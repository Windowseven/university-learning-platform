import { ArrowRight, FlaskConical } from 'lucide-react'

import type { StudentLab } from '@/lib/api-types'
import { NotebookChip } from './status-chip'

export function LabCard({
  lab,
  onOpen,
  showCourse = true,
}: {
  lab: StudentLab
  onOpen: (labId: number) => void
  showCourse?: boolean
}) {
  const hasNotebook = lab.ready && !!lab.notebook_filename
  return (
    <button
      onClick={() => onOpen(lab.id)}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-ring/50 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FlaskConical className="size-5" aria-hidden="true" />
        </span>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
      </div>

      <h3 className="mt-4 text-base font-semibold tracking-tight">{lab.title}</h3>
      {showCourse && (
        <p className="mt-0.5 text-xs text-muted-foreground">
          {lab.courseCode} · {lab.courseName}
        </p>
      )}
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{lab.description}</p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <NotebookChip present={hasNotebook} />
      </div>

      <span className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card py-2 text-sm font-medium transition group-hover:border-primary/40 group-hover:text-primary">
        Open lab
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </button>
  )
}

export function LabCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm" aria-hidden="true">
      <div className="size-10 animate-pulse rounded-xl bg-muted" />
      <div className="mt-4 h-5 w-3/4 animate-pulse rounded-md bg-muted" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded-md bg-muted" />
      <div className="mt-3 h-3 w-full animate-pulse rounded-md bg-muted" />
      <div className="mt-4 h-3 w-32 animate-pulse rounded-md bg-muted" />
      <div className="mt-4 h-9 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  )
}