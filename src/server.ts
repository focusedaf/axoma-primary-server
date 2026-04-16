import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";

// routes
import AuthRouter from "./modules/auth/auth.routes";
import OnboardingRouter from "./modules/onboarding/onboarding.routes";
import AdminRouter from "./modules/admin/admin.routes";
import DashboardRouter from "./modules/dashboard/dashboard.routes";
import ViolationRouter from "./modules/violations/violations.routes";
import ResultRouter from "./modules/results/results.routes";
import AttemptRouter from "./modules/attempts/attempts.routes";
import ExamRouter from "./modules/exams/exams.routes";
import IssuerRouter from "./modules/issuer/issuer.routes";
import NotificationRouter from "./modules/notifications/notifications.routes";

const app = express();
const httpServer = createServer(app);

const CLIENTS = ["http://localhost:3000", "http://localhost:3001"];

// CORS
app.use(
  cors({
    origin: CLIENTS,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

// ROUTES
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/onboarding", OnboardingRouter);
app.use("/api/v1/exams", ExamRouter);
app.use("/api/v1", AttemptRouter);
app.use("/api/v1/results", ResultRouter);
app.use("/api/v1/violations", ViolationRouter);
app.use("/api/v1/dashboard", DashboardRouter);
app.use("/api/v1/issuer", IssuerRouter);
app.use("/api/v1/notifications", NotificationRouter);

httpServer.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
