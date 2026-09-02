/**
 * Frontend data access layer.
 *
 * This is the ONLY module React components import data from. The app never
 * imports mock data directly.
 *
 * Today every accessor is backed by static mock data in ./mock.ts so the app
 * runs without a server. When the real backend is available:
 *   1. reimplement these accessors as requests (e.g. GET /api/me/dashboard)
 *   2. delete ./mock.ts — nothing else references it.
 * The types in @/lib/api-types describe the payload contract both sides agree
 * on, and are re-exported here for convenience.
 */
import * as db from './mock'

export type { SectionId } from '@/lib/navigation'
export type {
  AdminAnalytics,
  Assignment,
  Course,
  CourseSummary,
  Enrollment,
  JupyterStatus,
  Lab,
  LaunchResponse,
  LecturerCourseWorkspace,
  LecturerDashboard,
  LecturerGlobalAssignment,
  LecturerGlobalLab,
  LecturerGlobalStudent,
  LecturerNotification,
  LecturerStudentActivity,
  LecturerStudentAssignmentProgress,
  LecturerStudentLabProgress,
  LecturerStudentProfile,
  LecturerUpcomingItem,
  PushResponse,
  Role,
  StudentAssignment,
  StudentAssignmentStatus,
  StudentCourse,
  StudentLab,
  StudentNotification,
  Submission,
  TeachingAnalytics,
  TeachingAttentionItem,
  TeachingCoursePerformance,
  User,
  UserBrief,
} from '@/lib/api-types'

export const roles = db.roles

/** Admin workspace resources. */
export const admin = {
  analytics: db.analytics,
  users: db.users,
  /** @todo replace with GET /api/admin/courses */
  courses: db.courses,
  labs: db.labs,
  assignments: db.assignments,
  submissions: db.submissions,
}

/** Lecturer (teaching) workspace resources. */
export const lecturer = {
  profile: db.lecturer,
  hub: db.lecturerHub,
  analytics: db.lecturerAnalytics,
  dashboard: db.lecturerDashboard,
  assignments: db.lecturerAssignments,
  labs: db.lecturerLabs,
  students: db.lecturerStudents,
  notifications: db.lecturerNotifications,
  upcoming: db.lecturerUpcoming,
  courseWorkspace: (courseId: number) => db.lecturerCourseWorkspaces[courseId],
  studentProfile: (studentId: number) => db.lecturerStudentProfiles[studentId],
}

/** Student (learning) workspace resources. */
export const student = {
  profile: db.studentProfile,
  courses: db.studentCourses,
  assignments: db.studentAssignments,
  labs: db.studentLabs,
  notifications: db.studentNotifications,
  assignmentCounts: () => {
    const items = db.studentAssignments
    return {
      toDo: items.filter((a) => a.status === 'NOT_STARTED').length,
      submitted: items.filter((a) => a.status === 'SUBMITTED' || a.status === 'GRADED').length,
      overdue: items.filter((a) => a.status === 'OVERDUE').length,
    }
  },
}