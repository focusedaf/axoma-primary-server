import { Request, Response } from "express";
import { authCoreService } from "./auth.core.service";
import { AuthRequest } from "../../middleware/auth.middleware";

export const authController = {
  async candidateRegister(req: Request, res: Response) {
    try {
      const { user, accessToken, refreshToken } =
        await authCoreService.candidateRegister(req.body);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });

      res.status(201).json({ user });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async candidateLogin(req: Request, res: Response) {
    try {
      const { user, accessToken, refreshToken } =
        await authCoreService.candidateLogin(req.body.email, req.body.password);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });

      res.status(200).json({ user });
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
        secure: false,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });

      res.status(201).json({ user });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async issuerLogin(req: Request, res: Response) {
    try {
      const { user, accessToken, refreshToken } =
        await authCoreService.issuerLogin(req.body.email, req.body.password);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });

      res.status(200).json({ user });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async me(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userData =
      req.user.role === "candidate"
        ? await authCoreService.getCandidateById(req.user.userId)
        : await authCoreService.getIssuerById(req.user.userId);

    res.json({ user: userData });
  },

  async refreshToken(req: Request, res: Response) {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res.status(401).json({ message: "No refresh token provided" });

    try {
      const newTokens = await authCoreService.refreshTokens(token);

      res.cookie("accessToken", newTokens.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.cookie("refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });

      res.json({ message: "Tokens refreshed" });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  },

  async logout(req: Request, res: Response) {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    res.json({ message: "Logged out" });
  },
};
