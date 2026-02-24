import bcrypt from "bcrypt";
import { IssuerStatus } from "../../db/generated/prisma";
import { adminRepository } from "./admin.repository";

export const adminService = {
  register: async (email: string, password: string) => {
    const existing = await adminRepository.findByEmail(email);

    if (existing) {
      throw new Error("Admin already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return adminRepository.createAdmin(email, hashedPassword);
  },

  login: async (email: string, password: string) => {
    const admin = await adminRepository.findByEmail(email);

    if (!admin) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return admin;
  },

  fetchIssuers: async (status?: IssuerStatus) => {
    return adminRepository.getIssuers(status);
  },

  approveIssuer: async (issuerId: string) => {
    return adminRepository.approveIssuer(issuerId);
  },

  suspendIssuer: async (issuerId: string) => {
    return adminRepository.suspendIssuer(issuerId);
  },
};
