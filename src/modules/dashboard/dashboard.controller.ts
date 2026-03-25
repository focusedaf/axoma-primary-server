import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getCandidateDashboard } from "./candidate-dashboard.service";

export const getDashboardController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const candidateId = req.user.userId;

    const data = await getCandidateDashboard(candidateId);

    res.json(data);
  } catch (err) {
    next(err);
  }
};
