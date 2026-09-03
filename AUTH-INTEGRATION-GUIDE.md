# Authentication Integration Guide

This document provides specific recommendations for integrating the frontend with a backend authentication system, replacing the current client-side mock authentication.

## Current Authentication System Issues

The existing `lib/auth.tsx` has several limitations that need to be addressed for production/backend integration:

### Security Concerns:
1. **Plaintext Passwords in Code**: Demo accounts with passwords stored directly in source code (lines 30-39)
2. **Weak Password Hashing**: Custom hash function instead of industry-standard bcrypt/argon2 (lines 86-93)
3. **LocalStorage Session Storage**: Authentication state stored in localStorage (vulnerable to XSS attacks)
4. **No Rate Limiting**: Brute force attacks possible on login endpoint
5. **No Password Strength Validation**: Only checks minimum length (8 characters)
6. **No Account Lockout**: No protection against repeated failed login attempts

### Architectural Limitations:
1. **Client-Side Only**: All authentication logic runs in frontend - not secure for production
2. **Hardcoded Demo Data**: Cannot work with real user database
3. **No Token Refresh**: Sessions don't expire or refresh properly
4. **Limited Role Handling**: Simple role checking without proper permission system

## Recommended Backend Authentication Approach

### 1. Session-Based Authentication (Recommended for this App)

For a traditional web app like this, session-based authentication with HTTP-only cookies is often the best choice:

#### Backend Implementation:
- Use express-session or similar middleware
- Store session data in Redis or database
- Set HTTP-only, secure cookies for session ID
- Implement proper session expiration and renewal
- Add CSRF protection

#### Frontend Changes:
- Remove localStorage session management
- Rely on cookies being sent automatically with requests
- Update auth API calls to work with cookie-based auth

### 2. JWT-Based Authentication (Alternative)

If you prefer stateless authentication or need to support multiple frontend types:

#### Backend Implementation:
- Issue access tokens (short-lived, 15-30 min) and refresh tokens (longer-lived)
- Store refresh tokens in database with rotation
- Access tokens stored in memory (not localStorage) to reduce XSS risk
- Refresh tokens stored in HTTP-only cookies
- Implement token blacklisting for logout

#### Frontend Changes:
- Store access token in memory (React state or closure)
- Handle automatic token refresh using refresh token cookie
- Implement proper logout that clears both token types

## Specific API Endpoints Needed

Based on the current frontend usage, the backend should provide these auth endpoints:

### 1. Authentication Endpoints
```
POST /api/auth/login
  - Body: { email: string, password: string }
  - Returns: { user: UserInfo } (sets session cookie)
  - Errors: 401 (invalid credentials), 400 (validation), 429 (rate limit)

POST /api/auth/logout
  - Body: {} (or empty)
  - Returns: { success: true }
  - Clears session cookie

POST /api/auth/signup
  - Body: { email: string, password: string, fullName: string }
  - Returns: { user: UserInfo }
  - Errors: 400 (validation/duplicate), 429 (rate limit)

GET /api/auth/me
  - Returns: { user: UserInfo } or 401 if not authenticated
  - Used to check auth status on app load

POST /api/auth/refresh
  - Returns: { accessToken: string } (if using JWT)
  - Called automatically when access token expires
```

### 2. Password Management Endpoints (Optional but Recommended)
```
POST /api/auth/forgot-password
  - Body: { email: string }
  - Returns: { success: true } (don't reveal if email exists)

POST /api/auth/reset-password
  - Body: { token: string, password: string }
  - Returns: { success: true }

POST /api/auth/change-password
  - Body: { oldPassword: string, newPassword: string }
  - Requires authentication
```

## Frontend Implementation Changes

### 1. Replace `lib/auth.tsx` with Backend-Auth Version

Here's what the new auth system should look like:

```typescript
'use client'

import * as React from 'react'

export type AuthRole = 'ADMIN' | 'LECTURER' | 'STUDENT'

export interface AuthUser {
  username: string
  email: string
  full_name: string
  role: AuthRole
  initials: string
}

// REMOVED: PlatformAccount, demoAccounts, localStorage storage
// REMOVED: Custom hash functions, email normalization (backend handles this)

const AUTH_CONTEXT_KEY = 'platform-auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  // Check auth status on mount
  React.useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Important for cookies
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        return null
      } else {
        const errorData = await response.json()
        return errorData.message || 'Login failed'
      }
    } catch (error) {
      return 'Network error. Please try again.'
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  // Optional: signup if frontend handles registration
  const signup = async (opts: { fullName: string; email: string; password: string }): Promise<string | null> => {
    // Implementation similar to login but calling /api/auth/signup
    // ...
  }

  const value = React.useMemo(
    () => ({ user, login, signup, logout, loading }),
    [user, login, signup, logout, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

### 2. Update Components to Handle Loading State

Components that use `useAuth()` should handle the loading state:

```typescript
function DashboardShell() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div>Loading...</div> // or show skeleton
  }
  
  if (!user) {
    return <SignIn />
  }
  
  // ... rest of component
}
```

### 3. Remove Demo Accounts and Mock Data

Delete or comment out:
- Hardcoded demo accounts in `lib/auth.tsx` (lines 30-39)
- Any references to mock authentication flows
- LocalStorage session management code

## Security Best Practices to Implement

### 1. Password Security
- **Backend**: Use bcrypt or argon2 for password hashing (minimum 12 rounds)
- **Backend**: Enforce password policy (min 12 chars, mix of character types)
- **Backend**: Implement haveibeenpwned-style password breach checking
- **Frontend**: Use HTTPS in production (cookies should be Secure)

### 2. Session Security
- **Backend**: Set cookies with `HttpOnly`, `Secure`, `SameSite=Strict`
- **Backend**: Implement proper session expiration (15-30 min idle timeout)
- **Backend**: Regenerate session ID on login and privilege changes
- **Backend**: Implement concurrent session limits if needed

### 3. Rate Limiting and Protection
- **Backend**: Implement rate limiting on auth endpoints (e.g., 5 attempts/minute/IP)
- **Backend**: Implement account lockout after failed attempts (e.g., lock for 15 min after 5 failures)
- **Backend**: Log authentication events for monitoring and anomaly detection
- **Frontend**: Show CAPTCHA after multiple failed attempts (if needed)

### 4. Input Validation
- **Backend**: Validate all input (email format, password strength, etc.)
- **Backend**: Sanitize outputs to prevent XSS (though less critical for JSON APIs)
- **Frontend**: Client-side validation for better UX, but never trust it for security

## Environment Configuration

Add these environment variables for authentication configuration:

```
# For session-based auth
SESSION_SECRET=your-super-secret-session-key-here
SESSION_COOKIE_NAME=platform-session
SESSION_COOKIE_HTTPONLY=true
SESSION_COOKIE_SECURE=true # Set to false only for local development
SESSION_COOKIE_SAMESITE=strict

# For JWT-based auth (if used)
JWT_ACCESS_TOKEN_SECRET=your-access-token-secret
JWT_REFRESH_TOKEN_SECRET=your-refresh-token-secret
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Rate limiting
RATE_LIMIT_WINDOW_MS=60000 # 1 minute
RATE_LIMIT_MAX_REQUESTS=5 # per window
```

## Migration Strategy

### Phase 1: Preparation
1. Share this guide with backend team
2. Define exact API contract for auth endpoints
3. Set up test environment with backend auth implementation

### Phase 2: Parallel Development
1. Backend implements auth endpoints
2. Frontend develops using mock auth layer (can toggle between mock/real)
3. Test auth flows with test accounts

### Phase 3: Integration and Testing
1. Switch frontend to use real backend auth
2. Test all authentication flows:
   - Login/logout
   - Session persistence
   - Role-based access control
   - Error handling (invalid credentials, locked accounts, etc.)
   - Password reset flow
3. Security testing (XSS, CSRF, session fixation attempts)

### Phase 4: Production Rollout
1. Deploy backend auth to staging
2. Perform thorough QA
3. Deploy to production with feature flag
4. Monitor authentication metrics and error rates
5. Have rollback plan ready

## Files to Modify

| File | Changes Needed |
|------|----------------|
| `lib/auth.tsx` | Complete replacement with backend-auth version |
| `lib/api/index.ts` | Update to use real auth endpoints (if not already done) |
| Components using auth | Add loading state handling if not present |
| `BACKEND-INTEGRATION-GUIDE.md` | Reference this auth guide |
| Environment config | Add session/JWT variables |

## Testing Checklist

Before considering auth integration complete, verify:

- [ ] Login works with valid credentials
- [ ] Login fails appropriately with invalid credentials
- [ ] Login fails with rate limiting after multiple attempts
- [ ] Login sets appropriate session cookies
- [ ] Authenticated routes accessible after login
- [ ] Unauthenticated users redirected to login
- [ ] Login persists across page refreshes (within session timeout)
- [ ] Logout clears session and redirects to login
- [ ] Role-based access control works correctly
- [ ] Session expires after timeout
- [ ] CSRF protection working (if implemented)
- [ ] Password strength enforcement working
- [ ] Account lockout after failed attempts (if implemented)
- [ ] No sensitive data in localStorage or URL
- [ ] HTTPS required in production (cookies Secure flag)

By following these guidelines, you'll replace the current insecure mock authentication with a production-ready system that properly integrates with your backend while maintaining the existing frontend architecture and user experience.