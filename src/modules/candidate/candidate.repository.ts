import prisma from "../../db/db";

export const candidateRepository = {
  findByEmail: (email: string) =>
    prisma.candidate.findUnique({ where: { email } }),

  create: (data: any) => prisma.candidate.create({ data }),
};
