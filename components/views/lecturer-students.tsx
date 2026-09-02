'use client'

import * as React from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  FlaskConical,
  LogIn,
  Search,
  User,
  Users,
} from 'lucide-react'

import { lecturer as lecturerApi } from '@/lib/api'
import type {
  LecturerStudentActivity,
  LecturerStudentAssignmentProgress,
  LecturerStudentLabProgress,
} from '@/lib/api-types'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const {
  students: lecturerStudents,
  studentProfile: lecturerStudentProfile,
} = lecturerApi
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

function fmtDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  )
}

export function LecturerStudentsView({
  onOpenStudent,
}: {
  onOpenStudent: (studentId: number) => void
}) {
  const [loading, setLoading] = React.useState(true)
  const [query, setQuery] = React.useState('')
  const [course, setCourse] = React.useState('ALL')

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <PageSkeleton variant="table" kpis={0} headerActions={false} />

  const courses = Array.from(new Set(lecturerStudents.flatMap((s) => s.courses.map((c) => c.code)))).sort()

  const filtered = lecturerStudents.filter((s) => {
    const q = query.trim().toLowerCase()
    const matchQ =
      !q ||
      s.full_name.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    const matchCourse = course === 'ALL' || s.courses.some((c) => c.code === course)
    return matchQ && matchCourse
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Students</h1>
            <Badge variant="secondary" className="tabular-nums">{lecturerStudents.length} in roster</Badge>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            All students enrolled across your courses.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students..."
            className="pl-9"
            aria-label="Search students"
          />
        </div>
        <Select value={course} onValueChange={(v) => setCourse(String(v))}>
          <SelectTrigger className="w-full sm:w-48" aria-label="Filter by course">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All courses</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students match your filters"
          description="Try a different name or course."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Student</span>
            <span className="hidden md:block">Username</span>
            <span>Courses</span>
            <span className="text-right">Status</span>
          </div>
          <ul className="divide-y divide-border">
            {filtered.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => onOpenStudent(s.id)}
                  className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 text-left transition hover:bg-muted/40"
                  aria-label={`Open profile for ${s.full_name}`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {s.full_name.split(' ').map((p) => p[0]).join('')}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{s.full_name}</span>
                      <span className="block truncate text-xs text-muted-foreground md:hidden">
                        @{s.username}
                      </span>
                    </span>
                  </span>
                  <span className="hidden truncate text-sm text-muted-foreground md:block">
                    @{s.username}
                  </span>
                  <span className="flex flex-wrap gap-1.5">
                    {s.courses.map((c) => (
                      <Badge key={c.id} variant="secondary" className="font-mono">{c.code}</Badge>
                    ))}
                  </span>
                  <span className="text-right">
                    <Badge variant={s.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {s.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </Badge>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function LecturerStudentProfileView({
  studentId,
  onBack,
}: {
  studentId: number
  onBack: () => void
}) {
  const profile = lecturerStudentProfile(studentId)
  const student = lecturerStudents.find((s) => s.id === studentId)

  if (!profile || !student) {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit gap-1.5" onClick={onBack}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to students
        </Button>
        <EmptyState
          icon={User}
          title="Student not found"
          description="This student is not in your current roster."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Button variant="ghost" size="sm" className="w-fit gap-1.5 text-muted-foreground" onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to students
      </Button>

      {/* Basic information */}
      <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
            {student.full_name.split(' ').map((p) => p[0]).join('')}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{student.full_name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              @{student.username} · {student.email}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={student.status === 'ACTIVE' ? 'success' : 'secondary'}>
            {student.status === 'ACTIVE' ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant="secondary">
            Last active {fmtDate(student.lastActive)}
          </Badge>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          {/* Enrolled courses */}
          <section aria-labelledby="courses-title">
            <SectionLabel id="courses-title" icon={BookOpen}>Enrolled courses</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {student.courses.map((c) => (
                <div key={c.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-mono">{c.code}</Badge>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{c.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Assignment progress */}
          <section aria-labelledby="assignment-progress-title">
            <SectionLabel id="assignment-progress-title" icon={FileText}>Assignment progress</SectionLabel>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Assignment</span>
                <span className="hidden sm:block">Submitted</span>
                <span className="text-right">Status</span>
              </div>
              <ul className="divide-y divide-border">
                {profile.assignmentProgress.map((a) => (
                  <AssignmentRow key={a.assignmentId} a={a} />
                ))}
              </ul>
            </div>
          </section>

          {/* Activity */}
          <section aria-labelledby="activity-title">
            <SectionLabel id="activity-title" icon={Clock}>Activity</SectionLabel>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <ul className="space-y-4">
                {profile.activity.map((act) => (
                  <ActivityRow key={act.id} act={act} />
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Lab progress */}
        <section aria-labelledby="lab-progress-title" className="xl:col-span-1">
          <SectionLabel id="lab-progress-title" icon={FlaskConical}>Lab progress</SectionLabel>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <ul className="space-y-4">
              {profile.labProgress.map((l) => (
                <LabRow key={l.labId} l={l} />
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

function AssignmentRow({ a }: { a: LecturerStudentAssignmentProgress }) {
  const meta = {
    SUBMITTED: { label: 'Submitted', badge: 'warning' as const, icon: <CheckCircle2 className="size-4 text-warning" aria-hidden="true" /> },
    GRADED: { label: a.score != null ? `Graded · ${a.score}%` : 'Graded', badge: 'success' as const, icon: <CheckCircle2 className="size-4 text-success" aria-hidden="true" /> },
    PENDING: { label: 'Pending', badge: 'secondary' as const, icon: <Clock className="size-4 text-muted-foreground" aria-hidden="true" /> },
  }[a.status]

  return (
    <li className="flex items-center gap-4 px-4 py-3">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{a.title}</span>
        <span className="block text-xs text-muted-foreground">{a.courseCode}</span>
      </span>
      <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
        {meta.icon}
        {a.submittedAt ? fmtDate(a.submittedAt) : '—'}
      </span>
      <Badge variant={meta.badge}>{meta.label}</Badge>
    </li>
  )
}

function LabRow({ l }: { l: LecturerStudentLabProgress }) {
  const meta = {
    COMPLETED: { label: 'Completed', badge: 'success' as const, icon: 'text-success' },
    IN_PROGRESS: { label: 'In progress', badge: 'warning' as const, icon: 'text-warning' },
    NOT_STARTED: { label: 'Not started', badge: 'secondary' as const, icon: 'text-muted-foreground' },
  }[l.status]

  return (
    <li className="flex items-center gap-3">
      <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted', meta.icon)}>
        <FlaskConical className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{l.title}</span>
        <span className="block text-xs text-muted-foreground">{l.courseCode}</span>
      </span>
      <Badge variant={meta.badge}>{meta.label}</Badge>
    </li>
  )
}

function ActivityRow({ act }: { act: LecturerStudentActivity }) {
  const icon =
    act.type === 'SUBMISSION' ? <FileText className="size-4" aria-hidden="true" />
    : act.type === 'LAB' ? <FlaskConical className="size-4" aria-hidden="true" />
    : act.type === 'LOGIN' ? <LogIn className="size-4" aria-hidden="true" />
    : <ArrowRight className="size-4" aria-hidden="true" />

  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium">{act.description}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{fmtDate(act.time)}</p>
      </div>
    </li>
  )
}

function SectionLabel({
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