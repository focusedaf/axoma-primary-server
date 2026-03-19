import prisma from "../../db/db";

export async function logViolation(data: any) {
  return prisma.violation.create({ data });
}

export async function getExamViolations(examId: string, candidateId: string) {
  return prisma.violation.findMany({
    where: { examId, candidateId },
    orderBy: { createdAt: "desc" },
  });
}
