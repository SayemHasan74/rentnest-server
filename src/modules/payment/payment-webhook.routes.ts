import express, { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/", express.raw({ type: "application/json" }), PaymentController.webhook);

export const PaymentWebhookRoutes = router;
