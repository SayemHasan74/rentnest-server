import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";
import { ApiErrorResponse } from "../types/api-response";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errorDetails: unknown = error;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorDetails = error.errorDetails;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = "Database request failed";
    errorDetails = {
      code: error.code,
      meta: error.meta
    };
  } else if (error instanceof SyntaxError && "body" in error) {
    statusCode = 400;
    message = "Invalid JSON payload";
    errorDetails = {
      name: error.name,
      message: error.message
    };
  } else if (error instanceof Error) {
    message = error.message;
    errorDetails = {
      name: error.name,
      message: error.message,
      stack: env.nodeEnv === "development" ? error.stack : undefined
    };
  }

  const response: ApiErrorResponse = {
    success: false,
    message,
    errorDetails
  };

  res.status(statusCode).json(response);
};
