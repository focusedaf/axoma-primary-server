import prisma from "../../db/db";

export async function lockAttempt(
  examId: string,
  candidateId: string,
  fingerprint: string,
) {
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
      fingerprint,
      status: "in_progress",
    },
  });
}

export async function verifyAttempt(
  examId: string,
  candidateId: string,
  fingerprint: string,
) {
  const attempt = await prisma.attempt.findFirst({
    where: {
      examId,
      candidateId,
      status: "in_progress",
    },
  });

  if (!attempt) return false;

  return attempt.fingerprint === fingerprint;
}

export async function submitAttempt(
  examId: string,
  candidateId: string,
  answers: any,
) {
  return prisma.$transaction([
    prisma.result.create({
      data: {
        examId,
        candidateId,
        answers,
        score: 0, // compute later
      },
    }),
    prisma.attempt.updateMany({
      where: { examId, candidateId },
      data: {
        status: "submitted",
        submittedAt: new Date(),
      },
    }),
  ]);
}
