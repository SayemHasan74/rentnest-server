import { Router } from "express";
import { appConfig } from "../constants/app";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { CategoryRoutes } from "../modules/category/category.routes";
import { LandlordRoutes } from "../modules/landlord/landlord.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";
import { PropertyRoutes } from "../modules/property/property.routes";
import { RentalRoutes } from "../modules/rental/rental.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
import { sendResponse } from "../utils/sendResponse";

const router = Router();

router.get("/health", (_req, res) => {
  sendResponse(res, {
    message: "Server health check passed",
    data: {
      service: appConfig.service,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

router.use("/auth", AuthRoutes);
router.use("/admin", AdminRoutes);
router.use("/properties", PropertyRoutes);
router.use("/categories", CategoryRoutes);
router.use("/landlord", LandlordRoutes);
router.use("/rentals", RentalRoutes);
router.use("/payments", PaymentRoutes);
router.use("/reviews", ReviewRoutes);

export default router;
