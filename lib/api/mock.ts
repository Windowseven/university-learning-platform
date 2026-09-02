import type {
  AdminAnalytics,
  Assignment,
  Course,
  Enrollment,
  Lab,
  LecturerCourseWorkspace,
  LecturerDashboard,
  LecturerGlobalAssignment,
  LecturerGlobalLab,
  LecturerGlobalStudent,
  LecturerNotification,
  LecturerStudentProfile,
  LecturerUpcomingItem,
  Role,
  StudentAssignment,
  StudentCourse,
  StudentLab,
  StudentNotification,
  Submission,
  TeachingAnalytics,
  User,
} from '@/lib/api-types'

/**
 * MOCK DATA ONLY. This file builds a runnable demo without a server.
 * Nothing in the app imports it directly — the data access layer in
 * ./index.ts reads from here. When the real backend is available, replace
 * the accessors in ./index.ts with real requests and delete this file.
 */

export const roles: Role[] = ['ADMIN', 'LECTURER', 'STUDENT']

export const users: User[] = [
  { id: 1, username: 'jdavis', email: 'jordan.davis@uni.edu', full_name: 'Jordan Davis', role: 'ADMIN', is_active: true, created_at: '2026-01-12T09:00:00Z' },
  { id: 2, username: 'alexmorgan', email: 'alex.morgan@uni.edu', full_name: 'Alex Morgan', role: 'LECTURER', is_active: true, created_at: '2026-02-03T11:00:00Z' },
  { id: 3, username: 'sarahjames', email: 'sarah.james@uni.edu', full_name: 'Sarah James', role: 'LECTURER', is_active: true, created_at: '2026-02-18T10:00:00Z' },
  { id: 4, username: 'michaelkim', email: 'michael.kim@uni.edu', full_name: 'Michael Kim', role: 'STUDENT', is_active: true, created_at: '2026-03-02T14:00:00Z' },
  { id: 5, username: 'annasmith', email: 'anna.smith@uni.edu', full_name: 'Anna Smith', role: 'STUDENT', is_active: false, created_at: '2026-03-05T09:30:00Z' },
  { id: 6, username: 'luisfern', email: 'luis.fernandez@uni.edu', full_name: 'Luis Fernandez', role: 'STUDENT', is_active: true, created_at: '2026-03-11T16:00:00Z' },
  { id: 7, username: 'sarahchen', email: 'sarah.chen@uni.edu', full_name: 'Sarah Chen', role: 'LECTURER', is_active: true, created_at: '2026-04-01T08:00:00Z' },
  { id: 8, username: 'davidokafor', email: 'david.okafor@uni.edu', full_name: 'David Okafor', role: 'STUDENT', is_active: true, created_at: '2026-04-10T12:00:00Z' },
]

export const courses: Course[] = [
  { id: 101, code: 'CS101', name: 'Introduction to Computer Science', description: 'Foundational programming concepts, logic and problem solving.', lecturer_id: 2, is_active: true, created_at: '2026-01-20T09:00:00Z', lecturer: { id: 2, username: 'alexmorgan', full_name: 'Alex Morgan' } },
  { id: 102, code: 'CS201', name: 'Data Structures & Algorithms', description: 'Core data structures and algorithmic analysis.', lecturer_id: 2, is_active: true, created_at: '2026-01-22T09:00:00Z', lecturer: { id: 2, username: 'alexmorgan', full_name: 'Alex Morgan' } },
  { id: 103, code: 'DB201', name: 'Database Systems', description: 'Relational design, SQL and data modelling.', lecturer_id: 3, is_active: true, created_at: '2026-02-01T09:00:00Z', lecturer: { id: 3, username: 'sarahjames', full_name: 'Sarah James' } },
  { id: 104, code: 'AI301', name: 'Artificial Intelligence', description: 'Machine learning foundations and intelligent systems.', lecturer_id: 7, is_active: true, created_at: '2026-02-10T09:00:00Z', lecturer: { id: 7, username: 'sarahchen', full_name: 'Sarah Chen' } },
]

export const labs: Lab[] = [
  { id: 501, course_id: 101, title: 'Python Control Flow', description: 'Practice conditionals and loops.', instructions: 'Complete the notebook cells provided.', is_published: true, notebook_filename: 'control_flow.ipynb', created_at: '2026-03-01T09:00:00Z' },
  { id: 502, course_id: 101, title: 'Functions & Modules', description: 'Write reusable functions.', instructions: 'Implement the functions and run all cells.', is_published: true, notebook_filename: 'functions.ipynb', created_at: '2026-03-08T09:00:00Z' },
  { id: 503, course_id: 102, title: 'Linked Lists', description: 'Implement a singly linked list.', instructions: 'Fill in the missing methods.', is_published: true, notebook_filename: 'linked_lists.ipynb', created_at: '2026-03-15T09:00:00Z' },
  { id: 504, course_id: 103, title: 'SQL Joins Lab', description: 'Query multi-table datasets.', instructions: 'Answer each question in the marked cells.', is_published: false, notebook_filename: null, created_at: '2026-03-20T09:00:00Z' },
]

export const assignments: Assignment[] = [
  { id: 601, course_id: 101, title: 'Lab Report 01', description: 'Summarise what you learned in the first three labs.', deadline: '2026-09-04T23:59:00Z', created_at: '2026-08-20T09:00:00Z' },
  { id: 602, course_id: 102, title: 'Algorithm Analysis', description: 'Analyse time complexity of given algorithms.', deadline: '2026-09-07T23:59:00Z', created_at: '2026-08-22T09:00:00Z' },
  { id: 603, course_id: 103, title: 'Database Design Task', description: 'Normalise the supplied schema.', deadline: '2026-09-10T23:59:00Z', created_at: '2026-08-25T09:00:00Z' },
]

export const submissions: Submission[] = [
  { id: 701, assignment_id: 601, student_id: 4, status: 'SUBMITTED', submission_path: 'labs/mkim_lab01.ipynb', submitted_at: '2026-08-30T10:42:00Z', student_username: 'michaelkim' },
  { id: 702, assignment_id: 601, student_id: 6, status: 'SUBMITTED', submission_path: 'labs/luis_lab01.ipynb', submitted_at: '2026-08-30T11:12:00Z', student_username: 'luisfern' },
  { id: 703, assignment_id: 601, student_id: 8, status: 'SUBMITTED', submission_path: 'labs/david_lab01.ipynb', submitted_at: '2026-08-30T12:05:00Z', student_username: 'davidokafor' },
]

export const analytics: AdminAnalytics = {
  users: { total: 1248, active: 892, inactive: 356, students: 1090, lecturers: 154, admins: 4 },
  courses: { total: 42, active: 38 },
  enrollments: {
    total: 8921,
    per_course: [
      { course_id: 101, code: 'CS101', name: 'Introduction to Computer Science', students: 128 },
      { course_id: 102, code: 'CS201', name: 'Data Structures & Algorithms', students: 96 },
      { course_id: 103, code: 'DB201', name: 'Database Systems', students: 84 },
      { course_id: 104, code: 'AI301', name: 'Artificial Intelligence', students: 62 },
    ],
  },
  labs: { total: 186, published: 172, with_notebook: 164 },
  assignments: { total: 324 },
  submissions: { expected: 4516, not_started: 1240, in_progress: 795, submitted: 2481, graded: 2010 },
  completion: [
    { course_id: 101, code: 'CS101', name: 'Introduction to Computer Science', enrolled: 128, assignments: 12, submitted: 108, expected: 128, pct: 84 },
    { course_id: 102, code: 'CS201', name: 'Data Structures & Algorithms', enrolled: 96, assignments: 10, submitted: 69, expected: 96, pct: 72 },
    { course_id: 103, code: 'DB201', name: 'Database Systems', enrolled: 84, assignments: 8, submitted: 51, expected: 84, pct: 61 },
    { course_id: 104, code: 'AI301', name: 'Artificial Intelligence', enrolled: 62, assignments: 9, submitted: 34, expected: 62, pct: 55 },
  ],
  pushes: { pending: 17 },
  hub: { available: true, live_sessions: 24, running_users: ['michaelkim', 'luisfern', 'davidokafor'] },
}

export const lecturer: {
  fullName: string
  username: string
  title: string
} = {
  fullName: 'Dr. Ada Lecturer',
  username: 'adlectur',
  title: 'Senior Lecturer',
}

export const lecturerHub: { available: boolean } = {
  available: true,
}

export const lecturerAnalytics: TeachingAnalytics = {
  available: true,
  overview: {
    courses: 3,
    students: 128,
    labs: 16,
    assignments: 15,
  },
  assignmentCompletion: {
    submitted: 105,
    expected: 128,
    rate: 0.82,
  },
  studentEngagement: {
    active: 97,
    total: 128,
    rate: 0.76,
  },
  courses: [
    { id: 301, code: 'CS301', name: 'Machine Learning', students: 32, labs: 4, assignments: 3, completionRate: 0.82 },
    { id: 302, code: 'CS302', name: 'Database Systems', students: 41, labs: 6, assignments: 5, completionRate: 0.71 },
    { id: 303, code: 'CS303', name: 'AI Fundamentals', students: 55, labs: 6, assignments: 7, completionRate: 0.91 },
  ],
  attention: [
    {
      id: 'att-1',
      type: 'SUBMISSION_REVIEW',
      priority: 'HIGH',
      courseId: 302,
      courseCode: 'CS302',
      title: 'Assignment review backlog',
      detail: 'Database Project submissions waiting for review',
      count: 18,
    },
    {
      id: 'att-2',
      type: 'NOTEBOOK_DELIVERY',
      priority: 'MEDIUM',
      courseId: 301,
      courseCode: 'CS301',
      title: 'Neural Networks not fully delivered',
      detail: 'Notebook pushed to 25 of 32 enrolled students',
      count: 7,
      total: 32,
    },
    {
      id: 'att-3',
      type: 'UPCOMING_DEADLINE',
      priority: 'MEDIUM',
      courseId: 302,
      courseCode: 'CS302',
      title: 'Database Design due tomorrow',
      detail: 'Assignment closes in under 24 hours',
    },
    {
      id: 'att-4',
      type: 'UNPUBLISHED_LAB',
      priority: 'LOW',
      courseId: 301,
      courseCode: 'CS301',
      title: 'Draft lab not published',
      detail: 'Classification with kNN has no notebook attached',
    },
    {
      id: 'att-5',
      type: 'LOW_PARTICIPATION',
      priority: 'LOW',
      courseId: 303,
      courseCode: 'CS303',
      title: 'Falling engagement',
      detail: '12 students have been inactive this week',
      count: 12,
    },
  ],
}

export const lecturerDashboard: LecturerDashboard = {
  stats: {
    courses: 3,
    students: 128,
    labs: 16,
    assignments: 15,
  },
  courses: [
    {
      id: 301,
      code: 'CS301',
      name: 'Machine Learning',
      description: 'Intro to machine learning and practical data analysis.',
      lecturer: 'Dr. Ada Lecturer',
      is_active: true,
      labs_count: 4,
      assignments_count: 3,
      students_count: 32,
    },
    {
      id: 302,
      code: 'CS302',
      name: 'Database Systems',
      description: 'Relational design, SQL and data modelling.',
      lecturer: 'Dr. Ada Lecturer',
      is_active: true,
      labs_count: 6,
      assignments_count: 5,
      students_count: 41,
    },
    {
      id: 303,
      code: 'CS303',
      name: 'AI Fundamentals',
      description: 'Core AI concepts from search to neural networks.',
      lecturer: 'Dr. Ada Lecturer',
      is_active: true,
      labs_count: 6,
      assignments_count: 7,
      students_count: 55,
    },
  ],
}

export const lecturerCourseWorkspaces: Record<number, LecturerCourseWorkspace> = {
  301: {
    is_active: true,
    students: [
      { id: 401, course_id: 301, enrolled_at: '2026-03-15T09:00:00Z', student: { id: 4, username: 'michaelkim', full_name: 'Michael Kim' } },
      { id: 402, course_id: 301, enrolled_at: '2026-03-16T10:30:00Z', student: { id: 6, username: 'luisfern', full_name: 'Luis Fernandez' } },
      { id: 403, course_id: 301, enrolled_at: '2026-03-18T14:00:00Z', student: { id: 8, username: 'davidokafor', full_name: 'David Okafor' } },
      { id: 404, course_id: 301, enrolled_at: '2026-04-02T09:00:00Z', student: { id: 9, username: 'anapires', full_name: 'Ana Pires' } },
    ],
    labs: [
      {
        id: 701,
        course_id: 301,
        title: 'Linear Regression Basics',
        description: 'Fit and evaluate a simple linear regression model.',
        instructions: 'Open the notebook, complete the cells, then push to students when ready.',
        is_published: true,
        notebook_filename: 'cs301_lab1_regression.ipynb',
        created_at: '2026-04-05T09:00:00Z',
      },
      {
        id: 702,
        course_id: 301,
        title: 'Classification with kNN',
        description: 'Implement and tune a k-nearest neighbours classifier.',
        instructions: 'Draft in progress — upload a notebook and publish to make it available.',
        is_published: false,
        notebook_filename: null,
        created_at: '2026-04-18T11:00:00Z',
      },
      {
        id: 703,
        course_id: 301,
        title: 'Neural Networks Intro',
        description: 'Build a small multi-layer perceptron from scratch.',
        instructions: 'Publishing and delivering to all enrolled students.',
        is_published: true,
        notebook_filename: 'cs301_lab3_nn.ipynb',
        created_at: '2026-05-01T10:00:00Z',
      },
    ],
    assignments: [
      {
        id: 801,
        course_id: 301,
        title: 'Regression Report',
        description: 'Write up findings from Lab 01 with a short reflection.',
        deadline: '2026-05-20T23:59:00Z',
        created_at: '2026-04-10T09:00:00Z',
      },
      {
        id: 802,
        course_id: 301,
        title: 'Model Evaluation Plan',
        description: 'Design an evaluation strategy for the kNN classifier.',
        deadline: '2026-06-05T23:59:00Z',
        created_at: '2026-05-05T09:00:00Z',
      },
    ],
    submissions: [
      { id: 901, assignment_id: 801, student_id: 4, status: 'SUBMITTED', submission_path: 'submissions/michaelkim/report.ipynb', submitted_at: '2026-05-18T14:20:00Z', student_username: 'michaelkim' },
      { id: 902, assignment_id: 801, student_id: 6, status: 'SUBMITTED', submission_path: 'submissions/luisfern/report.ipynb', submitted_at: '2026-05-19T09:40:00Z', student_username: 'luisfern' },
      { id: 903, assignment_id: 801, student_id: 8, status: 'SUBMITTED', submission_path: 'submissions/davidokafor/report.ipynb', submitted_at: '2026-05-20T22:55:00Z', student_username: 'davidokafor' },
    ],
  },
  302: {
    is_active: true,
    students: [
      { id: 411, course_id: 302, enrolled_at: '2026-03-20T09:00:00Z', student: { id: 21, username: 'sarahmitchell', full_name: 'Sarah Mitchell' } },
      { id: 412, course_id: 302, enrolled_at: '2026-03-22T11:00:00Z', student: { id: 22, username: 'jameswang', full_name: 'James Wang' } },
      { id: 413, course_id: 302, enrolled_at: '2026-03-25T10:00:00Z', student: { id: 23, username: 'emmythomas', full_name: 'Emmy Thomas' } },
    ],
    labs: [
      {
        id: 711,
        course_id: 302,
        title: 'ER Modelling',
        description: 'Design an entity-relationship model for a library.',
        instructions: 'Work through the schema design and normalise it.',
        is_published: true,
        notebook_filename: 'cs302_lab1_er.ipynb',
        created_at: '2026-04-08T09:00:00Z',
      },
      {
        id: 712,
        course_id: 302,
        title: 'SQL Joins & Subqueries',
        description: 'Practice joins and nested queries against a sample schema.',
        instructions: 'Complete the notebook exercises and push when ready.',
        is_published: true,
        notebook_filename: 'cs302_lab2_sql.ipynb',
        created_at: '2026-04-22T09:00:00Z',
      },
    ],
    assignments: [
      {
        id: 811,
        course_id: 302,
        title: 'Database Project',
        description: 'Design and implement a full database for a chosen domain.',
        deadline: '2026-06-02T23:59:00Z',
        created_at: '2026-04-12T09:00:00Z',
      },
      {
        id: 812,
        course_id: 302,
        title: 'Database Design',
        description: 'Submit the conceptual schema for peer review.',
        deadline: '2026-09-01T23:59:00Z',
        created_at: '2026-08-15T09:00:00Z',
      },
    ],
    submissions: [
      { id: 911, assignment_id: 811, student_id: 21, status: 'SUBMITTED', submission_path: 'submissions/sarahmitchell/project.sql', submitted_at: '2026-05-28T11:00:00Z', student_username: 'sarahmitchell' },
      { id: 912, assignment_id: 811, student_id: 22, status: 'SUBMITTED', submission_path: 'submissions/jameswang/project.sql', submitted_at: '2026-05-30T13:20:00Z', student_username: 'jameswang' },
    ],
  },
  303: {
    is_active: true,
    students: [
      { id: 421, course_id: 303, enrolled_at: '2026-04-01T09:00:00Z', student: { id: 31, username: 'aaronsingh', full_name: 'Aaron Singh' } },
      { id: 422, course_id: 303, enrolled_at: '2026-04-03T12:00:00Z', student: { id: 32, username: 'priyapatel', full_name: 'Priya Patel' } },
      { id: 423, course_id: 303, enrolled_at: '2026-04-05T14:00:00Z', student: { id: 33, username: 'chloedavis', full_name: 'Chloe Davis' } },
    ],
    labs: [
      {
        id: 721,
        course_id: 303,
        title: 'Search Algorithms',
        description: 'Implement breadth-first and A* search.',
        instructions: 'Complete the search notebook and verify on the maze data.',
        is_published: true,
        notebook_filename: 'cs303_lab1_search.ipynb',
        created_at: '2026-04-16T09:00:00Z',
      },
      {
        id: 722,
        course_id: 303,
        title: 'Perceptron Lab',
        description: 'Train a single-layer perceptron on synthetic data.',
        instructions: 'Experiment with learning rates and report results.',
        is_published: true,
        notebook_filename: 'cs303_lab2_perceptron.ipynb',
        created_at: '2026-05-02T09:00:00Z',
      },
    ],
    assignments: [
      {
        id: 821,
        course_id: 303,
        title: 'Search Foundations',
        description: 'Short reflection on search algorithm trade-offs.',
        deadline: '2026-06-10T23:59:00Z',
        created_at: '2026-04-20T09:00:00Z',
      },
      {
        id: 822,
        course_id: 303,
        title: 'ANN Project',
        description: 'Train and evaluate a neural network on a real dataset.',
        deadline: '2026-06-24T23:59:00Z',
        created_at: '2026-05-10T09:00:00Z',
      },
    ],
    submissions: [
      { id: 921, assignment_id: 821, student_id: 31, status: 'SUBMITTED', submission_path: 'submissions/aaronsingh/search.md', submitted_at: '2026-06-07T09:00:00Z', student_username: 'aaronsingh' },
      { id: 922, assignment_id: 821, student_id: 32, status: 'SUBMITTED', submission_path: 'submissions/priyapatel/search.md', submitted_at: '2026-06-08T16:00:00Z', student_username: 'priyapatel' },
      { id: 923, assignment_id: 821, student_id: 33, status: 'SUBMITTED', submission_path: 'submissions/chloedavis/search.md', submitted_at: '2026-06-09T19:30:00Z', student_username: 'chloedavis' },
    ],
  },
}

export const lecturerStudents: LecturerGlobalStudent[] = [
  { id: 4, username: 'michaelkim', email: 'michael.kim@uni.edu', full_name: 'Michael Kim', courses: [{ id: 301, code: 'CS301', name: 'Machine Learning' }], status: 'ACTIVE', lastActive: '2026-08-29T14:32:00Z' },
  { id: 6, username: 'luisfern', email: 'luis.fernandez@uni.edu', full_name: 'Luis Fernandez', courses: [{ id: 301, code: 'CS301', name: 'Machine Learning' }], status: 'ACTIVE', lastActive: '2026-08-28T09:12:00Z' },
  { id: 8, username: 'davidokafor', email: 'david.okafor@uni.edu', full_name: 'David Okafor', courses: [{ id: 301, code: 'CS301', name: 'Machine Learning' }], status: 'ACTIVE', lastActive: '2026-08-30T21:05:00Z' },
  { id: 9, username: 'anapires', email: 'ana.pires@uni.edu', full_name: 'Ana Pires', courses: [{ id: 301, code: 'CS301', name: 'Machine Learning' }], status: 'INACTIVE', lastActive: '2026-08-12T10:00:00Z' },
  { id: 21, username: 'sarahmitchell', email: 'sarah.mitchell@uni.edu', full_name: 'Sarah Mitchell', courses: [{ id: 302, code: 'CS302', name: 'Database Systems' }], status: 'ACTIVE', lastActive: '2026-08-29T16:45:00Z' },
  { id: 22, username: 'jameswang', email: 'james.wang@uni.edu', full_name: 'James Wang', courses: [{ id: 302, code: 'CS302', name: 'Database Systems' }], status: 'ACTIVE', lastActive: '2026-08-30T08:20:00Z' },
  { id: 23, username: 'emmythomas', email: 'emmy.thomas@uni.edu', full_name: 'Emmy Thomas', courses: [{ id: 302, code: 'CS302', name: 'Database Systems' }], status: 'INACTIVE', lastActive: '2026-08-05T13:40:00Z' },
  { id: 31, username: 'aaronsingh', email: 'aaron.singh@uni.edu', full_name: 'Aaron Singh', courses: [{ id: 303, code: 'CS303', name: 'AI Fundamentals' }], status: 'ACTIVE', lastActive: '2026-08-30T19:10:00Z' },
  { id: 32, username: 'priyapatel', email: 'priya.patel@uni.edu', full_name: 'Priya Patel', courses: [{ id: 303, code: 'CS303', name: 'AI Fundamentals' }], status: 'ACTIVE', lastActive: '2026-08-28T11:55:00Z' },
  { id: 33, username: 'chloedavis', email: 'chloe.davis@uni.edu', full_name: 'Chloe Davis', courses: [{ id: 303, code: 'CS303', name: 'AI Fundamentals' }], status: 'ACTIVE', lastActive: '2026-08-30T07:30:00Z' },
]

export const lecturerStudentProfiles: Record<number, LecturerStudentProfile> = {
  4: {
    student: lecturerStudents[0],
    assignmentProgress: [
      { assignmentId: 801, title: 'Regression Report', courseCode: 'CS301', status: 'SUBMITTED', submittedAt: '2026-05-18T14:20:00Z', score: null },
      { assignmentId: 802, title: 'Model Evaluation Plan', courseCode: 'CS301', status: 'PENDING', submittedAt: null, score: null },
    ],
    labProgress: [
      { labId: 701, title: 'Linear Regression Basics', courseCode: 'CS301', status: 'COMPLETED' },
      { labId: 702, title: 'Classification with kNN', courseCode: 'CS301', status: 'NOT_STARTED' },
      { labId: 703, title: 'Neural Networks Intro', courseCode: 'CS301', status: 'IN_PROGRESS' },
    ],
    activity: [
      { id: 'ac-4-1', type: 'SUBMISSION', description: 'Submitted Regression Report', time: '2026-05-18T14:20:00Z' },
      { id: 'ac-4-2', type: 'LAB', description: 'Opened Neural Networks Intro notebook', time: '2026-08-25T09:40:00Z' },
      { id: 'ac-4-3', type: 'LOGIN', description: 'Signed in to the teaching platform', time: '2026-08-29T14:32:00Z' },
    ],
  },
  6: {
    student: lecturerStudents[1],
    assignmentProgress: [
      { assignmentId: 801, title: 'Regression Report', courseCode: 'CS301', status: 'SUBMITTED', submittedAt: '2026-05-19T09:40:00Z', score: null },
      { assignmentId: 802, title: 'Model Evaluation Plan', courseCode: 'CS301', status: 'PENDING', submittedAt: null, score: null },
    ],
    labProgress: [
      { labId: 701, title: 'Linear Regression Basics', courseCode: 'CS301', status: 'COMPLETED' },
      { labId: 702, title: 'Classification with kNN', courseCode: 'CS301', status: 'NOT_STARTED' },
      { labId: 703, title: 'Neural Networks Intro', courseCode: 'CS301', status: 'COMPLETED' },
    ],
    activity: [
      { id: 'ac-6-1', type: 'SUBMISSION', description: 'Submitted Regression Report', time: '2026-05-19T09:40:00Z' },
      { id: 'ac-6-2', type: 'LAB', description: 'Completed Neural Networks Intro notebook', time: '2026-08-26T18:25:00Z' },
      { id: 'ac-6-3', type: 'LOGIN', description: 'Signed in to the teaching platform', time: '2026-08-28T09:12:00Z' },
    ],
  },
  8: {
    student: lecturerStudents[2],
    assignmentProgress: [
      { assignmentId: 801, title: 'Regression Report', courseCode: 'CS301', status: 'GRADED', submittedAt: '2026-05-20T22:55:00Z', score: 82 },
      { assignmentId: 802, title: 'Model Evaluation Plan', courseCode: 'CS301', status: 'PENDING', submittedAt: null, score: null },
    ],
    labProgress: [
      { labId: 701, title: 'Linear Regression Basics', courseCode: 'CS301', status: 'COMPLETED' },
      { labId: 702, title: 'Classification with kNN', courseCode: 'CS301', status: 'NOT_STARTED' },
      { labId: 703, title: 'Neural Networks Intro', courseCode: 'CS301', status: 'IN_PROGRESS' },
    ],
    activity: [
      { id: 'ac-8-1', type: 'SUBMISSION', description: 'Submitted Regression Report', time: '2026-05-20T22:55:00Z' },
      { id: 'ac-8-2', type: 'ASSIGNMENT', description: 'Opened Model Evaluation Plan assignment', time: '2026-08-27T10:15:00Z' },
      { id: 'ac-8-3', type: 'LOGIN', description: 'Signed in to the teaching platform', time: '2026-08-30T21:05:00Z' },
    ],
  },
  9: {
    student: lecturerStudents[3],
    assignmentProgress: [
      { assignmentId: 801, title: 'Regression Report', courseCode: 'CS301', status: 'PENDING', submittedAt: null, score: null },
      { assignmentId: 802, title: 'Model Evaluation Plan', courseCode: 'CS301', status: 'PENDING', submittedAt: null, score: null },
    ],
    labProgress: [
      { labId: 701, title: 'Linear Regression Basics', courseCode: 'CS301', status: 'IN_PROGRESS' },
      { labId: 702, title: 'Classification with kNN', courseCode: 'CS301', status: 'NOT_STARTED' },
      { labId: 703, title: 'Neural Networks Intro', courseCode: 'CS301', status: 'NOT_STARTED' },
    ],
    activity: [
      { id: 'ac-9-1', type: 'LAB', description: 'Opened Linear Regression Basics notebook', time: '2026-08-10T12:05:00Z' },
      { id: 'ac-9-2', type: 'LOGIN', description: 'Signed in to the teaching platform', time: '2026-08-12T10:00:00Z' },
    ],
  },
  21: {
    student: lecturerStudents[4],
    assignmentProgress: [
      { assignmentId: 811, title: 'Database Project', courseCode: 'CS302', status: 'SUBMITTED', submittedAt: '2026-05-28T11:00:00Z', score: null },
      { assignmentId: 812, title: 'Database Design', courseCode: 'CS302', status: 'PENDING', submittedAt: null, score: null },
    ],
    labProgress: [
      { labId: 711, title: 'ER Modelling', courseCode: 'CS302', status: 'COMPLETED' },
      { labId: 712, title: 'SQL Joins & Subqueries', courseCode: 'CS302', status: 'IN_PROGRESS' },
    ],
    activity: [
      { id: 'ac-21-1', type: 'SUBMISSION', description: 'Submitted Database Project', time: '2026-05-28T11:00:00Z' },
      { id: 'ac-21-2', type: 'LAB', description: 'Continued SQL Joins & Subqueries lab', time: '2026-08-29T16:45:00Z' },
      { id: 'ac-21-3', type: 'LOGIN', description: 'Signed in to the teaching platform', time: '2026-08-29T16:40:00Z' },
    ],
  },
  22: {
    student: lecturerStudents[5],
    assignmentProgress: [
      { assignmentId: 811, title: 'Database Project', courseCode: 'CS302', status: 'SUBMITTED', submittedAt: '2026-05-30T13:20:00Z', score: null },
      { assignmentId: 812, title: 'Database Design', courseCode: 'CS302', status: 'PENDING', submittedAt: null, score: null },
    ],
    labProgress: [
      { labId: 711, title: 'ER Modelling', courseCode: 'CS302', status: 'COMPLETED' },
      { labId: 712, title: 'SQL Joins & Subqueries', courseCode: 'CS302', status: 'COMPLETED' },
    ],
    activity: [
      { id: 'ac-22-1', type: 'SUBMISSION', description: 'Submitted Database Project', time: '2026-05-30T13:20:00Z' },
      { id: 'ac-22-2', type: 'LAB', description: 'Completed SQL Joins & Subqueries lab', time: '2026-08-28T09:55:00Z' },
      { id: 'ac-22-3', type: 'LOGIN', description: 'Signed in to the teaching platform', time: '2026-08-30T08:20:00Z' },
    ],
  },
  23: {
    student: lecturerStudents[6],
    assignmentProgress: [
      { assignmentId: 811, title: 'Database Project', courseCode: 'CS302', status: 'PENDING', submittedAt: null, score: null },
      { assignmentId: 812, title: 'Database Design', courseCode: 'CS302', status: 'PENDING', submittedAt: null, score: null },
    ],
    labProgress: [
      { labId: 711, title: 'ER Modelling', courseCode: 'CS302', status: 'COMPLETED' },
      { labId: 712, title: 'SQL Joins & Subqueries', courseCode: 'CS302', status: 'NOT_STARTED' },
    ],
    activity: [
      { id: 'ac-23-1', type: 'LAB', description: 'Completed ER Modelling lab', time: '2026-06-20T10:00:00Z' },
      { id: 'ac-23-2', type: 'LOGIN', description: 'Signed in to the teaching platform', time: '2026-08-05T13:40:00Z' },
    ],
  },
  31: {
    student: lecturerStudents[7],
    assignmentProgress: [
      { assignmentId: 821, title: 'Search Foundations', courseCode: 'CS303', status: 'SUBMITTED', submittedAt: '2026-06-07T09:00:00Z', score: null },
      { assignmentId: 822, title: 'ANN Project', courseCode: 'CS303', status: 'PENDING', submittedAt: null, score: null },
    ],
    labProgress: [
      { labId: 721, title: 'Search Algorithms', courseCode: 'CS303', status: 'COMPLETED' },
      { labId: 722, title: 'Perceptron Lab', courseCode: 'CS303', status: 'IN_PROGRESS' },
    ],
    activity: [
      { id: 'ac-31-1', type: 'SUBMISSION', description: 'Submitted Search Foundations', time: '2026-06-07T09:00:00Z' },
      { id: 'ac-31-2', type: 'LAB', description: 'Working on Perceptron Lab', time: '2026-08-30T19:10:00Z' },
      { id: 'ac-31-3', type: 'LOGIN', description: 'Signed in to the teaching platform', time: '2026-08-30T19:05:00Z' },
    ],
  },
  32: {
    student: lecturerStudents[8],
    assignmentProgress: [
      { assignmentId: 821, title: 'Search Foundations', courseCode: 'CS303', status: 'SUBMITTED', submittedAt: '2026-06-08T16:00:00Z', score: null },
      { assignmentId: 822, title: 'ANN Project', courseCode: 'CS303', status: 'PENDING', submittedAt: null, score: null },
    ],
    labProgress: [
      { labId: 721, title: 'Search Algorithms', courseCode: 'CS303', status: 'COMPLETED' },
      { labId: 722, title: 'Perceptron Lab', courseCode: 'CS303', status: 'COMPLETED' },
    ],
    activity: [
      { id: 'ac-32-1', type: 'SUBMISSION', description: 'Submitted Search Foundations', time: '2026-06-08T16:00:00Z' },
      { id: 'ac-32-2', type: 'LAB', description: 'Completed Perceptron Lab', time: '2026-08-27T09:00:00Z' },
      { id: 'ac-32-3', type: 'LOGIN', description: 'Signed in to the teaching platform', time: '2026-08-28T11:55:00Z' },
    ],
  },
  33: {
    student: lecturerStudents[9],
    assignmentProgress: [
      { assignmentId: 821, title: 'Search Foundations', courseCode: 'CS303', status: 'SUBMITTED', submittedAt: '2026-06-09T19:30:00Z', score: null },
      { assignmentId: 822, title: 'ANN Project', courseCode: 'CS303', status: 'PENDING', submittedAt: null, score: null },
    ],
    labProgress: [
      { labId: 721, title: 'Search Algorithms', courseCode: 'CS303', status: 'IN_PROGRESS' },
      { labId: 722, title: 'Perceptron Lab', courseCode: 'CS303', status: 'IN_PROGRESS' },
    ],
    activity: [
      { id: 'ac-33-1', type: 'SUBMISSION', description: 'Submitted Search Foundations', time: '2026-06-09T19:30:00Z' },
      { id: 'ac-33-2', type: 'LOGIN', description: 'Signed in to the teaching platform', time: '2026-08-30T07:30:00Z' },
    ],
  },
}

export const lecturerAssignments: LecturerGlobalAssignment[] = [
  {
    id: 801,
    courseId: 301,
    courseCode: 'CS301',
    courseName: 'Machine Learning',
    title: 'Regression Report',
    description: 'Write up findings from Lab 01 with a short reflection.',
    deadline: '2026-05-20T23:59:00Z',
    submitted: 24,
    expected: 32,
    status: 'OPEN',
  },
  {
    id: 802,
    courseId: 301,
    courseCode: 'CS301',
    courseName: 'Machine Learning',
    title: 'Model Evaluation Plan',
    description: 'Design an evaluation strategy for the kNN classifier.',
    deadline: '2026-09-14T23:59:00Z',
    submitted: 5,
    expected: 32,
    status: 'OPEN',
  },
  {
    id: 811,
    courseId: 302,
    courseCode: 'CS302',
    courseName: 'Database Systems',
    title: 'Database Project',
    description: 'Design and implement a full database for a chosen domain.',
    deadline: '2026-06-02T23:59:00Z',
    submitted: 18,
    expected: 41,
    status: 'OPEN',
  },
  {
    id: 812,
    courseId: 302,
    courseCode: 'CS302',
    courseName: 'Database Systems',
    title: 'Database Design',
    description: 'Submit the conceptual schema for peer review.',
    deadline: '2026-09-03T23:59:00Z',
    submitted: 0,
    expected: 41,
    status: 'UPCOMING',
  },
  {
    id: 821,
    courseId: 303,
    courseCode: 'CS303',
    courseName: 'AI Fundamentals',
    title: 'Search Foundations',
    description: 'Short reflection on search algorithm trade-offs.',
    deadline: '2026-06-10T23:59:00Z',
    submitted: 41,
    expected: 55,
    status: 'CLOSED',
  },
  {
    id: 822,
    courseId: 303,
    courseCode: 'CS303',
    courseName: 'AI Fundamentals',
    title: 'ANN Project',
    description: 'Train and evaluate a neural network on a real dataset.',
    deadline: '2026-10-05T23:59:00Z',
    submitted: 6,
    expected: 55,
    status: 'UPCOMING',
  },
]

export const lecturerLabs: LecturerGlobalLab[] = [
  {
    id: 701,
    courseId: 301,
    courseCode: 'CS301',
    courseName: 'Machine Learning',
    title: 'Linear Regression Basics',
    description: 'Fit and evaluate a simple linear regression model.',
    is_published: true,
    notebook_filename: 'cs301_lab1_regression.ipynb',
    delivered: 30,
    expected: 32,
  },
  {
    id: 702,
    courseId: 301,
    courseCode: 'CS301',
    courseName: 'Machine Learning',
    title: 'Classification with kNN',
    description: 'Implement and tune a k-nearest neighbours classifier.',
    is_published: false,
    notebook_filename: null,
    delivered: 0,
    expected: 32,
  },
  {
    id: 703,
    courseId: 301,
    courseCode: 'CS301',
    courseName: 'Machine Learning',
    title: 'Neural Networks Intro',
    description: 'Build a small multi-layer perceptron from scratch.',
    is_published: true,
    notebook_filename: 'cs301_lab3_nn.ipynb',
    delivered: 25,
    expected: 32,
  },
  {
    id: 711,
    courseId: 302,
    courseCode: 'CS302',
    courseName: 'Database Systems',
    title: 'ER Modelling',
    description: 'Design an entity-relationship model for a library.',
    is_published: true,
    notebook_filename: 'cs302_lab1_er.ipynb',
    delivered: 41,
    expected: 41,
  },
  {
    id: 712,
    courseId: 302,
    courseCode: 'CS302',
    courseName: 'Database Systems',
    title: 'SQL Joins & Subqueries',
    description: 'Practice joins and nested queries against a sample schema.',
    is_published: true,
    notebook_filename: 'cs302_lab2_sql.ipynb',
    delivered: 30,
    expected: 41,
  },
  {
    id: 721,
    courseId: 303,
    courseCode: 'CS303',
    courseName: 'AI Fundamentals',
    title: 'Search Algorithms',
    description: 'Implement breadth-first and A* search.',
    is_published: true,
    notebook_filename: 'cs303_lab1_search.ipynb',
    delivered: 51,
    expected: 55,
  },
  {
    id: 722,
    courseId: 303,
    courseCode: 'CS303',
    courseName: 'AI Fundamentals',
    title: 'Perceptron Lab',
    description: 'Train a single-layer perceptron on synthetic data.',
    is_published: true,
    notebook_filename: 'cs303_lab2_perceptron.ipynb',
    delivered: 55,
    expected: 55,
  },
]

export const lecturerNotifications: LecturerNotification[] = [
  { id: 'nt-1', kind: 'submission', course: 'CS301', title: '3 submissions need review', time: '10 min ago' },
  { id: 'nt-2', kind: 'delivery', course: 'CS301', title: 'Neural Networks notebook not fully delivered', time: '1 hour ago' },
  { id: 'nt-3', kind: 'deadline', course: 'CS302', title: 'Database Design due tomorrow', time: '3 hours ago' },
  { id: 'nt-4', kind: 'student', course: 'CS303', title: '12 students inactive this week', time: 'Yesterday' },
]
export const lecturerUpcoming: LecturerUpcomingItem[] = [
  { id: 'up-1', kind: 'assignment', title: 'Database Design', courseCode: 'CS302', date: '2026-09-03', label: 'Due tomorrow' },
  { id: 'up-2', kind: 'lab', title: 'SQL Joins & Subqueries', courseCode: 'CS302', date: '2026-09-08', label: 'Publish window' },
  { id: 'up-3', kind: 'assignment', title: 'Regression Report review', courseCode: 'CS301', date: '2026-09-12', label: 'Review closes' },
  { id: 'up-4', kind: 'assignment', title: 'Model Evaluation Plan', courseCode: 'CS301', date: '2026-09-14', label: 'Due in 13 days' },
  { id: 'up-5', kind: 'assignment', title: 'ANN Project', courseCode: 'CS303', date: '2026-10-05', label: 'Due in 34 days' },
]

export const studentProfile: {
  fullName: string
  username: string
  email: string
  title: string
} = {
  fullName: 'Sam Anderson',
  username: 'sam',
  email: 'sam.anderson@gmail.com',
  title: 'Student',
}

export const studentCourses: StudentCourse[] = [
  { id: 301, code: 'CS301', name: 'Machine Learning', lecturer: 'Dr. Ada Lecturer', description: 'Intro to machine learning and practical data analysis.', labs_available: 2, assignments_count: 3 },
  { id: 302, code: 'CS302', name: 'Database Systems', lecturer: 'Dr. Ada Lecturer', description: 'Relational design, SQL and data modelling.', labs_available: 2, assignments_count: 2 },
  { id: 303, code: 'CS303', name: 'AI Fundamentals', lecturer: 'Dr. Ada Lecturer', description: 'Core AI concepts from search to neural networks.', labs_available: 2, assignments_count: 2 },
]

export const studentAssignments: StudentAssignment[] = [
  { id: 1001, courseId: 301, courseCode: 'CS301', courseName: 'Machine Learning', title: 'Regression Report', description: 'Write up your findings from the linear regression lab and include a short reflection.', deadline: '2026-09-10', dueLabel: 'Due in 2 days', status: 'NOT_STARTED', submittedAt: null, submissionFilename: null, grade: null },
  { id: 1002, courseId: 301, courseCode: 'CS301', courseName: 'Machine Learning', title: 'Model Evaluation Plan', description: 'Design an evaluation strategy for the kNN classifier.', deadline: '2026-09-14', dueLabel: 'Due in 6 days', status: 'SUBMITTED', submittedAt: '2026-09-07T14:32:00Z', submissionFilename: 'model-evaluation-plan.pdf', grade: null },
  { id: 1003, courseId: 301, courseCode: 'CS301', courseName: 'Machine Learning', title: 'Neural Networks Report', description: 'Describe the network you built and reflect on the results.', deadline: '2026-09-20', dueLabel: 'Due in 12 days', status: 'SUBMITTED', submittedAt: '2026-09-05T09:15:00Z', submissionFilename: 'nn-report.pdf', grade: null },
  { id: 1004, courseId: 302, courseCode: 'CS302', courseName: 'Database Systems', title: 'Database Design', description: 'Submit the conceptual schema for your database project for peer review.', deadline: '2026-09-09', dueLabel: 'Due tomorrow', status: 'NOT_STARTED', submittedAt: null, submissionFilename: null, grade: null },
  { id: 1005, courseId: 302, courseCode: 'CS302', courseName: 'Database Systems', title: 'Database Project', description: 'Design and implement a full database for a chosen domain.', deadline: '2026-08-28', dueLabel: 'Submitted', status: 'SUBMITTED', submittedAt: '2026-08-28T11:00:00Z', submissionFilename: 'database-project.sql', grade: null },
  { id: 1006, courseId: 303, courseCode: 'CS303', courseName: 'AI Fundamentals', title: 'Search Foundations', description: 'Short reflection on search algorithm trade-offs.', deadline: '2026-07-30', dueLabel: 'Submitted', status: 'GRADED', submittedAt: '2026-07-28T19:30:00Z', submissionFilename: 'search-foundations.md', grade: 88 },
  { id: 1007, courseId: 303, courseCode: 'CS303', courseName: 'AI Fundamentals', title: 'ANN Project', description: 'Train and evaluate a neural network on a real dataset.', deadline: '2026-09-18', dueLabel: 'Due in 10 days', status: 'SUBMITTED', submittedAt: '2026-09-04T16:45:00Z', submissionFilename: 'ann-project.ipynb', grade: null },
]

export const studentLabs: StudentLab[] = [
  { id: 2001, courseId: 301, courseCode: 'CS301', courseName: 'Machine Learning', title: 'Linear Regression Basics', description: 'Fit and evaluate a simple linear regression model using numpy.', instructions: ['Open the notebook.', 'Complete exercises 1 to 3.', 'Save your work in your Jupyter workspace.'], notebook_filename: 'cs301_lab1_regression.ipynb', ready: true },
  { id: 2002, courseId: 301, courseCode: 'CS301', courseName: 'Machine Learning', title: 'Neural Networks Intro', description: 'Build a small multi-layer perceptron from scratch.', instructions: ['Open the notebook.', 'Implement the forward pass.', 'Train and evaluate on the provided data.'], notebook_filename: 'cs301_lab3_nn.ipynb', ready: true },
  { id: 2003, courseId: 302, courseCode: 'CS302', courseName: 'Database Systems', title: 'ER Modelling', description: 'Design an entity-relationship model for a library.', instructions: ['Sketch entities and relationships.', 'Normalise the schema to 3NF.', 'Validate your model in the notebook.'], notebook_filename: 'cs302_lab1_er.ipynb', ready: true },
  { id: 2004, courseId: 302, courseCode: 'CS302', courseName: 'Database Systems', title: 'SQL Joins & Subqueries', description: 'Practice joins and nested queries against a sample schema.', instructions: ['Open the notebook.', 'Answer each question in the marked cells.'], notebook_filename: 'cs302_lab2_sql.ipynb', ready: true },
  { id: 2005, courseId: 303, courseCode: 'CS303', courseName: 'AI Fundamentals', title: 'Search Algorithms', description: 'Implement breadth-first and A* search.', instructions: ['Implement BFS on the maze data.', 'Implement A* with a valid heuristic.', 'Compare exploration counts.'], notebook_filename: 'cs303_lab1_search.ipynb', ready: true },
  { id: 2006, courseId: 303, courseCode: 'CS303', courseName: 'AI Fundamentals', title: 'Perceptron Lab', description: 'Train a single-layer perceptron on synthetic data.', instructions: ['Experiment with learning rates.', 'Plot the decision boundary.', 'Summarise your findings in the notebook.'], notebook_filename: 'cs303_lab2_perceptron.ipynb', ready: true },
]

export const studentNotifications: StudentNotification[] = [
  { id: 'sn-1', kind: 'deadline', course: 'CS302', title: 'Database Design due tomorrow', time: '3 hours ago' },
  { id: 'sn-2', kind: 'graded', course: 'CS303', title: 'Search Foundations graded · 88%', time: 'Yesterday' },
  { id: 'sn-3', kind: 'lab', course: 'CS301', title: 'New notebook: Linear Regression Basics', time: '2 days ago' },
]



