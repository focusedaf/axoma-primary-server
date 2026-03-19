import { Router } from "express";
import { logViolation } from "./violations.service";

const ViolationRouter = Router();

ViolationRouter.post("/", async (req, res) => {
  await logViolation(req.body);
  res.json({ success: true });
});

export default ViolationRouter;
