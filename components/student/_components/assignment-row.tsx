import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardList } from 'lucide-react'

import type { StudentAssignment } from '@/lib/api-types'
import { dueMeta, formatShortDate } from '../lib'
import { DueChip } from './status-chip'

function RowMeta({ a }: { a: StudentAssignment }) {
  if (a.status === 'SUBMITTED') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        Submitted {formatShortDate(a.submittedAt)}
      </span>
    )
  }
  if (a.status === 'GRADED') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        {a.grade != null ? `Graded · ${a.grade}%` : 'Graded'}
      </span>
    )
  }
  const due = dueMeta(a)
  return <DueChip label={due.label} tone={due.tone} />
}

export function AssignmentRow({
  a,
  onOpen,
}: {
  a: StudentAssignment
  onOpen: (assignmentId: number) => void
}) {
  const isAttention = a.status === 'NOT_STARTED' || a.status === 'OVERDUE'
  const isSubmitted = a.status === 'SUBMITTED' || a.status === 'GRADED'
  const iconTone = a.status === 'OVERDUE'
    ? 'bg-destructive/10 text-destructive'
    : isAttention
      ? 'bg-warning/10 text-warning'
      : isSubmitted
        ? 'bg-success/10 text-success'
        : 'bg-muted text-muted-foreground'
  const Icon = a.status === 'OVERDUE'
    ? AlertTriangle
    : isSubmitted
      ? CheckCircle2
      : ClipboardList

  return (
    <button
      onClick={() => onOpen(a.id)}
      className="flex w-full flex-col gap-3 px-4 py-3.5 text-left transition hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between"
    >
      <span className="flex min-w-0 items-start gap-3">
        <span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${iconTone}`}>
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{a.title}</span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {a.courseCode} · {a.courseName}
          </span>
        </span>
      </span>

      <span className="flex shrink-0 items-center justify-between gap-4 pl-12 sm:justify-end sm:pl-0">
        <RowMeta a={a} />
        {isAttention ? (
          <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            Continue
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
        ) : (
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        )}
      </span>
    </button>
  )
}