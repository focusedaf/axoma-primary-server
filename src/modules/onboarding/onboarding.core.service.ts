import prisma from "../../db/db";
import { onboardingRepository } from "./onboarding.repository";
import { UserRole } from "../../middleware/auth.middleware";
import { io } from "../../server";

export const onboardingService = {
  async upsertProfile(userId: string, role: UserRole, data: any) {
    switch (role) {
      case "institution":
        return onboardingRepository.upsertInstitutionProfile(userId, data);

      case "professor":
        return onboardingRepository.upsertProfessorProfile(userId, data);

      case "recruiter":
        return onboardingRepository.upsertRecruiterProfile(userId, data);

      case "candidate":
        return onboardingRepository.upsertCandidateProfile(userId, data);

      default:
        throw new Error("Invalid role for onboarding");
    }
  },

  async getProfile(userId: string, role: UserRole) {
    switch (role) {
      case "institution":
        return onboardingRepository.getInstitutionProfile(userId);

      case "professor":
        return onboardingRepository.getProfessorProfile(userId);

      case "recruiter":
        return onboardingRepository.getRecruiterProfile(userId);

      case "candidate":
        return onboardingRepository.getCandidateProfile(userId);

      default:
        throw new Error("Invalid role for onboarding");
    }
  },

  async addDocuments(userId: string, role: UserRole, files: string[]) {
    if (role === "candidate") {
      const docs = await onboardingRepository.addCandidateDocuments(
        userId,
        files,
      );

      await prisma.candidate.update({
        where: { id: userId },
        data: { onboardingCompleted: true },
      });

      return docs;
    }

    if (["institution", "professor", "recruiter"].includes(role)) {
      const docs = await onboardingRepository.addIssuerDocuments(userId, files);

      await prisma.issuer.update({
        where: { id: userId },
        data: { onboardingCompleted: true },
      });

      io.to("admin").emit("notification", {
        type: "new_issuer_ready",
        message:
          "A new issuer has completed onboarding and is ready for approval",
      });

      return docs;
    }

    throw new Error("Invalid role for document upload");
  },
};
