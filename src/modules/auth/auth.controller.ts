import { Request, Response } from "express";
import { authCoreService } from "./auth.core.service";
import { AuthRequest } from "../../middleware/auth.middleware";
import { rotateTokens,verifyRefreshToken } from "../../utils/helper";

export const authController = {
  async candidateRegister(req: Request, res: Response) {
    try {
      const { user, accessToken, refreshToken } =
        await authCoreService.candidateRegister(req.body);

      res.cookie("candidateAccessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.cookie("candidateRefreshToken", refreshToken, {
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

      res.cookie("candidateAccessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.cookie("candidateRefreshToken", refreshToken, {
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

      res.cookie("issuerAccessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.cookie("issuerRefreshToken", refreshToken, {
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

      res.cookie("issuerAccessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.cookie("issuerRefreshToken", refreshToken, {
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
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role === "candidate") {
      const user = await authCoreService.getCandidateById(req.user.userId);
      return res.json({ user });
    }

    if (
      req.user.role === "institution" ||
      req.user.role === "professor" ||
      req.user.role === "recruiter"
    ) {
      const user = await authCoreService.getIssuerById(req.user.userId);
      return res.json({ user });
    }

    return res.status(403).json({ message: "Invalid role" });
  },

  async refreshToken(req: Request, res: Response) {
    const token =
      req.cookies?.adminRefreshToken ||
      req.cookies?.issuerRefreshToken ||
      req.cookies?.candidateRefreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
      const payload = verifyRefreshToken(
        token,
        process.env.REFRESH_TOKEN_SECRET!,
      );

      if (!payload) {
        throw new Error("Invalid refresh token");
      }

      const { accessToken, refreshToken } = rotateTokens(
        { userId: payload.userId, role: payload.role },
        process.env.ACCESS_TOKEN_SECRET!,
        process.env.REFRESH_TOKEN_SECRET!,
      );

      if (payload.role === "admin") {
        res.cookie("adminAccessToken", accessToken, { httpOnly: true });
        res.cookie("adminRefreshToken", refreshToken, { httpOnly: true });
      } else if (payload.role === "candidate") {
        res.cookie("candidateAccessToken", accessToken, { httpOnly: true });
        res.cookie("candidateRefreshToken", refreshToken, { httpOnly: true });
      } else {
        res.cookie("issuerAccessToken", accessToken, { httpOnly: true });
        res.cookie("issuerRefreshToken", refreshToken, { httpOnly: true });
      }

      res.json({ message: "Tokens refreshed" });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  },

  async logout(req: Request, res: Response) {
    res.clearCookie("issuerAccessToken");
    res.clearCookie("issuerRefreshToken");
    res.clearCookie("candidateAccessToken");
    res.clearCookie("candidateRefreshToken");

    res.json({ message: "Logged out" });
  },
};
