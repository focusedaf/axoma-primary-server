import { Router } from "express";
import {
  getResultController,
  getResultsByExamController,
} from "./results.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const ResultRouter = Router();

/**
 *  Issuer → ALL results of exam
 * FIXES YOUR 404 ERROR
 */
ResultRouter.get(
  "/exam/:examId",
  authMiddleware,
  roleMiddleware(["professor", "institution", "recruiter"]),
  getResultsByExamController,
);

/**
 *  Candidate → own result
 */
ResultRouter.get(
  "/:examId",
  authMiddleware,
  roleMiddleware(["candidate"]),
  getResultController,
);

export default ResultRouter;
