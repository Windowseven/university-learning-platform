'use client'

import * as React from 'react'
import { Eraser, FileClock, ScrollText, Search, ShieldCheck } from 'lucide-react'

import { useAudit, type AuditCategory } from '@/lib/audit'
import { PageHeader } from '@/components/shared/page-header'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/states'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const categories: AuditCategory[] = ['Access', 'Content', 'Infrastructure', 'Settings']

const categoryTone: Record<AuditCategory, string> = {
  Access: 'bg-warning/10 text-warning',
  Content: 'bg-primary/10 text-primary',
  Infrastructure: 'bg-cyan/10 text-cyan',
  Settings: 'bg-success/10 text-success',
}

const actionLabel: Record<string, string> = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  push: 'Pushed',
  upload: 'Uploaded',
  export: 'Exported',
  toggle: 'Toggled',
  launch: 'Launched',
}

const resourceLabel: Record<string, string> = {
  user: 'user',
  course: 'course',
  lab: 'lab notebook',
  assignment: 'assignment',
  submission: 'submission',
  hub: 'JupyterLab workspace',
  system: 'system',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function AuditLogView() {
  const { entries, clear } = useAudit()
  const [query, setQuery] = React.useState('')
  const [category, setCategory] = React.useState<'all' | AuditCategory>('all')
  const [resource, setResource] = React.useState<'all' | string>('all')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((e) => {
      const matchesCategory = category === 'all' || e.category === category
      const matchesResource = resource === 'all' || e.resource === resource
      const matchesQuery = !q || e.detail.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q)
      return matchesCategory && matchesResource && matchesQuery
    })
  }, [entries, query, category, resource])

  if (loading) return <PageSkeleton variant="table" rows={6} />

  const resources = ['user', 'course', 'lab', 'assignment', 'submission', 'hub']

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={ScrollText}
        title="Audit & Logs"
        description="Actions performed in this admin console, captured in this session."
        actions={
          <Button variant="outline" onClick={clear} disabled={entries.length === 0}>
            <Eraser className="size-4" aria-hidden="true" />
            Clear log
          </Button>
        }
      />

      <div className="max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="size-4" aria-hidden="true" />
          <h2 className="font-semibold">How this works</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          This log records real actions you take in the admin console — creating a user, pushing a
          lab notebook, exporting data, and so on. Entries are stored on this device for your
          session. A backend audit service is not connected yet, so nothing here reads from server
          logs.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actor or detail..."
            className="pl-9"
            aria-label="Search audit log"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={category} onValueChange={(v) => setCategory(v as 'all' | AuditCategory)}>
            <SelectTrigger className="w-36" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={resource} onValueChange={(v) => setResource(String(v))}>
            <SelectTrigger className="w-36" aria-label="Filter by resource">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All resources</SelectItem>
              {resources.map((r) => (
                <SelectItem key={r} value={r}>{resourceLabel[r]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {filtered.length === 0 ? (
          entries.length === 0 ? (
            <EmptyState
              icon={FileClock}
              title="No activity recorded yet"
              description="Take an action in the admin console — like adding a user or pushing a lab — and it will appear here."
              className="border-0"
            />
          ) : (
            <EmptyState
              icon={Search}
              title="No entries match your filters"
              description="Try changing the search or filter criteria."
              className="border-0"
            />
          )
        ) : (
          <ul className="divide-y divide-border/60">
            {filtered.map((e) => (
              <li key={e.id} className="flex items-start gap-4 px-5 py-4">
                <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${categoryTone[e.category]}`}>
                  <FileClock className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {actionLabel[e.action]} {resourceLabel[e.resource]}
                    <span className="text-muted-foreground"> · {e.detail}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {e.actor} · {formatTime(e.timestamp)}
                  </p>
                </div>
                <Badge variant="outline" className={categoryTone[e.category]}>
                  {e.category}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
