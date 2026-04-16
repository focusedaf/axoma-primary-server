import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "./notifications.controller";

const router = Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/:id/read", authMiddleware, markAsRead);
router.patch("/read-all", authMiddleware, markAllAsRead);

export default router;
