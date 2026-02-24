import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  fetchIssuers,
  approveIssuer,
  suspendIssuer,
} from "./admin.controller";
import { authMiddleware, AuthRequest } from "../../middleware/auth.middleware";

const AdminRouter = Router();

AdminRouter.post("/register", registerAdmin);
AdminRouter.post("/login", loginAdmin);
AdminRouter.post("/logout",logoutAdmin)
AdminRouter.use(authMiddleware);

AdminRouter.use((req: AuthRequest, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - Admin only",
    });
  }
  next();
});

AdminRouter.get("/issuers", fetchIssuers);
AdminRouter.patch("/issuers/:id/approve", approveIssuer);
AdminRouter.patch("/issuers/:id/suspend", suspendIssuer);

export default AdminRouter;
