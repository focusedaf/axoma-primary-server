import { Router } from "express";
import {
  getExam,
  getAllExams,
  createExam,
  saveDraft,
} from "./exams.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const ExamRouter = Router();

ExamRouter.get("/", authMiddleware, roleMiddleware(["candidate"]), getAllExams);

ExamRouter.get("/:id", authMiddleware, roleMiddleware(["candidate"]), getExam);

ExamRouter.post("/", authMiddleware, roleMiddleware(["professor"]), createExam);

ExamRouter.post(
  "/draft",
  authMiddleware,
  roleMiddleware(["professor", "institution"]),
  saveDraft,
);

export default ExamRouter;
