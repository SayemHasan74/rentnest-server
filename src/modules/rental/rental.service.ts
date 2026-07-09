import { PropertyStatus, RentalStatus } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

type CreateRentalPayload = {
  propertyId: string;
  moveInDate: Date;
  rentalMonths: number;
  message?: string;
};

const rentalInclude = {
  property: {
    select: {
      id: true,
      title: true,
      location: true,
      rentAmount: true,
      status: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      category: {
        select: {
          id: true,
          name: true
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
    },
    orderBy: {
      createdAt: "desc" as const
    }
  },
  review: true
};

export const RentalService = {
  create: async (tenantId: string, payload: CreateRentalPayload) => {
    const property = await prisma.property.findUnique({
      where: {
        id: payload.propertyId
      }
    });

    if (!property) {
      throw new AppError(404, "Property not found");
    }

    if (property.status !== PropertyStatus.AVAILABLE) {
      throw new AppError(400, "Property is not available for rent", {
        propertyStatus: property.status
      });
    }

    if (property.landlordId === tenantId) {
      throw new AppError(400, "Landlords cannot request their own property");
    }

    const existingRequest = await prisma.rentalRequest.findFirst({
      where: {
        tenantId,
        propertyId: payload.propertyId,
        status: {
          in: [
            RentalStatus.PENDING,
            RentalStatus.APPROVED,
            RentalStatus.ACTIVE
          ]
        }
      }
    });

    if (existingRequest) {
      throw new AppError(409, "You already have an active request for this property", {
        rentalRequestId: existingRequest.id,
        status: existingRequest.status
      });
    }

    return prisma.rentalRequest.create({
      data: {
        tenantId,
        propertyId: payload.propertyId,
        moveInDate: payload.moveInDate,
        rentalMonths: payload.rentalMonths,
        message: payload.message
      },
      include: rentalInclude
    });
  },

  getMine: async (tenantId: string) => {
    return prisma.rentalRequest.findMany({
      where: {
        tenantId
      },
      orderBy: {
        createdAt: "desc"
      },
      include: rentalInclude
    });
  },

  getById: async (tenantId: string, rentalRequestId: string) => {
    const rentalRequest = await prisma.rentalRequest.findFirst({
      where: {
        id: rentalRequestId,
        tenantId
      },
      include: rentalInclude
    });

    if (!rentalRequest) {
      throw new AppError(404, "Rental request not found");
    }

    return rentalRequest;
  }
};
