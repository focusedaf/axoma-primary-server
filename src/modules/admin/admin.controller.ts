import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { IssuerStatus } from "../../db/generated/prisma";
import { rotateTokens } from "../../utils/helper";
import { AuthRequest } from "../../middleware/auth.middleware";

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await adminService.register(email, password);

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await adminService.login(email, password);

    const { accessToken, refreshToken } = rotateTokens(
      {
        userId: admin.id,
        role: "admin",
      },
      process.env.ACCESS_TOKEN_SECRET!,
      process.env.REFRESH_TOKEN_SECRET!,
    );

    res.cookie("adminAccessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    res.cookie("adminRefreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: admin.id,
        role: "admin",
      },
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutAdmin = async (req: Request, res: Response) => {
  res.clearCookie("adminAccessToken");
  res.clearCookie("adminRefreshToken");

  res.json({ message: "Logged out" });
};

export const fetchIssuers = async (req: Request, res: Response) => {
  try {
    const statusQuery = req.query.status;
    let status: IssuerStatus | undefined;

    if (
      statusQuery === IssuerStatus.pending ||
      statusQuery === IssuerStatus.approved ||
      statusQuery === IssuerStatus.suspended
    ) {
      status = statusQuery as IssuerStatus;
    }

    const issuers = await adminService.fetchIssuers(status);

    return res.status(200).json({
      success: true,
      data: issuers,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch issuers",
    });
  }
};

export const getAdminMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const admin = await adminService.getById(req.user.userId);

    return res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin",
    });
  }
};

export const approveIssuer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid issuer id",
      });
    }

    const issuer = await adminService.approveIssuer(id);

    return res.status(200).json({
      success: true,
      message: "Issuer approved successfully",
      data: issuer,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to approve issuer",
    });
  }
};

export const suspendIssuer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid issuer id",
      });
    }

    const issuer = await adminService.suspendIssuer(id);

    return res.status(200).json({
      success: true,
      message: "Issuer suspended successfully",
      data: issuer,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to suspend issuer",
    });
  }
};
