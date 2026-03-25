import { Router } from "express";
import { getDashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const DashboardRouter = Router();

DashboardRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["candidate"]),
  getDashboardController,
);

export default DashboardRouter;
