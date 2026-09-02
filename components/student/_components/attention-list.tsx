import { AlertTriangle } from 'lucide-react'

import type { StudentAssignment } from '@/lib/api-types'
import { AssignmentRow } from './assignment-row'

export function AttentionList({
  items,
  summary,
  onOpen,
}: {
  items: StudentAssignment[]
  summary: string
  onOpen: (assignmentId: number) => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <AlertTriangle className="size-4 text-warning" aria-hidden="true" />
        <p className="text-sm font-medium">{summary}</p>
      </div>
      <ul className="divide-y divide-border">
        {items.map((a) => (
          <li key={a.id}>
            <AssignmentRow a={a} onOpen={onOpen} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AttentionListSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm" aria-hidden="true">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="size-4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
      <ul className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="size-9 animate-pulse rounded-lg bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-44 animate-pulse rounded bg-muted" />
                <div className="h-3 w-28 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-7 w-20 animate-pulse rounded-lg bg-muted" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}