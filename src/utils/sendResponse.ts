import { Response } from "express";
import { ApiSuccessResponse } from "../types/api-response";

type SendResponseOptions<T> = {
  statusCode?: number;
  message: string;
  data: T;
};

export const sendResponse = <T>(
  res: Response,
  options: SendResponseOptions<T>
) => {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message: options.message,
    data: options.data
  };

  res.status(options.statusCode || 200).json(response);
};
