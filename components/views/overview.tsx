'use client'

import * as React from 'react'
import {
  BarChart3,
  BookOpen,
  CloudUpload,
  FileCheck2,
  GraduationCap,
  MonitorCog,
  Play,
  Plus,
  Sparkles,
  TerminalSquare,
  Users as UsersIcon,
} from 'lucide-react'

import { admin } from '@/lib/api'
import type { SectionId } from '@/lib/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { cn } from '@/lib/utils'

const { analytics } = admin

interface Stat {
  label: string
  value: string
  sub: string
  icon: React.ComponentType<{ className?: string }>
  tone: string
  run: () => void
}

export function OverviewView({
  onNavigate,
  onLaunch,
  launched,
}: {
  onNavigate: (id: SectionId) => void
  onLaunch: () => void
  launched: boolean
}) {
  const a = analytics
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])
  const maxEnrolled = Math.max(...a.enrollments.per_course.map((c) => c.students), 1)
  const subTotal = Math.max(a.submissions.submitted + a.submissions.not_started + a.submissions.in_progress, 1)

  const stats: Stat[] = [
    { label: 'Users', value: a.users.total.toLocaleString(), sub: `${a.users.active.toLocaleString()} active`, icon: UsersIcon, tone: 'bg-primary/10 text-primary', run: () => onNavigate('users') },
    { label: 'Courses', value: String(a.courses.total), sub: `${a.courses.active} active`, icon: BookOpen, tone: 'bg-indigo-500/10 text-indigo-500', run: () => onNavigate('courses') },
    { label: 'Enrollments', value: a.enrollments.total.toLocaleString(), sub: 'across all courses', icon: GraduationCap, tone: 'bg-success/10 text-success', run: () => onNavigate('analytics') },
    { label: 'Labs', value: String(a.labs.total), sub: `${a.labs.published} published`, icon: TerminalSquare, tone: 'bg-warning/10 text-warning', run: () => onNavigate('labs') },
  ]

  const courseCompletion = a.completion.slice(0, 4)

  if (loading) return <PageSkeleton />

  return (
    <div className="flex flex-col gap-8">
      <div className="animate-rise flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
            Admin console
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Welcome back, Jordan<span className="text-primary">.</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {a.users.total.toLocaleString()} users · {a.courses.total} courses · {a.submissions.submitted.toLocaleString()} submissions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => onNavigate('users')} className="gap-2">
            <Plus className="size-4" aria-hidden="true" />
            Add user
          </Button>
          <Button onClick={onLaunch} className="gap-2">
            <Play className="size-4" aria-hidden="true" />
            {launched ? 'Workspace opened' : 'Open JupyterLab'}
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <button
              key={s.label}
              onClick={s.run}
              className="animate-rise rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className={cn('flex size-10 items-center justify-center rounded-xl', s.tone)}>
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
            </button>
          )
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" aria-hidden="true" />
                <h2 className="font-semibold">Course completion</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Submission completion by active course</p>
            </div>
            <Button variant="link" className="h-auto p-0 text-sm" onClick={() => onNavigate('analytics')}>
              View analytics
            </Button>
          </div>

          <div className="mt-5 flex flex-col gap-5">
            {courseCompletion.map((course) => (
              <div key={course.course_id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{course.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.code} · {course.submitted}/{course.expected} submitted
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{course.pct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={course.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${course.name} completion`}>
                  <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${course.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Assignments</p>
              <p className="mt-1 text-2xl font-semibold">{a.assignments.total}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Solutions submitted</p>
              <p className="mt-1 text-2xl font-semibold">{a.submissions.submitted.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Graded</p>
              <p className="mt-1 text-2xl font-semibold">{a.submissions.graded.toLocaleString()}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MonitorCog className="size-4 text-cyan" aria-hidden="true" />
                <h2 className="font-semibold">JupyterHub</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Live environment activity</p>
            </div>
            <Badge variant={a.hub.available ? 'default' : 'destructive'} className="gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-current" aria-hidden="true" />
              {a.hub.available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Live sessions</p>
              <p className="mt-2 text-2xl font-semibold">{a.hub.live_sessions}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Pending pushes</p>
              <p className="mt-2 text-2xl font-semibold text-warning">{a.pushes.pending}</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Running users</p>
            {a.hub.running_users.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No active sessions right now.</p>
            ) : (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {a.hub.running_users.slice(0, 5).map((u) => (
                  <li key={u} className="rounded-full bg-muted px-2.5 py-1 font-mono text-[11px] text-foreground">
                    {u}
                  </li>
                ))}
                {a.hub.running_users.length > 5 && (
                  <li className="px-1 py-1 text-[11px] text-muted-foreground">
                    +{a.hub.running_users.length - 5} more
                  </li>
                )}
              </ul>
            )}
          </div>

          <Button variant="outline" className="mt-4 w-full" onClick={() => onNavigate('jupyterhub')}>
            <MonitorCog className="size-4" aria-hidden="true" />
            View hub status
          </Button>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center gap-2">
            <CloudUpload className="size-4 text-primary" aria-hidden="true" />
            <h2 className="font-semibold">Pending notebook pushes</h2>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{a.pushes.pending} pushes</span> are waiting
            to be delivered to students. Notebooks that couldn&apos;t be delivered in the initial
            push are retried — a pending push is not a failed delivery.
          </p>
          <Button variant="outline" className="mt-5" onClick={() => onNavigate('labs')}>
            Manage lab pushes
          </Button>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Submission status</h2>
              <p className="mt-1 text-sm text-muted-foreground">Across the platform</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('submissions')} className="text-sm">
              View all
            </Button>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {[
              { label: 'Submitted', value: a.submissions.submitted, cls: 'bg-primary' },
              { label: 'In progress', value: a.submissions.in_progress, cls: 'bg-warning' },
              { label: 'Not started', value: a.submissions.not_started, cls: 'bg-muted-foreground/40' },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/90">{row.label}</span>
                  <span className="text-xs text-muted-foreground">{((row.value / subTotal) * 100).toFixed(0)}% · {row.value.toLocaleString()}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className={cn('h-full rounded-full', row.cls)} style={{ width: `${(row.value / subTotal) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section aria-label="Quick actions" className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-semibold">Quick actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">Common tasks you can start now.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Manage users', icon: UsersIcon, run: () => onNavigate('users') },
            { label: 'New course', icon: BookOpen, run: () => onNavigate('courses') },
            { label: 'Review submissions', icon: FileCheck2, run: () => onNavigate('submissions') },
            { label: 'Open JupyterHub', icon: MonitorCog, run: onLaunch },
          ].map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                onClick={action.run}
                className="flex items-center gap-3 rounded-xl border border-border p-3 text-left text-sm font-medium transition hover:bg-muted hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {action.label}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
