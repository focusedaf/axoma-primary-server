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
  await syncExamStatuses();

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
      duration: true,
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
  const exams = await prisma.exam.findMany({
    where: {
      issuerId,
      status: {
        not: "Draft",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      attempts: {
        select: {
          status: true,
        },
      },
    },
  });

  return exams.map((exam) => ({
    id: exam.id,
    title: exam.title,
    scheduledOn: exam.scheduledOn,
    status: exam.status,
    published: exam.published,
    submissions: {
      submitted: exam.attempts.filter((a) => a.status === "submitted").length,
      total: exam.attempts.length,
    },
  }));
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

export async function syncExamStatuses() {
  const now = new Date();

  const exams = await prisma.exam.findMany({
    where: {
      status: {
        not: "Draft",
      },
    },
  });

  for (const exam of exams) {
    if (!exam.scheduledOn) continue;

    const start = new Date(exam.scheduledOn);
    const end = new Date(start.getTime() + exam.duration * 60000);

    let newStatus: string;

    if (now < start) newStatus = "Upcoming";
    else if (now >= start && now <= end) newStatus = "Live";
    else newStatus = "Closed";

    if (exam.status !== newStatus) {
      await prisma.exam.update({
        where: { id: exam.id },
        data: { status: newStatus },
      });
    }
  }
}