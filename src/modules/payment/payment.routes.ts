import { UserRole } from "@prisma/client";
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createPaymentValidationSchema } from "../../schemas/payment.schema";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create",
  auth(UserRole.TENANT),
  validateRequest({ body: createPaymentValidationSchema }),
  PaymentController.create
);

export const PaymentRoutes = router;
