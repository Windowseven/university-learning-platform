'use client'

import * as React from 'react'
import { BellRing } from 'lucide-react'

import { student as studentApi } from '@/lib/api'
import { greeting, isAction, sortAttention, todayLong } from './lib'
import { DashboardSkeleton } from './_components/skeletons'
import { AttentionList } from './_components/attention-list'
import { QuickStats } from './_components/quick-stats'
import { CourseCard } from './_components/course-card'
import { RecentLabs } from './_components/recent-labs'
import { SectionHeading } from './_components/page-header'

const {
  assignments: studentAssignments,
  assignmentCounts: studentAssignmentCounts,
  courses: studentCourses,
  labs: studentLabs,
  profile: studentProfile,
} = studentApi

export function StudentDashboardView({
  onOpenCourse,
  onOpenAssignment,
  onOpenLab,
  onOpenAssignments,
  onOpenCourses,
  onOpenLabs,
}: {
  onOpenCourse: (courseId: number) => void
  onOpenAssignment: (assignmentId: number) => void
  onOpenLab: (labId: number) => void
  onOpenAssignments: () => void
  onOpenCourses: () => void
  onOpenLabs: () => void
}) {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <DashboardSkeleton />

  const counts = studentAssignmentCounts()
  const attention = studentAssignments
    .filter((a) => isAction(a))
    .sort(sortAttention)
  const recentLabs = studentLabs.filter((l) => l.ready).slice(0, 3)

  return (
    <div className="flex flex-col gap-10">
      {/* Greeting */}
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {greeting(studentProfile.fullName)} <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here&apos;s what needs your attention today.
          </p>
        </div>
        <p className="text-sm font-medium text-muted-foreground" aria-hidden="true">
          {todayLong()}
        </p>
      </section>

      {/* Needs your attention */}
      <section aria-labelledby="attention-heading">
        <SectionHeading id="attention-heading">Needs your attention</SectionHeading>
        {attention.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <BellRing className="size-6 text-success" aria-hidden="true" />
            <p className="text-sm font-semibold">You&apos;re all caught up</p>
            <p className="text-sm text-muted-foreground">No assignments need your attention right now.</p>
            <button
              onClick={onOpenAssignments}
              className="mt-1 text-sm font-medium text-primary transition hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
            >
              View assignments
            </button>
          </div>
        ) : (
          <AttentionList
            items={attention}
            summary={`${attention.length} assignment${attention.length === 1 ? '' : 's'} require your attention`}
            onOpen={onOpenAssignment}
          />
        )}
      </section>

      {/* Quick overview */}
      <section aria-labelledby="overview-heading">
        <SectionHeading id="overview-heading">Quick overview</SectionHeading>
        <QuickStats
          data={{
            courses: studentCourses.length,
            toDo: counts.toDo,
            submitted: counts.submitted,
            overdue: counts.overdue,
          }}
        />
      </section>

      {/* My courses */}
      <section aria-labelledby="courses-heading">
        <SectionHeading id="courses-heading" actionLabel="View all" onAction={onOpenCourses}>
          My courses
        </SectionHeading>
        {studentCourses.length === 0 ? (
          <EmptyCourses />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {studentCourses.map((c) => (
              <CourseCard key={c.id} course={c} onOpen={onOpenCourse} />
            ))}
          </div>
        )}
      </section>

      {/* Recent lab work */}
      <section aria-labelledby="recent-labs-heading">
        <SectionHeading id="recent-labs-heading" actionLabel="View all" onAction={onOpenLabs}>
          Recent lab work
        </SectionHeading>
        {recentLabs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <p className="text-sm font-semibold">No labs available yet</p>
            <p className="text-sm text-muted-foreground">Published practical work will appear here.</p>
          </div>
        ) : (
          <RecentLabs labs={recentLabs} onOpen={onOpenLab} />
        )}
      </section>
    </div>
  )
}

function EmptyCourses() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
      <p className="text-sm font-semibold">No courses yet</p>
      <p className="text-sm text-muted-foreground">Your enrolled courses will appear here.</p>
    </div>
  )
}