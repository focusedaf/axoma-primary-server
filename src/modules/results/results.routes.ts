import { Router } from "express";
import prisma from "../../db/db";
import { AuthRequest } from "../../middleware/auth.middleware";

const ResultRouter = Router();

ResultRouter.get("/:examId", async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const candidateId = req.user.userId;

  const result = await prisma.result.findFirst({
    where: {
      examId: req.params.examId,
      candidateId,
    },
  });

  res.json(result);
});
export default ResultRouter;
