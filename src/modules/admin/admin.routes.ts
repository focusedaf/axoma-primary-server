import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  fetchIssuers,
  approveIssuer,
  suspendIssuer,
  getAdminMe,
} from "./admin.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const AdminRouter = Router();

AdminRouter.post("/login", loginAdmin);
AdminRouter.post("/logout", logoutAdmin);

AdminRouter.use(authMiddleware);
AdminRouter.get("/me", getAdminMe);
AdminRouter.use(roleMiddleware(["admin"]));

AdminRouter.get("/issuers", fetchIssuers);
AdminRouter.patch("/issuers/:id/approve", approveIssuer);
AdminRouter.patch("/issuers/:id/suspend", suspendIssuer);

export default AdminRouter;
