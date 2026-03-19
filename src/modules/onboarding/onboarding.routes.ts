import { Router } from "express";
import { onboardingController } from "./onboarding.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/multer.middleware";

const OnboardingRouter = Router();
OnboardingRouter.post(
  "/profile",
  authMiddleware,
  onboardingController.upsertProfile,
);

OnboardingRouter.get(
  "/profile",
  authMiddleware,
  onboardingController.getProfile,
);

OnboardingRouter.post(
  "/documents",
  authMiddleware,
  upload.array("documents", 5),
  onboardingController.addDocuments,
);

export default OnboardingRouter;
