'use client'

import * as React from 'react'
import { ArrowRight, ClipboardList } from 'lucide-react'

import { lecturer as lecturerApi } from '@/lib/api'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const { assignments: lecturerAssignments } = lecturerApi

function fmtDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const statusMeta = {
  OPEN: { label: 'Open', badge: 'warning' as const, dot: 'bg-warning' },
  UPCOMING: { label: 'Upcoming', badge: 'secondary' as const, dot: 'bg-muted-foreground' },
  CLOSED: { label: 'Closed', badge: 'success' as const, dot: 'bg-success' },
}

export function LecturerAssignmentsView({
  onOpenCourse,
}: {
  onOpenCourse: (courseId: number) => void
}) {
  const [loading, setLoading] = React.useState(true)
  const [course, setCourse] = React.useState('ALL')
  const [status, setStatus] = React.useState('ALL')

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <PageSkeleton variant="dashboard" kpis={0} headerActions={false} />

  const courses = Array.from(new Set(lecturerAssignments.map((a) => a.courseCode))).sort()

  const filtered = lecturerAssignments.filter((a) => {
    const matchCourse = course === 'ALL' || a.courseCode === course
    const matchStatus = status === 'ALL' || a.status === status
    return matchCourse && matchStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Assignments</h1>
            <Badge variant="secondary" className="tabular-nums">{lecturerAssignments.length} across courses</Badge>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Submission status across every course you teach.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={course} onValueChange={(v) => setCourse(String(v))}>
          <SelectTrigger className="w-full sm:w-48" aria-label="Filter by course">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All courses</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(String(v))}>
          <SelectTrigger className="w-full sm:w-40" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="UPCOMING">Upcoming</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assignments match your filters"
          description="Try a different course or status."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((a) => {
            const pct = Math.round((a.submitted / a.expected) * 100)
            const pending = a.expected - a.submitted
            const meta = statusMeta[a.status]
            return (
              <article
                key={a.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="font-mono">{a.courseCode}</Badge>
                      <span className={cn('size-2 rounded-full', meta.dot)} aria-hidden="true" />
                      <Badge variant={meta.badge}>{meta.label}</Badge>
                    </div>
                    <h3 className="mt-3 text-base font-semibold tracking-tight">{a.title}</h3>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{a.description}</p>
                  </div>
                  <p className="shrink-0 text-right text-sm text-muted-foreground">
                    Due {fmtDate(a.deadline)}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {a.submitted} / {a.expected} submitted
                    </span>
                    <span className="font-medium tabular-nums">{pct}%</span>
                  </div>
                  <div
                    className="h-2 w-full overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={cn('h-full rounded-full transition-all', a.status === 'OPEN' ? 'bg-warning' : 'bg-primary')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    {pending > 0 ? (
                      <span className={cn('font-medium', a.status === 'OPEN' ? 'text-warning' : 'text-muted-foreground')}>
                        {pending} pending
                      </span>
                    ) : (
                      <span className="font-medium text-success">All submitted</span>
                    )}
                  </p>
                  <Button
                    size="sm"
                    variant={a.status === 'OPEN' ? 'default' : 'outline'}
                    className="gap-1.5"
                    onClick={() => onOpenCourse(a.courseId)}
                  >
                    {a.status === 'OPEN' ? 'Review' : 'View in course'}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}