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
  }),

  confirm: catchAsync(async (req, res) => {
    const payment = await PaymentService.confirmPayment(
      req.user!.userId,
      req.body
    );

    sendResponse(res, {
      message: "Payment status confirmed successfully",
      data: payment
    });
  }),

  webhook: catchAsync(async (req, res) => {
    const signatureHeader = req.headers["stripe-signature"];
    const signature = Array.isArray(signatureHeader)
      ? signatureHeader[0]
      : signatureHeader;

    const result = await PaymentService.handleStripeWebhook(
      signature,
      req.body as Buffer
    );

    sendResponse(res, {
      message: "Stripe webhook processed successfully",
      data: result
    });
  }),

  getMine: catchAsync(async (req, res) => {
    const payments = await PaymentService.getMine(req.user!.userId);

    sendResponse(res, {
      message: "Payment history retrieved successfully",
      data: payments
    });
  }),

  getById: catchAsync(async (req, res) => {
    const payment = await PaymentService.getById(
      req.user!.userId,
      req.params.id as string
    );

    sendResponse(res, {
      message: "Payment details retrieved successfully",
      data: payment
    });
  })
};
