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
  courseType: text("course_type"), // Made optional
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
  identifier: z.string().min(1, "Username or Student ID is required"),
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
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
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