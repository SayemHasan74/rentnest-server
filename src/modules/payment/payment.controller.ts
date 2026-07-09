import { PaymentService } from "./payment.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const PaymentController = {
  create: catchAsync(async (req, res) => {
    const result = await PaymentService.createCheckoutSession(
      req.user!.userId,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      message: "Stripe checkout session created successfully",
      data: result
    });
  })
};
