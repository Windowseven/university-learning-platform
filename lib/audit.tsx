'use client'

import * as React from 'react'
import { useAuth } from '@/lib/auth'

export type AuditCategory = 'Access' | 'Content' | 'Infrastructure' | 'Settings'

export interface AuditEntry {
  id: string
  actor: string
  action: 'create' | 'update' | 'delete' | 'push' | 'upload' | 'export' | 'toggle' | 'launch'
  resource: 'user' | 'course' | 'lab' | 'assignment' | 'submission' | 'hub' | 'system'
  category: AuditCategory
  detail: string
  timestamp: string
}

interface AuditContextValue {
  entries: AuditEntry[]
  log: (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'actor'>) => void
  clear: () => void
}

const AuditContext = React.createContext<AuditContextValue | null>(null)

const STORAGE_KEY = 'platform-audit-log'
const MAX_ENTRIES = 200

export type AuditResource = AuditEntry['resource']

function load(): AuditEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [entries, setEntries] = React.useState<AuditEntry[]>([])

  React.useEffect(() => {
    setEntries(load())
  }, [])

  const log = React.useCallback(
    (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'actor'>) => {
      setEntries((prev) => {
        const next: AuditEntry = {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          actor: user?.full_name ?? 'System',
          timestamp: new Date().toISOString(),
        }
        const merged = [next, ...prev].slice(0, MAX_ENTRIES)
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        } catch {
          /* storage unavailable */
        }
        return merged
      })
    },
    [user],
  )

  const clear = React.useCallback(() => {
    setEntries([])
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* storage unavailable */
    }
  }, [])

  const value = React.useMemo(() => ({ entries, log, clear }), [entries, log, clear])

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>
}

export function useAudit() {
  const ctx = React.useContext(AuditContext)
  if (!ctx) throw new Error('useAudit must be used within AuditProvider')
  return ctx
}
