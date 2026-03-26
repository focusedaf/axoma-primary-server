import { Request, Response } from "express";
import * as examService from "./exams.service";
import { uploadExamToIPFS } from "./ipfs.service";
import { AuthRequest } from "../../middleware/auth.middleware";

export async function getExam(req: Request, res: Response) {
  const id = req.params.id as string;

  const exam = await examService.getExamById(id);

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  res.json(exam);
}

export async function getAllExams(req: Request, res: Response) {
  try {
    const exams = await examService.getAllExams();
    res.json(exams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createExam(req: AuthRequest, res: Response) {
  try {
    const { title, duration, scheduledOn, questions, draftId } = req.body;

    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cid = await uploadExamToIPFS({
      title,
      duration,
      scheduledOn,
      questions,
    });

    const exam = await examService.createExam({
      title,
      duration: Number(duration),
      scheduledOn,
      cid,
      issuerId: req.user.userId,
    });

    /**
     * DELETE DRAFT AFTER PUBLISH
     */
    if (draftId) {
      await examService.deleteDraft(draftId, req.user.userId);
    }

    res.status(201).json({
      ...exam,
      cid,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * FINAL DRAFT SAVE (SAFE UPDATE)
 */
export async function saveDraft(req: AuthRequest, res: Response) {
  try {
    const {
      id,
      title,
      duration,
      scheduledOn,
      instructions,
      questions,
      examType,
    } = req.body;

    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const exam = await examService.saveDraftExam({
      id,
      title,
      duration: duration ? Number(duration) : undefined,
      scheduledOn,
      instructions,
      issuerId: req.user.userId,
      questions,
      examType,
    });

    res.status(200).json(exam);
  } catch (err) {
    console.error("SAVE DRAFT ERROR:", err);
    res.status(500).json({ message: "Failed to save draft" });
  }
}

export async function getMyDrafts(req: AuthRequest, res: Response) {
  try {
    const drafts = await examService.getDraftsByIssuer(req.user!.userId);
    res.json(drafts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch drafts" });
  }
}

export async function getDraftById(req: AuthRequest, res: Response) {
  try {
    const rawId = req.params.id;

    // FIX: normalize to string
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      return res.status(400).json({ message: "Invalid draft id" });
    }

    const draft = await examService.getDraftById(id, req.user!.userId);

    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    res.json(draft);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch draft" });
  }
}

export async function getMyExams(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const exams = await examService.getExamsByIssuer(req.user.userId);

    res.json(exams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exams" });
  }
}

