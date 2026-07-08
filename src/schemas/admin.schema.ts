import { z } from "zod";
import { userStatusSchema } from "./common.schema";

export const updateUserStatusValidationSchema = z.object({
  status: userStatusSchema
});

export const categoryValidationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional()
});

export const updateCategoryValidationSchema = categoryValidationSchema.partial();
