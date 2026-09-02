'use client'

import * as React from 'react'
import { ArrowRight, CheckCircle2, FlaskConical, XCircle } from 'lucide-react'

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

const { labs: lecturerLabs } = lecturerApi

function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  )
}

export function LecturerLabsView({
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

  const courses = Array.from(new Set(lecturerLabs.map((l) => l.courseCode))).sort()

  const filtered = lecturerLabs.filter((l) => {
    const matchCourse = course === 'ALL' || l.courseCode === course
    const matchStatus =
      status === 'ALL' ||
      (status === 'PUBLISHED' && l.is_published) ||
      (status === 'DRAFT' && !l.is_published)
    return matchCourse && matchStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Labs</h1>
            <Badge variant="secondary" className="tabular-nums">{lecturerLabs.length} across courses</Badge>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Which labs are published, have notebooks, and who hasn&apos;t received them.
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
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No labs match your filters"
          description="Try a different course or status."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((l) => {
            const pending = l.expected - l.delivered
            const pct = Math.round((l.delivered / l.expected) * 100)
            return (
              <article
                key={l.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="font-mono">{l.courseCode}</Badge>
                      <Badge variant={l.is_published ? 'success' : 'secondary'}>
                        {l.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <h3 className="mt-3 text-base font-semibold tracking-tight">{l.title}</h3>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{l.description}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <FlaskConical className="size-4" aria-hidden="true" />
                      Notebook
                    </span>
                    {l.notebook_filename ? (
                      <span className="flex items-center gap-1.5 font-medium text-success">
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                        Attached
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                        <XCircle className="size-4" aria-hidden="true" />
                        None
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        Delivery
                        <span className="font-medium tabular-nums text-foreground">
                          {l.delivered} / {l.expected}
                        </span>
                      </span>
                      <span className={cn('font-medium tabular-nums', pending === 0 && 'text-success')}>
                        {pending === 0 ? 'Delivered' : `${pending} pending`}
                      </span>
                    </div>
                    <ProgressBar value={pct / 100} />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => onOpenCourse(l.courseId)}
                  >
                    Manage
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