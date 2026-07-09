import { UserRole } from "@prisma/client";
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import {
  idParamSchema,
  validateRequest
} from "../../middlewares/validateRequest";
import {
  propertyValidationSchema,
  updatePropertyAvailabilityValidationSchema,
  updatePropertyValidationSchema
} from "../../schemas/property.schema";
import { updateRentalStatusValidationSchema } from "../../schemas/rental.schema";
import { LandlordPropertyController } from "./landlord-property.controller";
import { LandlordRentalController } from "./landlord-rental.controller";

const router = Router();

router.use(auth(UserRole.LANDLORD));

router.get("/properties", LandlordPropertyController.getMine);

router.post(
  "/properties",
  validateRequest({ body: propertyValidationSchema }),
  LandlordPropertyController.create
);

router.put(
  "/properties/:id",
  validateRequest({
    params: idParamSchema,
    body: updatePropertyValidationSchema
  }),
  LandlordPropertyController.update
);

router.patch(
  "/properties/:id/availability",
  validateRequest({
    params: idParamSchema,
    body: updatePropertyAvailabilityValidationSchema
  }),
  LandlordPropertyController.updateAvailability
);

router.delete(
  "/properties/:id",
  validateRequest({ params: idParamSchema }),
  LandlordPropertyController.delete
);

router.get("/requests", LandlordRentalController.getRequests);

router.patch(
  "/requests/:id",
  validateRequest({
    params: idParamSchema,
    body: updateRentalStatusValidationSchema
  }),
  LandlordRentalController.updateStatus
);

export const LandlordRoutes = router;
