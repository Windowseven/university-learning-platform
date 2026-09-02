import { ArrowRight, BookOpen, ClipboardList, FlaskConical } from 'lucide-react'

import type { StudentCourse } from '@/lib/api-types'

export function CourseCard({
  course,
  onOpen,
}: {
  course: StudentCourse
  onOpen: (courseId: number) => void
}) {
  return (
    <button
      onClick={() => onOpen(course.id)}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-ring/50 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-xs font-medium text-muted-foreground">
          <BookOpen className="size-3" aria-hidden="true" />
          {course.code}
        </span>
        <ArrowRight
          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-4 text-base font-semibold tracking-tight">{course.name}</h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{course.lecturer}</p>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>

      <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <FlaskConical className="size-4 text-primary" aria-hidden="true" />
            <span className="font-semibold tabular-nums">{course.labs_available}</span>
            <span className="text-xs">labs</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <ClipboardList className="size-4 text-primary" aria-hidden="true" />
            <span className="font-semibold tabular-nums">{course.assignments_count}</span>
            <span className="text-xs">assignments</span>
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Open course
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </button>
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm" aria-hidden="true">
      <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
      <div className="mt-4 h-5 w-3/4 animate-pulse rounded-md bg-muted" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded-md bg-muted" />
      <div className="mt-3 h-3 w-full animate-pulse rounded-md bg-muted" />
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}