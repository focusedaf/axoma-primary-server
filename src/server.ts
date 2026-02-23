import express from "express";
import cors from "cors";
import { env } from "./config/env";
import cookieParser from "cookie-parser";
import AuthRouter from "./modules/auth/auth.routes";
import OnboardingRouter from "./modules/onboarding/onboarding.routes";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/onboarding",OnboardingRouter);

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
