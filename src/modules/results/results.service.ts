import prisma from "../../db/db";

export async function getResult(examId: string, candidateId: string) {
  return prisma.result.findFirst({
    where: { examId, candidateId },
  });
}
