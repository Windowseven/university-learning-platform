export type Role = 'ADMIN' | 'LECTURER' | 'STUDENT'

export interface User {
  id: number
  username: string
  email: string
  full_name: string
  role: Role
  is_active: boolean
  created_at: string
}

export interface UserBrief {
  id: number
  username: string
  full_name: string
}

export interface Course {
  id: number
  code: string
  name: string
  description: string
  lecturer_id: number
  is_active: boolean
  created_at: string
  lecturer?: UserBrief | null
}

export interface Enrollment {
  id: number
  course_id: number
  student: UserBrief
  enrolled_at: string
}

export interface Lab {
  id: number
  course_id: number
  title: string
  description: string
  instructions: string
  is_published: boolean
  notebook_filename: string | null
  created_at: string
}

export interface Assignment {
  id: number
  course_id: number
  title: string
  description: string
  deadline: string | null
  created_at: string
}

export interface Submission {
  id: number
  assignment_id: number
  student_id: number
  status: string
  submission_path: string | null
  submitted_at: string | null
  student_username?: string | null
}

export interface JupyterStatus {
  available: boolean
  status: string
}

export interface PushResponse {
  lab_id: number
  enrolled: number
  delivered_now: number
  pending: number
}

export interface AdminAnalytics {
  users: {
    total: number
    active: number
    inactive: number
    students: number
    lecturers: number
    admins: number
  }
  courses: { total: number; active: number }
  enrollments: {
    total: number
    per_course: { course_id: number; code: string; name: string; students: number }[]
  }
  labs: { total: number; published: number; with_notebook: number }
  assignments: { total: number }
  submissions: {
    expected: number
    not_started: number
    in_progress: number
    submitted: number
    graded: number
  }
  completion: {
    course_id: number
    code: string
    name: string
    enrolled: number
    assignments: number
    submitted: number
    expected: number
    pct: number
  }[]
  pushes: { pending: number }
  hub: { available: boolean; live_sessions: number; running_users: string[] }
}

export interface CourseSummary {
  id: number
  code: string
  name: string
  description: string
  lecturer: string
  is_active: boolean
  labs_count: number
  assignments_count: number
  students_count: number
}

export interface LecturerDashboard {
  stats: {
    courses: number
    students: number
    labs: number
    assignments: number
  }
  courses: CourseSummary[]
}

export interface LecturerCourseWorkspace {
  is_active: boolean
  students: Enrollment[]
  labs: Lab[]
  assignments: Assignment[]
  submissions: Submission[]
}

export type AttentionType =
  | 'SUBMISSION_REVIEW'
  | 'NOTEBOOK_DELIVERY'
  | 'UPCOMING_DEADLINE'
  | 'UNPUBLISHED_LAB'
  | 'LOW_PARTICIPATION'

export type AttentionPriority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface TeachingAttentionItem {
  id: string
  type: AttentionType
  priority: AttentionPriority
  courseId: number
  courseCode: string
  title: string
  detail: string
  count?: number
  total?: number
}

export interface TeachingCoursePerformance {
  id: number
  code: string
  name: string
  students: number
  labs: number
  assignments: number
  completionRate: number
}

export interface TeachingAnalytics {
  available: boolean
  overview: {
    courses: number
    students: number
    labs: number
    assignments: number
  }
  assignmentCompletion: {
    submitted: number
    expected: number
    rate: number
  }
  studentEngagement: {
    active: number
    total: number
    rate: number
  }
  courses: TeachingCoursePerformance[]
  attention: TeachingAttentionItem[]
}

export interface LaunchResponse {
  status: 'READY' | 'STARTING' | 'TIMEOUT' | string
  launch_url?: string | null
  sso_url?: string | null
  message?: string | null
}

export interface LecturerGlobalStudent {
  id: number
  username: string
  email: string
  full_name: string
  courses: { id: number; code: string; name: string }[]
  status: 'ACTIVE' | 'INACTIVE'
  lastActive: string
}

export interface LecturerStudentAssignmentProgress {
  assignmentId: number
  title: string
  courseCode: string
  status: 'SUBMITTED' | 'PENDING' | 'GRADED'
  submittedAt: string | null
  score: number | null
}

export interface LecturerStudentLabProgress {
  labId: number
  title: string
  courseCode: string
  status: 'COMPLETED' | 'NOT_STARTED' | 'IN_PROGRESS'
}

export interface LecturerStudentActivity {
  id: string
  type: 'SUBMISSION' | 'LAB' | 'LOGIN' | 'ASSIGNMENT'
  description: string
  time: string
}

export interface LecturerStudentProfile {
  student: LecturerGlobalStudent
  assignmentProgress: LecturerStudentAssignmentProgress[]
  labProgress: LecturerStudentLabProgress[]
  activity: LecturerStudentActivity[]
}

export interface LecturerGlobalAssignment {
  id: number
  courseId: number
  courseCode: string
  courseName: string
  title: string
  description: string
  deadline: string
  submitted: number
  expected: number
  status: 'OPEN' | 'CLOSED' | 'UPCOMING'
}

export interface LecturerGlobalLab {
  id: number
  courseId: number
  courseCode: string
  courseName: string
  title: string
  description: string
  is_published: boolean
  notebook_filename: string | null
  delivered: number
  expected: number
}

export interface LecturerUpcomingItem {
  id: string
  kind: 'assignment' | 'lab'
  title: string
  courseCode: string
  date: string
  label: string
}

export interface LecturerNotification {
  id: string
  kind: 'submission' | 'delivery' | 'deadline' | 'student'
  course: string
  title: string
  time: string
}

export type StudentAssignmentStatus = 'NOT_STARTED' | 'SUBMITTED' | 'GRADED' | 'OVERDUE'

export interface StudentCourse {
  id: number
  code: string
  name: string
  lecturer: string
  description: string
  labs_available: number
  assignments_count: number
}

export interface StudentAssignment {
  id: number
  courseId: number
  courseCode: string
  courseName: string
  title: string
  description: string
  deadline: string
  dueLabel: string
  status: StudentAssignmentStatus
  submittedAt: string | null
  submissionFilename: string | null
  grade: number | null
}

export interface StudentLab {
  id: number
  courseId: number
  courseCode: string
  courseName: string
  title: string
  description: string
  instructions: string[]
  notebook_filename: string | null
  ready: boolean
}

export interface StudentNotification {
  id: string
  kind: 'deadline' | 'graded' | 'lab'
  course: string
  title: string
  time: string
}

