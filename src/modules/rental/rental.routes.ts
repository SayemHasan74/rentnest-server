import { UserRole } from "@prisma/client";
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import {
  idParamSchema,
  validateRequest
} from "../../middlewares/validateRequest";
import { createRentalValidationSchema } from "../../schemas/rental.schema";
import { RentalController } from "./rental.controller";

const router = Router();

router.use(auth(UserRole.TENANT));

router.post(
  "/",
  validateRequest({ body: createRentalValidationSchema }),
  RentalController.create
);

router.get("/", RentalController.getMine);

router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  RentalController.getById
);

export const RentalRoutes = router;
