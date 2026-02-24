import prisma from "../../db/db";
import { IssuerStatus } from "../../db/generated/prisma";

export const adminRepository = {
  findByEmail: (email: string) =>
    prisma.admin.findUnique({
      where: { email },
    }),

  createAdmin: (email: string, hashedPassword: string) =>
    prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        role: "admin",
      },
    }),

  getIssuers: (status?: IssuerStatus) =>
    prisma.issuer.findMany({
      where: status ? { status } : undefined,
      include: {
        institutionProfile: true,
        professorProfile: true,
        recruiterProfile: true,
        documents: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

  approveIssuer: (issuerId: string) =>
    prisma.issuer.update({
      where: { id: issuerId },
      data: { status: IssuerStatus.approved },
    }),

  suspendIssuer: (issuerId: string) =>
    prisma.issuer.update({
      where: { id: issuerId },
      data: { status: IssuerStatus.suspended },
    }),
};
