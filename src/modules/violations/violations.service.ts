import prisma from "../../db/db";
import { sendNotification } from "../../utils/notify";

export async function logViolation(data: {
  examId: string;
  candidateId: string;
  type: string;
  severity: string;
  metadata?: any;
}) {
  const exam = await prisma.exam.findUnique({
    where: { id: data.examId },
    select: { issuerId: true },
  });

  // notifications
  await sendNotification(
    data.candidateId,
    "violation",
    `Violation detected: ${data.type}`,
  );

  if (exam?.issuerId) {
    await sendNotification(
      exam.issuerId,
      "violation_alert",
      `Candidate violation: ${data.type}`,
    );
  }

  // SAVE violation
  return prisma.violation.create({
    data,
  });
}

export async function getExamViolations(examId: string, candidateId: string) {
  return prisma.violation.findMany({
    where: {
      examId,
      candidateId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAllViolations(candidateId: string) {
  return prisma.violation.findMany({
    where: {
      candidateId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getViolationsByExam(examId: string, issuerId: string) {
  return prisma.violation.findMany({
    where: {
      examId,
      exam: {
        issuerId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      candidate: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}
