'use client'

import * as React from 'react'
import { ArrowLeft, ArrowRight, BookOpen, ClipboardList, FlaskConical } from 'lucide-react'

import { student as studentApi } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsPanel } from '@/components/ui/tabs'
import { isSubmitted, sortByDeadline } from './lib'
import { PageHeroSkeleton, ListSkeleton } from './_components/skeletons'
import { LabCard } from './_components/lab-card'
import { AssignmentRow } from './_components/assignment-row'
import { NotebookChip, LabStatusChip } from './_components/status-chip'

const { assignments: studentAssignments, courses: studentCourses, labs: studentLabs } = studentApi

export function StudentCourseView({
  courseId,
  onBack,
  onOpenLab,
  onOpenAssignment,
}: {
  courseId: number
  onBack: () => void
  onOpenLab: (labId: number) => void
  onOpenAssignment: (assignmentId: number) => void
}) {
  const [loading, setLoading] = React.useState(true)
  const course = studentCourses.find((c) => c.id === courseId)

  const labs = course ? studentLabs.filter((l) => l.courseId === course.id && l.ready) : []
  const assignments = course
    ? studentAssignments.filter((a) => a.courseId === course.id).sort(sortByDeadline)
    : []
  const continueLab = labs.find((l) => l.ready && l.notebook_filename)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [courseId])

  if (!course) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={onBack}
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          My Courses
        </button>
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <BookOpen className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-semibold">Course not found</p>
          <p className="text-sm text-muted-foreground">This course is not part of your enrolment.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeroSkeleton />
        <div className="h-28 animate-pulse rounded-2xl border border-border bg-card shadow-sm" />
        <ListSkeleton rows={3} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <button
        onClick={onBack}
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        My Courses
      </button>

      <header className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit font-mono">{course.code}</Badge>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{course.name}</h1>
        <p className="text-sm text-muted-foreground">{course.lecturer}</p>
      </header>
      <div className="h-px bg-border" />

      {/* Continue learning */}
      <section aria-labelledby="continue-heading">
        <SectionHeading id="continue-heading">Continue learning</SectionHeading>
        {continueLab ? (
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FlaskConical className="size-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Next lab
                </p>
                <h3 className="mt-1 truncate text-lg font-semibold tracking-tight lg:whitespace-normal">
                  {continueLab.title}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <NotebookChip present={!!continueLab.notebook_filename} />
                  <LabStatusChip ready={continueLab.ready} />
                </div>
              </div>
            </div>
            <Button className="w-full gap-1.5 lg:w-auto" onClick={() => onOpenLab(continueLab.id)}>
              Open lab
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">
            Nothing to continue right now — check back once your lecturer publishes a lab.
          </div>
        )}
      </section>

      {/* Tabs */}
      <Tabs defaultValue="labs">
        <TabsList>
          <TabsTrigger value="labs">Labs ({labs.length})</TabsTrigger>
          <TabsTrigger value="assignments">
            Assignments (
            {assignments.length - assignments.filter((a) => isSubmitted(a)).length} to do)
          </TabsTrigger>
        </TabsList>

        <TabsPanel value="labs">
          {labs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <FlaskConical className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-semibold">No labs available yet</p>
              <p className="text-sm text-muted-foreground">
                Published practical work will show up here as your lecturer releases it.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {labs.map((l) => (
                <LabCard key={l.id} lab={l} onOpen={onOpenLab} />
              ))}
            </div>
          )}
        </TabsPanel>

        <TabsPanel value="assignments">
          {assignments.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ClipboardList className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-semibold">No assignments yet</p>
              <p className="text-sm text-muted-foreground">
                Assignments will appear here once your lecturer creates them.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <ul className="divide-y divide-border">
                {assignments.map((a) => (
                  <li key={a.id}>
                    <AssignmentRow a={a} onOpen={onOpenAssignment} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsPanel>
      </Tabs>
    </div>
  )
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  )
}