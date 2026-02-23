import prisma from "../../db/db";

export const onboardingRepository = {
  // ISSUERS

  upsertInstitutionProfile: (userId: string, data: any) =>
    prisma.institutionProfile.upsert({
      where: { issuerId: userId },
      update: data,
      create: { ...data, issuerId: userId },
    }),

  upsertProfessorProfile: (userId: string, data: any) =>
    prisma.professorProfile.upsert({
      where: { issuerId: userId },
      update: data,
      create: { ...data, issuerId: userId },
    }),

  upsertRecruiterProfile: (userId: string, data: any) =>
    prisma.recruiterProfile.upsert({
      where: { issuerId: userId },
      update: data,
      create: { ...data, issuerId: userId },
    }),

  getInstitutionProfile: (userId: string) =>
    prisma.institutionProfile.findUnique({
      where: { issuerId: userId },
    }),

  getProfessorProfile: (userId: string) =>
    prisma.professorProfile.findUnique({
      where: { issuerId: userId },
    }),

  getRecruiterProfile: (userId: string) =>
    prisma.recruiterProfile.findUnique({
      where: { issuerId: userId },
    }),

  addIssuerDocuments: (userId: string, files: string[]) =>
    prisma.issuerDocument.createMany({
      data: files.map((url) => ({
        issuerId: userId,
        fileUrl: url,
        type: "docs",
      })),
    }),

  // CANDIDATE

  upsertCandidateProfile: (userId: string, data: any) =>
    prisma.candidateProfile.upsert({
      where: { candidateId: userId },
      update: data,
      create: { ...data, candidateId: userId },
    }),

  getCandidateProfile: (userId: string) =>
    prisma.candidateProfile.findUnique({
      where: { candidateId: userId },
    }),

  addCandidateDocuments: (userId: string, files: string[]) =>
    prisma.candidateDocument.createMany({
      data: files.map((url) => ({
        candidateId: userId,
        fileUrl: url,
        type: "docs",
      })),
    }),
};
