import { Router } from "express";
import { appConfig } from "../constants/app";
import { sendResponse } from "../utils/sendResponse";

const router = Router();

router.get("/health", (_req, res) => {
  sendResponse(res, {
    message: "Server health check passed",
    data: {
      service: appConfig.service,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
