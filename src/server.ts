import express from "express";
import cors from "cors";
import { env } from "./config/env";
import AuthRouter from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";

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

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
