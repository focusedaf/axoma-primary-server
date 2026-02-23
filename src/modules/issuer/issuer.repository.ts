import prisma from "../../db/db";

export const issuerRepository = {
  findByEmail: (email: string) =>
    prisma.issuer.findUnique({ where: { email } }),
  findById: (id: string) => prisma.issuer.findUnique({ where: { id } }),
  create: (data: any) => prisma.issuer.create({ data }),
};