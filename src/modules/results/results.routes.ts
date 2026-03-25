import { Router } from "express";
import { getResultController } from "./results.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const ResultRouter = Router();

ResultRouter.get(
  "/:examId",
  authMiddleware,
  roleMiddleware(["candidate"]),
  getResultController,
);

export default ResultRouter;
