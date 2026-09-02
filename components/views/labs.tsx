'use client'

import * as React from 'react'
import { CloudUpload, FileCode2, Play, Plus, TerminalSquare } from 'lucide-react'

import { admin } from '@/lib/api'
import type { Lab } from '@/lib/api-types'
import { useAudit } from '@/lib/audit'
import { PageHeader } from '@/components/shared/page-header'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const { labs: allLabs, courses, analytics } = admin

interface PushState {
  lab_id: number
  enrolled: number
  delivered_now: number
  pending: number
}

function usePushStates(): { state: Record<number, PushState>; push: (lab: Lab) => void } {
  const [state, setState] = React.useState<Record<number, PushState>>({})

  const push = (lab: Lab) => {
    const course = courses.find((c) => c.id === lab.course_id)
    const enrolledForCourse = analytics.enrollments.per_course.find((c) => c.course_id === lab.course_id)?.students ?? 0
    const enrolled = course?.is_active ? enrolledForCourse : 0
    const delivered = Math.round(enrolled * 0.72)
    setState((prev) => ({
      ...prev,
      [lab.id]: { lab_id: lab.id, enrolled, delivered_now: delivered, pending: enrolled - delivered },
    }))
  }

  return { state, push }
}

export function LabsView({
  launched,
  onLaunch,
}: {
  launched: boolean
  onLaunch: () => void
}) {
  const { state, push } = usePushStates()
  const { log } = useAudit()
  const courseName = (id: number) => courses.find((c) => c.id === id)?.name ?? `Course #${id}`
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <PageSkeleton variant="table" kpis={4} rows={3} />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={TerminalSquare}
        title="Labs"
        description="Manage course labs and their notebook distribution to students."
        actions={
          <>
            <Button variant="outline" onClick={onLaunch} disabled={launched}>
              <Play className="size-4" aria-hidden="true" />
              {launched ? 'Workspace opened' : 'Open JupyterLab'}
            </Button>
            <Button onClick={() => log({ action: 'create', resource: 'lab', category: 'Content', detail: 'Opened the new-lab form' })}>
              <Plus className="size-4" aria-hidden="true" />
              New lab
            </Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total labs', value: String(allLabs.length) },
          { label: 'Published', value: String(allLabs.filter((l) => l.is_published).length) },
          { label: 'With notebook', value: String(allLabs.filter((l) => l.notebook_filename).length) },
          { label: 'Pending pushes', value: String(Object.values(state).reduce((n, s) => n + s.pending, 0)) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</p>
          </div>
        ))}
      </section>

      <section aria-label="Course labs">
        <div className="mb-3">
          <h2 className="font-semibold">Course labs</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {allLabs.map((lab) => {
            const pushState = state[lab.id]
            return (
              <article key={lab.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <TerminalSquare className="size-5" aria-hidden="true" />
                  </div>
                  <Badge variant={lab.is_published ? 'default' : 'secondary'}>
                    {lab.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <h3 className="mt-4 font-semibold">{lab.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{courseName(lab.course_id)}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{lab.description}</p>

                <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs">
                  <FileCode2 className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  {lab.notebook_filename ? (
                    <span className="truncate font-mono text-foreground">{lab.notebook_filename}</span>
                  ) : (
                    <span className="text-muted-foreground">No notebook uploaded</span>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto h-6 px-2 text-[11px]"
                    onClick={() => log({ action: 'upload', resource: 'lab', category: 'Content', detail: `${lab.notebook_filename ? 'Replaced' : 'Uploaded'} notebook for “${lab.title}”` })}
                  >
                    {lab.notebook_filename ? 'Replace' : 'Upload'}
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground">
                    {pushState ? (
                      <span>
                        {pushState.delivered_now} delivered ·{' '}
                        <span className={pushState.pending > 0 ? 'font-medium text-warning' : 'text-success'}>
                          {pushState.pending} pending
                        </span>
                      </span>
                    ) : (
                      'Not pushed yet'
                    )}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!lab.notebook_filename}
                    onClick={() => {
                      push(lab)
                      log({ action: 'push', resource: 'lab', category: 'Content', detail: `Pushed ${lab.title} to enrolled students` })
                    }}
                  >
                    <CloudUpload className="size-3.5" aria-hidden="true" />
                    Push
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
