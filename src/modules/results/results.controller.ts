import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getResult, getResultsByExam, gradeResult } from "./results.service";

function normalizeParam(param: string | string[]): string {
  return Array.isArray(param) ? param[0] : param;
}

/**
 * Candidate → own result
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
    const examId = normalizeParam(req.params.examId);

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
 * Professor → all submissions
 */
export const getResultsByExamController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const examId = normalizeParam(req.params.examId);
    const issuerId = req.user!.userId;

    const results = await getResultsByExam(examId, issuerId);

    res.json(results);
  } catch (err) {
    next(err);
  }
};

/**
 * Professor → grade
 */
export const gradeResultController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const resultId = normalizeParam(req.params.resultId);
    const { score } = req.body;

    if (score === undefined) {
      return res.status(400).json({ message: "Score required" });
    }

    const updated = await gradeResult(resultId, score);

    res.json({ success: true, updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to grade result" });
  }
};
