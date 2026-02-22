import { Request, Response } from "express";
import { authCoreService } from "./auth.core.service";

export const authController = {
  async candidateRegister(req: Request, res: Response) {
    try {
      const { user, accessToken, refreshToken } =
        await authCoreService.candidateRegister(req.body);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
      });

      res.status(201).json({ user });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async candidateLogin(req: Request, res: Response) {
    try {
      const tokens = await authCoreService.candidateLogin(
        req.body.email,
        req.body.password,
      );
      res.json(tokens);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async issuerRegister(req: Request, res: Response) {
    try {
      const { user, accessToken, refreshToken } =
        await authCoreService.issuerRegister(req.body);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
      });

      res.status(201).json({ user });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async issuerLogin(req: Request, res: Response) {
    try {
      const tokens = await authCoreService.issuerLogin(
        req.body.email,
        req.body.password,
      );
      res.json(tokens);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};
