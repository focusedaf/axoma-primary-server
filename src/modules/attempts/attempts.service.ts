import prisma from "../../db/db";
import { createResult } from "../results/results.service";

export async function startAttempt(examId: string, candidateId: string) {
  const existing = await prisma.attempt.findFirst({
    where: {
      examId,
      candidateId,
      status: "in_progress",
    },
  });

  if (existing) return existing;

  return prisma.attempt.create({
    data: {
      examId,
      candidateId,
      status: "in_progress",
    },
  });
}

export async function submitAttempt(
  examId: string,
  candidateId: string,
  answers: any,
) {
  const attempt = await prisma.attempt.findFirst({
    where: {
      examId,
      candidateId,
      status: "in_progress",
    },
  });

  if (!attempt) {
    throw new Error("No active attempt found");
  }

  return prisma.$transaction(async (tx) => {
  
    await createResult({
      examId,
      candidateId,
      answers,
      score: 0,
    });

    await tx.attempt.update({
      where: { id: attempt.id },
      data: {
        status: "submitted",
        submittedAt: new Date(),
      },
    });
  });
}
