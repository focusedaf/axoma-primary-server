import prisma from "../../db/db";
import { validateIssuer } from "../issuer/issuer.core.service";

export async function getProfessorDashboard(issuerId: string) {
  await validateIssuer(issuerId);

  const [totalExams, totalAttempts, totalViolations] = await Promise.all([
    prisma.exam.count({
      where: { issuerId },
    }),

    prisma.attempt.count({
      where: {
        exam: { issuerId },
      },
    }),

    prisma.violation.count({
      where: {
        exam: { issuerId },
      },
    }),
  ]);

  const recentExams = await prisma.exam.findMany({
    where: { issuerId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      createdAt: true,
      status: true,
    },
  });

  return {
    stats: {
      totalExams,
      totalAttempts,
      totalViolations,
    },
    recentExams,
  };
}
