import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPermacultureInfoSchema, insertUserSchema, loginSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPg from "connect-pg-simple";
import "./types/session";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all permaculture information
  app.get("/api/permaculture", async (req, res) => {
    try {
      const { search, category } = req.query;
      
      let result;
      if (search || category) {
        result = await storage.searchPermacultureInfo(
          search as string || "",
          category as string || undefined
        );
      } else {
        result = await storage.getAllPermacultureInfo();
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch permaculture information" });
    }
  });

  // Get single permaculture information by ID
  app.get("/api/permaculture/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const info = await storage.getPermacultureInfoById(id);
      
      if (!info) {
        return res.status(404).json({ message: "Information not found" });
      }
      
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch permaculture information" });
    }
  });

  // Create new permaculture information
  app.post("/api/permaculture", async (req, res) => {
    try {
      const validatedData = insertPermacultureInfoSchema.parse(req.body);
      const newInfo = await storage.createPermacultureInfo(validatedData);
      res.status(201).json(newInfo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid data provided", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create permaculture information" });
    }
  });

  // Update permaculture information
  app.put("/api/permaculture/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPermacultureInfoSchema.partial().parse(req.body);
      
      const updatedInfo = await storage.updatePermacultureInfo(id, validatedData);
      
      if (!updatedInfo) {
        return res.status(404).json({ message: "Information not found" });
      }
      
      res.json(updatedInfo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid data provided", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update permaculture information" });
    }
  });

  // Delete permaculture information
  app.delete("/api/permaculture/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePermacultureInfo(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Information not found" });
      }
      
      res.json({ message: "Information deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete permaculture information" });
    }
  });

  // Session middleware setup
  const pgStore = connectPg(session);
  app.use(session({
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Registration endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmailOrStudentId(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const newUser = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Create session
      req.session.userId = newUser.id;
      req.session.userRole = newUser.role;

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json({ 
        success: true, 
        user: userWithoutPassword,
        message: "Registration successful" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid data provided", 
          errors: error.errors 
        });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { identifier, password } = loginSchema.parse(req.body);
      
      // Find user by email or student ID
      const user = await storage.getUserByEmailOrStudentId(identifier);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password - handle both hashed and plain text passwords
      let isValidPassword = false;
      
      // Check if password is already hashed (starts with $2b$ for bcrypt)
      if (user.password.startsWith('$2b$')) {
        isValidPassword = await bcrypt.compare(password, user.password);
      } else {
        // Handle plain text passwords (for test users)
        isValidPassword = password === user.password;
      }
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create session
      req.session.userId = user.id;
      req.session.userRole = user.role;

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        success: true, 
        user: userWithoutPassword,
        message: "Login successful" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid data provided", 
          errors: error.errors 
        });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get current user endpoint
  app.get("/api/auth/user", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });

  // Protected routes for course management
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getPublicCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/instructor", requireAuth, async (req: any, res) => {
    try {
      const courses = await storage.getInstructorCourses(req.session.userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch instructor courses" });
    }
  });

  app.get("/api/enrollments", requireAuth, async (req: any, res) => {
    try {
      const enrollments = await storage.getStudentEnrollments(req.session.userId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}