import { Router } from "express";
import { appConfig } from "../constants/app";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server health check passed",
    data: {
      service: appConfig.service,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
