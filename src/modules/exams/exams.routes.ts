import { Router } from "express";
import { getExam, getAllExams } from "./exams.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const ExamRouter = Router();

ExamRouter.get("/", authMiddleware, roleMiddleware(["candidate"]), getAllExams);

ExamRouter.get("/:id", authMiddleware, roleMiddleware(["candidate"]), getExam);

export default ExamRouter;
