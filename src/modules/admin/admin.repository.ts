import prisma from "../../db/db";
import { IssuerStatus } from "../../db/generated/prisma";

export const adminRepository = {
  findByEmail: (email: string) =>
    prisma.admin.findUnique({
      where: { email },
    }),

  getAdminById: (id: string) =>
    prisma.admin.findUnique({
      where: { id },
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
