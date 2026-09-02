import { Skeleton } from '@/components/ui/skeleton'

function SkeletonHeader({ withActions = true }: { withActions?: boolean }) {
  return (
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
      </div>
      {withActions && (
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      )}
    </div>
  )
}

function SkeletonCards({ count }: { count: number }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <Skeleton className="size-10 rounded-xl" />
          <Skeleton className="mt-5 h-4 w-20" />
          <Skeleton className="mt-2 h-7 w-16" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>
      ))}
    </section>
  )
}

export function PageSkeleton({
  variant = 'dashboard',
  kpis = 4,
  rows = 5,
  headerActions = true,
}: {
  variant?: 'dashboard' | 'table'
  kpis?: number
  rows?: number
  headerActions?: boolean
}) {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-label="Loading view" role="status">
      <SkeletonHeader withActions={headerActions} />
      <SkeletonCards count={kpis} />

      {variant === 'table' ? (
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <Skeleton className="h-3 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
          <div className="space-y-3 p-4">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="ml-auto h-5 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {[0, 1].map((panel) => (
            <section key={panel} className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="mt-6 space-y-4">
                {Array.from({ length: 3 }).map((_, r) => (
                  <div key={r}>
                    <div className="flex items-center justify-between gap-4">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="mt-2 h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
