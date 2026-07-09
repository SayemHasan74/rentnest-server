import { RentalService } from "./rental.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const RentalController = {
  create: catchAsync(async (req, res) => {
    const rentalRequest = await RentalService.create(
      req.user!.userId,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      message: "Rental request submitted successfully",
      data: rentalRequest
    });
  }),

  getMine: catchAsync(async (req, res) => {
    const rentalRequests = await RentalService.getMine(req.user!.userId);

    sendResponse(res, {
      message: "Rental requests retrieved successfully",
      data: rentalRequests
    });
  }),

  getById: catchAsync(async (req, res) => {
    const rentalRequest = await RentalService.getById(
      req.user!.userId,
      req.params.id as string
    );

    sendResponse(res, {
      message: "Rental request details retrieved successfully",
      data: rentalRequest
    });
  })
};
