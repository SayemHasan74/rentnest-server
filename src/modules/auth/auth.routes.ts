import { Router } from "express";
import { auth } from "../../middlewares/auth";
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

router.get("/me", auth(), AuthController.me);

export const AuthRoutes = router;
