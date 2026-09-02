'use client'

import * as React from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  TriangleAlert,
  Upload,
} from 'lucide-react'

import { student as studentApi } from '@/lib/api'
import { useAudit } from '@/lib/audit'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateTime, dueMeta } from './lib'
import { DueChip } from './_components/status-chip'
import { PageHeroSkeleton, ListSkeleton } from './_components/skeletons'

const { assignments: studentAssignments } = studentApi

export function StudentAssignmentView({
  assignmentId,
  onBack,
}: {
  assignmentId: number
  onBack: () => void
}) {
  const { log } = useAudit()
  const assignment = studentAssignments.find((a) => a.id === assignmentId) ?? null

  const [loading, setLoading] = React.useState(true)
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [resubmitMode, setResubmitMode] = React.useState(false)
  const [notice, setNotice] = React.useState<string | null>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [assignmentId])

  const pickFile = (files: FileList | null) => {
    const f = files?.[0]
    if (f) setFileName(f.name)
  }

  const submit = () => {
    if (!assignment || !fileName) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setResubmitMode(false)
      setFileName(null)
      setNotice(assignment.status === 'GRADED' ? 'Submission updated.' : 'Assignment submitted.')
      log(
        { action: 'upload', resource: 'submission', category: 'Content', detail: `Submitted "${assignment.title}" for ${assignment.courseCode}` },
      )
      setTimeout(() => setNotice(null), 4000)
    }, 800)
  }

  if (!assignment) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={onBack}
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Assignments
        </button>
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FileText className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-semibold">Assignment not found</p>
          <p className="text-sm text-muted-foreground">This assignment is not part of your work.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeroSkeleton />
        <ListSkeleton rows={2} />
      </div>
    )
  }

  const isOverdue = assignment.status === 'OVERDUE'
  const hasSubmitted = assignment.status === 'SUBMITTED' || assignment.status === 'GRADED'
  const showForm = assignment.status === 'NOT_STARTED' || resubmitMode
  const due = dueMeta(assignment)

  return (
    <div className="flex flex-col gap-8">
      <button
        onClick={onBack}
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Assignments
      </button>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono">{assignment.courseCode}</Badge>
          <span className="text-sm text-muted-foreground">{assignment.courseName}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{assignment.title}</h1>
        <p className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-3.5" aria-hidden="true" />
          <DueChip label={due.label} tone={due.tone} />
          <span>· {formatDate(assignment.deadline)}</span>
        </p>
      </header>
      <div className="h-px bg-border" />

      <section aria-labelledby="about-heading">
        <h2 id="about-heading" className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          About this assignment
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-foreground/80">{assignment.description}</p>
      </section>

      {isOverdue && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-destructive">Deadline passed</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This assignment can no longer be submitted because the deadline has passed.
            </p>
          </div>
        </div>
      )}

      {!isOverdue && (
        <section aria-labelledby="submission-heading">
        <h2 id="submission-heading" className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your submission
        </h2>

        {hasSubmitted && !showForm ? (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {assignment.status === 'GRADED'
                      ? assignment.grade != null
                        ? `Graded · ${assignment.grade}%`
                        : 'Graded'
                      : 'Submitted'}
                  </p>
                  <p className="mt-0.5 text-sm text-foreground/80">{assignment.submissionFilename}</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted {assignment.submittedAt ? formatDateTime(assignment.submittedAt) : '—'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => {
                  setResubmitMode(true)
                  setFileName(null)
                }}
              >
                Submit again
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-4 py-10 text-center">
              {fileName ? (
                <>
                  <FileText className="size-7 text-primary" aria-hidden="true" />
                  <p className="text-sm font-medium">{fileName}</p>
                </>
              ) : (
                <>
                  <Upload className="size-7 text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm font-semibold">Upload your completed work</p>
                  <p className="text-sm text-muted-foreground">
                    Choose a file to attach to your submission.
                  </p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                aria-label="Choose submission file"
                onChange={(e) => pickFile(e.target.files)}
              />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                Choose file
              </Button>
              {!fileName && <p className="text-xs text-muted-foreground">No file selected</p>}
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                className="w-full gap-2 sm:w-auto"
                disabled={!fileName || submitting}
                onClick={submit}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  'Submit assignment'
                )}
              </Button>
            </div>
          </div>
        )}
      </section>
      )}

      {notice && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-sm font-medium text-success"
        >
          <CheckCircle2 className="size-4" aria-hidden="true" />
          {notice}
        </p>
      )}
    </div>
  )
}