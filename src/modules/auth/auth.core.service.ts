import { candidateAuthService } from "./candidate-auth.service";
import { issuerAuthService } from "./issuer-auth.service";

export const authCoreService = {
  candidateRegister: candidateAuthService.register,
  candidateLogin: candidateAuthService.login,

  issuerRegister: issuerAuthService.register,
  issuerLogin: issuerAuthService.login,
};
