import cors from "cors";
import express, { Application, Request, Response } from "express";
import { appConfig } from "./constants/app";
import { env } from "./config/env";
import apiRoutes from "./routes";

const app: Application = express();

app.use(
  cors({
    origin: env.allowedOrigins.includes("*") ? true : env.allowedOrigins,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "RentNest API is running",
    data: {
      service: appConfig.service,
      version: appConfig.version,
      environment: env.nodeEnv
    }
  });
});

app.use("/api", apiRoutes);

export default app;
