import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    
    if (typeof decoded === "object" && "sub" in decoded) {
      req.userId = decoded.sub as string;
      req.user = decoded;
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const optionalAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      
      if (typeof decoded === "object" && "sub" in decoded) {
        req.userId = decoded.sub as string;
        req.user = decoded;
      }
    }
    next();
  } catch (error) {
    next();
  }
};
