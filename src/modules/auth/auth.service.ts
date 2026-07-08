import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { excludePassword } from "./auth.utils";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD";
  phone?: string;
  address?: string;
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
  }
};
