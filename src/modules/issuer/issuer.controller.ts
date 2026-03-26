import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { uploadCandidatesCSV } from "./issuer.core.service";

export const uploadCandidatesController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const examId = req.params.examId as string;

    if (!req.file) {
      return res.status(400).json({ message: "CSV required" });
    }

    const result = await uploadCandidatesCSV(
      req.user.userId,
      examId,
      req.file.buffer,
    );

    return res.json({
      success: true,
      message: "Uploaded successfully",
      count: (result as any).count,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: err.message || "Upload failed",
    });
  }
};