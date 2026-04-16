import { Router } from "express";
import { startAttempt, submitExam } from "./attempts.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const AttemptRouter = Router();

AttemptRouter.post(
  "/start",
  authMiddleware,
  roleMiddleware(["candidate"]),
  startAttempt,
);

AttemptRouter.post(
  "/submit",
  authMiddleware,
  roleMiddleware(["candidate"]),
  submitExam,
);

export default AttemptRouter;
