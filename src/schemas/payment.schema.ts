import { z } from "zod";

export const createPaymentValidationSchema = z.object({
  rentalRequestId: z.string().min(1, "Rental request ID is required")
});

export const confirmPaymentValidationSchema = z.object({
  providerSessionId: z.string().min(1, "Provider session ID is required"),
  status: z.enum(["COMPLETED", "FAILED", "CANCELLED"])
});
