import { LandlordPropertyService } from "./landlord-property.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const LandlordPropertyController = {
  create: catchAsync(async (req, res) => {
    const property = await LandlordPropertyService.create(
      req.user!.userId,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      message: "Property listing created successfully",
      data: property
    });
  }),

  getMine: catchAsync(async (req, res) => {
    const properties = await LandlordPropertyService.getMine(req.user!.userId);

    sendResponse(res, {
      message: "Landlord properties retrieved successfully",
      data: properties
    });
  }),

  update: catchAsync(async (req, res) => {
    const property = await LandlordPropertyService.update(
      req.user!.userId,
      req.params.id as string,
      req.body
    );

    sendResponse(res, {
      message: "Property listing updated successfully",
      data: property
    });
  }),

  updateAvailability: catchAsync(async (req, res) => {
    const property = await LandlordPropertyService.updateAvailability(
      req.user!.userId,
      req.params.id as string,
      req.body.status
    );

    sendResponse(res, {
      message: "Property availability updated successfully",
      data: property
    });
  }),

  delete: catchAsync(async (req, res) => {
    const result = await LandlordPropertyService.delete(
      req.user!.userId,
      req.params.id as string
    );

    sendResponse(res, {
      message: "Property listing deleted successfully",
      data: result
    });
  })
};
