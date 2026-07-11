import { PaymentStatus, PropertyStatus, RentalStatus } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

type UpdateRentalStatusPayload = {
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
};

const landlordRentalInclude = {
  tenant: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true
    }
  },
  property: {
    select: {
      id: true,
      title: true,
      location: true,
      rentAmount: true,
      landlordId: true,
      status: true,
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
    }
  }
};

const getRentalForLandlordOrThrow = async (
  landlordId: string,
  rentalRequestId: string
) => {
  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      id: rentalRequestId,
      property: {
        landlordId
      }
    },
    include: landlordRentalInclude
  });

  if (!rentalRequest) {
    throw new AppError(404, "Rental request not found for this landlord");
  }

  return rentalRequest;
};

export const LandlordRentalService = {
  getRequests: async (landlordId: string) => {
    return prisma.rentalRequest.findMany({
      where: {
        property: {
          landlordId
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      include: landlordRentalInclude
    });
  },

  updateStatus: async (
    landlordId: string,
    rentalRequestId: string,
    payload: UpdateRentalStatusPayload
  ) => {
    const rentalRequest = await getRentalForLandlordOrThrow(
      landlordId,
      rentalRequestId
    );

    if (rentalRequest.status !== RentalStatus.PENDING) {
      throw new AppError(400, "Only pending rental requests can be updated", {
        currentStatus: rentalRequest.status
      });
    }

    if (payload.status === RentalStatus.REJECTED && !payload.rejectionReason) {
      throw new AppError(400, "Rejection reason is required when rejecting a request");
    }

    const now = new Date();

    const updatedRentalRequest = await prisma.rentalRequest.update({
      where: {
        id: rentalRequestId
      },
      data:
        payload.status === RentalStatus.APPROVED
          ? {
              status: RentalStatus.APPROVED,
              approvedAt: now,
              rejectionReason: null
            }
          : {
              status: RentalStatus.REJECTED,
              rejectedAt: now,
              rejectionReason: payload.rejectionReason
            },
      include: landlordRentalInclude
    });

    if (payload.status === RentalStatus.REJECTED) {
      return updatedRentalRequest;
    }

    await prisma.property.update({
      where: {
        id: rentalRequest.propertyId
      },
      data: {
        status: PropertyStatus.UNAVAILABLE
      }
    });

    return updatedRentalRequest;
  },

  complete: async (landlordId: string, rentalRequestId: string) => {
    const rentalRequest = await getRentalForLandlordOrThrow(
      landlordId,
      rentalRequestId
    );

    if (rentalRequest.status !== RentalStatus.ACTIVE) {
      throw new AppError(400, "Only active rental requests can be completed", {
        currentStatus: rentalRequest.status
      });
    }

    const hasCompletedPayment = rentalRequest.payments.some(
      (payment) => payment.status === PaymentStatus.COMPLETED
    );

    if (!hasCompletedPayment) {
      throw new AppError(400, "Rental request must be paid before completion");
    }

    return prisma.$transaction(async (tx) => {
      const completedRentalRequest = await tx.rentalRequest.update({
        where: {
          id: rentalRequestId
        },
        data: {
          status: RentalStatus.COMPLETED,
          completedAt: new Date()
        },
        include: landlordRentalInclude
      });

      await tx.property.update({
        where: {
          id: rentalRequest.propertyId
        },
        data: {
          status: PropertyStatus.AVAILABLE
        }
      });

      return completedRentalRequest;
    });
  }
};
