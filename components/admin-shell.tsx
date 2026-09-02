'use client'

import * as React from 'react'
import { useEffect } from 'react'

import { defaultSection, navGroups, navItems, type SectionId } from '@/lib/navigation'
import { useAuth } from '@/lib/auth'
import { Sidebar, type Persona } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { CommandPalette } from '@/components/layout/command-palette'
import { AppSkeleton } from '@/components/shared/app-skeleton'
import { OverviewView } from '@/components/views/overview'
import { UsersView } from '@/components/views/users'
import { CoursesView } from '@/components/views/courses'
import { AssignmentsView } from '@/components/views/assignments'
import { LabsView } from '@/components/views/labs'
import { SubmissionsView } from '@/components/views/submissions'
import { AnalyticsView } from '@/components/views/analytics'
import { JupyterHubView } from '@/components/views/jupyterhub'
import { AuditLogView } from '@/components/views/audit'
import { AppearanceView } from '@/components/views/appearance'
import { SettingsView } from '@/components/views/settings'

export function AdminShell() {
  const { user, logout } = useAuth()
  const [active, setActive] = React.useState<SectionId>(defaultSection)
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [launched, setLaunched] = React.useState(false)
  const [appLoading, setAppLoading] = React.useState(true)

  useEffect(() => {
    const t = setTimeout(() => setAppLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
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
    : { name: 'Admin', role: 'ADMIN', initials: 'AD' }

  const navigate = (id: SectionId) => {
    setActive(id)
    setCommandOpen(false)
    setMobileOpen(false)
  }

  const activeLabel = navItems.find((n) => n.id === active)?.label ?? 'Dashboard'

  const renderView = () => {
    switch (active) {
      case 'overview':
        return <OverviewView onNavigate={navigate} onLaunch={() => setLaunched(true)} launched={launched} />
      case 'users':
        return <UsersView />
      case 'courses':
        return <CoursesView />
      case 'labs':
        return <LabsView onLaunch={() => setLaunched(true)} launched={launched} />
      case 'assignments':
        return <AssignmentsView />
      case 'submissions':
        return <SubmissionsView />
      case 'analytics':
        return <AnalyticsView />
      case 'jupyterhub':
        return <JupyterHubView />
      case 'audit':
        return <AuditLogView />
      case 'appearance':
        return <AppearanceView />
      case 'settings':
        return <SettingsView />
      default:
        return <OverviewView onNavigate={navigate} onLaunch={() => setLaunched(true)} launched={launched} />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        groups={navGroups}
        active={active}
        onSelect={(id) => navigate(id as SectionId)}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        brandSubtitle="Admin console"
        persona={persona}
        onLogout={logout}
      />

      <div className={collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}>
        <Header
          activeLabel={activeLabel}
          persona={persona}
          adminMode
          mobileLabel="Platform"
          onOpenCommand={() => setCommandOpen(true)}
          onOpenMobileNav={() => setMobileOpen(true)}
          onNavigate={(id) => navigate(id as SectionId)}
        />
        <main className="mx-auto max-w-[1500px] px-4 py-7 md:px-8 lg:py-9">
          <div key={active} className="animate-rise">
            {renderView()}
          </div>
        </main>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} onNavigate={navigate} />

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
