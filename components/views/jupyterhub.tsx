'use client'

import * as React from 'react'
import { ArrowUpRight, MonitorCog, RefreshCw, Server, Users } from 'lucide-react'

import { PageHeader } from '@/components/shared/page-header'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { admin } from '@/lib/api'
import { useAudit } from '@/lib/audit'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const { analytics } = admin

export function JupyterHubView() {
  const [refreshKey, setRefreshKey] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const { log } = useAudit()
  void refreshKey
  const hub = analytics.hub
  const available = hub.available

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <PageSkeleton />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={MonitorCog}
        title="JupyterHub"
        description="Reachability and live activity of the Jupyter environment."
        actions={
          <Button
            variant="outline"
            onClick={() => {
              setRefreshKey((k) => k + 1)
              log({ action: 'update', resource: 'hub', category: 'Infrastructure', detail: 'Refreshed JupyterHub status' })
            }}
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Refresh status
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Server className="size-5" aria-hidden="true" />
            </span>
            <h2 className="font-semibold">Hub status</h2>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Reachability</span>
            <Badge
              variant={available ? 'default' : 'destructive'}
              className="gap-1.5"
            >
              <span
                aria-hidden="true"
                className={cn('size-1.5 rounded-full', available ? 'bg-current' : 'bg-current')}
              />
              {available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Live sessions</span>
            <span className="font-semibold">{hub.live_sessions}</span>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="size-5" aria-hidden="true" />
              </span>
              <h2 className="font-semibold">Running users</h2>
            </div>
            <Badge variant="outline">{hub.running_users.length} shown</Badge>
          </div>
          {hub.running_users.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No users have a session running.</p>
          ) : (
            <ul className="mt-5 flex flex-wrap gap-2">
              {hub.running_users.map((u) => (
                <li
                  key={u}
                  className="rounded-full border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs text-foreground"
                >
                  {u}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold">Open your JupyterLab</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Launch a personal notebook environment. This opens a new browser tab using
              single sign-on with the hub.
            </p>
          </div>
          <Button
            disabled={!available}
            className="shrink-0"
            onClick={() => log({ action: 'launch', resource: 'hub', category: 'Infrastructure', detail: 'Opened personal JupyterLab workspace' })}
          >
            Open JupyterLab
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        {!available && (
          <p className="mt-4 flex items-center gap-2 text-sm text-destructive">
            The hub is unreachable, so notebooks cannot be launched right now.
          </p>
        )}
      </section>
    </div>
  )
}
