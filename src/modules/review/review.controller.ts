import { ReviewService } from "./review.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const ReviewController = {
  create: catchAsync(async (req, res) => {
    const review = await ReviewService.create(req.user!.userId, req.body);

    sendResponse(res, {
      statusCode: 201,
      message: "Review created successfully",
      data: review
    });
  })
};
