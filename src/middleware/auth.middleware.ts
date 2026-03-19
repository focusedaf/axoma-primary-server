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
  console.log("COOKIES:", req.cookies);
  try {
    let token: string | undefined;

    if (req.cookies?.adminAccessToken) {
      token = req.cookies.adminAccessToken;
    } else if (req.cookies?.issuerAccessToken) {
      token = req.cookies.issuerAccessToken;
    } else if (req.cookies?.candidateAccessToken) {
      token = req.cookies.candidateAccessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token",
      });
    }
    console.log("TOKEN:", token);
    const decoded = verifyAccessToken(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as { userId: string; role: UserRole } | null;

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    }
    console.log("DECODED:", decoded);
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
