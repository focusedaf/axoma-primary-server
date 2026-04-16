import { Request, Response } from "express";
import prisma from "../../db/db";
import * as examService from "./exams.service";
import { uploadExamToIPFS } from "./ipfs.service";
import { AuthRequest } from "../../middleware/auth.middleware";
import { sendNotification } from "../../utils/notify";

function normalizeParam(param: string | string[]): string {
  if (Array.isArray(param)) return param[0];
  return param;
}

/**
 * 🔒 INLINE GUARD — ISSUER MUST BE APPROVED
 */
async function assertIssuerVerified(issuerId: string) {
  const issuer = await prisma.issuer.findUnique({
    where: { id: issuerId },
    select: { status: true },
  });

  if (!issuer) {
    const err: any = new Error("Issuer not found");
    err.status = 404;
    throw err;
  }

  if (issuer.status !== "approved") {
    const err: any = new Error("Issuer not verified");
    err.status = 403;
    throw err;
  }
}

/* =========================
   GET EXAM
========================= */
export async function getExam(req: Request, res: Response) {
  try {
    const id = normalizeParam(req.params.id);
    const exam = await examService.getExamById(id);

    if (!exam) return res.status(404).json({ message: "Exam not found" });

    res.json(exam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* =========================
   GET ALL EXAMS (CANDIDATE)
========================= */
export async function getAllExams(req: Request, res: Response) {
  try {
    const exams = await examService.getAllExams();
    res.json(exams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* =========================
   CREATE EXAM (ISSUER ONLY VERIFIED)
========================= */
export async function createExam(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.userId)
      return res.status(401).json({ message: "Unauthorized" });

    // 🔒 BLOCK UNVERIFIED ISSUERS
    await assertIssuerVerified(req.user.userId);

    const {
      title,
      duration,
      scheduledOn,
      questions,
      instructions,
      examType,
      draftId,
    } = req.body;

    const cid = await uploadExamToIPFS({
      title,
      duration,
      scheduledOn,
      instructions,
      examType,
      questions,
    });

    const exam = await examService.createExam({
      title,
      duration: Number(duration),
      scheduledOn,
      cid,
      issuerId: req.user.userId,
    });

    if (draftId) {
      await examService.deleteDraft(draftId, req.user.userId);
    }

    return res.status(201).json({ ...exam, cid });
  } catch (err: any) {
    console.error(err);

    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
}

/* =========================
   SAVE DRAFT
========================= */
export async function saveDraft(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.userId)
      return res.status(401).json({ message: "Unauthorized" });

    const {
      id,
      title,
      duration,
      scheduledOn,
      instructions,
      questions,
      examType,
    } = req.body;

    const draft = await examService.saveDraftExam({
      id,
      title,
      duration: duration ? Number(duration) : undefined,
      scheduledOn,
      instructions,
      issuerId: req.user.userId,
      questions,
      examType,
    });

    res.status(200).json(draft);
  } catch (err) {
    console.error("SAVE DRAFT ERROR:", err);
    res.status(500).json({ message: "Failed to save draft" });
  }
}

/* =========================
   GET DRAFT BY ID
========================= */
export async function getDraftById(req: AuthRequest, res: Response) {
  try {
    const id = normalizeParam(req.params.id);

    if (!id) return res.status(400).json({ message: "Invalid draft id" });

    const draft = await examService.getDraftById(id, req.user!.userId);

    if (!draft) return res.status(404).json({ message: "Draft not found" });

    res.json(draft);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch draft" });
  }
}

/* =========================
   GET MY DRAFTS
========================= */
export async function getMyDrafts(req: AuthRequest, res: Response) {
  try {
    const drafts = await examService.getDraftsByIssuer(req.user!.userId);
    res.json(drafts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch drafts" });
  }
}

/* =========================
   DELETE DRAFT
========================= */
export async function deleteDraft(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.userId)
      return res.status(401).json({ message: "Unauthorized" });

    const id = normalizeParam(req.params.id);

    await examService.deleteDraft(id, req.user.userId);

    res.json({ message: "Draft deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete draft" });
  }
}

/* =========================
   GET MY EXAMS
========================= */
export async function getMyExams(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.userId)
      return res.status(401).json({ message: "Unauthorized" });

    const exams = await examService.getExamsByIssuer(req.user.userId);
    res.json(exams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exams" });
  }
}

/* =========================
   MARK PUBLISHED (ISSUER VERIFIED ONLY)
========================= */
export async function markPublished(req: AuthRequest, res: Response) {
  try {
    const issuerId = req.user?.userId;

    if (!issuerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔒 BLOCK UNVERIFIED ISSUERS
    await assertIssuerVerified(issuerId);

    const examId = normalizeParam(req.params.examId);
    const { txHash, publishedAt } = req.body;

    const exam = await prisma.exam.update({
      where: { id: examId },
      data: {
        txHash,
        publishedAt: new Date(publishedAt),
        status: "Upcoming",
        published: true,
      },
      include: {
        candidates: true,
      },
    });

    for (const c of exam.candidates) {
      if (c.candidateId) {
        await sendNotification(
          c.candidateId,
          "exam_published",
          `New exam "${exam.title}" is available`,
        );
      }
    }

    res.json(exam);
  } catch (err: any) {
    console.error(err);

    res.status(err.status || 500).json({
      message: err.message || "Failed to mark as published",
    });
  }
}
