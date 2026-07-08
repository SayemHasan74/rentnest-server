import { Prisma, PropertyStatus } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

type PropertyFilters = {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  amenities?: string;
  page?: number;
  limit?: number;
};

const propertyInclude = {
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
      phone: true
    }
  },
  reviews: {
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      tenant: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc" as const
    }
  }
};

export const PropertyService = {
  getAll: async (filters: PropertyFilters) => {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
    const where: Prisma.PropertyWhereInput = {
      status: PropertyStatus.AVAILABLE
    };

    if (filters.location) {
      where.location = {
        contains: filters.location,
        mode: "insensitive"
      };
    }

    if (filters.minPrice || filters.maxPrice) {
      where.rentAmount = {
        gte: filters.minPrice,
        lte: filters.maxPrice
      };
    }

    if (filters.type) {
      where.category = {
        name: {
          contains: filters.type,
          mode: "insensitive"
        }
      };
    }

    if (filters.amenities) {
      const amenities = filters.amenities
        .split(",")
        .map((amenity) => amenity.trim())
        .filter(Boolean);

      if (amenities.length > 0) {
        where.amenities = {
          hasEvery: amenities
        };
      }
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          category: propertyInclude.category,
          landlord: propertyInclude.landlord
        }
      }),
      prisma.property.count({ where })
    ]);

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      properties
    };
  },

  getById: async (id: string) => {
    const property = await prisma.property.findFirst({
      where: {
        id,
        status: PropertyStatus.AVAILABLE
      },
      include: propertyInclude
    });

    if (!property) {
      throw new AppError(404, "Property not found");
    }

    return property;
  }
};
