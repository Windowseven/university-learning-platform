'use client'

import * as React from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Download,
  FileCode2,
  FlaskConical,
  Loader2,
  MonitorCog,
  NotebookPen,
  TriangleAlert,
} from 'lucide-react'

import { student as studentApi } from '@/lib/api'
import { useAudit } from '@/lib/audit'
import { Button } from '@/components/ui/button'
import { LabStatusChip } from './_components/status-chip'
import { PageHeroSkeleton } from './_components/skeletons'

const { labs: studentLabs } = studentApi

type EnvState = 'idle' | 'starting' | 'ready' | 'timeout' | 'error'

export function StudentLabView({
  labId,
  onBack,
}: {
  labId: number
  onBack: () => void
}) {
  const { log } = useAudit()
  const lab = studentLabs.find((l) => l.id === labId) ?? null

  const [loading, setLoading] = React.useState(true)
  const [env, setEnv] = React.useState<EnvState>('idle')
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [labId])

  React.useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const launch = () => {
    if (env === 'starting') return
    setEnv('starting')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setEnv('ready')
      log(
        { action: 'launch', resource: 'hub', category: 'Infrastructure', detail: `Opened JupyterLab for lab "${lab?.title}" (${lab?.courseCode})` },
      )
    }, 1400)
  }

  if (!lab) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={onBack}
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Labs
        </button>
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FlaskConical className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-semibold">Lab not found</p>
          <p className="text-sm text-muted-foreground">This lab is not available to you.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeroSkeleton />
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-56 animate-pulse rounded-2xl border border-border bg-card shadow-sm" />
          <div className="flex flex-col gap-6">
            <div className="h-24 animate-pulse rounded-2xl border border-border bg-card shadow-sm" />
            <div className="h-56 animate-pulse rounded-2xl border border-border bg-card shadow-sm" />
          </div>
        </div>
      </div>
    )
  }

  const isNotebookMissing = !lab.ready || !lab.notebook_filename

  return (
    <div className="flex flex-col gap-8">
      <button
        onClick={onBack}
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {lab.courseCode} / Labs
      </button>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-xs font-medium text-muted-foreground">
            {lab.courseCode}
          </span>
          <span className="text-sm text-muted-foreground">{lab.courseName}</span>
          <LabStatusChip ready={lab.ready} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{lab.title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{lab.description}</p>
      </header>
      <div className="h-px bg-border" />

      {isNotebookMissing && (
        <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-5">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-warning">Notebook not attached</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your lecturer hasn&apos;t attached a notebook to this lab yet. You can still follow the
              instructions.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Instructions */}
        <section aria-labelledby="instructions-heading">
          <SectionHeading id="instructions-heading" icon={NotebookPen}>Instructions</SectionHeading>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
            <ol className="space-y-3">
              {lab.instructions.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary tabular-nums">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground/80">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          {/* Notebook */}
          {!isNotebookMissing && (
            <section aria-labelledby="notebook-heading">
              <SectionHeading id="notebook-heading" icon={FileCode2}>Lab notebook</SectionHeading>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FileCode2 className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{lab.notebook_filename}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-success">
                        <CheckCircle2 className="size-3.5" aria-hidden="true" />
                        Notebook ready
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 sm:w-auto"
                    onClick={() =>
                      log(
                        { action: 'export', resource: 'lab', category: 'Content', detail: `Downloaded notebook "${lab.notebook_filename}"` },
                      )
                    }
                  >
                    <Download className="size-3.5" aria-hidden="true" />
                    Download notebook
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* Your workspace */}
          <section aria-labelledby="workspace-heading">
            <SectionHeading id="workspace-heading" icon={MonitorCog}>Your workspace</SectionHeading>
            <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MonitorCog className="size-7" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">JupyterLab</h3>
              <p className="mt-1 text-sm text-muted-foreground">Your personal workspace</p>

              <div className="mt-5 w-full" aria-live="polite">
                {env === 'starting' && (
                  <>
                    <Button className="w-full gap-2 sm:w-auto" disabled>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Opening…
                    </Button>
                    <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium">
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Preparing your workspace…
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Please wait. This usually takes a few moments.
                    </p>
                  </>
                )}

                {(env === 'ready' || env === 'idle') && (
                  <>
                    <Button className="w-full gap-2 sm:w-auto" onClick={launch}>
                      Open in JupyterLab
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Button>
                    {env === 'ready' && (
                      <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-success">
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                        Your workspace is ready.
                      </p>
                    )}
                  </>
                )}

                {(env === 'timeout' || env === 'error') && (
                  <>
                    <Button className="gap-2" onClick={launch}>
                      Try again
                    </Button>
                    <p
                      className={
                        'mt-4 flex items-center justify-center gap-1.5 text-sm font-medium ' +
                        (env === 'timeout' ? 'text-muted-foreground' : 'text-destructive')
                      }
                    >
                      {env === 'timeout' ? 'We are still starting your workspace.' : "We couldn't start your workspace."}
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function SectionHeading({
  id,
  icon: Icon,
  children,
}: {
  id: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <h2 id={id} className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <Icon className="size-4" aria-hidden="true" />
      {children}
    </h2>
  )
}