import { Router } from "express";
import {
  getResultController,
  getResultsByExamController,
  gradeResultController,
} from "./results.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router();

/**
 * PROFESSOR → get all submissions
 */
router.get(
  "/exam/:examId",
  authMiddleware,
  roleMiddleware(["professor"]),
  getResultsByExamController,
);

/**
 * PROFESSOR → grade
 */
router.patch(
  "/:resultId/grade",
  authMiddleware,
  roleMiddleware(["professor"]),
  gradeResultController,
);

/**
 * CANDIDATE → own result
 */
router.get(
  "/:examId",
  authMiddleware,
  roleMiddleware(["candidate"]),
  getResultController,
);

export default router;
