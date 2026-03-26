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
    const token =
      req.cookies?.adminAccessToken ||
      req.cookies?.issuerAccessToken ||
      req.cookies?.candidateAccessToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = verifyAccessToken(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as { userId: string; role: UserRole };

    if (!decoded?.userId || !decoded?.role) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ message: "Authentication failed" });
  }
};
