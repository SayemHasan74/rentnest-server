import { UserRole } from "@prisma/client";
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import {
  idParamSchema,
  validateRequest
} from "../../middlewares/validateRequest";
import {
  confirmPaymentValidationSchema,
  createPaymentValidationSchema
} from "../../schemas/payment.schema";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create",
  auth(UserRole.TENANT),
  validateRequest({ body: createPaymentValidationSchema }),
  PaymentController.create
);

router.post(
  "/confirm",
  auth(UserRole.TENANT),
  validateRequest({ body: confirmPaymentValidationSchema }),
  PaymentController.confirm
);

router.get("/", auth(UserRole.TENANT), PaymentController.getMine);

router.get(
  "/:id",
  auth(UserRole.TENANT),
  validateRequest({ params: idParamSchema }),
  PaymentController.getById
);

export const PaymentRoutes = router;
