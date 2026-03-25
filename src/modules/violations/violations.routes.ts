import { Router } from "express";
import {
  createViolationController,
  getExamViolationsController,
  getAllViolationsController,
} from "./violations.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const ViolationRouter = Router();

ViolationRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["candidate"]),
  createViolationController,
);


ViolationRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["candidate"]),
  getAllViolationsController,
);


ViolationRouter.get(
  "/:examId",
  authMiddleware,
  roleMiddleware(["candidate"]),
  getExamViolationsController,
);

export default ViolationRouter;
