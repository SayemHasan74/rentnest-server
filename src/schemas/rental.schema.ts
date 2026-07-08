import { z } from "zod";

export const createRentalValidationSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  moveInDate: z.coerce.date(),
  rentalMonths: z.number().int().positive().max(60),
  message: z.string().trim().max(1000).optional()
});

export const updateRentalStatusValidationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    message: "Status must be APPROVED or REJECTED"
  }),
  rejectionReason: z.string().trim().max(500).optional()
});
