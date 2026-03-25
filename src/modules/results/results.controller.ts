import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getResult } from "./results.service";

export const getResultController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const candidateId = req.user.userId;
    const examId = req.params.examId as string;

    if (!examId) {
      return res.status(400).json({
        message: "Exam ID is required",
      });
    }

    const result = await getResult(examId, candidateId);

    if (!result) {
      return res.status(404).json({
        message: "Result not found",
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};
