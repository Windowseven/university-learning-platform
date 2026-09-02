'use client'

import * as React from 'react'
import { BookOpen, Plus, Search } from 'lucide-react'

import { admin } from '@/lib/api'
import { useAudit } from '@/lib/audit'
import { PageHeader } from '@/components/shared/page-header'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/states'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AvatarInitials } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const { courses: allCourses } = admin

const accents = [
  'bg-primary/10 text-primary',
  'bg-destructive/10 text-destructive',
  'bg-success/10 text-success',
  'bg-warning/10 text-warning',
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function CoursesView() {
  const { log } = useAudit()
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <PageSkeleton variant="table" rows={4} />

  const filtered = allCourses.filter((c) => {
    const q = query.trim().toLowerCase()
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.lecturer?.full_name.toLowerCase().includes(q) ?? false)
    )
  })

  const activeCount = allCourses.filter((c) => c.is_active).length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={BookOpen}
        title="Courses"
        description="Course catalog and status across the platform."
        actions={
          <Button onClick={() => log({ action: 'create', resource: 'course', category: 'Content', detail: 'Opened the new-course form' })}>
            <Plus className="size-4" aria-hidden="true" />
            New course
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total courses', value: String(allCourses.length) },
          { label: 'Active', value: String(activeCount) },
          { label: 'Inactive', value: String(allCourses.length - activeCount) },
          { label: 'Enrollments', value: '—' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses or lecturers..."
              className="pl-9"
              aria-label="Search courses"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description="No courses match your current search."
            actionLabel="Clear search"
            onAction={() => setQuery('')}
            className="border-0"
          />
        ) : (
          <div className="p-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Course</th>
                    <th className="px-2 py-3">Lecturer</th>
                    <th className="px-2 py-3">Created</th>
                    <th className="px-2 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, idx) => (
                    <tr key={c.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', accents[idx % accents.length])}>
                            <BookOpen className="size-4" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="font-mono text-xs text-muted-foreground">{c.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        {c.lecturer ? (
                          <div className="flex items-center gap-2">
                            <AvatarInitials name={c.lecturer.full_name} className="size-7" />
                            <span className="text-sm">{c.lecturer.full_name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </td>
                      <td className="px-2 py-4 text-muted-foreground">{formatDate(c.created_at)}</td>
                      <td className="px-2 py-4 text-right">
                        <Badge variant={c.is_active ? 'default' : 'secondary'} className="capitalize">
                          {c.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
