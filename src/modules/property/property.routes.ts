import { Router } from "express";
import {
  idParamSchema,
  validateRequest
} from "../../middlewares/validateRequest";
import { propertyFilterQuerySchema } from "../../schemas/property.schema";
import { PropertyController } from "./property.controller";

const router = Router();

router.get(
  "/",
  validateRequest({ query: propertyFilterQuerySchema }),
  PropertyController.getAll
);

router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  PropertyController.getById
);

export const PropertyRoutes = router;
