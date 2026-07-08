import { UserRole } from "@prisma/client";
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import {
  idParamSchema,
  validateRequest
} from "../../middlewares/validateRequest";
import {
  categoryValidationSchema,
  updateCategoryValidationSchema
} from "../../schemas/admin.schema";
import { CategoryController } from "./category.controller";

const router = Router();

router.get("/", CategoryController.getAll);

router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest({ body: categoryValidationSchema }),
  CategoryController.create
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest({
    params: idParamSchema,
    body: updateCategoryValidationSchema
  }),
  CategoryController.update
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest({ params: idParamSchema }),
  CategoryController.delete
);

export const CategoryRoutes = router;
