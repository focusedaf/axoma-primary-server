import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  logViolation,
  getExamViolations,
  getAllViolations,
  getViolationsByExam as getViolationsByExamService,
} from "./violations.service";

function normalizeParam(param: string | string[]): string {
  if (Array.isArray(param)) return param[0];
  return param;
}
/**
 * Candidate → create violation
 */
export const createViolations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let candidateId: string;

    if (req.headers["x-service-token"] === process.env.SERVICE_TOKEN) {
      candidateId = req.body.candidateId;
    } else {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      candidateId = req.user.userId;
    }

    const { examId, type, severity, metadata } = req.body;

    await logViolation({
      examId,
      candidateId,
      type,
      severity,
      metadata,
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

/**
 * Candidate → own violations (per exam)
 */
export const getExamViolation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const examId = normalizeParam(req.params.examId);

    const data = await getExamViolations(examId, req.user.userId);

    res.json(data);
  } catch (err) {
    next(err);
  }
};
/**
 * Candidate → all violations
 */
export const getAllViolation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const data = await getAllViolations(req.user.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * Issuer → violations by exam
 */
export const getViolationsByExam = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const examId = normalizeParam(req.params.examId);

    const data = await getViolationsByExamService(examId, req.user.userId);

    res.json(data);
  } catch (err) {
    next(err);
  }
};
