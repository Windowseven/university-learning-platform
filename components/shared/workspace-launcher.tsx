'use client'

import * as React from 'react'
import { BookOpen, CheckCircle2, ExternalLink, Loader2, MonitorCog } from 'lucide-react'

import { useAudit } from '@/lib/audit'
import { lecturer as lecturerApi } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const { hub: lecturerHub } = lecturerApi

export function WorkspaceLauncher({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { log } = useAudit()
  const [state, setState] = React.useState<'idle' | 'launching' | 'ready'>('idle')

  React.useEffect(() => {
    if (!open) {
      setState('idle')
      return
    }
    if (!lecturerHub.available) return
    setState('launching')
    const t = setTimeout(() => {
      setState('ready')
      log({ action: 'launch', resource: 'hub', category: 'Infrastructure', detail: 'Opened personal JupyterLab workspace' })
    }, 800)
    return () => clearTimeout(t)
  }, [open, log])

  return (
    <Dialog open={open} onOpenChange={(next) => {
      if (!next) onClose()
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-2">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MonitorCog className="size-6" aria-hidden="true" />
          </div>
          <DialogTitle>JupyterLab teaching workspace</DialogTitle>
          <DialogDescription>Your personal workspace for notebooks and course materials.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-4 text-center">
          {state === 'launching' ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              <p className="text-sm font-medium">Opening your workspace…</p>
              <p className="text-xs text-muted-foreground">
                POST /me/jupyterhub/open
              </p>
            </>
          ) : state === 'ready' ? (
            <>
              <div className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
                <BookOpen className="size-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium">Workspace ready</p>
              <p className="text-xs text-muted-foreground">
                Your notebook server is running and your session is ready.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">JupyterHub is unavailable right now.</p>
          )}
        </div>

        <DialogFooter>
          {state === 'ready' ? (
            <>
              <Button
                className="gap-2"
                onClick={onClose}
                render={<a href="#" onClick={(e) => e.preventDefault()} />}
              >
                Open JupyterLab
                <ExternalLink className="size-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" onClick={onClose}>
                Done
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onClose} disabled={state === 'launching'}>
              {state === 'launching' ? ('Opening…' as const) : 'Close'}
            </Button>
          )}
        </DialogFooter>

        {state === 'launching' && (
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            This is a simulated launch — no server is started in this demo.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}