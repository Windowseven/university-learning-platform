import { AlertTriangle, BookOpen, CheckCircle2, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface QuickStatsData {
  courses: number
  toDo: number
  submitted: number
  overdue: number
}

export function QuickStats({ data }: { data: QuickStatsData }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Courses"
        value={data.courses}
        sub="Active courses"
        icon={BookOpen}
        tone="text-muted-foreground"
      />
      <StatCard
        label="To Do"
        value={data.toDo}
        sub="Need action"
        icon={ClipboardList}
        tone="text-warning"
      />
      <StatCard
        label="Submitted"
        value={data.submitted}
        sub="Completed"
        icon={CheckCircle2}
        tone="text-success"
      />
      <StatCard
        label="Overdue"
        value={data.overdue}
        sub={data.overdue === 0 ? 'On track' : 'Needs review'}
        icon={AlertTriangle}
        tone={data.overdue === 0 ? 'text-muted-foreground' : 'text-destructive'}
      />
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  sub: string
  icon: LucideIcon
  tone: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className={cn('size-4.5', tone)} aria-hidden="true" />
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

export function QuickStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="size-4.5 animate-pulse rounded bg-muted" />
          </div>
          <div className="mt-3 h-8 w-12 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-20 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}