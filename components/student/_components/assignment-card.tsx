import { ArrowRight, CheckCircle2 } from 'lucide-react'

import type { StudentAssignment } from '@/lib/api-types'
import { dueMeta, formatShortDate } from '../lib'
import { AssignmentStatusChip, DueChip } from './status-chip'

export function AssignmentCard({
  a,
  onOpen,
}: {
  a: StudentAssignment
  onOpen: (assignmentId: number) => void
}) {
  const isAttention = a.status === 'NOT_STARTED' || a.status === 'OVERDUE'
  const isSubmitted = a.status === 'SUBMITTED' || a.status === 'GRADED'
  const due = dueMeta(a)

  const meta = isSubmitted ? (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
      Submitted {formatShortDate(a.submittedAt)}
    </span>
  ) : (
    <DueChip label={due.label} tone={due.tone} />
  )

  return (
    <button
      onClick={() => onOpen(a.id)}
      className={
        'flex w-full flex-col gap-4 rounded-2xl border bg-card p-5 text-left shadow-sm transition hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none ' +
        (isAttention ? 'border-warning/40' : 'border-border')
      }
    >
      <span className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          <span className="font-mono font-medium text-foreground">{a.courseCode}</span>
          <span className="mx-1.5" aria-hidden="true">·</span>
          {a.courseName}
        </span>
        <AssignmentStatusChip status={a.status} grade={a.grade} />
      </span>

      <span className="min-w-0">
        <span className="block text-base font-semibold tracking-tight">{a.title}</span>
      </span>

      {meta}

      <span
        className={
          'inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold sm:w-fit sm:self-end sm:px-4 ' +
          (isAttention
            ? 'bg-primary text-primary-foreground'
            : 'border border-border text-foreground')
        }
      >
        {isAttention ? 'Continue' : 'View submission'}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </span>
    </button>
  )
}