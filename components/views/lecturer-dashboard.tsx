'use client'

import * as React from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  FlaskConical,
  GraduationCap,
  Loader2,
  Sparkles,
  Users,
} from 'lucide-react'

import { lecturer as lecturerApi } from '@/lib/api'
import { useAudit } from '@/lib/audit'
import type {
  AttentionPriority,
  AttentionType,
  CourseSummary,
  TeachingAttentionItem,
  TeachingAnalytics,
} from '@/lib/api-types'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/states'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const {
  profile: lecturer,
  dashboard: lecturerDashboard,
  analytics: lecturerAnalytics,
  hub: lecturerHub,
  upcoming: lecturerUpcoming,
} = lecturerApi

function greeting(name: string) {
  const hour = new Date().getHours()
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  return `${part}, ${name}`
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  )
}

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  tone,
}: {
  label: string
  value: string | number
  sub: string
  icon: React.ComponentType<{ className?: string }>
  tone: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className={cn('flex size-10 items-center justify-center rounded-xl', tone)}>
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

/* ------------------------------ Attention ------------------------------ */

const attentionMeta: Record<AttentionType, { icon: React.ComponentType<{ className?: string }>; verb: string }> = {
  SUBMISSION_REVIEW: { icon: ClipboardList, verb: 'Review' },
  NOTEBOOK_DELIVERY: { icon: FlaskConical, verb: 'Manage' },
  UPCOMING_DEADLINE: { icon: Clock, verb: 'Open' },
  UNPUBLISHED_LAB: { icon: FlaskConical, verb: 'Manage' },
  LOW_PARTICIPATION: { icon: Users, verb: 'View' },
}

const priorityTone: Record<AttentionPriority, string> = {
  HIGH: 'border-destructive/30 bg-destructive/[0.04]',
  MEDIUM: 'border-warning/30 bg-warning/[0.04]',
  LOW: 'border-border bg-card',
}

const priorityLabel: Record<AttentionPriority, string> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

const priorityBadge: Record<AttentionPriority, 'destructive' | 'warning' | 'secondary'> = {
  HIGH: 'destructive',
  MEDIUM: 'warning',
  LOW: 'secondary',
}

function AttentionItem({
  item,
  onOpen,
}: {
  item: TeachingAttentionItem
  onOpen: (courseId: number) => void
}) {
  const meta = attentionMeta[item.type]
  const Icon = meta.icon
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 rounded-xl border p-4 transition hover:shadow-sm',
        priorityTone[item.priority],
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4.5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{item.title}</p>
            <Badge variant={priorityBadge[item.priority]}>{priorityLabel[item.priority]}</Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {item.courseCode}
            {item.detail ? ` · ${item.detail}` : ''}
          </p>
          {typeof item.count === 'number' && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.count}
              {typeof item.total === 'number' ? ` / ${item.total}` : ''}
            </p>
          )}
        </div>
      </div>
      <Button size="sm" variant="outline" className="shrink-0 gap-1.5" onClick={() => onOpen(item.courseId)}>
        {meta.verb}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  )
}

/* ------------------------------ Course performance ------------------------------ */

function CoursePerformanceRow({
  perf,
  onOpen,
}: {
  perf: NonNullable<TeachingAnalytics['courses']>[number]
  onOpen: (id: number) => void
}) {
  const pct = Math.round(perf.completionRate * 100)
  return (
    <button
      onClick={() => onOpen(perf.id)}
      className="group w-full rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-ring/50 hover:shadow"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-mono">{perf.code}</Badge>
          <span className="font-semibold">{perf.name}</span>
        </div>
        <span className="text-lg font-semibold tabular-nums">{pct}%</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="font-medium tabular-nums">{perf.students}</p>
          <p className="text-xs text-muted-foreground">Students</p>
        </div>
        <div>
          <p className="font-medium tabular-nums">{perf.labs}</p>
          <p className="text-xs text-muted-foreground">Labs</p>
        </div>
        <div>
          <p className="font-medium tabular-nums">{perf.assignments}</p>
          <p className="text-xs text-muted-foreground">Assignments</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Overall progress</span>
          <span className="flex items-center gap-1.5 font-medium text-primary group-hover:underline">
            Open course
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
        <ProgressBar value={perf.completionRate} />
      </div>
    </button>
  )
}

/* ------------------------------ Dashboard ------------------------------ */

export function LecturerDashboardView({
  onOpenCourse,
}: {
  onOpenCourse: (courseId: number) => void
}) {
  const { log } = useAudit()
  const [loading, setLoading] = React.useState(true)
  const [failed, setFailed] = React.useState(false)
  const [launching, setLaunching] = React.useState(false)
  const [launched, setLaunched] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <PageSkeleton variant="dashboard" kpis={4} rows={6} />

  const openWorkspace = () => {
    setLaunching(true)
    setTimeout(() => {
      setLaunching(false)
      setLaunched(true)
      log({ action: 'launch', resource: 'hub', category: 'Infrastructure', detail: 'Opened personal JupyterLab workspace' })
    }, 700)
  }

  const overview = lecturerAnalytics.overview
  const analyticsAvailable = lecturerAnalytics.available

  if (failed) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
        <h3 className="text-sm font-semibold text-destructive">Unable to load your dashboard</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          We couldn&apos;t retrieve your teaching information.
        </p>
        <Button variant="outline" className="mt-5" onClick={() => setFailed(false)}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {/* 01 — Welcome */}
      <section className="animate-rise flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:p-8">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Teaching console
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {greeting(lecturer.fullName)} <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening across your teaching workspace.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center md:flex-col lg:flex-row">
          <Button size="lg" className="gap-2.5" onClick={openWorkspace} disabled={launching || !lecturerHub.available}>
            {launching ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : launched ? (
              <CheckCircle2 className="size-4 text-primary-foreground" aria-hidden="true" />
            ) : (
              <BookOpen className="size-4" aria-hidden="true" />
            )}
            {launching ? 'Opening…' : launched ? 'Opened workspace' : 'Open JupyterLab'}
            {!launching && !launched && <ArrowUpRight className="size-4" aria-hidden="true" />}
          </Button>
          <p className="text-center text-xs text-muted-foreground sm:text-left">
            Prepare notebooks and course materials
          </p>
        </div>
      </section>

      {/* 02 — Upcoming deadlines */}
      <section aria-labelledby="upcoming-title">
        <SectionLabel id="upcoming-title">Upcoming deadlines</SectionLabel>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <ul className="divide-y divide-border">
            {lecturerUpcoming.map((item) => (
              <li key={item.id} className="flex items-center gap-4 px-4 py-3 transition hover:bg-muted/40">
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg',
                    item.kind === 'assignment' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success',
                  )}
                >
                  {item.kind === 'assignment' ? (
                    <ClipboardList className="size-4.5" aria-hidden="true" />
                  ) : (
                    <FlaskConical className="size-4.5" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {item.kind === 'assignment' ? 'Assignment' : 'Lab'} · {item.courseCode} · {item.date}
                  </p>
                </div>
                <Badge
                  variant={item.label.toLowerCase().includes('tomorrow') || item.label.toLowerCase().includes('closes') ? 'warning' : 'secondary'}
                >
                  {item.label}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 — Teaching overview */}
      <section aria-labelledby="overview-title">
        <SectionLabel id="overview-title">Teaching overview</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Courses" value={overview.courses} sub="Active" icon={GraduationCap} tone="bg-primary/10 text-primary" />
          <MetricCard label="Students" value={overview.students} sub="Enrolled" icon={Users} tone="bg-indigo-500/10 text-indigo-500" />
          <MetricCard label="Labs" value={overview.labs} sub="Published" icon={FlaskConical} tone="bg-success/10 text-success" />
          <MetricCard label="Assignments" value={overview.assignments} sub="Created" icon={ClipboardList} tone="bg-warning/10 text-warning" />
        </div>
      </section>

      {/* 04 — Attention center */}
      <section aria-labelledby="attention-title">
        <div className="mb-3 flex items-center justify-between">
          <SectionLabel id="attention-title" inline>Needs your attention</SectionLabel>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={() => onOpenCourse(lecturerAnalytics.attention[0]?.courseId ?? lecturerDashboard.courses[0].id)}>
            View all
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {lecturerAnalytics.attention.map((item) => (
            <AttentionItem key={item.id} item={item} onOpen={onOpenCourse} />
          ))}
        </div>
      </section>

      {/* 05 — Teaching analytics */}
      <section aria-labelledby="analytics-title">
        <SectionLabel id="analytics-title">Teaching analytics</SectionLabel>
        {analyticsAvailable ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <ClipboardList className="size-4 text-primary" aria-hidden="true" />
                Assignment progress
              </h3>
              <div className="mt-5">
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-semibold tabular-nums">
                    {Math.round(lecturerAnalytics.assignmentCompletion.rate * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lecturerAnalytics.assignmentCompletion.submitted} / {lecturerAnalytics.assignmentCompletion.expected} submissions
                  </p>
                </div>
                <ProgressBar value={lecturerAnalytics.assignmentCompletion.rate} className="mt-3" />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <Users className="size-4 text-primary" aria-hidden="true" />
                Student engagement
              </h3>
              <div className="mt-5">
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-semibold tabular-nums">
                    {Math.round(lecturerAnalytics.studentEngagement.rate * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lecturerAnalytics.studentEngagement.active} / {lecturerAnalytics.studentEngagement.total} active students
                  </p>
                </div>
                <ProgressBar value={lecturerAnalytics.studentEngagement.rate} className="mt-3" />
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="Analytics are not available yet"
            description="Continue managing your courses below. Lecturer analytics will appear once the backend can supply them."
          />
        )}
      </section>

      {/* 06 — Course performance */}
      <section aria-labelledby="performance-title">
        <SectionLabel id="performance-title">Course performance</SectionLabel>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lecturerAnalytics.courses.map((perf) => (
            <CoursePerformanceRow key={perf.id} perf={perf} onOpen={onOpenCourse} />
          ))}
        </div>
      </section>

      {/* 07 — My courses */}
      <section aria-labelledby="my-courses-title">
        <SectionLabel id="my-courses-title">My courses</SectionLabel>
        {lecturerDashboard.courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="You are not currently assigned to any courses."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {lecturerDashboard.courses.map((course) => (
              <CourseCard key={course.id} course={course} onOpen={onOpenCourse} />
            ))}
          </div>
        )}
      </section>
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
      <h3 className="mt-4 text-lg font-semibold tracking-tight">{course.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {course.description.trim() || 'No description provided.'}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <p className="font-semibold tabular-nums">{course.students_count}</p>
          <p className="text-xs text-muted-foreground">Students</p>
        </div>
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <p className="font-semibold tabular-nums">{course.labs_count}</p>
          <p className="text-xs text-muted-foreground">Labs</p>
        </div>
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <p className="font-semibold tabular-nums">{course.assignments_count}</p>
          <p className="text-xs text-muted-foreground">Assignments</p>
        </div>
      </div>
      <Button variant="outline" className="mt-5 gap-1.5" onClick={() => onOpen(course.id)}>
        Open workspace
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </article>
  )
}

function SectionLabel({
  id,
  inline,
  children,
}: {
  id?: string
  inline?: boolean
  children: React.ReactNode
}) {
  return (
    <h2
      id={id}
      className={cn(
        'mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground',
        inline && 'mb-0',
      )}
    >
      {children}
    </h2>
  )
}
