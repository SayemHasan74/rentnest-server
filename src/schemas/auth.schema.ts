import { z } from "zod";
import { emailSchema, nameSchema, passwordSchema } from "./common.schema";

export const registerValidationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(["TENANT", "LANDLORD"], {
    message: "Role must be TENANT or LANDLORD"
  }),
  phone: z.string().trim().min(6).max(20).optional(),
  address: z.string().trim().max(255).optional()
});

export const loginValidationSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});
