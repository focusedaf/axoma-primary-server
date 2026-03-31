import express from "express";
import cors from "cors";
import { env } from "./config/env";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

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

const app = express();
const httpServer = createServer(app);

// SOCKET SERVER
export const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
  },
});

app.use(
  cors({
    origin: env.CLIENT_URL,
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

io.on("connection", (socket) => {
  const { userId, role } = socket.handshake.auth;
  console.log("SOCKET CONNECT:", userId, role);
  if (userId) {
    socket.join(userId);
    console.log("User connected:", userId);
  }

  if (role === "admin") {
    socket.join("admin");
    console.log("JOINED ADMIN ROOM");
  }

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
  });
});

httpServer.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
