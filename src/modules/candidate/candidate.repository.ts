import prisma from "../../db/db";

export const candidateRepository = {
  findByEmail: (email: string) =>
    prisma.candidate.findUnique({ where: { email } }),
  findById: (id: string) => prisma.candidate.findUnique({ where: { id } }),
  create: (data: any) => prisma.candidate.create({ data }),
};