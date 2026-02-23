import { z } from "zod";
import { issuerRegisterSchema } from "./auth.schema";
import {
  hashPassword,
  verifyPassword,
  rotateTokens,
  UserRole,
} from "../../utils/helper";
import { issuerRepository } from "../issuer/issuer.repository";

type IssuerRegisterInput = z.infer<typeof issuerRegisterSchema>;

export const issuerAuthService = {
  async register(data: IssuerRegisterInput) {
    const existing = await issuerRepository.findByEmail(data.email);
    if (existing) throw new Error("Issuer already exists");

    const hashed = await hashPassword(data.password);

    const issuer = await issuerRepository.create({
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      institutionName: data.institutionName,
      mobileNumber: data.mobileNumber,
      email: data.email,
      password: hashed,
      walletAddress: data.walletAddress,
    });

    const tokens = rotateTokens(
      { userId: issuer.id, role: issuer.role },
      process.env.ACCESS_TOKEN_SECRET!,
      process.env.REFRESH_TOKEN_SECRET!,
    );

    return {
      user: {
        id: issuer.id,
        email: issuer.email,
        role: issuer.role,
      },
      ...tokens,
    };
  },

  async login(email: string, password: string) {
    const issuer = await issuerRepository.findByEmail(email);
    if (!issuer) throw new Error("Invalid credentials");

    const valid = await verifyPassword(password, issuer.password);
    if (!valid) throw new Error("Invalid credentials");

    const tokens = rotateTokens(
      { userId: issuer.id, role: issuer.role }, 
      process.env.ACCESS_TOKEN_SECRET!,
      process.env.REFRESH_TOKEN_SECRET!,
    );

    return {
      user: {
        id: issuer.id,
        email: issuer.email,
        role: issuer.role,
      },
      ...tokens,
    };
  },

  getById: async (id: string) => {
    const issuer = await issuerRepository.findById(id);
    if (!issuer) throw new Error("Issuer not found");
    return { id: issuer.id, email: issuer.email, role: issuer.role };
  },
};
