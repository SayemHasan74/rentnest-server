import { CategoryService } from "./category.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const CategoryController = {
  getAll: catchAsync(async (_req, res) => {
    const categories = await CategoryService.getAll();

    sendResponse(res, {
      message: "Categories retrieved successfully",
      data: categories
    });
  }),

  create: catchAsync(async (req, res) => {
    const category = await CategoryService.create(req.body);

    sendResponse(res, {
      statusCode: 201,
      message: "Category created successfully",
      data: category
    });
  }),

  update: catchAsync(async (req, res) => {
    const category = await CategoryService.update(
      req.params.id as string,
      req.body
    );

    sendResponse(res, {
      message: "Category updated successfully",
      data: category
    });
  }),

  delete: catchAsync(async (req, res) => {
    const result = await CategoryService.delete(req.params.id as string);

    sendResponse(res, {
      message: "Category deleted successfully",
      data: result
    });
  })
};
