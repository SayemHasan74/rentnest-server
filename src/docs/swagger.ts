import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi";

const router = Router();

router.get("/docs.json", (_req, res) => {
  res.status(200).json(openApiDocument);
});

router.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

export const SwaggerRoutes = router;
