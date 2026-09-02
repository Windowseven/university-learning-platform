'use client'

import * as React from 'react'
import { ClipboardList } from 'lucide-react'

import { student as studentApi } from '@/lib/api'
import type { StudentAssignment } from '@/lib/api-types'
import { cn } from '@/lib/utils'
import { isAction, isSubmitted, sortAttention } from './lib'
import { PageHeader } from './_components/page-header'
import { PageHeroSkeleton, ListSkeleton } from './_components/skeletons'
import { AssignmentCard } from './_components/assignment-card'

const { assignments: studentAssignments } = studentApi

type Filter = 'ALL' | 'ACTION' | 'SUBMITTED' | 'OVERDUE'

const filters: { id: Filter; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'ACTION', label: 'Needs action' },
  { id: 'SUBMITTED', label: 'Submitted' },
  { id: 'OVERDUE', label: 'Overdue' },
]

function matches(a: StudentAssignment, filter: Filter) {
  if (filter === 'ALL') return true
  if (filter === 'ACTION') return isAction(a)
  if (filter === 'SUBMITTED') return isSubmitted(a)
  return a.status === 'OVERDUE'
}

export function StudentAssignmentsView({
  onOpenAssignment,
}: {
  onOpenAssignment: (assignmentId: number) => void
}) {
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState<Filter>('ALL')

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeroSkeleton />
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <div key={f.id} className="h-8 w-28 animate-pulse rounded-full bg-muted" />
          ))}
        </div>
        <ListSkeleton rows={4} />
      </div>
    )
  }

  const filtered = studentAssignments.filter((a) => matches(a, filter))
  const attention = filtered.filter((a) => isAction(a)).sort(sortAttention)
  const submitted = filtered.filter((a) => isSubmitted(a)).sort(sortAttention)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Assignments"
        subtitle="Your submission center across all courses."
        badge={`${studentAssignments.length} total`}
      />

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter assignments">
        {filters.map((f) => {
          const count = studentAssignments.filter((a) => matches(a, f.id)).length
          const active = filter === f.id
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {f.label}
              <span
                className={cn(
                  'ml-1.5 tabular-nums',
                  active ? 'text-primary-foreground/80' : 'text-muted-foreground/60',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ClipboardList className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-semibold">
            {filter === 'ACTION' ? "You're all caught up" : 'No assignments here'}
          </p>
          <p className="text-sm text-muted-foreground">
            {filter === 'ACTION'
              ? 'No assignments need your attention.'
              : filter === 'OVERDUE'
                ? 'No overdue assignments. Nice work.'
                : 'Nothing matches this filter right now.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {attention.length > 0 && (
            <section aria-label="Needs attention">
              <GroupLabel tone="warning">Needs attention</GroupLabel>
              <div className="grid gap-4 lg:grid-cols-2">
                {attention.map((a) => (
                  <AssignmentCard key={a.id} a={a} onOpen={onOpenAssignment} />
                ))}
              </div>
            </section>
          )}

          {submitted.length > 0 && (
            <section aria-label="Submitted">
              <GroupLabel tone="success">Submitted</GroupLabel>
              <div className="grid gap-4 lg:grid-cols-2">
                {submitted.map((a) => (
                  <AssignmentCard key={a.id} a={a} onOpen={onOpenAssignment} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function GroupLabel({ tone, children }: { tone: 'warning' | 'success'; children: React.ReactNode }) {
  return (
    <h2
      className={cn(
        'mb-4 text-xs font-semibold uppercase tracking-wider',
        tone === 'warning' ? 'text-warning' : 'text-success',
      )}
    >
      {children}
    </h2>
  )
}