import { ArrowRight, FlaskConical } from 'lucide-react'

import type { StudentLab } from '@/lib/api-types'
import { NotebookChip } from './status-chip'

export function RecentLabs({
  labs,
  onOpen,
}: {
  labs: StudentLab[]
  onOpen: (labId: number) => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <ul className="divide-y divide-border">
        {labs.map((l) => (
          <li key={l.id}>
            <button
              onClick={() => onOpen(l.id)}
              className="flex w-full flex-col gap-3 px-4 py-3.5 text-left transition hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <span className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FlaskConical className="size-4.5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{l.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {l.courseCode} · {l.courseName}
                  </span>
                </span>
              </span>

              <span className="flex shrink-0 items-center justify-between gap-4 pl-12 sm:justify-end sm:pl-0">
                <NotebookChip present={l.ready && !!l.notebook_filename} />
                <span className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold">
                  Open
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function RecentLabsSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm" aria-hidden="true">
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
            <div className="h-7 w-24 animate-pulse rounded-lg bg-muted" />
          </li>
        ))}
      </ul>
    </div>
  )
}