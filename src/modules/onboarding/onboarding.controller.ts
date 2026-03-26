import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { onboardingService } from "./onboarding.core.service";
import { getOnboardingSchemaByRole } from "./onboarding.schema";
import connectCloudinary, { cloudinary } from "../../config/cloudinary/config";
import { UploadApiResponse } from "cloudinary";

connectCloudinary();

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

  async addDocuments(req: AuthRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadPromises = files.map((file) => {
        return new Promise<UploadApiResponse>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder:
                  req.user?.role === "candidate"
                    ? "candidate-docs"
                    : "issuer-docs",
                resource_type: "auto",
              },
              (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Upload failed"));
                resolve(result);
              },
            )
            .end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);
      const urls = results.map((r) => r.secure_url);

      const docs = await onboardingService.addDocuments(
        req.user.userId,
        req.user.role,
        urls,
      );

      return res.status(200).json({
        message: "Documents uploaded",
        urls,
        docs,
      });
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      return res.status(500).json({
        message: "Upload failed",
        error: (error as Error).message,
      });
    }
  },
};
