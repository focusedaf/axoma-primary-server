import prisma from "../../db/db";

export async function getAdminDashboard() {
  const [
    totalIssuers,
    pendingIssuers,
    approvedIssuers,
    suspendedIssuers,
    totalExams,
    totalAttempts,
    totalViolations,
  ] = await Promise.all([
    prisma.issuer.count(),
    prisma.issuer.count({ where: { status: "pending" } }),
    prisma.issuer.count({ where: { status: "approved" } }),
    prisma.issuer.count({ where: { status: "suspended" } }),
    prisma.exam.count(),
    prisma.attempt.count(),
    prisma.violation.count(),
  ]);

  const recentIssuers = await prisma.issuer.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return {
    stats: {
      totalIssuers,
      pendingIssuers,
      approvedIssuers,
      suspendedIssuers,
      totalExams,
      totalAttempts,
      totalViolations,
    },
    recentIssuers,
  };
}
