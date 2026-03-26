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

export async function getAllExams() {
  return prisma.exam.findMany({
    where: {
      status: {
        in: ["Live", "Upcoming"],
      },
    },
    select: {
      id: true,
      title: true,
      scheduledOn: true,
      status: true,
    },
  });
}

export async function getExamsByIssuer(issuerId: string) {
  return prisma.exam.findMany({
    where: { issuerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createExam(data: {
  title: string;
  duration: number;
  scheduledOn: string;
  cid: string;
  issuerId: string;
}) {
  return prisma.exam.create({
    data: {
      title: data.title,
      duration: data.duration,
      cid: data.cid,
      issuerId: data.issuerId,
      status: "Upcoming",
      scheduledOn: new Date(data.scheduledOn),
    },
  });
}

export async function saveDraftExam(data: {
  title?: string;
  duration?: number;
  scheduledOn?: string;
  issuerId: string;
}) {
  return prisma.exam.create({
    data: {
      title: data.title || "Untitled Draft",
      duration: data.duration || 0,
      cid: "DRAFT", 
      issuerId: data.issuerId,
      status: "Draft",
      scheduledOn: data.scheduledOn ? new Date(data.scheduledOn) : new Date(),
    },
  });
}