import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  loginValidationSchema,
  registerValidationSchema
} from "../../schemas/auth.schema";
import { AuthController } from "./auth.controller";

const router = Router();

router.post(
  "/register",
  validateRequest({ body: registerValidationSchema }),
  AuthController.register
);

router.post(
  "/login",
  validateRequest({ body: loginValidationSchema }),
  AuthController.login
);

export const AuthRoutes = router;
