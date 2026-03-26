import { Router } from "express";
import { upload } from "../../middleware/multer.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";
import { uploadCandidatesController } from "./issuer.controller";

const IssuerRouter = Router();

IssuerRouter.post(
  "/exams/:examId/upload-candidates",
  authMiddleware,
  roleMiddleware(["professor", "institution", "recruiter"]),
  upload.single("file"),
  uploadCandidatesController,
);

export default IssuerRouter;
