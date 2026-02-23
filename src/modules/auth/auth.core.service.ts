import { candidateAuthService } from "./candidate-auth.service";
import { issuerAuthService } from "./issuer-auth.service";
import { verifyRefreshToken, rotateTokens } from "../../utils/helper";

export const authCoreService = {
  candidateRegister: candidateAuthService.register,
  candidateLogin: candidateAuthService.login,
  issuerRegister: issuerAuthService.register,
  issuerLogin: issuerAuthService.login,

  getCandidateById: candidateAuthService.getById,
  getIssuerById: issuerAuthService.getById,

  refreshTokens: async (refreshToken: string) => {
    
    const payload = verifyRefreshToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    );
    if (!payload) throw new Error("Invalid refresh token");

    return rotateTokens(
      { userId: payload.userId, role: payload.role },
      process.env.ACCESS_TOKEN_SECRET!,
      process.env.REFRESH_TOKEN_SECRET!,
    );
  },
};
