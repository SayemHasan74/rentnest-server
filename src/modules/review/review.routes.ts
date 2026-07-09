import { UserRole } from "@prisma/client";
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { reviewValidationSchema } from "../../schemas/review.schema";
import { ReviewController } from "./review.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.TENANT),
  validateRequest({ body: reviewValidationSchema }),
  ReviewController.create
);

export const ReviewRoutes = router;
