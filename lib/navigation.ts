import {
  BarChart3,
  Bell,
  BookOpen,
  ClipboardList,
  FlaskConical,
  GraduationCap,
  Home,
  LayoutDashboard,
  MonitorCog,
  ScrollText,
  Settings2,
  TerminalSquare,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type SectionId =
  | 'overview'
  | 'courses'
  | 'labs'
  | 'assignments'
  | 'users'
  | 'submissions'
  | 'analytics'
  | 'jupyterhub'
  | 'audit'
  | 'appearance'
  | 'settings'

export interface NavItem {
  id: SectionId
  label: string
  icon: LucideIcon
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ id: 'overview', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Academic',
    items: [
      { id: 'courses', label: 'Courses', icon: BookOpen },
      { id: 'labs', label: 'Labs', icon: TerminalSquare },
      { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    ],
  },
  {
    label: 'Users & Access',
    items: [{ id: 'users', label: 'Users', icon: Users }],
  },
  {
    label: 'Submissions',
    items: [{ id: 'submissions', label: 'Submissions', icon: GraduationCap }],
  },
  {
    label: 'Platform',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'jupyterhub', label: 'JupyterHub', icon: MonitorCog },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'audit', label: 'Audit & Logs', icon: ScrollText },
      { id: 'appearance', label: 'Appearance', icon: Settings2 },
      { id: 'settings', label: 'Settings', icon: Settings2 },
    ],
  },
]

export const navItems: NavItem[] = navGroups.flatMap((g) => g.items)

export const defaultSection: SectionId = 'overview'

export type LecturerSectionId =
  | 'lecturer-dashboard'
  | 'lecturer-courses'
  | 'lecturer-course'
  | 'lecturer-student'
  | 'lecturer-students'
  | 'lecturer-assignments'
  | 'lecturer-labs'
  | 'lecturer-jupyterlab'

export interface LecturerNavItem {
  id: LecturerSectionId
  label: string
  icon: LucideIcon
  variant?: 'default' | 'launcher'
}

export interface LecturerNavGroup {
  label: string
  items: LecturerNavItem[]
}

export const lecturerNavGroups: LecturerNavGroup[] = [
  {
    label: 'Overview',
    items: [{ id: 'lecturer-dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Teaching',
    items: [
      { id: 'lecturer-courses', label: 'My Courses', icon: BookOpen },
      { id: 'lecturer-students', label: 'Students', icon: Users },
      { id: 'lecturer-assignments', label: 'Assignments', icon: ClipboardList },
      { id: 'lecturer-labs', label: 'Labs', icon: FlaskConical },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { id: 'lecturer-jupyterlab', label: 'JupyterLab', icon: MonitorCog, variant: 'launcher' },
    ],
  },
]

export const lecturerNavItems: LecturerNavItem[] = lecturerNavGroups.flatMap((g) => g.items)

export const lecturerDefaultSection: LecturerSectionId = 'lecturer-dashboard'

export type StudentSectionId =
  | 'student-dashboard'
  | 'student-courses'
  | 'student-course'
  | 'student-assignments'
  | 'student-assignment'
  | 'student-labs'
  | 'student-lab'
  | 'student-account'

export interface StudentNavItem {
  id: StudentSectionId
  label: string
  icon: LucideIcon
}

export interface StudentNavGroup {
  label: string
  items: StudentNavItem[]
}

export const studentNavGroups: StudentNavGroup[] = [
  {
    label: 'Workspace',
    items: [{ id: 'student-dashboard', label: 'Overview', icon: LayoutDashboard }],
  },
  {
    label: 'Learning',
    items: [
      { id: 'student-courses', label: 'Courses', icon: BookOpen },
      { id: 'student-assignments', label: 'Assignments', icon: ClipboardList },
      { id: 'student-labs', label: 'Labs', icon: FlaskConical },
    ],
  },
  {
    label: 'Account',
    items: [{ id: 'student-account', label: 'My Account', icon: Settings2 }],
  },
]

export const studentNavItems: StudentNavItem[] = studentNavGroups.flatMap((g) => g.items)

export const studentDefaultSection: StudentSectionId = 'student-dashboard'

export { Home, Bell }
