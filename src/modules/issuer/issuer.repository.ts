import prisma from "../../db/db";

export const issuerRepository = {
  findByEmail: (email: string) =>
    prisma.issuer.findUnique({ where: { email } }),

  create: (data: any) => prisma.issuer.create({ data }),
};
