import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

type CategoryPayload = {
  name?: string;
  description?: string;
};

export const CategoryService = {
  getAll: async () => {
    return prisma.category.findMany({
      orderBy: {
        name: "asc"
      },
      include: {
        _count: {
          select: {
            properties: true
          }
        }
      }
    });
  },

  create: async (payload: Required<Pick<CategoryPayload, "name">> & CategoryPayload) => {
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: payload.name
      }
    });

    if (existingCategory) {
      throw new AppError(409, "Category already exists", {
        name: payload.name
      });
    }

    return prisma.category.create({
      data: {
        name: payload.name,
        description: payload.description
      }
    });
  },

  update: async (id: string, payload: CategoryPayload) => {
    const category = await prisma.category.findUnique({
      where: {
        id
      }
    });

    if (!category) {
      throw new AppError(404, "Category not found");
    }

    if (payload.name && payload.name !== category.name) {
      const duplicateCategory = await prisma.category.findUnique({
        where: {
          name: payload.name
        }
      });

      if (duplicateCategory) {
        throw new AppError(409, "Category already exists", {
          name: payload.name
        });
      }
    }

    return prisma.category.update({
      where: {
        id
      },
      data: payload
    });
  },

  delete: async (id: string) => {
    const category = await prisma.category.findUnique({
      where: {
        id
      },
      include: {
        _count: {
          select: {
            properties: true
          }
        }
      }
    });

    if (!category) {
      throw new AppError(404, "Category not found");
    }

    if (category._count.properties > 0) {
      throw new AppError(400, "Category cannot be deleted while properties use it", {
        propertyCount: category._count.properties
      });
    }

    await prisma.category.delete({
      where: {
        id
      }
    });

    return null;
  }
};
