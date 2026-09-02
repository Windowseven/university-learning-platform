'use client'

import * as React from 'react'
import { FlaskConical, Search } from 'lucide-react'

import { student as studentApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from './_components/page-header'
import { LabCard } from './_components/lab-card'
import { PageHeroSkeleton, CardGridSkeleton } from './_components/skeletons'

const { courses: studentCourses, labs: studentLabs } = studentApi

export function StudentLabsView({
  onOpenLab,
}: {
  onOpenLab: (labId: number) => void
}) {
  const [loading, setLoading] = React.useState(true)
  const [query, setQuery] = React.useState('')
  const [course, setCourse] = React.useState('ALL')

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeroSkeleton />
        <CardGridSkeleton count={3} variant="lab" />
      </div>
    )
  }

  const available = studentLabs.filter((l) => l.ready)

  const filtered = available.filter((l) => {
    const q = query.trim().toLowerCase()
    const matchQ =
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.courseCode.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q)
    const matchCourse = course === 'ALL' || l.courseCode === course
    return matchQ && matchCourse
  })

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Labs"
        subtitle="Practical work across your courses."
        badge={available.length > 0 ? `${available.length} available` : undefined}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search labs..."
            className="pl-9"
            aria-label="Search labs"
          />
        </div>
        <Select value={course} onValueChange={(v) => setCourse(String(v))}>
          <SelectTrigger className="w-full sm:w-48" aria-label="Filter by course">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All courses</SelectItem>
            {studentCourses.map((c) => (
              <SelectItem key={c.id} value={c.code}>{c.code}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FlaskConical className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-semibold">
            {studentLabs.length === 0 ? 'No labs available yet' : 'No labs match your filters'}
          </p>
          <p className="text-sm text-muted-foreground">
            {studentLabs.length === 0
              ? 'Published practical work will appear here.'
              : 'Try a different course or search term.'}
          </p>
          {studentLabs.length > 0 && (
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => {
                setQuery('')
                setCourse('ALL')
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((l) => (
            <LabCard key={l.id} lab={l} onOpen={onOpenLab} />
          ))}
        </div>
      )}
    </div>
  )
}