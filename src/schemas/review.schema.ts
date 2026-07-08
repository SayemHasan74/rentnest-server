import { z } from "zod";

export const reviewValidationSchema = z.object({
  rentalRequestId: z.string().min(1, "Rental request ID is required"),
  propertyId: z.string().min(1, "Property ID is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional()
});
