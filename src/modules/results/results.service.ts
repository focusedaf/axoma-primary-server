import prisma from "../../db/db";
import { sendNotification } from "../../utils/notify";

type CreateResultInput = {
  examId: string;
  candidateId: string;
  score: number;
  answers: any;
};

export async function createResult(data: CreateResultInput) {
  const result = await prisma.result.create({
    data,
  });

  
  await sendNotification(
    data.candidateId,
    "submission",
    "Your exam has been submitted successfully",
  );

  return result;
}

export async function getResult(examId: string, candidateId: string) {
  return prisma.result.findFirst({
    where: {
      examId,
      candidateId,
    },
  });
}

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
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function gradeResult(resultId: string, score: number) {
  const updated = await prisma.result.update({
    where: { id: resultId },
    data: { score },
  });

  
  await sendNotification(
    updated.candidateId,
    "result",
    "Your exam has been graded",
  );

  return updated;
}
