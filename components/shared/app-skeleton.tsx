'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { PageSkeleton } from '@/components/shared/page-skeleton'

export function AppSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground" aria-busy="true" aria-label="Loading application" role="status">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar py-5 text-sidebar-foreground">
        <div className="flex items-center gap-3 px-3">
          <Skeleton className="size-9 rounded-xl bg-sidebar-accent" />
          <div className="leading-tight">
            <Skeleton className="h-4 w-32 bg-sidebar-accent" />
            <Skeleton className="mt-1.5 h-3 w-20 bg-sidebar-accent" />
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-5 overflow-y-auto px-3">
          {[0, 1, 2, 3].map((group) => (
            <div key={group}>
              <Skeleton className="mb-2 h-2.5 w-14 bg-sidebar-accent" />
              <div className="flex flex-col gap-1">
                {[0, 1, 2].map((item) => (
                  <Skeleton key={item} className="h-9 w-full rounded-xl bg-sidebar-accent" />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-4 border-t border-sidebar-border px-3 pt-4">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <Skeleton className="size-9 rounded-full bg-sidebar-accent" />
            <div className="min-w-0">
              <Skeleton className="h-3.5 w-24 bg-sidebar-accent" />
              <Skeleton className="mt-1.5 h-3 w-12 bg-sidebar-accent" />
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <Skeleton className="size-5 rounded bg-muted lg:hidden" />
            <Skeleton className="hidden h-4 w-48 bg-muted md:block" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="hidden h-9 w-52 rounded-lg bg-muted md:block" />
            <Skeleton className="size-9 rounded-lg bg-muted" />
            <Skeleton className="size-9 rounded-lg bg-muted" />
            <Skeleton className="size-9 rounded-lg bg-muted" />
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 py-7 md:px-8 lg:py-9">
          <PageSkeleton />
        </main>
      </div>
    </div>
  )
}
