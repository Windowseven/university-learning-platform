'use client'

import * as React from 'react'
import { FileSearch, GraduationCap } from 'lucide-react'

import { PageHeader } from '@/components/shared/page-header'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { admin } from '@/lib/api'
import { Badge } from '@/components/ui/badge'

const { submissions, assignments, users } = admin

const statusTone: Record<string, string> = {
  SUBMITTED: 'bg-primary/10 text-primary',
  GRADED: 'bg-success/10 text-success',
  IN_PROGRESS: 'bg-warning/10 text-warning',
  NOT_STARTED: 'bg-muted text-muted-foreground',
}

export function SubmissionsView() {
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <PageSkeleton variant="table" rows={6} />

  const rows = React.useMemo(() => {    const assignmentById = new Map(assignments.map((a) => [a.id, a]))
    const q = query.trim().toLowerCase()
    return submissions
      .map((s) => ({
        ...s,
        assignmentTitle: assignmentById.get(s.assignment_id)?.title ?? `Assignment #${s.assignment_id}`,
      }))
      .filter((s) => !q || s.student_username?.toLowerCase().includes(q) || s.assignmentTitle.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={GraduationCap}
        title="Submissions"
        description="All student submissions across the platform."
      />

      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-xs">
          <FileSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by student or assignment..."
            aria-label="Filter submissions"
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
          />
        </div>
        <span className="ml-auto text-sm text-muted-foreground">{rows.length} of {submissions.length}</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Assignment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Upload</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const student = users.find((u) => u.id === row.student_id)
                return (
                  <tr key={row.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{student?.full_name ?? row.student_username}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.assignmentTitle}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={statusTone[row.status] ?? 'bg-muted'}>
                        {row.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.submitted_at ? new Date(row.submitted_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {row.submission_path ? (
                        <button className="font-medium text-primary hover:underline">View upload</button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No submissions match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
