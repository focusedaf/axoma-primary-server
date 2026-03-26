import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getCandidateDashboard } from "./candidate-dashboard.service";
import { getProfessorDashboard } from "./issuer-dashboard.service";
import { getAdminDashboard } from "./admin-dashboard.service";

export const getDashboardController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.userId;
    const role = req.user.role;

    if (role === "admin") {
      const data = await getAdminDashboard();
      return res.json(data);
    }
    
    if (role === "candidate") {
      const data = await getCandidateDashboard(userId);
      return res.json(data);
    }

    if (role === "professor") {
      const data = await getProfessorDashboard(userId);
      return res.json(data);
    }

    return res.status(403).json({ message: "Invalid role" });
  } catch (err) {
    next(err);
  }
};
