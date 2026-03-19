import { Router } from "express";
import { getExam } from "./exams.controller";
import { AuthRequest } from "../../middleware/auth.middleware";
const ExamRouter = Router();

ExamRouter.get("/:id", getExam);

export default ExamRouter;
