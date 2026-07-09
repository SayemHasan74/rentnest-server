import cors from "cors";
import express, { Application, Request, Response } from "express";
import { appConfig } from "./constants/app";
import { env } from "./config/env";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { PaymentWebhookRoutes } from "./modules/payment/payment-webhook.routes";
import apiRoutes from "./routes";
import { sendResponse } from "./utils/sendResponse";

const app: Application = express();

app.use(
  cors({
    origin: env.allowedOrigins.includes("*") ? true : env.allowedOrigins,
    credentials: true
  })
);
app.use("/api/payments/webhook", PaymentWebhookRoutes);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  sendResponse(res, {
    message: "RentNest API is running",
    data: {
      service: appConfig.service,
      version: appConfig.version,
      environment: env.nodeEnv
    }
  });
});

app.use("/api", apiRoutes);
app.use(notFound);
app.use(globalErrorHandler);

export default app;
