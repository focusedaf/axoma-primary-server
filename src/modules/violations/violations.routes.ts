import { Router } from "express";
import {
  createViolations,
  getExamViolation,
  getAllViolation,
  getViolationsByExam,
} from "./violations.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const ViolationRouter = Router();

/**
 * Candidate → create violation
 */
ViolationRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["candidate"]),
  createViolations,
);

/**
 * Candidate → all violations
 */
ViolationRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["candidate"]),
  getAllViolation,
);

/**
 * Candidate → exam-specific
 */
ViolationRouter.get(
  "/:examId",
  authMiddleware,
  roleMiddleware(["candidate"]),
  getExamViolation,
);

/**
 * Issuer → exam violations FIXED
 */
ViolationRouter.get(
  "/exam/:examId",
  authMiddleware,
  roleMiddleware(["professor", "institution", "recruiter"]),
  getViolationsByExam,
);

export default ViolationRouter;
