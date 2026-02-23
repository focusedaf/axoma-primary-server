import { z } from "zod";
import { candidateRegisterSchema } from "./auth.schema";
import { hashPassword, verifyPassword, rotateTokens } from "../../utils/helper";
import { candidateRepository } from "../candidate/candidate.repository";

type CandidateRegisterInput = z.infer<typeof candidateRegisterSchema>;

export const candidateAuthService = {
  async register(data: CandidateRegisterInput) {
    const existing = await candidateRepository.findByEmail(data.email);
    if (existing) throw new Error("Candidate already exists");

    const hashed = await hashPassword(data.password);

    const candidate = await candidateRepository.create({
      ...data,
      password: hashed,
    });

    const tokens = rotateTokens(
      { userId: candidate.id, role: "candidate" },
      process.env.ACCESS_TOKEN_SECRET!,
      process.env.REFRESH_TOKEN_SECRET!,
    );

    return {
      user: {
        id: candidate.id,
        email: candidate.email,
        role: "candidate",
      },
      ...tokens,
    };
  },

  async login(email: string, password: string) {
    const candidate = await candidateRepository.findByEmail(email);
    if (!candidate) throw new Error("Invalid credentials");

    const valid = await verifyPassword(password, candidate.password);
    if (!valid) throw new Error("Invalid credentials");

    const tokens = rotateTokens(
      { userId: candidate.id, role: "candidate" },
      process.env.ACCESS_TOKEN_SECRET!,
      process.env.REFRESH_TOKEN_SECRET!,
    );

    return {
      user: {
        id: candidate.id,
        email: candidate.email,
        role: "candidate",
      },
      ...tokens,
    };
  },

  getById: async (id: string) => {
    const candidate = await candidateRepository.findById(id);
    if (!candidate) throw new Error("Candidate not found");
    return { id: candidate.id, email: candidate.email, role: "candidate" };
  },
};
