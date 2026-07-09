import { RentalStatus } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

type CreateReviewPayload = {
  rentalRequestId: string;
  propertyId: string;
  rating: number;
  comment?: string;
};

const reviewInclude = {
  tenant: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  property: {
    select: {
      id: true,
      title: true,
      location: true
    }
  },
  rentalRequest: {
    select: {
      id: true,
      status: true,
      completedAt: true
    }
  }
};

export const ReviewService = {
  create: async (tenantId: string, payload: CreateReviewPayload) => {
    const rentalRequest = await prisma.rentalRequest.findFirst({
      where: {
        id: payload.rentalRequestId,
        tenantId,
        propertyId: payload.propertyId
      },
      include: {
        review: true
      }
    });

    if (!rentalRequest) {
      throw new AppError(404, "Completed rental request not found for this property");
    }

    if (rentalRequest.status !== RentalStatus.COMPLETED) {
      throw new AppError(400, "Review can be created only after rental is completed", {
        currentStatus: rentalRequest.status
      });
    }

    if (rentalRequest.review) {
      throw new AppError(409, "Review already exists for this rental request", {
        reviewId: rentalRequest.review.id
      });
    }

    return prisma.review.create({
      data: {
        tenantId,
        propertyId: payload.propertyId,
        rentalRequestId: payload.rentalRequestId,
        rating: payload.rating,
        comment: payload.comment
      },
      include: reviewInclude
    });
  }
};
