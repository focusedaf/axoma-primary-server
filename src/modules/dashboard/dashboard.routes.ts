import { Router } from "express";
import { getCandidateDashboard } from "./candidate-dashboard.service";
import { AuthRequest } from "../../middleware/auth.middleware";

const DashboardRouter = Router();

DashboardRouter.get("/", async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const candidateId = req.user.userId;

  const data = await getCandidateDashboard(candidateId);

  res.json(data);
});


export default DashboardRouter;
