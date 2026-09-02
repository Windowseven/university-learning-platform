'use client'

import { ThemeProvider } from '@/lib/theme'
import { AuditProvider } from '@/lib/audit'
import { AuthProvider, useAuth } from '@/lib/auth'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SignIn } from '@/components/sign-in'
import { AdminShell } from '@/components/admin-shell'
import { LecturerShell } from '@/components/lecturer-shell'
import { StudentShell } from '@/components/student/shell'

function DashboardRouter() {
  const { user } = useAuth()

  if (!user) return <SignIn />
  if (user.role === 'ADMIN') return <AdminShell />
  if (user.role === 'STUDENT') return <StudentShell />
  return <LecturerShell />
}

export function DashboardShell() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuditProvider>
          <TooltipProvider>
            <DashboardRouter />
          </TooltipProvider>
        </AuditProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
