import { AttentionListSkeleton } from './attention-list'
import { CourseCardSkeleton } from './course-card'
import { LabCardSkeleton } from './lab-card'
import { QuickStatsSkeleton } from './quick-stats'
import { RecentLabsSkeleton } from './recent-labs'

export function DashboardSkeleton({ attentionRows = 2 }: { attentionRows?: number }) {
  return (
    <div className="flex flex-col gap-10" aria-busy="true" aria-label="Loading dashboard" role="status">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-72 max-w-full animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-60 max-w-full animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
      </div>

      <section>
        <div className="mb-3 h-3 w-44 animate-pulse rounded bg-muted" />
        <AttentionListSkeleton rows={attentionRows} />
      </section>

      <QuickStatsSkeleton />

      <section>
        <div className="mb-3 h-3 w-28 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      </section>

      <section>
        <div className="mb-3 h-3 w-32 animate-pulse rounded bg-muted" />
        <RecentLabsSkeleton rows={2} />
      </section>
    </div>
  )
}

export function CardGridSkeleton({
  count = 3,
  variant = 'course',
}: {
  count?: number
  variant?: 'course' | 'lab'
}) {
  const Card = variant === 'course' ? CourseCardSkeleton : LabCardSkeleton
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      aria-label="Loading cards"
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} />
      ))}
    </div>
  )
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      aria-busy="true"
      aria-label="Loading list"
      role="status"
    >
      <ul className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="size-9 animate-pulse rounded-lg bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PageHeroSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      <div className="h-7 w-52 max-w-full animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
    </div>
  )
}