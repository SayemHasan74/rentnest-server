import jwt, { SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

export type JwtPayload = {
  userId: string;
  role: UserRole;
  email: string;
};

export const createToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, env.jwtSecret) as JwtPayload;
  } catch (_error) {
    throw new AppError(401, "Invalid or expired authorization token");
  }
};
