import prisma from "../../db/db";

export async function logViolation(data: {
  examId: string;
  candidateId: string;
  type: string;
  severity: string;
  metadata?: any;
}) {
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
