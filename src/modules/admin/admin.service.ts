import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { excludePassword } from "../auth/auth.utils";

type UserListQuery = {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
};

type UpdateUserStatusPayload = {
  status: UserStatus;
};

const adminPropertyInclude = {
  category: {
    select: {
      id: true,
      name: true
    }
  },
  landlord: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true
    }
  },
  _count: {
    select: {
      rentalRequests: true,
      reviews: true
    }
  }
};

const adminRentalInclude = {
  tenant: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true
    }
  },
  property: {
    select: {
      id: true,
      title: true,
      location: true,
      rentAmount: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true
        }
      }
    }
  },
  payments: {
    select: {
      id: true,
      transactionId: true,
      amount: true,
      provider: true,
      status: true,
      paidAt: true,
      createdAt: true
    }
  },
  review: true
};

export const AdminService = {
  getUsers: async (query: UserListQuery) => {
    const where: Prisma.UserWhereInput = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: "insensitive"
          }
        },
        {
          email: {
            contains: query.search,
            mode: "insensitive"
          }
        }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      }
    });

    return users.map(excludePassword);
  },

  updateUserStatus: async (
    currentAdminId: string,
    userId: string,
    payload: UpdateUserStatusPayload
  ) => {
    if (currentAdminId === userId) {
      throw new AppError(400, "Admins cannot change their own status");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        status: payload.status
      }
    });

    return excludePassword(updatedUser);
  },

  getProperties: async () => {
    return prisma.property.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: adminPropertyInclude
    });
  },

  getRentals: async () => {
    return prisma.rentalRequest.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: adminRentalInclude
    });
  }
};
