'use client'

import * as React from 'react'
import { ArrowRight, BookOpen, ClipboardList, FlaskConical, Users } from 'lucide-react'

import { lecturer as lecturerApi } from '@/lib/api'
import type { CourseSummary } from '@/lib/api-types'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const { dashboard: lecturerDashboard } = lecturerApi

function CoursesLoader({ cards }: { cards: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading courses" role="status">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-5 w-2/3" />
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-3/4" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((j) => (
              <div key={j} className="rounded-lg bg-muted/50 px-3 py-3">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="mt-1 h-3 w-12" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-5 h-9 w-full rounded-lg" />
        </div>
      ))}
    </div>
  )
}

function CourseCard({ course, onOpen }: { course: CourseSummary; onOpen: (id: number) => void }) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <Badge variant="secondary" className="font-mono">{course.code}</Badge>
        <Badge variant={course.is_active ? 'success' : 'secondary'}>
          {course.is_active ? 'Active' : 'Archived'}
        </Badge>
      </div>
      <h3 className="mt-4 text-xl font-semibold tracking-tight">{course.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {course.description.trim() || 'No description provided.'}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { icon: Users, label: 'Students', value: course.students_count },
          { icon: FlaskConical, label: 'Labs', value: course.labs_count },
          { icon: ClipboardList, label: 'Assignments', value: course.assignments_count },
        ].map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className="rounded-lg bg-muted/50 px-3 py-2">
              <p className="text-base font-semibold leading-tight">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          )
        })}
      </div>

      <Button variant="outline" className="mt-5 gap-1.5" onClick={() => onOpen(course.id)}>
        Open workspace
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </article>
  )
}

export function LecturerCoursesView({ onOpenCourse }: { onOpenCourse: (id: number) => void }) {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <CoursesLoader cards={3} />

  const courses = lecturerDashboard.courses

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-primary">
          <BookOpen className="size-4" aria-hidden="true" />
          My Courses
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Course directory</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {courses.length} course{courses.length === 1 ? '' : 's'} you currently teach. Open a
          course to manage its students, labs and assignments.
        </p>
      </div>

      <div className={cn('grid gap-4', courses.length > 1 ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-1 md:max-w-xl')}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onOpen={onOpenCourse} />
        ))}
      </div>
    </div>
  )
}
