import { Router } from "express";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";


const AuthRouter = Router();

AuthRouter.post("/candidate/register", authController.candidateRegister);
AuthRouter.post("/candidate/login", authController.candidateLogin);

AuthRouter.post("/issuer/register", authController.issuerRegister);
AuthRouter.post("/issuer/login", authController.issuerLogin);

AuthRouter.get("/me", authMiddleware, authController.me);
AuthRouter.post("/refresh", authController.refreshToken);
AuthRouter.post("/logout", authController.logout);


export default AuthRouter;
