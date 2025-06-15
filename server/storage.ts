import type { User, InsertUser, PermacultureInfo, InsertPermacultureInfo, Course, Enrollment, InsertCourse, InsertEnrollment } from "@shared/schema";
import { users, permacultureInfo, courses, enrollments } from "@shared/schema";
import { db } from "./db";
import { eq, or, ilike, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmailOrStudentId(identifier: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Permaculture info methods
  getAllPermacultureInfo(): Promise<PermacultureInfo[]>;
  getPermacultureInfoById(id: number): Promise<PermacultureInfo | undefined>;
  createPermacultureInfo(info: InsertPermacultureInfo): Promise<PermacultureInfo>;
  updatePermacultureInfo(id: number, info: Partial<InsertPermacultureInfo>): Promise<PermacultureInfo | undefined>;
  deletePermacultureInfo(id: number): Promise<boolean>;
  searchPermacultureInfo(query: string, category?: string): Promise<PermacultureInfo[]>;

  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: number, user: any): Promise<User>;
  deleteUser(id: number): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getUserByStudentId(studentId: string): Promise<User | undefined>;

  // Course methods
  createCourse(course: InsertCourse): Promise<Course>;
  getCourseById(id: number): Promise<Course | undefined>;
  getPublicCourses(): Promise<Course[]>;
  getInstructorCourses(instructorId: number): Promise<Course[]>;
  updateCourse(id: number, course: Partial<Course>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;

  // Enrollment methods
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getStudentEnrollments(studentId: number): Promise<Enrollment[]>;
  isUserEnrolled(userId: number, courseId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmailOrStudentId(identifier: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      or(
        eq(users.username, identifier),
        eq(users.studentId, identifier)
      )
    );
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Generate student ID
    const studentId = await this.generateStudentId();
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        studentId,
        role: "student", // Default role
      })
      .returning();
    return user;
  }

  private async generateStudentId(): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const userCount = await db.select().from(users);
    const nextId = userCount.length + 1;
    return `RRF${year}${nextId.toString().padStart(4, '0')}`;
  }

  async getAllPermacultureInfo(): Promise<PermacultureInfo[]> {
    return await db.select().from(permacultureInfo).orderBy(permacultureInfo.dateAdded);
  }

  async getPermacultureInfoById(id: number): Promise<PermacultureInfo | undefined> {
    const [info] = await db.select().from(permacultureInfo).where(eq(permacultureInfo.id, id));
    return info || undefined;
  }

  async createPermacultureInfo(insertInfo: InsertPermacultureInfo): Promise<PermacultureInfo> {
    const [info] = await db
      .insert(permacultureInfo)
      .values(insertInfo)
      .returning();
    return info;
  }

  async updatePermacultureInfo(id: number, updateInfo: Partial<InsertPermacultureInfo>): Promise<PermacultureInfo | undefined> {
    const [updated] = await db
      .update(permacultureInfo)
      .set(updateInfo)
      .where(eq(permacultureInfo.id, id))
      .returning();
    return updated || undefined;
  }

  async deletePermacultureInfo(id: number): Promise<boolean> {
    const result = await db
      .delete(permacultureInfo)
      .where(eq(permacultureInfo.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async searchPermacultureInfo(query: string, category?: string): Promise<PermacultureInfo[]> {
    let whereClause;
    
    if (query && category) {
      whereClause = and(
        or(
          ilike(permacultureInfo.title, `%${query}%`),
          ilike(permacultureInfo.description, `%${query}%`)
        ),
        eq(permacultureInfo.category, category)
      );
    } else if (query) {
      whereClause = or(
        ilike(permacultureInfo.title, `%${query}%`),
        ilike(permacultureInfo.description, `%${query}%`)
      );
    } else if (category) {
      whereClause = eq(permacultureInfo.category, category);
    }

    if (whereClause) {
      return await db.select().from(permacultureInfo).where(whereClause);
    }
    
    return await this.getAllPermacultureInfo();
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async updateUser(id: number, updateData: any): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db
      .delete(users)
      .where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    const users = await db.select().from(users);
    return users;
  }

  async getUserByStudentId(studentId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.studentId, studentId));
    return user;
  }

  // Course methods
  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getPublicCourses(): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.isPublic, true));
  }

  async getInstructorCourses(instructorId: number): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.instructorId, instructorId));
  }

  async updateCourse(id: number, course: Partial<Course>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set(course)
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Enrollment methods
  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async getStudentEnrollments(studentId: number): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.studentId, studentId));
  }

  async isUserEnrolled(userId: number, courseId: number): Promise<boolean> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, userId),
          eq(enrollments.courseId, courseId)
        )
      );
    return !!enrollment;
  }
}

export const storage = new DatabaseStorage();