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

/**
 * ISSUER (professor, institution, recruiter)
 */

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
  roleMiddleware(["professor", "institution", "recruiter"]),
  createExam,
);

ExamRouter.post(
  "/draft",
  authMiddleware,
  roleMiddleware(["professor", "institution", "recruiter"]),
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
  roleMiddleware(["professor", "institution", "recruiter"]),
  markPublished,
);

ExamRouter.delete(
  "/drafts/:id",
  authMiddleware,
  roleMiddleware(["professor", "institution", "recruiter"]),
  deleteDraft,
);

/**
 * CANDIDATE
 */

ExamRouter.get("/", authMiddleware, roleMiddleware(["candidate"]), getAllExams);

ExamRouter.get("/:id", authMiddleware, roleMiddleware(["candidate"]), getExam);

export default ExamRouter;
