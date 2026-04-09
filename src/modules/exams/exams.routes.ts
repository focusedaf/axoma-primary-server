import { Router } from "express";
import {
  getExam,
  getAllExams,
  createExam,
  saveDraft,
  getMyDrafts,
  getDraftById,
  getMyExams,
  markPublished,
  deleteDraft,
} from "./exams.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const ExamRouter = Router();


ExamRouter.get(
  "/drafts/me",
  authMiddleware,
  roleMiddleware(["professor", "institution", "recruiter"]),
  getMyDrafts,
);

ExamRouter.get(
  "/drafts/:id",
  authMiddleware,
  roleMiddleware(["professor", "institution", "recruiter"]),
  getDraftById,
);

ExamRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["professor", "institution"]),
  createExam,
);

ExamRouter.post(
  "/draft",
  authMiddleware,
  roleMiddleware(["professor", "institution"]),
  saveDraft,
);

ExamRouter.get(
  "/issuer",
  authMiddleware,
  roleMiddleware(["professor", "institution", "recruiter"]),
  getMyExams,
);

ExamRouter.post(
  "/:examId/mark-published",
  authMiddleware,
  roleMiddleware(["professor", "institution"]),
  markPublished,
);

ExamRouter.delete(
  "/drafts/:id",
  authMiddleware,
  roleMiddleware(["professor", "institution", "recruiter"]),
  deleteDraft,
);

/**
 * EXAMS (CANDIDATE)
 */
ExamRouter.get("/", authMiddleware, roleMiddleware(["candidate"]), getAllExams);
ExamRouter.get("/:id", authMiddleware, roleMiddleware(["candidate"]), getExam);

export default ExamRouter;
