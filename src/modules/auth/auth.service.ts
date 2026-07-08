import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { createToken } from "../../utils/jwt";
import { excludePassword } from "./auth.utils";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD";
  phone?: string;
  address?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export const AuthService = {
  register: async (payload: RegisterPayload) => {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: payload.email
      }
    });

    if (existingUser) {
      throw new AppError(409, "Email is already registered", {
        email: payload.email
      });
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: payload.role as UserRole,
        phone: payload.phone,
        address: payload.address
      }
    });

    return excludePassword(user);
  },

  login: async (payload: LoginPayload) => {
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email
      }
    });

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const isPasswordMatched = await bcrypt.compare(
      payload.password,
      user.password
    );

    if (!isPasswordMatched) {
      throw new AppError(401, "Invalid email or password");
    }

    if (user.status === "BANNED") {
      throw new AppError(403, "This user account is banned", {
        status: user.status
      });
    }

    const accessToken = createToken({
      userId: user.id,
      role: user.role,
      email: user.email
    });

    return {
      accessToken,
      user: excludePassword(user)
    };
  },

  getMe: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return excludePassword(user);
  }
};
