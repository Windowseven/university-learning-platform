# Backend Integration Guide

This document outlines the steps needed to integrate the frontend with a real backend API.

## Current Architecture Overview

The frontend currently uses mock data located in:
- `lib/api/mock.ts` - Contains all mock data structures
- `lib/api/index.ts` - Exports the mock data as the API layer
- `lib/api-types.ts` - Contains TypeScript interfaces for data contracts

Components import data from `lib/api/index.ts` which re-exports everything from `mock.ts`.

## Integration Steps

### 1. Replace Mock Data Layer

When the backend is ready, replace `lib/api/index.ts` with implementations that make HTTP requests to your backend endpoints.

See `lib/api/index-with-real-backend.ts` for an example implementation.

### 2. Backend API Endpoints Expected

Based on the current mock data structure, your backend should provide these endpoints:

#### Admin Endpoints
- `GET /api/admin/analytics` - Returns AdminAnalytics
- `GET /api/admin/users` - Returns User[]
- `GET /api/admin/courses` - Returns Course[]
- `GET /api/admin/labs` - Returns Lab[]
- `GET /api/admin/assignments` - Returns Assignment[]
- `GET /api/admin/submissions` - Returns Submission[]
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course

#### Lecturer Endpoints
- `GET /api/lecturer/profile` - Lecturer profile info
- `GET /api/lecturer/hub` - JupyterHub status
- `GET /api/lecturer/analytics` - TeachingAnalytics
- `GET /api/lecturer/dashboard` - LecturerDashboard
- `GET /api/lecturer/assignments` - LecturerGlobalAssignment[]
- `GET /api/lecturer/labs` - LecturerGlobalLab[]
- `GET /api/lecturer/students` - LecturerGlobalStudent[]
- `GET /api/lecturer/notifications` - LecturerNotification[]
- `GET /api/lecturer/upcoming` - LecturerUpcomingItem[]
- `GET /api/lecturer/courses/:courseId/workspace` - LecturerCourseWorkspace
- `GET /api/lecturer/students/:studentId` - LecturerStudentProfile

#### Student Endpoints
- `GET /api/student/profile` - Student profile info
- `GET /api/student/courses` - StudentCourse[]
- `GET /api/student/assignments` - StudentAssignment[]
- `GET /api/student/labs` - StudentLab[]
- `GET /api/student/notifications` - StudentNotification[]
- `GET /api/student/assignments/counts` - Assignment counts

### 3. Authentication Integration

Replace the current client-side authentication in `lib/auth.tsx` with backend authentication:

#### Recommended Approach:
1. Use HTTP-only cookies for session management (more secure than localStorage)
2. Implement proper JWT or session-based authentication on backend
3. Remove plaintext password storage and demo accounts from frontend code
4. Add proper password hashing (bcrypt/argon2) on backend
5. Implement rate limiting on auth endpoints
6. Add password strength validation

#### Auth API Endpoints Needed:
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/logout` - Clear session
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh token (if using JWT)

### 4. Data Fetching Patterns in Components

Components should be updated to use React data fetching patterns:

#### Example - Using useEffect for data loading:
```typescript
import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';

function AnalyticsComponent() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In real implementation, you'd call the API directly
    // admin.analytics would need to be updated to return a Promise
    fetch('/api/admin/analytics')
      .then(response => response.json())
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render analytics */}</div>;
}
```

#### Example - Using React Query or SWR:
```typescript
import useSWR from 'swr';

function UsersTable() {
  const { data: users, error, isLoading } = useSWR('/api/admin/users', fetcher);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load</div>;
  
  return (
    <table>
      {/* Render users */}
    </table>
  );
}
```

### 5. Environment Configuration

Add environment variables for API configuration:

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Then in your API client:
```typescript
const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
```

### 6. Error Handling and Loading States

Ensure all components handle:
- Loading states (skeletons, spinners)
- Error states (retry mechanisms, user-friendly messages)
- Empty states (when data arrays are empty)

### 7. Security Considerations

1. **CORS**: Ensure backend properly configures CORS for your frontend domain
2. **CSRF Protection**: Implement CSRF tokens if using cookie-based auth
3. **Input Validation**: Validate all data on backend (never trust frontend)
4. **Rate Limiting**: Protect API endpoints from abuse
5. **Data Sanitization**: Sanitize outputs to prevent XSS
6. **HTTPS**: Ensure all API calls use HTTPS in production

## Files to Modify

1. **Primary**: `lib/api/index.ts` - Replace with real API implementation
2. **Authentication**: `lib/auth.tsx` - Replace with backend-auth version
3. **Components**: Update data fetching patterns as needed
4. **Configuration**: Add environment variables and API client utils

## Migration Strategy

1. **Keep mock data available** during transition by maintaining both versions
2. **Feature flag** to switch between mock and real API
3. **Gradual migration** - convert one API section at a time
4. **Testing** - ensure all components work with real data before removing mocks

## Benefits of This Approach

1. **Separation of Concerns**: Frontend only handles presentation and UI logic
2. **Security**: Sensitive logic and data remain on backend
3. **Maintainability**: Single source of truth for data
4. **Scalability**: Backend can handle caching, business logic, etc.
5. **Testability**: Easier to mock API responses for frontend testing

## Next Steps

1. Share this API contract with your backend team
2. Implement the endpoints on your backend following the types in `api-types.ts`
3. Replace `lib/api/index.ts` with the real implementation
4. Update authentication to use backend sessions
5. Test thoroughly with real data
6. Remove mock data files once confident in integration