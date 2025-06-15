import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { USER_ROLES } from "@shared/constants";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const hasRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

// Role-specific middleware
export const isAdmin = hasRole([USER_ROLES.ADMIN]);
export const isInstructor = hasRole([USER_ROLES.ADMIN, USER_ROLES.INSTRUCTOR]);
export const isStudent = hasRole([USER_ROLES.ADMIN, USER_ROLES.INSTRUCTOR, USER_ROLES.STUDENT]); 