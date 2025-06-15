import { pgTable, text, serial, timestamp, varchar, boolean, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 20 }).unique(),
  username: text("username").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  district: text("district").notNull(),
  subcounty: text("subcounty").notNull(),
  village: text("village").notNull(),
  educationLevel: text("education_level").notNull(),
  courseType: text("course_type"), // Now correctly nullable by default
  role: text("role").notNull().default("student"), // 'student', 'instructor', 'admin'
  createdAt: timestamp("created_at").defaultNow(),
});

export const permacultureInfo = pgTable("permaculture_info", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array(),
  dateAdded: timestamp("date_added").defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructorId: serial("instructor_id").notNull().references(() => users.id),
  isApproved: boolean("is_approved").default(false),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  minPassPercentage: integer("min_pass_percentage").default(70),
  totalModules: integer("total_modules").default(0),
  estimatedDuration: integer("estimated_duration"), // in minutes
  category: text("category").notNull(),
  level: text("level").notNull(), // beginner, intermediate, advanced
  prerequisites: text("prerequisites").array(),
  tags: text("tags").array(),
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  courseId: serial("course_id").notNull().references(() => courses.id),
  studentId: serial("student_id").notNull().references(() => users.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  status: text("status").notNull().default("active"), // active, completed, dropped
});

export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: serial("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  type: text("type").notNull(), // 'video', 'document', 'quiz', 'assignment'
  content: json("content").notNull(),
  duration: integer("duration"), // in minutes
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  minPassPercentage: integer("min_pass_percentage").default(70),
  isRequired: boolean("is_required").default(true),
});

export const courseSchedules = pgTable("course_schedules", {
  id: serial("id").primaryKey(),
  courseId: serial("course_id").notNull().references(() => courses.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxStudents: integer("max_students"),
  isOnline: boolean("is_online").default(true),
  location: text("location"),
  instructorId: serial("instructor_id").notNull().references(() => users.id),
  status: text("status").notNull().default("scheduled"), // scheduled, ongoing, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const studentProgress = pgTable("student_progress", {
  id: serial("id").primaryKey(),
  studentId: serial("student_id").notNull().references(() => users.id),
  moduleId: serial("module_id").notNull().references(() => courseModules.id),
  status: text("status").notNull().default("not_started"), // not_started, in_progress, completed
  score: integer("score"),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  currentPosition: integer("current_position").default(0), // For video/document progress
  timeSpent: integer("time_spent").default(0), // in seconds
});

export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull().references(() => users.id),
  moduleId: serial("module_id").notNull().references(() => courseModules.id),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  downloadCount: integer("download_count").default(0),
  downloadedAt: timestamp("downloaded_at").defaultNow(),
});

export const helpTickets = pgTable("help_tickets", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"), // open, in_progress, resolved, closed
  priority: text("priority").notNull().default("medium"), // low, medium, high
  assignedTo: serial("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'system', 'message', 'course', 'announcement'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: serial("sender_id").notNull().references(() => users.id),
  receiverId: serial("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupMessages = pgTable("group_messages", {
  id: serial("id").primaryKey(),
  senderId: serial("sender_id").notNull().references(() => users.id),
  groupId: text("group_id").notNull(), // This will store the student ID or group identifier
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  groupId: text("group_id").notNull(),
  userId: serial("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const moduleTests = pgTable("module_tests", {
  id: serial("id").primaryKey(),
  moduleId: serial("module_id").notNull().references(() => courseModules.id),
  title: text("title").notNull(),
  description: text("description"),
  questions: json("questions").notNull(), // Array of question objects
  timeLimit: integer("time_limit"), // in minutes
  passingScore: integer("passing_score").notNull(),
  maxAttempts: integer("max_attempts").default(3),
  isRandomized: boolean("is_randomized").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const testAttempts = pgTable("test_attempts", {
  id: serial("id").primaryKey(),
  testId: serial("test_id").notNull().references(() => moduleTests.id),
  studentId: serial("student_id").notNull().references(() => users.id),
  score: integer("score"),
  answers: json("answers").notNull(), // Array of student answers
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  isPassed: boolean("is_passed"),
});

export const courseAnalytics = pgTable("course_analytics", {
  id: serial("id").primaryKey(),
  courseId: serial("course_id").notNull().references(() => courses.id),
  totalEnrollments: integer("total_enrollments").default(0),
  activeStudents: integer("active_students").default(0),
  completionRate: integer("completion_rate").default(0),
  averageScore: integer("average_score").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  studentId: true,
  createdAt: true,
  role: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().min(1, "Location is required"),
  district: z.string().min(1, "District is required"),
  subcounty: z.string().min(1, "Subcounty is required"),
  village: z.string().min(1, "Village is required"),
  educationLevel: z.enum(["primary", "secondary", "diploma", "bachelors", "masters", "phd", "other"], {
    required_error: "Please select your education level",
  }),
  courseType: z.enum(["online", "physical"]).optional(), // Made optional
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Student ID is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertPermacultureInfoSchema = createInsertSchema(permacultureInfo).omit({
  id: true,
  dateAdded: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isApproved: true,
  isPublic: true,
  totalModules: true,
}).extend({
  minPassPercentage: z.number().min(0).max(100).default(70),
  estimatedDuration: z.number().min(0).optional(),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  prerequisites: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertCourseModuleSchema = createInsertSchema(courseModules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isApproved: true,
});

export const insertCourseScheduleSchema = createInsertSchema(courseSchedules).omit({
  id: true,
  createdAt: true,
});

export const insertStudentProgressSchema = createInsertSchema(studentProgress).omit({
  id: true,
  completedAt: true,
  lastAccessedAt: true,
});

export const insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  downloadCount: true,
  downloadedAt: true,
});

export const insertHelpTicketSchema = createInsertSchema(helpTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export const insertGroupMessageSchema = createInsertSchema(groupMessages).omit({
  id: true,
  createdAt: true,
});

export const insertGroupMemberSchema = createInsertSchema(groupMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertModuleTestSchema = createInsertSchema(moduleTests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  questions: z.array(z.object({
    question: z.string(),
    type: z.enum(["multiple_choice", "true_false", "short_answer"]),
    options: z.array(z.string()).optional(),
    correctAnswer: z.union([z.string(), z.array(z.string())]),
    points: z.number().min(0),
  })),
  passingScore: z.number().min(0).max(100),
  timeLimit: z.number().min(0).optional(),
  maxAttempts: z.number().min(1).default(3),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type InsertPermacultureInfo = z.infer<typeof insertPermacultureInfoSchema>;
export type PermacultureInfo = typeof permacultureInfo.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type CourseModule = typeof courseModules.$inferSelect;
export type InsertCourseModule = z.infer<typeof insertCourseModuleSchema>;
export type CourseSchedule = typeof courseSchedules.$inferSelect;
export type InsertCourseSchedule = z.infer<typeof insertCourseScheduleSchema>;
export type StudentProgress = typeof studentProgress.$inferSelect;
export type InsertStudentProgress = z.infer<typeof insertStudentProgressSchema>;
export type Download = typeof downloads.$inferSelect;
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type HelpTicket = typeof helpTickets.$inferSelect;
export type InsertHelpTicket = z.infer<typeof insertHelpTicketSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type GroupMessage = typeof groupMessages.$inferSelect;
export type InsertGroupMessage = z.infer<typeof insertGroupMessageSchema>;
export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertGroupMember = z.infer<typeof insertGroupMemberSchema>;
export type CourseAnalytics = typeof courseAnalytics.$inferSelect;
export type ModuleTest = typeof moduleTests.$inferSelect;
export type InsertModuleTest = z.infer<typeof insertModuleTestSchema>;
export type TestAttempt = typeof testAttempts.$inferSelect;