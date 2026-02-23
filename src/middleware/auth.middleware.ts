import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/helper";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = verifyAccessToken(token, process.env.ACCESS_TOKEN_SECRET!);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.user = {
    userId: decoded.userId,
    role: decoded.role,
  };

  next();
};