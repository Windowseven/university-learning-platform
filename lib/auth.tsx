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

export interface PlatformAccount {
  email: string
  fullName: string
  role: AuthRole
  initials: string
  salt: string
  hash: string
  createdAt: string
}

/**
 * Demo accounts used to seed the local account store. In a real deployment
 * these would live in a database (email is the primary key) and passwords
 * would be hashed with bcrypt/argon2 server-side.
 */
export const demoAccounts: Array<{
  role: AuthRole
  fullName: string
  email: string
  password: string
}> = [
  { role: 'ADMIN', fullName: 'Jordan Davis', email: 'jordan.davis@gmail.com', password: 'admin123' },
  { role: 'LECTURER', fullName: 'Dr. Ada Lecturer', email: 'ada.lecturer@gmail.com', password: 'lecturer123' },
  { role: 'STUDENT', fullName: 'Sam Anderson', email: 'sam.anderson@gmail.com', password: 'student123' },
]

const SESSION_KEY = 'platform-session'
const USERS_KEY = 'platform-users'

const GMAIL_TYPOS = [
  'gmial.com',
  'gmial.com',
  'gmail.con',
  'gmil.com',
  'gmal.com',
  'gmailc.com',
  'gmail.cmo',
  'gmail.co',
  'gmail.ocm',
]

function initialsOf(fullName: string): string {
  return fullName
    .replace(/^Dr\.\s+/i, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Accept any valid email address; @gmail.com is preferred but not enforced. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

/** Return the corrected hostname when a gmail typo is detected, else null. */
export function gmailTypoSuggestion(email: string): string | null {
  const host = email.split('@')[1]?.trim().toLowerCase()
  if (!host) return null
  if (host === 'gmail.com') return null
  return GMAIL_TYPOS.includes(host) ? 'gmail.com' : null
}

// Demo-grade keyed hash so plaintext passwords are never stored. A real
// backend would replace this with bcrypt/argon2; the salt prevents two
// accounts sharing the same hash for the same password.
function hashPassword(password: string, salt: string): string {
  let h = 5381
  const input = `${salt}::${password}`
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0
  }
  return `h$${h.toString(16)}`
}

function makeSalt(): string {
  const bytes = new Uint32Array(2)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes)
  } else {
    bytes[0] = Math.floor(Math.random() * 0xffffffff)
    bytes[1] = Math.floor(Math.random() * 0xffffffff)
  }
  return Array.from(bytes, (n) => n.toString(16).padStart(8, '0')).join('')
}

function seedUsers(): PlatformAccount[] {
  return demoAccounts.map((a) => {
    const salt = makeSalt()
    return {
      email: normalizeEmail(a.email),
      fullName: a.fullName,
      role: a.role,
      initials: initialsOf(a.fullName),
      salt,
      hash: hashPassword(a.password, salt),
      createdAt: '2026-01-01T00:00:00.000Z',
    }
  })
}

function readUsers(): PlatformAccount[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(USERS_KEY)
    if (!raw) {
      const seeded = seedUsers()
      writeUsers(seeded)
      return seeded
    }
    const parsed = JSON.parse(raw) as PlatformAccount[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(users: PlatformAccount[]) {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    /* storage unavailable */
  }
}

function readSessionUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { email?: string; role?: AuthRole }
    const users = readUsers()
    let account: PlatformAccount | undefined
    if (parsed.email) {
      account = users.find((u) => u.email === normalizeEmail(parsed.email as string))
    } else if (parsed.role) {
      // Migrate a legacy role-based session to the closest demo account.
      account = users.find((u) => u.role === parsed.role)
    }
    if (!account) return null
    return {
      username: account.email.split('@')[0],
      email: account.email,
      full_name: account.fullName,
      role: account.role,
      initials: account.initials,
    }
  } catch {
    return null
  }
}

function setSession(account: PlatformAccount) {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({ email: account.email }))
  } catch {
    /* storage unavailable */
  }
}

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => string | null
  signup: (opts: { fullName: string; email: string; password: string }) => string | null
  signInAsRole: (role: AuthRole) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)

  React.useEffect(() => {
    setUser(readSessionUser())
  }, [])

  const applyAccount = React.useCallback((account: PlatformAccount) => {
    setSession(account)
    setUser({
      username: account.email.split('@')[0],
      email: account.email,
      full_name: account.fullName,
      role: account.role,
      initials: account.initials,
    })
  }, [])

  const login = React.useCallback(
    (email: string, password: string): string | null => {
      // Flow demo: an empty email/password still signs you in as the demo
      // student so the workspace can be reached without credentials.
      if (!email.trim() || !password.trim()) {
        const demo = readUsers().find((u) => u.role === 'STUDENT')
        if (demo) {
          applyAccount(demo)
          return null
        }
        return 'Something went wrong. Try again.'
      }
      const normalized = normalizeEmail(email)
      const users = readUsers()
      const account = users.find((u) => u.email === normalized)
      if (!account) return 'No account found for this email. Create one first.'
      if (!password.trim()) return 'Enter your password.'
      if (account.hash !== hashPassword(password, account.salt)) return 'Incorrect password. Try again.'
      applyAccount(account)
      return null
    },
    [applyAccount],
  )

  const signup = React.useCallback(
    ({ fullName, email, password }: { fullName: string; email: string; password: string }): string | null => {
      if (!fullName.trim()) return 'Enter your name.'
      if (!isValidEmail(email)) return 'Enter a valid email address.'
      const typo = gmailTypoSuggestion(email)
      if (typo) return `Did you mean @${typo}?`
      if (password.length < 8) return 'Password must be at least 8 characters.'
      const normalized = normalizeEmail(email)
      const users = readUsers()
      if (users.some((u) => u.email === normalized)) {
        return 'An account with this email already exists. Sign in instead.'
      }
      const salt = makeSalt()
      const account: PlatformAccount = {
        email: normalized,
        fullName: fullName.trim(),
        role: 'STUDENT',
        initials: initialsOf(fullName),
        salt,
        hash: hashPassword(password, salt),
        createdAt: new Date().toISOString(),
      }
      writeUsers([...users, account])
      applyAccount(account)
      return null
    },
    [applyAccount],
  )

  const signInAsRole = React.useCallback(
    (role: AuthRole) => {
      const users = readUsers()
      const account = users.find((u) => u.role === role)
      if (account) applyAccount(account)
    },
    [applyAccount],
  )

  const logout = React.useCallback(() => {
    setUser(null)
    try {
      window.localStorage.removeItem(SESSION_KEY)
    } catch {
      /* storage unavailable */
    }
  }, [])

  const value = React.useMemo(
    () => ({ user, login, signup, signInAsRole, logout }),
    [user, login, signup, signInAsRole, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}