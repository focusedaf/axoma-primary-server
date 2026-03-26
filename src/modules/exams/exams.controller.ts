import { Request, Response } from "express";
import * as examService from "./exams.service";

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
    console.error("Get all exams error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createExam(req: Request, res: Response) {
  try {
    const { title, duration, scheduledOn, cid } = req.body;

    if (!cid) {
      return res.status(400).json({ message: "CID required" });
    }

    const exam = await examService.createExam({
      title,
      duration,
      scheduledOn,
      cid,
      issuerId: (req as any).user.userId,
    });

    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function saveDraft(req: Request, res: Response) {
  try {
    const exam = await examService.saveDraftExam({
      ...req.body,
      issuerId: (req as any).user.userId,
    });

    res.status(201).json(exam);
  } catch {
    res.status(500).json({ message: "Failed to save draft" });
  }
}
