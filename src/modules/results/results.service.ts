import prisma from "../../db/db";

/**
 * Candidate result
 */
export async function getResult(examId: string, candidateId: string) {
  return prisma.result.findFirst({
    where: {
      examId,
      candidateId,
    },
  });
}

/**
 * Issuer: get all results for an exam
 */
export async function getResultsByExam(examId: string, issuerId: string) {
  return prisma.result.findMany({
    where: {
      examId,
      exam: {
        issuerId,
      },
    },
    include: {
      candidate: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
