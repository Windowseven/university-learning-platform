'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'

import {
  lecturerDefaultSection,
  lecturerNavGroups,
  lecturerNavItems,
  type LecturerSectionId,
} from '@/lib/navigation'
import { useAuth } from '@/lib/auth'
import { lecturer as lecturerApi } from '@/lib/api'
import { Sidebar, type Persona } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { AppSkeleton } from '@/components/shared/app-skeleton'
import { WorkspaceLauncher } from '@/components/shared/workspace-launcher'
import { LecturerDashboardView } from '@/components/views/lecturer-dashboard'
import { LecturerCoursesView } from '@/components/views/lecturer-courses'
import { LecturerCourseView } from '@/components/views/lecturer-course'
import { LecturerStudentsView, LecturerStudentProfileView } from '@/components/views/lecturer-students'
import { LecturerAssignmentsView } from '@/components/views/lecturer-assignments'
import { LecturerLabsView } from '@/components/views/lecturer-labs'

const { notifications: lecturerNotifications } = lecturerApi

export function LecturerShell() {
  const { user, logout } = useAuth()
  const [active, setActive] = useState<LecturerSectionId>(lecturerDefaultSection)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [appLoading, setAppLoading] = useState(true)
  const [launcherOpen, setLauncherOpen] = useState(false)

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
    : { name: 'Lecturer', role: 'LECTURER', initials: 'LT' }

  const navigate = (id: LecturerSectionId) => {
    setActive(id)
    setMobileOpen(false)
  }

  const openCourse = (courseId: number) => {
    setSelectedCourseId(courseId)
    setActive('lecturer-course')
  }

  const openStudent = (studentId: number) => {
    setSelectedStudentId(studentId)
    setActive('lecturer-student')
  }

  const activeLabel =
    active === 'lecturer-course'
      ? 'Course Workspace'
      : active === 'lecturer-student'
        ? 'Student Profile'
        : (lecturerNavItems.find((n) => n.id === active)?.label ?? 'Dashboard')

  const renderView = () => {
    switch (active) {
      case 'lecturer-course':
        return (
          <LecturerCourseView
            courseId={selectedCourseId ?? 0}
            onBack={() => setActive('lecturer-dashboard')}
          />
        )
      case 'lecturer-student':
        return (
          <LecturerStudentProfileView
            studentId={selectedStudentId ?? 0}
            onBack={() => setActive('lecturer-students')}
          />
        )
      case 'lecturer-students':
        return <LecturerStudentsView onOpenStudent={openStudent} />
      case 'lecturer-assignments':
        return <LecturerAssignmentsView onOpenCourse={openCourse} />
      case 'lecturer-labs':
        return <LecturerLabsView onOpenCourse={openCourse} />
      case 'lecturer-courses':
        return <LecturerCoursesView onOpenCourse={openCourse} />
      case 'lecturer-dashboard':
      default:
        return <LecturerDashboardView onOpenCourse={openCourse} />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        groups={lecturerNavGroups}
        active={active}
        onSelect={(id) => navigate(id as LecturerSectionId)}
        onLaunch={() => setLauncherOpen(true)}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        brandSubtitle="Teaching console"
        persona={persona}
        onLogout={logout}
      />

      <div className={collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}>
        <Header
          activeLabel={activeLabel}
          persona={persona}
          adminMode={false}
          mobileLabel="Teaching"
          showCommand={false}
          notifications={lecturerNotifications}
          onOpenCommand={() => {}}
          onOpenMobileNav={() => setMobileOpen(true)}
          onNavigate={() => {}}
        />
        <main className="mx-auto max-w-[1500px] px-4 py-7 md:px-8 lg:py-9">
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

      <WorkspaceLauncher open={launcherOpen} onClose={() => setLauncherOpen(false)} />
    </div>
  )
}