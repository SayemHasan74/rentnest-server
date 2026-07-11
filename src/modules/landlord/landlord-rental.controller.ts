import { LandlordRentalService } from "./landlord-rental.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const LandlordRentalController = {
  getRequests: catchAsync(async (req, res) => {
    const rentalRequests = await LandlordRentalService.getRequests(
      req.user!.userId
    );

    sendResponse(res, {
      message: "Landlord rental requests retrieved successfully",
      data: rentalRequests
    });
  }),

  updateStatus: catchAsync(async (req, res) => {
    const rentalRequest = await LandlordRentalService.updateStatus(
      req.user!.userId,
      req.params.id as string,
      req.body
    );

    sendResponse(res, {
      message: `Rental request ${req.body.status.toLowerCase()} successfully`,
      data: rentalRequest
    });
  }),

  complete: catchAsync(async (req, res) => {
    const rentalRequest = await LandlordRentalService.complete(
      req.user!.userId,
      req.params.id as string
    );

    sendResponse(res, {
      message: "Rental request completed successfully",
      data: rentalRequest
    });
  })
};
