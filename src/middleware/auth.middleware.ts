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
    const tokens = [
      req.cookies?.adminAccessToken,
      req.cookies?.issuerAccessToken,
      req.cookies?.candidateAccessToken,
    ];

    let decoded: { userId: string; role: UserRole } | null = null;

    for (const token of tokens) {
      if (!token) continue;

      const result = verifyAccessToken(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as { userId: string; role: UserRole } | null;

      if (result) {
        decoded = result;
        break;
      }
    }

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid or missing token",
      });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};