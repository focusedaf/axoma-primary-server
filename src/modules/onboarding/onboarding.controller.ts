import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { onboardingService } from "./onboarding.core.service";
import { getOnboardingSchemaByRole } from "./onboarding.schema";

export const onboardingController = {
  async upsertProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const schema = getOnboardingSchemaByRole(req.user.role);

      const parsed = schema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          message: "Validation failed",
          errors: parsed.error.flatten(),
        });
        return;
      }

      const profile = await onboardingService.upsertProfile(
        req.user.userId,
        req.user.role,
        parsed.data,
      );

      res.json({ profile });
    } catch (error) {
      console.error("Onboarding upsert error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const profile = await onboardingService.getProfile(
        req.user.userId,
        req.user.role,
      );

      res.json({ profile });
    } catch (error) {
      console.error("Onboarding get profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async addDocuments(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (!req.files) {
        res.status(400).json({ message: "No files uploaded" });
        return;
      }

      const files = req.files as Express.Multer.File[];

      if (!files.length) {
        res.status(400).json({ message: "No files uploaded" });
        return;
      }

      const fileUrls = files.map((file: Express.Multer.File) => file.path);

      await onboardingService.addDocuments(
        req.user.userId,
        req.user.role,
        fileUrls,
      );

      res.json({ message: "Documents uploaded" });
    } catch (error) {
      console.error("Onboarding upload error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
