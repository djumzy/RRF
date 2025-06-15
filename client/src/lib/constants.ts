// Application Constants

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Course Status
export const COURSE_STATUS = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PUBLISHED: 'published',
} as const;

export type CourseStatus = typeof COURSE_STATUS[keyof typeof COURSE_STATUS];

// Collaboration Request Status
export const COLLABORATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
} as const;

export type CollaborationStatus = typeof COLLABORATION_STATUS[keyof typeof COLLABORATION_STATUS];

// Student Progress Status
export const PROGRESS_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  BEHIND: 'behind',
  INACTIVE: 'inactive',
} as const;

export type ProgressStatus = typeof PROGRESS_STATUS[keyof typeof PROGRESS_STATUS];

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 50,
  ACCEPTED_TYPES: [
    '.pdf',
    '.doc',
    '.docx',
    '.txt',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.mp4',
    '.avi',
    '.mov',
    '.mp3',
    '.wav',
    '.pptx',
    '.xlsx',
  ],
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  COURSE_PAGE_SIZE: 12,
  STUDENT_PAGE_SIZE: 20,
} as const;

// Course Content
export const PERMACULTURE_CHAPTERS = [
  'Learning Culture – Why Culture? What is a Culture?',
  'What is Permaculture?',
  'Climate Change and the Role of Permaculture in Refugees',
  'Water Management',
  'Soil Building and Regeneration in Refugee and Rural Settings',
  'Food Forests and Polyculture Gardening',
  'Natural Building and Shelter Design',
  'Integrated Pest Management (IPM)',
  'Zoning, Sector and Elevation Planning',
  'Collect, Sink, Spread, and Store',
  'Learning Through Demonstration Farms',
  'Vocational Permaculture for Youth and Adults',
  'Thinking About Worldviews',
  'Growing Resilient Refugee Communities – Using the Six Thinking Hats',
] as const;

// Dashboard Stats Refresh Intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  STATS: 5 * 60 * 1000, // 5 minutes
  PROGRESS: 2 * 60 * 1000, // 2 minutes
  NOTIFICATIONS: 30 * 1000, // 30 seconds
  REAL_TIME: 5 * 1000, // 5 seconds
} as const;

// Theme Colors (matching the design system)
export const COLORS = {
  RRF_GREEN: '#22C55E',
  RRF_DARK_GREEN: '#16A34A',
  RRF_LIGHT_GREEN: '#DCFCE7',
  SUCCESS: '#22C55E',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
} as const;

// Navigation Menu Items
export const ADMIN_MENU_ITEMS = [
  { path: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
  { path: '/courses', icon: 'BookOpen', label: 'All Courses' },
  { path: '/users', icon: 'Users', label: 'User Management' },
  { path: '/approvals', icon: 'CheckCircle', label: 'Course Approvals' },
  { path: '/analytics', icon: 'ChartLine', label: 'Analytics' },
  { path: '/settings', icon: 'Settings', label: 'Settings' },
] as const;

export const INSTRUCTOR_MENU_ITEMS = [
  { path: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
  { path: '/my-courses', icon: 'BookOpen', label: 'My Courses' },
  { path: '/create-course', icon: 'PlusCircle', label: 'Create Course' },
  { path: '/collaborate', icon: 'Users', label: 'Collaborate' },
  { path: '/student-progress', icon: 'ChartLine', label: 'Student Progress' },
  { path: '/files', icon: 'FolderOpen', label: 'Files & Resources' },
  { path: '/settings', icon: 'Settings', label: 'Settings' },
] as const;

export const STUDENT_MENU_ITEMS = [
  { path: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
  { path: '/my-learning', icon: 'GraduationCap', label: 'My Learning' },
  { path: '/browse-courses', icon: 'BookOpen', label: 'Browse Courses' },
  { path: '/schedule', icon: 'Calendar', label: 'Schedule' },
  { path: '/progress', icon: 'ChartLine', label: 'My Progress' },
  { path: '/downloads', icon: 'Download', label: 'Downloads' },
  { path: '/help', icon: 'HelpCircle', label: 'Get Help' },
] as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    USER: '/api/auth/user',
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
  },
  COURSES: {
    LIST: '/api/courses',
    CREATE: '/api/courses',
    GET: (id: string | number) => `/api/courses/${id}`,
    UPDATE: (id: string | number) => `/api/courses/${id}`,
    DELETE: (id: string | number) => `/api/courses/${id}`,
    SUBMIT_REVIEW: (id: string | number) => `/api/courses/${id}/submit-for-review`,
    APPROVE: (id: string | number) => `/api/courses/${id}/approve`,
    PENDING_REVIEW: '/api/courses/pending-review',
  },
  CHAPTERS: {
    LIST: (courseId: string | number) => `/api/courses/${courseId}/chapters`,
    CREATE: (courseId: string | number) => `/api/courses/${courseId}/chapters`,
    UPDATE: (id: string | number) => `/api/chapters/${id}`,
    DELETE: (id: string | number) => `/api/chapters/${id}`,
  },
  ENROLLMENTS: {
    LIST: '/api/enrollments',
    ENROLL: (courseId: string | number) => `/api/courses/${courseId}/enroll`,
    PROGRESS: (courseId: string | number) => `/api/enrollments/${courseId}/progress`,
  },
  COLLABORATION: {
    LIST: '/api/collaboration-requests',
    CREATE: '/api/collaboration-requests',
    UPDATE: (id: string | number) => `/api/collaboration-requests/${id}`,
  },
  FILES: {
    LIST: (courseId: string | number) => `/api/courses/${courseId}/files`,
    UPLOAD: (courseId: string | number) => `/api/courses/${courseId}/files`,
    DELETE: (id: string | number) => `/api/files/${id}`,
  },
  STATS: '/api/stats',
} as const;

// Form Validation Rules
export const VALIDATION = {
  COURSE_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  COURSE_DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
  },
  CHAPTER_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 80,
  },
  CHAPTER_CONTENT: {
    MIN_LENGTH: 50,
    MAX_LENGTH: 10000,
  },
  USER_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'rrf-learning-theme',
  PREFERENCES: 'rrf-learning-preferences',
  DRAFT_COURSES: 'rrf-learning-draft-courses',
  RECENT_COURSES: 'rrf-learning-recent-courses',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Please contact an administrator.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size must be less than ${FILE_UPLOAD.MAX_SIZE_MB}MB`,
  UNSUPPORTED_FILE_TYPE: 'This file type is not supported',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  COURSE_CREATED: 'Course created successfully',
  COURSE_UPDATED: 'Course updated successfully',
  COURSE_DELETED: 'Course deleted successfully',
  CHAPTER_CREATED: 'Chapter added successfully',
  CHAPTER_UPDATED: 'Chapter updated successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  ENROLLMENT_SUCCESS: 'Successfully enrolled in course',
  PROGRESS_UPDATED: 'Progress updated successfully',
} as const;
