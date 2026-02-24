import { Response, NextFunction } from "express";
import { AuthRequest, UserRole } from "./auth.middleware";

export const roleMiddleware =
  (allowedRoles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }


    if (req.user.role === "admin") {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Insufficient role",
      });
    }

    next();
  };
