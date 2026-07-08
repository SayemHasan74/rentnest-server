import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerValidationSchema } from "../../schemas/auth.schema";
import { AuthController } from "./auth.controller";

const router = Router();

router.post(
  "/register",
  validateRequest({ body: registerValidationSchema }),
  AuthController.register
);

export const AuthRoutes = router;
