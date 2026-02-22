import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const roleMiddleware =
  (allowedRoles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
