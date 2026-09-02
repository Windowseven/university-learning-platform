'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'

import {
  studentDefaultSection,
  studentNavGroups,
  type StudentSectionId,
} from '@/lib/navigation'
import { useAuth } from '@/lib/auth'
import { student as studentApi } from '@/lib/api'
import { isAction } from './lib'
import { Sidebar, type Persona } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { AppSkeleton } from '@/components/shared/app-skeleton'
import { StudentDashboardView } from './dashboard'
import { StudentCoursesView } from './courses'
import { StudentCourseView } from './course'
import { StudentAssignmentsView } from './assignments'
import { StudentAssignmentView } from './assignment'
import { StudentLabsView } from './labs'
import { StudentLabView } from './lab'
import { StudentAccountView } from './account'

const {
  assignments: studentAssignments,
  courses: studentCourses,
  labs: studentLabs,
  notifications: studentNotifications,
} = studentApi

function parentSection(active: StudentSectionId): 'student-courses' | 'student-assignments' | 'student-labs' | null {
  if (active === 'student-course') return 'student-courses'
  if (active === 'student-assignment') return 'student-assignments'
  if (active === 'student-lab') return 'student-labs'
  return null
}

export function StudentShell() {
  const { user, logout } = useAuth()
  const [active, setActive] = useState<StudentSectionId>(studentDefaultSection)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null)
  const [selectedLabId, setSelectedLabId] = useState<number | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [appLoading, setAppLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setAppLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [mobileOpen])

  if (appLoading) return <AppSkeleton />

  const persona: Persona = user
    ? { name: user.full_name, role: user.role, initials: user.initials }
    : { name: 'Student', role: 'STUDENT', initials: 'ST' }

  const course = selectedCourseId != null ? studentCourses.find((c) => c.id === selectedCourseId) : null
  const assignment =
    selectedAssignmentId != null ? studentAssignments.find((a) => a.id === selectedAssignmentId) : null
  const lab = selectedLabId != null ? studentLabs.find((l) => l.id === selectedLabId) : null

  const labelFor = (section: StudentSectionId): string => {
    switch (section) {
      case 'student-course':
        return course?.code ?? 'Course'
      case 'student-assignment':
        return assignment?.title ?? 'Assignment'
      case 'student-lab':
        return lab?.title ?? 'Lab'
      case 'student-dashboard':
        return 'Dashboard'
      case 'student-courses':
        return 'Courses'
      case 'student-assignments':
        return 'Assignments'
      case 'student-labs':
        return 'Labs'
      case 'student-account':
        return 'My Account'
    }
  }

  const currentLabel = labelFor(active)
  const parent = parentSection(active)
  const breadcrumbs: { label: string; onClick?: () => void }[] = [
    ...(parent
      ? [
          {
            label: labelFor(parent),
            onClick: () => setActive(parent),
          },
        ]
      : []),
    { label: currentLabel },
  ]

  const needsActionCount = studentAssignments.filter((a) => isAction(a)).length

  const navigate = (id: StudentSectionId) => {
    setActive(id)
    setMobileOpen(false)
  }

  const openCourse = (courseId: number) => {
    setSelectedCourseId(courseId)
    setActive('student-course')
  }

  const openAssignment = (assignmentId: number) => {
    setSelectedAssignmentId(assignmentId)
    setActive('student-assignment')
  }

  const openLab = (labId: number) => {
    setSelectedLabId(labId)
    setActive('student-lab')
  }

  const renderView = () => {
    switch (active) {
      case 'student-course':
        return (
          <StudentCourseView
            courseId={selectedCourseId ?? 0}
            onBack={() => setActive('student-courses')}
            onOpenLab={openLab}
            onOpenAssignment={openAssignment}
          />
        )
      case 'student-assignment':
        return (
          <StudentAssignmentView
            assignmentId={selectedAssignmentId ?? 0}
            onBack={() => setActive('student-assignments')}
          />
        )
      case 'student-lab':
        return <StudentLabView labId={selectedLabId ?? 0} onBack={() => setActive('student-labs')} />
      case 'student-courses':
        return <StudentCoursesView onOpenCourse={openCourse} />
      case 'student-assignments':
        return <StudentAssignmentsView onOpenAssignment={openAssignment} />
      case 'student-labs':
        return <StudentLabsView onOpenLab={openLab} />
      case 'student-account':
        return <StudentAccountView />
      case 'student-dashboard':
      default:
        return (
          <StudentDashboardView
            onOpenCourse={openCourse}
            onOpenAssignment={openAssignment}
            onOpenLab={openLab}
            onOpenAssignments={() => setActive('student-assignments')}
            onOpenCourses={() => setActive('student-courses')}
            onOpenLabs={() => setActive('student-labs')}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        groups={studentNavGroups}
        active={active}
        badges={needsActionCount > 0 ? { 'student-assignments': String(needsActionCount) } : undefined}
        onSelect={(id) => navigate(id as StudentSectionId)}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        brandSubtitle="Student workspace"
        persona={persona}
        onLogout={logout}
      />

      <div className={collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}>
        <Header
          activeLabel={currentLabel}
          breadcrumbs={breadcrumbs}
          persona={persona}
          adminMode={false}
          mobileLabel={currentLabel}
          showCommand={false}
          notifications={studentNotifications}
          notificationCount={false}
          onOpenCommand={() => {}}
          onOpenMobileNav={() => setMobileOpen(true)}
          onNavigate={() => {}}
        />
        <main className="mx-auto max-w-7xl px-4 py-7 md:px-8 lg:py-9">
          <div key={active} className="animate-rise">
            {renderView()}
          </div>
        </main>
      </div>

      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="fixed bottom-6 left-4 z-30 hidden size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-muted lg:flex"
        style={{ left: collapsed ? '1rem' : '15rem', transition: 'left 200ms ease' }}
      >
        <span className="text-xs" aria-hidden="true">
          {collapsed ? '»' : '«'}
        </span>
      </button>
    </div>
  )
}