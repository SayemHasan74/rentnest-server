import { RequestHandler } from "express";

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    errorDetails: {
      path: req.originalUrl,
      method: req.method
    }
  });
};
