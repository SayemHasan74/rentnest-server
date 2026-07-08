import { PropertyService } from "./property.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const PropertyController = {
  getAll: catchAsync(async (req, res) => {
    const result = await PropertyService.getAll(req.query);

    sendResponse(res, {
      message: "Properties retrieved successfully",
      data: result
    });
  }),

  getById: catchAsync(async (req, res) => {
    const property = await PropertyService.getById(req.params.id as string);

    sendResponse(res, {
      message: "Property details retrieved successfully",
      data: property
    });
  })
};
