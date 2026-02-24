import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/helper";

export type UserRole =
  | "admin"
  | "professor"
  | "institution"
  | "recruiter"
  | "candidate";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token",
      });
    }

    const decoded = verifyAccessToken(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as { userId: string; role: UserRole } | null;

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
  
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
