import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  logViolation,
  getExamViolations,
  getAllViolations,
} from "./violations.service";

export const createViolationController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const candidateId = req.user.userId;

    const { examId, type, severity, metadata } = req.body;

    if (!examId || !type || !severity) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

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

export const getExamViolationsController = async (
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

    const data = await getExamViolations(examId, candidateId);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getAllViolationsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const candidateId = req.user.userId;

    const data = await getAllViolations(candidateId);

    res.json(data);
  } catch (err) {
    next(err);
  }
};
