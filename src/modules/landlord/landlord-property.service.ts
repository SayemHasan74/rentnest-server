import { Prisma, PropertyStatus } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

type PropertyPayload = {
  title: string;
  description: string;
  location: string;
  address?: string;
  rentAmount: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt?: number;
  amenities: string[];
  images: string[];
  status?: PropertyStatus;
  categoryId: string;
};

type UpdatePropertyPayload = Partial<PropertyPayload>;

const landlordPropertyInclude = {
  category: {
    select: {
      id: true,
      name: true
    }
  }
};

const ensureCategoryExists = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  });

  if (!category) {
    throw new AppError(404, "Category not found", {
      categoryId
    });
  }
};

const getOwnPropertyOrThrow = async (propertyId: string, landlordId: string) => {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      landlordId
    }
  });

  if (!property) {
    throw new AppError(404, "Property not found for this landlord");
  }

  return property;
};

export const LandlordPropertyService = {
  create: async (landlordId: string, payload: PropertyPayload) => {
    await ensureCategoryExists(payload.categoryId);

    return prisma.property.create({
      data: {
        ...payload,
        rentAmount: new Prisma.Decimal(payload.rentAmount),
        landlordId
      },
      include: landlordPropertyInclude
    });
  },

  getMine: async (landlordId: string) => {
    return prisma.property.findMany({
      where: {
        landlordId
      },
      orderBy: {
        createdAt: "desc"
      },
      include: landlordPropertyInclude
    });
  },

  update: async (
    landlordId: string,
    propertyId: string,
    payload: UpdatePropertyPayload
  ) => {
    await getOwnPropertyOrThrow(propertyId, landlordId);

    if (payload.categoryId) {
      await ensureCategoryExists(payload.categoryId);
    }

    return prisma.property.update({
      where: {
        id: propertyId
      },
      data: {
        ...payload,
        rentAmount:
          payload.rentAmount === undefined
            ? undefined
            : new Prisma.Decimal(payload.rentAmount)
      },
      include: landlordPropertyInclude
    });
  },

  updateAvailability: async (
    landlordId: string,
    propertyId: string,
    status: PropertyStatus
  ) => {
    await getOwnPropertyOrThrow(propertyId, landlordId);

    return prisma.property.update({
      where: {
        id: propertyId
      },
      data: {
        status
      },
      include: landlordPropertyInclude
    });
  },

  delete: async (landlordId: string, propertyId: string) => {
    await getOwnPropertyOrThrow(propertyId, landlordId);

    const activeRequest = await prisma.rentalRequest.findFirst({
      where: {
        propertyId,
        status: {
          in: ["PENDING", "APPROVED", "ACTIVE"]
        }
      }
    });

    if (activeRequest) {
      throw new AppError(400, "Property cannot be deleted while it has active rental requests", {
        rentalRequestId: activeRequest.id,
        status: activeRequest.status
      });
    }

    await prisma.property.delete({
      where: {
        id: propertyId
      }
    });

    return null;
  }
};
