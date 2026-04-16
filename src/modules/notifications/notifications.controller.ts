import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  getMyNotifications,
  markedAsRead,
  markedAllAsRead,
} from "./notifications.service";

function normalizeParam(param: string | string[]): string {
  return Array.isArray(param) ? param[0] : param;
}

/**
 * GET /notifications
 */
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notifications = await getMyNotifications(req.user.userId);

    return res.json(notifications);
  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/**
 * PATCH /notifications/:id/read
 */
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = normalizeParam(req.params.id);

    const notif = await markedAsRead(id);

    return res.json(notif);
  } catch (err) {
    console.error("MARK READ ERROR:", err);
    return res.status(500).json({ message: "Failed to mark as read" });
  }
};

/**
 * PATCH /notifications/read-all
 */
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await markedAllAsRead(req.user.userId);

    return res.json({ success: true });
  } catch (err) {
    console.error("MARK ALL READ ERROR:", err);
    return res.status(500).json({ message: "Failed to mark all as read" });
  }
};
