import { z } from "zod";

export const userRoleSchema = z.enum(["TENANT", "LANDLORD", "ADMIN"]);
export const userStatusSchema = z.enum(["ACTIVE", "BANNED"]);
export const propertyStatusSchema = z.enum(["AVAILABLE", "UNAVAILABLE"]);
export const rentalStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED"
]);
export const paymentStatusSchema = z.enum([
  "PENDING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
  "REFUNDED"
]);

export const emailSchema = z
  .string()
  .trim()
  .email("Valid email is required")
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .max(72, "Password must be at most 72 characters long");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters long")
  .max(80, "Name must be at most 80 characters long");

export const optionalTextSchema = z
  .string()
  .trim()
  .max(1000, "Text must be at most 1000 characters long")
  .optional();

export const positiveIntSchema = z
  .number()
  .int("Value must be an integer")
  .positive("Value must be positive");

export const positivePriceSchema = z
  .number()
  .positive("Amount must be positive")
  .max(9999999999, "Amount is too large");

export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : 1))
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : 10))
    .pipe(z.number().int().positive().max(100))
});
