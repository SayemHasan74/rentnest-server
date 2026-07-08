import { AuthService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const AuthController = {
  register: catchAsync(async (req, res) => {
    const user = await AuthService.register(req.body);

    sendResponse(res, {
      statusCode: 201,
      message: "User registered successfully",
      data: user
    });
  })
};
