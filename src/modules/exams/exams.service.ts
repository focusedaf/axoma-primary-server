import prisma from "../../db/db";

export async function getExamById(examId: string) {
  return prisma.exam.findUnique({
    where: { id: examId },
    select: {
      id: true,
      title: true,
      duration: true,
      cid: true,
    },
  });
}

export async function isCandidateAllowed(examId: string, email: string) {
  const record = await prisma.examCandidate.findFirst({
    where: {
      examId,
      email,
      allowed: true,
    },
  });

  return !!record;
}
