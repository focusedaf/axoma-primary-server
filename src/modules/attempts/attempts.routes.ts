import { Router } from "express";
import { lockAttempt, verifyLock, submitExam } from "./attempts.controller";

const AttemptRouter = Router();

AttemptRouter.post("/lock-attempt", lockAttempt);
AttemptRouter.post("/verify-lock", verifyLock);
AttemptRouter.post("/submit", submitExam);

export default AttemptRouter;
