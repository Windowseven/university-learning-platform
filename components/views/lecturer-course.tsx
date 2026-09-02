'use client'

import * as React from 'react'
import {
  ArrowLeft,
  ClipboardList,
  CloudUpload,
  Download,
  FileCode2,
  FlaskConical,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react'

import { lecturer as lecturerApi } from '@/lib/api'
import type {
  CourseSummary,
  Lab,
  Assignment,
  Enrollment,
  Submission,
  LecturerCourseWorkspace,
} from '@/lib/api-types'
import { useAuth } from '@/lib/auth'
import { useAudit } from '@/lib/audit'

const {
  courseWorkspace: lecturerCourseWorkspace,
  dashboard: lecturerDashboard,
} = lecturerApi
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/states'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { AvatarInitials } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsPanel } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

function formatDate(iso?: string | null) {
  if (!iso) return 'No deadline'
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ------------------------------ Students tab ------------------------------ */

function StudentsTab({
  students,
  onEnroll,
  onRemove,
}: {
  students: Enrollment[]
  onEnroll: (username: string) => void
  onRemove: (id: number, name: string) => void
}) {
  const [query, setQuery] = React.useState('')
  const [enrollOpen, setEnrollOpen] = React.useState(false)
  const [username, setUsername] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return students
    return students.filter(
      (e) => e.student.full_name.toLowerCase().includes(q) || e.student.username.toLowerCase().includes(q),
    )
  }, [students, query])

  const submit = () => {
    if (username.trim().length < 3) return
    onEnroll(username.trim())
    setUsername('')
    setEnrollOpen(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students…"
            className="pl-9"
            aria-label="Search students"
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {students.length} enrolled {students.length === 1 ? 'student' : 'students'}
          </p>
          <Button size="sm" onClick={() => setEnrollOpen(true)}>
            <UserPlus className="size-4" aria-hidden="true" />
            Enroll
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={students.length === 0 ? 'No students enrolled' : 'No students match your search'}
          description={
            students.length === 0
              ? 'Enroll students by their username to let them access this course.'
              : 'Try a different name or username.'
          }
          actionLabel={students.length === 0 ? 'Enroll student' : undefined}
          onAction={students.length === 0 ? () => setEnrollOpen(true) : undefined}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="hidden grid-cols-[1fr_max-content_max-content_max-content] gap-3 border-b border-border bg-muted/40 px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid">
            <span>Student</span>
            <span>Username</span>
            <span>Enrolled</span>
            <span className="sr-only">Actions</span>
          </div>
          {filtered.map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-1 items-center gap-2 border-b border-border px-4 py-3 last:border-0 sm:grid-cols-[1fr_max-content_max-content_max-content] sm:gap-3 sm:px-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <AvatarInitials name={e.student.full_name} className="size-9" />
                <span className="min-w-0 font-medium">{e.student.full_name}</span>
              </div>
              <span className="text-sm text-muted-foreground">@{e.student.username}</span>
              <span className="text-sm text-muted-foreground">{formatDate(e.enrolled_at)}</span>
              <div className="justify-self-end">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${e.student.full_name}`}>
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onRemove(e.id, e.student.full_name)}
                    >
                      <Trash2 aria-hidden="true" />
                      Remove student
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll a student</DialogTitle>
            <DialogDescription>
              Add an existing student to this course by username.
            </DialogDescription>
          </DialogHeader>
          <label className="text-sm font-medium">
            Student username
            <Input
              className="mt-1.5"
              placeholder="e.g. anasilver"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={username.trim().length < 3}>
              Enroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ------------------------------ Labs tab ------------------------------ */

interface PushState {
  lab_id: number
  enrolled: number
  delivered_now: number
  pending: number
}

function LabsTab({
  labs,
  totalStudents,
  onSave,
  onDelete,
}: {
  labs: Lab[]
  totalStudents: number
  onSave: (payload: Partial<Lab>, id?: number) => void
  onDelete: (lab: Lab) => void
}) {
  const [pushes, setPushes] = React.useState<Record<number, PushState>>({})
  const [creating, setCreating] = React.useState(false)
  const [editing, setEditing] = React.useState<Lab | null>(null)
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [instructions, setInstructions] = React.useState('')

  const openCreate = () => {
    setEditing(null)
    setTitle('')
    setDescription('')
    setInstructions('')
    setCreating(true)
  }
  const openEdit = (lab: Lab) => {
    setEditing(lab)
    setTitle(lab.title)
    setDescription(lab.description)
    setInstructions(lab.instructions)
    setCreating(true)
  }

  const submit = () => {
    if (!title.trim()) return
    if (editing) onSave({ title, description, instructions }, editing.id)
    else onSave({ title, description, instructions })
    setCreating(false)
  }

  const push = (lab: Lab) => {
    const delivered = Math.round(totalStudents * 0.78)
    setPushes((prev) => ({
      ...prev,
      [lab.id]: { lab_id: lab.id, enrolled: totalStudents, delivered_now: delivered, pending: totalStudents - delivered },
    }))
  }

  const deliverLine = (lab: Lab) => {
    const ps = pushes[lab.id]
    if (ps) {
      return (
        <span>
          {ps.delivered_now} delivered ·{' '}
          <span className={ps.pending > 0 ? 'font-medium text-warning' : 'text-success'}>{ps.pending} pending</span>
        </span>
      )
    }
    return 'Not pushed yet'
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {labs.length} lab{labs.length === 1 ? '' : 's'} · {labs.filter((l) => l.is_published).length} published
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          New lab
        </Button>
      </div>

      {labs.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No labs yet"
          description="Create a lab, attach a Jupyter notebook, and push it to students when ready."
          actionLabel="New lab"
          onAction={openCreate}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {labs.map((lab) => (
            <article key={lab.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FlaskConical className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight">{lab.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(lab.created_at)}</p>
                  </div>
                </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={lab.is_published}
                  onCheckedChange={(v) => onSave({ is_published: Boolean(v) }, lab.id)}
                  aria-label={lab.is_published ? 'Unpublish lab' : 'Publish lab'}
                />
                <span className={cn('text-xs font-medium', lab.is_published ? 'text-success' : 'text-muted-foreground')}>
                  {lab.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{lab.description || 'No description.'}</p>

              <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Notebook</p>
                <div className="mt-2 flex items-center gap-2">
                  <FileCode2 className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  {lab.notebook_filename ? (
                    <span className="truncate font-mono text-sm text-foreground">{lab.notebook_filename}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">No notebook uploaded</span>
                  )}
                  {lab.notebook_filename && <CheckMark />}
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Delivery</p>
                <p className="mt-1 text-sm text-muted-foreground">{deliverLine(lab)}</p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button size="sm" variant="outline">
                        <FileCode2 className="size-3.5" aria-hidden="true" />
                        Manage notebook
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>{lab.title}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onSave({ notebook_filename: `${lab.title.replace(/\s+/g, '_').toLowerCase()}.ipynb` }, lab.id)}>
                      <CloudUpload aria-hidden="true" />
                      {lab.notebook_filename ? 'Replace notebook' : 'Upload notebook'}
                    </DropdownMenuItem>
                    {lab.notebook_filename && (
                      <DropdownMenuItem>
                        <Download aria-hidden="true" />
                        Download notebook
                      </DropdownMenuItem>
                    )}
                    {lab.notebook_filename && (
                      <DropdownMenuItem onClick={() => onSave({ notebook_filename: null }, lab.id)} className="text-destructive">
                        <X aria-hidden="true" />
                        Remove notebook
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEdit(lab)}>
                      <Pencil aria-hidden="true" />
                      Edit lab
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(lab)} className="text-destructive">
                      <Trash2 aria-hidden="true" />
                      Delete lab
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="sm" disabled={!lab.notebook_filename} onClick={() => push(lab)}>
                  <CloudUpload className="size-3.5" aria-hidden="true" />
                  Push to students
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit lab' : 'New lab'}</DialogTitle>
            <DialogDescription>
              {editing ? `Update lab “${editing.title}”.` : 'Create a lab and add it to this course.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">
              Title
              <Input className="mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Logistic Regression" />
            </label>
            <label className="text-sm font-medium">
              Description
              <Input className="mt-1.5" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description of the lab" />
            </label>
            <label className="text-sm font-medium">
              Instructions
              <Input className="mt-1.5" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Guidance for students" />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!title.trim()}>
              {editing ? 'Save changes' : 'Create lab'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CheckMark() {
  return (
    <span className="ml-auto rounded-full bg-success/10 p-0.5 text-success" aria-label="Notebook attached">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="size-3">
        <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

/* ------------------------------ Assignments tab ------------------------------ */

function AssignmentsTab({
  assignments,
  submissions,
  totalStudents,
  onSave,
  onDelete,
}: {
  assignments: Assignment[]
  submissions: Submission[]
  totalStudents: number
  onSave: (a: Partial<Assignment>, id?: number) => void
  onDelete: (a: Assignment) => void
}) {
  const [creating, setCreating] = React.useState(false)
  const [editing, setEditing] = React.useState<Assignment | null>(null)
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [deadline, setDeadline] = React.useState('')

  const openCreate = () => {
    setEditing(null)
    setTitle('')
    setDescription('')
    setDeadline('')
    setCreating(true)
  }
  const openEdit = (a: Assignment) => {
    setEditing(a)
    setTitle(a.title)
    setDescription(a.description)
    setDeadline(a.deadline?.slice(0, 10) ?? '')
    setCreating(true)
  }

  const submit = () => {
    if (!title.trim()) return
    if (editing) onSave({ title, description, deadline: deadline || null }, editing.id)
    else onSave({ title, description, deadline: deadline || null })
    setCreating(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {assignments.length} assignment{assignments.length === 1 ? '' : 's'}
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          New assignment
        </Button>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assignments yet"
          description="Create an assignment to collect and review student submissions."
          actionLabel="New assignment"
          onAction={openCreate}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {assignments.map((a) => {
            const subs = submissions.filter((s) => s.assignment_id === a.id)
            const [expanded, setExpanded] = React.useState(false)
            const rate = totalStudents > 0 ? subs.length / totalStudents : 0
            return (
              <article key={a.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">Due {formatDate(a.deadline)}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" aria-label={`Actions for ${a.title}`}>
                          <MoreHorizontal className="size-4" aria-hidden="true" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(a)}>
                        <Pencil aria-hidden="true" />
                        Edit assignment
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(a)} className="text-destructive">
                        <Trash2 aria-hidden="true" />
                        Delete assignment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.description || 'No description.'}</p>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Submission progress</span>
                    <span className="font-medium tabular-nums">
                      {subs.length} / {totalStudents}
                    </span>
                  </div>
                  <ProgressBar value={rate} />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    {subs.length} submitted · {Math.max(0, totalStudents - subs.length)} pending
                  </p>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setExpanded((v) => !v)}>
                    <ClipboardList className="size-3.5" aria-hidden="true" />
                    {expanded ? 'Hide submissions' : 'View submissions'}
                  </Button>
                </div>

                {expanded && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-border">
                    {subs.length === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No submissions yet for this assignment.
                      </p>
                    ) : (
                      subs.map((s, i) => (
                        <div
                          key={s.id}
                          className={cn(
                            'flex items-center justify-between gap-3 px-4 py-3',
                            i !== subs.length - 1 && 'border-b border-border',
                          )}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <AvatarInitials name={s.student_username ?? 'U'} className="size-8" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">@{s.student_username}</p>
                              <p className="text-xs text-muted-foreground">
                                {String(s.status).toLowerCase()} · {s.submitted_at ? formatDate(s.submitted_at) : '—'}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="size-3.5" aria-hidden="true" />
                            Open
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit assignment' : 'New assignment'}</DialogTitle>
            <DialogDescription>
              {editing ? `Update assignment “${editing.title}”.` : 'Create an assignment for this course.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">
              Title
              <Input className="mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Final Project" />
            </label>
            <label className="text-sm font-medium">
              Description
              <Input className="mt-1.5" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What students should submit" />
            </label>
            <label className="text-sm font-medium">
              Deadline
              <Input className="mt-1.5" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!title.trim()}>
              {editing ? 'Save changes' : 'Create assignment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ------------------------------ Course workspace ------------------------------ */

export function LecturerCourseView({
  courseId,
  onBack,
}: {
  courseId: number
  onBack: () => void
}) {
  const { log } = useAudit()

  const summary = lecturerDashboard.courses.find((c) => c.id === courseId)
  const [workspace, setWorkspace] = React.useState<LecturerCourseWorkspace | undefined>(
    () => lecturerCourseWorkspace(courseId),
  )

  const [loading, setLoading] = React.useState(true)
  const [tab, setTab] = React.useState('students')
  const [editOpen, setEditOpen] = React.useState(false)
  const [editName, setEditName] = React.useState('')
  const [editDescription, setEditDescription] = React.useState('')
  const [editActive, setEditActive] = React.useState(true)
  const [studentSeq, setStudentSeq] = React.useState(500)
  const [labSeq, setLabSeq] = React.useState(800)
  const [assignmentSeq, setAssignmentSeq] = React.useState(900)

  const course: CourseSummary | null =
    summary && workspace
      ? {
          id: summary.id,
          code: summary.code,
          name: summary.name,
          description: summary.description,
          lecturer: summary.lecturer,
          is_active: editActive,
          labs_count: workspace.labs.length,
          assignments_count: workspace.assignments.length,
          students_count: workspace.students.length,
        }
      : null

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  React.useEffect(() => {
    if (summary) {
      setEditName(summary.name)
      setEditDescription(summary.description)
      setEditActive(workspace?.is_active ?? true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary])

  if (loading) return <PageSkeleton variant="table" rows={2} />

  if (!course || !workspace) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center">
        <h3 className="text-sm font-semibold text-destructive">Unable to load this course</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          We couldn&apos;t retrieve the course workspace.
        </p>
        <Button variant="outline" className="mt-5" onClick={onBack}>
          Back to dashboard
        </Button>
      </div>
    )
  }

  const saveCourse = () => {
    setWorkspace((w) => (w ? { ...w, is_active: editActive } : w))
    log(
      { action: 'update', resource: 'course', category: 'Content', detail: `Updated course ${course.code} · ${editName.trim() || course.name}` },
    )
    setEditOpen(false)
  }

  const enrollStudent = (username: string) => {
    const display = username
      .split(/[._-]/)
      .map((p) => p[0]?.toUpperCase() + p.slice(1))
      .join(' ')
    setWorkspace((w) =>
      w
        ? {
            ...w,
            students: [
              ...w.students,
              {
                id: studentSeq,
                course_id: course.id,
                enrolled_at: new Date().toISOString(),
                student: { id: studentSeq, username, full_name: display || username },
              },
            ],
          }
        : w,
    )
    setStudentSeq((n) => n + 1)
    log({ action: 'create', resource: 'user', category: 'Access', detail: `Enrolled ${username} in ${course.code}` })
  }

  const removeStudent = (id: number, name: string) => {
    setWorkspace((w) => (w ? { ...w, students: w.students.filter((s) => s.id !== id) } : w))
    log({ action: 'delete', resource: 'user', category: 'Access', detail: `Removed ${name} from ${course.code}` })
  }

  const saveLab = (payload: Partial<Lab>, id?: number) => {
    if (id) {
      setWorkspace((w) =>
        w ? { ...w, labs: w.labs.map((l) => (l.id === id ? { ...l, ...payload } : l)) } : w,
      )
      const labTitle = workspace.labs.find((l) => l.id === id)?.title ?? 'lab'
      log({ action: 'update', resource: 'lab', category: 'Content', detail: `Updated lab “${labTitle}” in ${course.code}` })
    } else {
      setWorkspace((w) =>
        w
          ? {
              ...w,
              labs: [
                ...w.labs,
                {
                  id: labSeq,
                  course_id: course.id,
                  title: payload.title ?? 'Untitled lab',
                  description: payload.description ?? '',
                  instructions: payload.instructions ?? '',
                  is_published: false,
                  notebook_filename: null,
                  created_at: new Date().toISOString(),
                },
              ],
            }
          : w,
      )
      setLabSeq((n) => n + 1)
      log({ action: 'create', resource: 'lab', category: 'Content', detail: `Created lab “${payload.title}” in ${course.code}` })
    }
  }

  const deleteLab = (lab: Lab) => {
    setWorkspace((w) => (w ? { ...w, labs: w.labs.filter((l) => l.id !== lab.id) } : w))
    log({ action: 'delete', resource: 'lab', category: 'Content', detail: `Deleted lab “${lab.title}” from ${course.code}` })
  }

  const saveAssignment = (payload: Partial<Assignment>, id?: number) => {
    if (id) {
      setWorkspace((w) =>
        w ? { ...w, assignments: w.assignments.map((a) => (a.id === id ? { ...a, ...payload } : a)) } : w,
      )
      const aTitle = workspace.assignments.find((a) => a.id === id)?.title ?? 'assignment'
      log({ action: 'update', resource: 'assignment', category: 'Content', detail: `Updated assignment “${aTitle}” in ${course.code}` })
    } else {
      setWorkspace((w) =>
        w
          ? {
              ...w,
              assignments: [
                ...w.assignments,
                {
                  id: assignmentSeq,
                  course_id: course.id,
                  title: payload.title ?? 'Untitled assignment',
                  description: payload.description ?? '',
                  deadline: payload.deadline ?? null,
                  created_at: new Date().toISOString(),
                },
              ],
            }
          : w,
      )
      setAssignmentSeq((n) => n + 1)
      log({ action: 'create', resource: 'assignment', category: 'Content', detail: `Created assignment “${payload.title}” in ${course.code}` })
    }
  }

  const deleteAssignment = (a: Assignment) => {
    setWorkspace((w) =>
      w
        ? {
            ...w,
            assignments: w.assignments.filter((x) => x.id !== a.id),
            submissions: w.submissions.filter((s) => s.assignment_id !== a.id),
          }
        : w,
    )
    log({ action: 'delete', resource: 'assignment', category: 'Content', detail: `Deleted assignment “${a.title}” from ${course.code}` })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Button variant="ghost" size="sm" className="-ml-2 gap-1.5 text-muted-foreground" onClick={onBack}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            My Courses
          </Button>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="secondary" className="font-mono">{course.code}</Badge>
            <Badge variant={course.is_active ? 'success' : 'secondary'}>
              {course.is_active ? 'Active' : 'Archived'}
            </Badge>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{course.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{course.lecturer}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" onClick={() => { setEditName(course.name); setEditDescription(course.description); setEditActive(course.is_active); setEditOpen(true); }}>
            <Pencil className="size-4" aria-hidden="true" />
            Edit course
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="max-w-full overflow-x-auto">
          <TabsTrigger value="students">
            <Users className="size-4" aria-hidden="true" />
            Students
          </TabsTrigger>
          <TabsTrigger value="labs">
            <FlaskConical className="size-4" aria-hidden="true" />
            Labs
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <ClipboardList className="size-4" aria-hidden="true" />
            Assignments
          </TabsTrigger>
        </TabsList>

        <TabsPanel value="students">
          <StudentsTab students={workspace.students} onEnroll={enrollStudent} onRemove={removeStudent} />
        </TabsPanel>

        <TabsPanel value="labs">
          <LabsTab labs={workspace.labs} totalStudents={workspace.students.length} onSave={saveLab} onDelete={deleteLab} />
        </TabsPanel>

        <TabsPanel value="assignments">
          <AssignmentsTab
            assignments={workspace.assignments}
            submissions={workspace.submissions}
            totalStudents={workspace.students.length}
            onSave={saveAssignment}
            onDelete={deleteAssignment}
          />
        </TabsPanel>
      </Tabs>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit course</DialogTitle>
            <DialogDescription>
              Update course information for {course.code}. Deletion is restricted to administrators.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">
              Name
              <Input className="mt-1.5" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </label>
            <label className="text-sm font-medium">
              Description
              <Input className="mt-1.5" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </label>
            <label className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm font-medium">
              Active course
              <Switch checked={editActive} onCheckedChange={(v) => setEditActive(Boolean(v))} aria-label="Toggle active" />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCourse}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
