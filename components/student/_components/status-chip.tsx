import { AlertTriangle, CheckCircle2, Clock, FlaskConical, FileX2 } from 'lucide-react'

import type { StudentAssignmentStatus } from '@/lib/api-types'
import type { DueTone } from '../lib'

type BadgeVariant = 'secondary' | 'warning' | 'success' | 'destructive'

export function AssignmentStatusChip({
  status,
  grade,
}: {
  status: StudentAssignmentStatus
  grade: number | null
}) {
  const map: Record<
    StudentAssignmentStatus,
    { label: string; variant: BadgeVariant }
  > = {
    NOT_STARTED: { label: 'Not started', variant: 'secondary' },
    SUBMITTED: { label: 'Submitted', variant: 'warning' },
    GRADED: { label: grade != null ? `Graded · ${grade}%` : 'Graded', variant: 'success' },
    OVERDUE: { label: 'Overdue', variant: 'destructive' },
  }
  const meta = map[status]
  return (
    <span
      className={
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ' +
        (meta.variant === 'secondary'
          ? 'border-border bg-muted text-muted-foreground'
          : meta.variant === 'warning'
            ? 'border-transparent bg-warning/10 text-warning'
            : meta.variant === 'success'
              ? 'border-transparent bg-success/10 text-success'
              : 'border-transparent bg-destructive/10 text-destructive')
      }
    >
      {status === 'OVERDUE' && <AlertTriangle className="size-3" aria-hidden="true" />}
      {status === 'GRADED' && <CheckCircle2 className="size-3" aria-hidden="true" />}
      {meta.label}
    </span>
  )
}

export function DueChip({
  label,
  tone,
}: {
  label: string
  tone: DueTone
}) {
  const Icon = tone === 'destructive' ? AlertTriangle : Clock
  return (
    <span
      className={
        'inline-flex items-center gap-1 text-xs font-medium ' +
        (tone === 'destructive' ? 'text-destructive' : 'text-warning')
      }
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  )
}

export function NotebookChip({ present }: { present: boolean }) {
  if (present) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        Notebook ready
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <FileX2 className="size-3.5" aria-hidden="true" />
      No notebook attached
    </span>
  )
}

export function LabStatusChip({ ready }: { ready: boolean }) {
  return (
    <span
      className={
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ' +
        (ready ? 'border-transparent bg-success/10 text-success' : 'border-border bg-muted text-muted-foreground')
      }
    >
      {ready ? (
        <CheckCircle2 className="size-3" aria-hidden="true" />
      ) : (
        <FlaskConical className="size-3" aria-hidden="true" />
      )}
      {ready ? 'Available' : 'Unavailable'}
    </span>
  )
}