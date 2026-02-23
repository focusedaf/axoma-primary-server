import { onboardingRepository } from "./onboarding.repository";

export const onboardingService = {
  async upsertProfile(userId: string, role: string, data: any) {
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
        throw new Error("Invalid role");
    }
  },

  async getProfile(userId: string, role: string) {
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
        throw new Error("Invalid role");
    }
  },

  async addDocuments(userId: string, role: string, files: string[]) {
    if (role === "candidate") {
      return onboardingRepository.addCandidateDocuments(userId, files);
    }

    return onboardingRepository.addIssuerDocuments(userId, files);
  },
};
