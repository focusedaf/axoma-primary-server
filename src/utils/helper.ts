import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export type UserRole ="admin"| "candidate" | "professor" | "recruiter" | "institution";

export interface AccessTokenPayload extends JwtPayload {
  userId: string;
  role: UserRole;
}

export interface RefreshTokenPayload extends JwtPayload {
  userId: string;
  role: UserRole;
}

export const hashPassword = async (password: string) => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(password, hashedPassword);
};

export const createAccessToken = (
  payload: AccessTokenPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"] = "15m",
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const createRefreshToken = (
  payload: RefreshTokenPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"] = "7d",
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyAccessToken = (
  token: string,
  secret: string,
): AccessTokenPayload | null => {
  try {
    return jwt.verify(token, secret) as AccessTokenPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (
  token: string,
  secret: string,
): RefreshTokenPayload | null => {
  try {
    return jwt.verify(token, secret) as RefreshTokenPayload;
  } catch {
    return null;
  }
};

export const hashRefreshToken = async (token: string) => {
  return bcrypt.hash(token, 12);
};

export const rotateTokens = (
  payload: {
    userId: string;
    role: UserRole;
  },
  accessSecret: string,
  refreshSecret: string,
) => {
  const accessToken = createAccessToken(payload, accessSecret, "15m");

  const refreshToken = createRefreshToken(payload, refreshSecret, "7d");

  return { accessToken, refreshToken };
};
