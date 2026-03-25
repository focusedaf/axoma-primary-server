import prisma from "../../db/db";

export async function getCandidateDashboard(candidateId: string) {
  const attempts = await prisma.attempt.findMany({
    where: { candidateId },
    include: {
      exam: {
        include: {
          results: {
            where: { candidateId },
            select: { score: true },
          },
        },
      },
    },
    orderBy: {
      startedAt: "desc",
    },
  });

  return attempts.map((a) => ({
    examId: a.examId,
    title: a.exam.title,
    duration: a.exam.duration,
    status: a.status,
    submittedAt: a.submittedAt,
    score: a.exam.results[0]?.score ?? null,
  }));
}
