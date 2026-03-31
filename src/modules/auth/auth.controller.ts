import { Request, Response } from "express";
import { authCoreService } from "./auth.core.service";
import { AuthRequest } from "../../middleware/auth.middleware";
import { adminService } from "../admin/admin.service";

export const authController = {
  async candidateRegister(req: Request, res: Response) {
    try {
      const { user, accessToken, refreshToken } =
        await authCoreService.candidateRegister(req.body);

      res.cookie("candidateAccessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      res.cookie("candidateRefreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
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
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      res.cookie("candidateRefreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
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
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      res.cookie("issuerRefreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
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
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      res.cookie("issuerRefreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
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

    const { userId, role } = req.user;

    try {
      if (role === "candidate") {
        const user = await authCoreService.getCandidateById(userId);
        return res.json({ user });
      }

      if (["institution", "professor", "recruiter"].includes(role)) {
        const user = await authCoreService.getIssuerById(userId);
        return res.json({ user });
      }

      if (role === "admin") {
        const admin = await adminService.getById(userId);
        return res.json({
          user: {
            id: admin.id,
            email: admin.email,
            role: admin.role,
          },
        });
      }

      return res.status(400).json({ message: "Invalid role" });
    } catch (err) {
      console.error("ME ERROR:", err);
      return res.status(500).json({ message: "Failed to fetch user" });
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const token =
        req.cookies?.adminRefreshToken ||
        req.cookies?.issuerRefreshToken ||
        req.cookies?.candidateRefreshToken;

      if (!token) return res.status(401).json({ message: "No refresh token" });

      const { accessToken, refreshToken } =
        await authCoreService.refreshTokens(token);

      const role =
        (req.cookies?.adminRefreshToken && "admin") ||
        (req.cookies?.candidateRefreshToken && "candidate") ||
        "issuer";

      res.cookie(`${role}AccessToken`, accessToken, {
        httpOnly: true,
        sameSite: "lax",
      });
      res.cookie(`${role}RefreshToken`, refreshToken, {
        httpOnly: true,
        sameSite: "lax",
      });

      return res.json({ message: "Tokens refreshed" });
    } catch (err: any) {
      return res.status(401).json({ message: err.message });
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
