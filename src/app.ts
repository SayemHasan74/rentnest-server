import cors from "cors";
import express, { Application, Request, Response } from "express";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "RentNest API is running",
    data: {
      service: "rentnest-server",
      version: "1.0.0"
    }
  });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server health check passed",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

export default app;
