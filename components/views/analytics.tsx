'use client'

import * as React from 'react'
import { BarChart3, Clock3, Users } from 'lucide-react'

import { PageHeader } from '@/components/shared/page-header'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { admin } from '@/lib/api'
import { cn } from '@/lib/utils'

const { analytics } = admin

function Metric({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-2xl font-semibold tracking-tight', tone)}>{value.toLocaleString()}</p>
    </div>
  )
}

export function AnalyticsView() {
  const a = analytics
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])
  const maxEnrolled = Math.max(...a.enrollments.per_course.map((c) => c.students), 1)
  const subTotal = Math.max(
    a.submissions.not_started + a.submissions.in_progress + a.submissions.submitted + a.submissions.graded,
    1,
  )

  const bars = [
    { label: 'Not started', value: a.submissions.not_started, className: 'bg-muted-foreground/40' },
    { label: 'In progress', value: a.submissions.in_progress, className: 'bg-warning' },
    { label: 'Submitted', value: a.submissions.submitted, className: 'bg-primary' },
    { label: 'Graded', value: a.submissions.graded, className: 'bg-success' },
  ]

  if (loading) return <PageSkeleton />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={BarChart3}
        title="Analytics"
        description="Platform-wide metrics across users, courses, labs and submissions."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric label="Users" value={a.users.total} />
        <Metric label="Courses" value={a.courses.total} />
        <Metric label="Enrollments" value={a.enrollments.total} />
        <Metric label="Labs" value={a.labs.total} />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="font-semibold">Enrollment by course</h2>
          </div>
          <ul className="mt-5 flex flex-col gap-4">
            {a.enrollments.per_course.map((c) => (
              <li key={c.course_id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    <span className="font-mono text-muted-foreground">{c.code}</span> · {c.name}
                  </span>
                  <span className="font-semibold">{c.students}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(c.students / maxEnrolled) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="font-semibold">Submission status</h2>
          </div>
          <ul className="mt-5 flex flex-col gap-3">
            {bars.map((bar) => (
              <li key={bar.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/90">{bar.label}</span>
                  <span className="font-semibold">{((bar.value / subTotal) * 100).toFixed(0)}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full', bar.className)}
                    style={{ width: `${(bar.value / subTotal) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-semibold">Course completion</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Course</th>
                <th className="py-2 pr-4 font-medium">Enrolled</th>
                <th className="py-2 pr-4 font-medium">Assignments</th>
                <th className="py-2 pr-4 font-medium">Completion</th>
                <th className="py-2 font-medium">%</th>
              </tr>
            </thead>
            <tbody>
              {a.completion.map((c) => (
                <tr key={c.course_id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4 font-medium">
                    <span className="font-mono text-muted-foreground">{c.code}</span> · {c.name}
                  </td>
                  <td className="py-3 pr-4">{c.enrolled}</td>
                  <td className="py-3 pr-4">{c.assignments}</td>
                  <td className="py-3 pr-4">
                    <span className="mr-2 text-xs text-muted-foreground">{c.submitted}/{c.expected} submitted</span>
                    <span className="inline-block h-2 w-28 align-middle overflow-hidden rounded-full bg-muted">
                      <span className="block h-full rounded-full bg-primary" style={{ width: `${c.pct}%` }} />
                    </span>
                  </td>
                  <td className="py-3 font-semibold">{c.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
