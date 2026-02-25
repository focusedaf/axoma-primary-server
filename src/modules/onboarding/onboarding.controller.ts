import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { onboardingService } from "./onboarding.core.service";
import { getOnboardingSchemaByRole } from "./onboarding.schema";
import connectCloudinary, { cloudinary } from "../../config/cloudinary/config";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

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
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0)
        return res.status(400).json({ message: "No files uploaded" });

      const urls: string[] = [];

      for (const file of files) {
        const result = await new Promise<UploadApiResponse>(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "issuer-docs",
                  upload_preset: "issuer_docs",
                  resource_type: "auto",
                },
                (error, result) => {
                  if (error) reject(error);
                  else if (result) resolve(result);
                  else reject(new Error("Unknown Cloudinary error"));
                },
              )
              .end(file.buffer);
          },
        );
        urls.push(result.secure_url);
      }

      await onboardingService.addDocuments(
        req.user.userId,
        req.user.role,
        urls,
      );

      return res.json({ message: "Documents uploaded", urls });
    } catch (error) {
      console.error("Onboarding upload error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
