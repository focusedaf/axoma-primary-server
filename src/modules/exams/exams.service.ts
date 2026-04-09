import prisma from "../../db/db";

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
      scheduledOn: data.scheduledOn ? new Date(data.scheduledOn) : null,
    },
  });
}

export async function saveDraftExam(data: {
  id?: string;
  title?: string;
  duration?: number;
  scheduledOn?: string;
  instructions?: string;
  issuerId: string;
  questions?: any;
  examType?: string;
}) {
  const updateData: any = {
    title: data.title ?? "Untitled Draft",
    duration: data.duration ?? 0,
    instructions: data.instructions ?? "",
    examType: data.examType ?? "mcq",
    status: "Draft",
    questions: data.questions ?? [],
    scheduledOnDraft: data.scheduledOn ?? null,
  };

  if (data.id) {
    await prisma.exam.updateMany({
      where: {
        id: data.id,
        issuerId: data.issuerId,
        status: "Draft",
      },
      data: updateData,
    });

    return prisma.exam.findUnique({
      where: { id: data.id },
    });
  }

  return prisma.exam.create({
    data: {
      ...updateData,
      cid: "DRAFT",
      issuerId: data.issuerId,
    },
  });
}

export async function getDraftsByIssuer(issuerId: string) {
  return prisma.exam.findMany({
    where: {
      issuerId,
      status: "Draft",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getDraftById(id: string, issuerId: string) {
  return prisma.exam.findFirst({
    where: {
      id,
      issuerId,
      status: "Draft",
    },
  });
}

export async function getExamsByIssuer(issuerId: string) {
  return prisma.exam.findMany({
    where: {
      issuerId,
      status: {
        not: "Draft",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      scheduledOn: true,
      status: true,
      published: true,
    },
  });
}

export async function deleteDraft(id: string, issuerId: string) {
  return prisma.exam.deleteMany({
    where: {
      id,
      issuerId,
      status: "Draft",
    },
  });
}
