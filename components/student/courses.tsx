'use client'

import * as React from 'react'
import { BookOpen } from 'lucide-react'

import { student as studentApi } from '@/lib/api'
import { PageHeader } from './_components/page-header'
import { CourseCard } from './_components/course-card'
import { PageHeroSkeleton, CardGridSkeleton } from './_components/skeletons'

const { courses: studentCourses } = studentApi

export function StudentCoursesView({
  onOpenCourse,
}: {
  onOpenCourse: (courseId: number) => void
}) {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeroSkeleton />
        <CardGridSkeleton count={3} variant="course" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="My Courses"
        subtitle="Your active learning spaces."
        badge={studentCourses.length > 0 ? `${studentCourses.length} active` : undefined}
      />

      {studentCourses.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <BookOpen className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-semibold">No courses yet</p>
          <p className="text-sm text-muted-foreground">Your enrolled courses will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {studentCourses.map((c) => (
            <CourseCard key={c.id} course={c} onOpen={onOpenCourse} />
          ))}
        </div>
      )}
    </div>
  )
}