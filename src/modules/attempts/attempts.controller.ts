import { Response } from "express";
import * as attemptService from "./attempts.service";
import { AuthRequest } from "../../middleware/auth.middleware";
import { isCandidateAllowed } from "../exams/exams.service";
import prisma from "../../db/db";

export async function lockAttempt(req: AuthRequest, res: Response) {
  const { examId, fingerprint } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const candidateId = req.user.userId;

  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    select: { email: true },
  });

  if (!candidate) {
    return res.status(404).json({ message: "Candidate not found" });
  }

  const allowed = await isCandidateAllowed(examId, candidate.email);

  if (!allowed) {
    return res.status(403).json({
      message: "You are not allowed to take this exam",
    });
  }

  await attemptService.lockAttempt(examId, candidateId, fingerprint);

  res.json({ success: true });
}

export async function verifyLock(req: AuthRequest, res: Response) {
  const { examId, fingerprint } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const candidateId = req.user.userId;

  const valid = await attemptService.verifyAttempt(
    examId,
    candidateId,
    fingerprint,
  );

  if (!valid) {
    return res.status(403).json({ message: "Device mismatch" });
  }

  res.json({ success: true });
}

export async function submitExam(req: AuthRequest, res: Response) {
  const { examId, answers } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const candidateId = req.user.userId;

  await attemptService.submitAttempt(examId, candidateId, answers);

  res.json({ success: true });
}
