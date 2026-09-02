import type { StudentAssignment } from '@/lib/api-types'

export type DueTone = 'warning' | 'destructive'

export function greeting(name: string) {
  const hour = new Date().getHours()
  const first = name.split(' ')[0] ?? name
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  return `${part}, ${first}`
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-US', options ?? { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatShortDate(iso: string | null) {
  if (!iso) return 'Not submitted'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatDateTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return (
    d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  )
}

export function todayLong() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function isAction(a: StudentAssignment) {
  return a.status === 'NOT_STARTED' || a.status === 'OVERDUE'
}

export function isSubmitted(a: StudentAssignment) {
  return a.status === 'SUBMITTED' || a.status === 'GRADED'
}

export function needsAttention(a: StudentAssignment) {
  return isAction(a)
}

export function dueMeta(a: StudentAssignment): { label: string; tone: DueTone } {
  if (a.status === 'OVERDUE') return { label: 'Deadline passed', tone: 'destructive' }
  if (a.status === 'NOT_STARTED') return { label: a.dueLabel, tone: 'warning' }
  return { label: a.dueLabel, tone: 'warning' }
}

export function sortByDeadline(a: StudentAssignment, b: StudentAssignment) {
  const da = new Date(a.deadline).getTime()
  const db = new Date(b.deadline).getTime()
  if (Number.isNaN(da) && Number.isNaN(db)) return 0
  if (Number.isNaN(da)) return 1
  if (Number.isNaN(db)) return -1
  return da - db
}

export function sortAttention(a: StudentAssignment, b: StudentAssignment) {
  if (a.status === 'OVERDUE' && b.status !== 'OVERDUE') return -1
  if (b.status === 'OVERDUE' && a.status !== 'OVERDUE') return 1
  return sortByDeadline(a, b)
}