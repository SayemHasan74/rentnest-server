import { z } from "zod";
import {
  positiveIntSchema,
  positivePriceSchema,
  propertyStatusSchema
} from "./common.schema";

export const propertyFilterQuerySchema = z.object({
  location: z.string().trim().optional(),
  minPrice: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .pipe(z.number().positive().optional()),
  maxPrice: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .pipe(z.number().positive().optional()),
  type: z.string().trim().optional(),
  amenities: z.string().trim().optional(),
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

export const propertyValidationSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  location: z.string().trim().min(2).max(120),
  address: z.string().trim().max(255).optional(),
  rentAmount: positivePriceSchema,
  bedrooms: positiveIntSchema.max(20),
  bathrooms: positiveIntSchema.max(20),
  areaSqFt: positiveIntSchema.max(100000).optional(),
  amenities: z.array(z.string().trim().min(1)).default([]),
  images: z.array(z.string().trim().url()).default([]),
  status: propertyStatusSchema.optional(),
  categoryId: z.string().min(1, "Category ID is required")
});

export const updatePropertyValidationSchema =
  propertyValidationSchema.partial();
