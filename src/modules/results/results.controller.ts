import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getResult, getResultsByExam } from "./results.service";

/**
 *  Candidate → own result
 */
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

    const result = await getResult(examId, candidateId);

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Issuer → all results of exam
 */
export const getResultsByExamController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const examId = req.params.examId as string;

    const results = await getResultsByExam(examId, req.user.userId);

    res.json(results);
  } catch (err) {
    next(err);
  }
};
