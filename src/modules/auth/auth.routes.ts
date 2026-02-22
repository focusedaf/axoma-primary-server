import { Router } from "express";
import { authController } from "./auth.controller";

const AuthRouter = Router();

AuthRouter.post("/candidate/register", authController.candidateRegister);
AuthRouter.post("/candidate/login", authController.candidateLogin);

AuthRouter.post("/issuer/register", authController.issuerRegister);
AuthRouter.post("/issuer/login", authController.issuerLogin);

export default AuthRouter;
