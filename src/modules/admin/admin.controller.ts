import { AdminService } from "./admin.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const AdminController = {
  getUsers: catchAsync(async (req, res) => {
    const users = await AdminService.getUsers(req.query);

    sendResponse(res, {
      message: "Users retrieved successfully",
      data: users
    });
  }),

  updateUserStatus: catchAsync(async (req, res) => {
    const user = await AdminService.updateUserStatus(
      req.user!.userId,
      req.params.id as string,
      req.body
    );

    sendResponse(res, {
      message: "User status updated successfully",
      data: user
    });
  }),

  getProperties: catchAsync(async (_req, res) => {
    const properties = await AdminService.getProperties();

    sendResponse(res, {
      message: "Admin properties retrieved successfully",
      data: properties
    });
  }),

  getRentals: catchAsync(async (_req, res) => {
    const rentals = await AdminService.getRentals();

    sendResponse(res, {
      message: "Admin rental requests retrieved successfully",
      data: rentals
    });
  })
};
