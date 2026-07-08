import { RequestHandler } from "express";
import { ZodError, z } from "zod";

type RequestValidationSchema = Partial<{
  body: z.ZodType;
  params: z.ZodType;
  query: z.ZodType;
}>;

export const validateRequest =
  (schema: RequestValidationSchema): RequestHandler =>
  (req, _res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params) as typeof req.params;
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query) as typeof req.query;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }

      next(error);
    }
  };

export const idParamSchema = z.object({
  id: z.string().min(1, "ID is required")
});
