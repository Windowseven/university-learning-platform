/**
 * Frontend data access layer - REAL BACKEND VERSION
 *
 * This file shows how the API layer would look when integrated with a real backend.
 * Replace ./lib/api/index.ts with this content when the backend is available.
 */

import type { SectionId } from '@/lib/navigation'
import type {
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

// API client helper - in a real app, you might use axios, fetch, or a dedicated client
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for cookies/sessions
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `API request failed: ${response.status}`
      )
    }

    return response.json()
  }

  // GET helper
  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint)
  }

  // POST helper
  post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // PUT helper
  put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // DELETE helper
  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

// Initialize API client
const api = new ApiClient()

/** Admin workspace resources - REAL BACKEND VERSION */
export const admin = {
  // In a real app, these would be functions that return promises
  // For simplicity in this example, we'll show the structure

  // These would normally be getters that return promises
  get analytics() {
    return {
      // These would be async functions in practice
      // For now showing the structure that components expect
      // In real implementation, these would be fetched from backend
      // Example: return api.get('/admin/analytics')
      // But since we need synchronous access for the mock data structure,
      // in practice you'd use React state management or suspense

      // Placeholder - in real app, use useEffect/fetching pattern
      // This structure shows what the data should look like
      users: { total: 0, active: 0, inactive: 0, students: 0, lecturers: 0, admins: 0 },
      courses: { total: 0, active: 0 },
      enrollments: { total: 0, per_course: [] },
      labs: { total: 0, published: 0, with_notebook: 0 },
      assignments: { total: 0 },
      submissions: { expected: 0, not_started: 0, in_progress: 0, submitted: 0, graded: 0 },
      completion: [],
      pushes: { pending: 0 },
      hub: { available: false, live_sessions: 0, running_users: [] },
    }
  },

  users: [], // Would be populated via api.get('/admin/users')
  courses: [], // Would be populated via api.get('/admin/courses')
  labs: [], // Would be populated via api.get('/admin/labs')
  assignments: [], // Would be populated via api.get('/admin/assignments')
  submissions: [], // Would be populated via api.get('/admin/submissions')

  // Example methods for mutations
  createCourse: async (courseData: Omit<Course, 'id' | 'created_at' | 'lecturer'>): Promise<Course> => {
    return api.post<Course>('/admin/courses', courseData)
  },

  updateCourse: async (id: number, courseData: Partial<Course>): Promise<Course> => {
    return api.put<Course>(`/admin/courses/${id}`, courseData)
  },

  deleteCourse: async (id: number): Promise<void> => {
    await api.delete<void>(`/admin/courses/${id}`)
  }
}

/** Lecturer (teaching) workspace resources - REAL BACKEND VERSION */
export const lecturer = {
  // Profile would be fetched from /lecturer/profile
  get profile() {
    return {
      fullName: '',
      username: '',
      title: '',
      email: '',
    }
  },

  // Hub status from /lecturer/hub
  get hub() {
    return { available: false }
  },

  // Analytics from /lecturer/analytics
  get analytics() {
    return {
      available: false,
      overview: { courses: 0, students: 0, labs: 0, assignments: 0 },
      assignmentCompletion: { submitted: 0, expected: 0, rate: 0 },
      studentEngagement: { active: 0, total: 0, rate: 0 },
      courses: [],
      attention: [],
    }
  },

  // Dashboard from /lecturer/dashboard
  get dashboard() {
    return {
      stats: { courses: 0, students: 0, labs: 0, assignments: 0 },
      courses: [],
    }
  },

  // These would be functions that return promises
  assignments: [], // From /lecturer/assignments
  labs: [], // From /lecturer/labs
  students: [], // From /lecturer/students
  notifications: [], // From /lecturer/notifications
  upcoming: [], // From /lecturer/upcoming

  // Course workspace would be a function
  courseWorkspace: (courseId: number) => {
    // In practice: return api.get<LecturerCourseWorkspace>(`/lecturer/courses/${courseId}/workspace`)
    // Returning empty structure for now
    return {
      is_active: false,
      students: [],
      labs: [],
      assignments: [],
      submissions: [],
    }
  },

  // Student profile would be a function
  studentProfile: (studentId: number) => {
    // In practice: return api.get<LecturerStudentProfile>(`/lecturer/students/${studentId}`)
    // Returning empty structure for now
    return {
      student: {
        id: 0,
        username: '',
        email: '',
        full_name: '',
        courses: [],
        status: 'ACTIVE',
        lastActive: '',
      },
      assignmentProgress: [],
      labProgress: [],
      activity: [],
    }
  },
}

/** Student (learning) workspace resources - REAL BACKEND VERSION */
export const student = {
  // Profile would be fetched from /student/profile
  get profile() {
    return {
      fullName: '',
      username: '',
      email: '',
      title: '',
    }
  },

  courses: [], // From /student/courses
  assignments: [], // From /student/assignments
  labs: [], // From /student/labs
  notifications: [], // From /student/notifications

  // Assignment counts would be a function
  assignmentCounts: () => {
    // In practice: return api.get<{toDo: number; submitted: number; overdue: number}>(`/student/assignments/counts`)
    return {
      toDo: 0,
      submitted: 0,
      overdue: 0,
    }
  },
}

/**
 * USAGE EXAMPLES FOR COMPONENTS:
 *
 * In your components, you would use React state and effects to fetch data:
 *
 * import { useEffect, useState } from 'react'
 * import { admin } from '@/lib/api'
 *
 * function AnalyticsComponent() {
 *   const [analytics, setAnalytics] = useState(null)
 *   const [loading, setLoading] = useState(true)
 *
 *   useEffect(() => {
 *     // Fetch admin analytics
 *     api.get('/admin/analytics').then(setAnalytics).finally(() => setLoading(false))
 *   }, [])
 *
 *   if (loading) return <SkeletonLoader />
 *   if (!analytics) return <ErrorMessage />
 *
 *   return <AnalyticsDisplay data={analytics} />
 * }
 *
 * OR for simpler cases where data is needed immediately on render:
 *
 * import { useQuery } from '@tanstack/react-query' // or similar
 *
 * function UserList() {
 *   const { data: users, isLoading } = useQuery({
 *     queryKey: ['users'],
 *     queryFn: () => api.get('/admin/users')
 *   })
 *
 *   if (isLoading) return <SkeletonLoader />
 *   return <UserList users={users} />
 * }
 */

// Export types for convenience
export * from '@/lib/api-types'