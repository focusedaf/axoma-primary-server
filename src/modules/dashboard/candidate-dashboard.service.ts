import prisma from "../../db/db";

export async function getCandidateDashboard(candidateId: string) {
  const attempts = await prisma.attempt.findMany({
    where: { candidateId },
    include: {
      exam: true,
    },
  });

  return attempts.map((a) => ({
    examId: a.examId,
    title: a.exam.title,
    status: a.status,
  }));
}
