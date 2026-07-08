import { UserRole } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { verifyToken } from "../utils/jwt";

export const auth = (...requiredRoles: UserRole[]) =>
  catchAsync(async (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "Authorization token is required");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      }
    });

    if (!user) {
      throw new AppError(401, "User account no longer exists");
    }

    if (user.status === "BANNED") {
      throw new AppError(403, "This user account is banned", {
        status: user.status
      });
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      throw new AppError(403, "You are not allowed to access this resource", {
        requiredRoles,
        currentRole: user.role
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    next();
  });
