'use client'

import * as React from 'react'
import { ClipboardList, Filter, Plus, Search } from 'lucide-react'

import { admin } from '@/lib/api'
import { useAudit } from '@/lib/audit'
import { PageHeader } from '@/components/shared/page-header'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const { assignments: allAssignments, courses } = admin

function formatDeadline(iso: string | null) {
  if (!iso) return 'No deadline'
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function isOverdue(iso: string | null) {
  if (!iso) return false
  return new Date(iso).getTime() < Date.now()
}

export function AssignmentsView() {
  const { log } = useAudit()
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <PageSkeleton variant="table" rows={4} />

  const courseName = (id: number) => courses.find((c) => c.id === id)?.name ?? `Course #${id}`

  const filtered = allAssignments.filter((a) => {
    const q = query.trim().toLowerCase()
    return !q || a.title.toLowerCase().includes(q) || courseName(a.course_id).toLowerCase().includes(q)
  })

  const open = allAssignments.filter((a) => !isOverdue(a.deadline)).length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={ClipboardList}
        title="Assignments"
        description="Manage assignments across all courses."
        actions={
          <Button onClick={() => log({ action: 'create', resource: 'assignment', category: 'Content', detail: 'Opened the new-assignment form' })}>
            <Plus className="size-4" aria-hidden="true" />
            New assignment
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total assignments', value: String(allAssignments.length) },
          { label: 'Open', value: String(open) },
          { label: 'Closed', value: String(allAssignments.length - open) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assignments..."
              className="pl-9"
              aria-label="Search assignments"
            />
          </div>
          <Button variant="outline" size="icon" aria-label="Filter">
            <Filter className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Assignment</th>
                <th className="px-2 py-3">Course</th>
                <th className="px-2 py-3">Deadline</th>
                <th className="px-2 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const overdue = isOverdue(a.deadline)
                return (
                  <tr key={a.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-4">
                      <p className="font-medium">{a.title}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{a.description}</p>
                    </td>
                    <td className="px-2 py-4 text-muted-foreground">{courseName(a.course_id)}</td>
                    <td className="px-2 py-4 text-muted-foreground">{formatDeadline(a.deadline)}</td>
                    <td className="px-2 py-4">
                      <Badge variant={overdue ? 'secondary' : 'default'}>
                        {overdue ? 'Closed' : 'Open'}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
