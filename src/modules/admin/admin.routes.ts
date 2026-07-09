import { UserRole } from "@prisma/client";
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import {
  idParamSchema,
  validateRequest
} from "../../middlewares/validateRequest";
import { updateUserStatusValidationSchema } from "../../schemas/admin.schema";
import { adminUserQuerySchema } from "../../schemas/admin.schema";
import { AdminController } from "./admin.controller";

const router = Router();

router.use(auth(UserRole.ADMIN));

router.get(
  "/users",
  validateRequest({ query: adminUserQuerySchema }),
  AdminController.getUsers
);

router.patch(
  "/users/:id",
  validateRequest({
    params: idParamSchema,
    body: updateUserStatusValidationSchema
  }),
  AdminController.updateUserStatus
);

router.get("/properties", AdminController.getProperties);
router.get("/rentals", AdminController.getRentals);

export const AdminRoutes = router;
