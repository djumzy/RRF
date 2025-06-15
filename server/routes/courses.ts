import { Router } from "express";
import { storage } from "../storage";
import { insertCourseSchema, insertEnrollmentSchema } from "@shared/schema";
import { isAuthenticated, isAdmin, isInstructor } from "../middleware/auth";
import { ZodError } from "zod";

const router = Router();

// Get all public courses
router.get("/", async (req, res) => {
  try {
    const courses = await storage.getPublicCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get course by ID (only if public or user is enrolled/instructor)
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const course = await storage.getCourseById(parseInt(req.params.id));
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user has access
    const hasAccess = course.isPublic || 
                     course.instructorId === req.user?.id ||
                     await storage.isUserEnrolled(req.user!.id, course.id);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create new course (instructors only)
router.post("/", isAuthenticated, isInstructor, async (req, res) => {
  try {
    const validatedData = insertCourseSchema.parse(req.body);
    const course = await storage.createCourse({
      ...validatedData,
      instructorId: req.user!.id,
    });
    res.status(201).json(course);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update course (instructor can only update their own courses)
router.patch("/:id", isAuthenticated, isInstructor, async (req, res) => {
  try {
    const course = await storage.getCourseById(parseInt(req.params.id));
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructorId !== req.user!.id) {
      return res.status(403).json({ message: "You can only update your own courses" });
    }

    const updatedCourse = await storage.updateCourse(course.id, req.body);
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Approve course (admin only)
router.patch("/:id/approve", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const course = await storage.getCourseById(parseInt(req.params.id));
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updatedCourse = await storage.updateCourse(course.id, {
      isApproved: true,
      isPublic: true,
    });
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Enroll in course (students only)
router.post("/:id/enroll", isAuthenticated, async (req, res) => {
  try {
    if (req.user!.role !== "student") {
      return res.status(403).json({ message: "Only students can enroll in courses" });
    }

    const course = await storage.getCourseById(parseInt(req.params.id));
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.isPublic) {
      return res.status(403).json({ message: "This course is not available for enrollment" });
    }

    const enrollment = await storage.createEnrollment({
      courseId: course.id,
      studentId: req.user!.id,
    });
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get instructor's courses
router.get("/instructor/courses", isAuthenticated, isInstructor, async (req, res) => {
  try {
    const courses = await storage.getInstructorCourses(req.user!.id);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get student's enrolled courses
router.get("/student/enrollments", isAuthenticated, async (req, res) => {
  try {
    if (req.user!.role !== "student") {
      return res.status(403).json({ message: "Only students can view enrollments" });
    }
    const enrollments = await storage.getStudentEnrollments(req.user!.id);
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router; 