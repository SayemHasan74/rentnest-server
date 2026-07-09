import dotenv from "dotenv";

dotenv.config();

type NodeEnv = "development" | "production" | "test";

const parsePort = (value: string | undefined): number => {
  const port = Number(value || 5000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return port;
};

const parseNodeEnv = (value: string | undefined): NodeEnv => {
  const nodeEnv = value || "development";

  if (!["development", "production", "test"].includes(nodeEnv)) {
    throw new Error("NODE_ENV must be development, production, or test");
  }

  return nodeEnv as NodeEnv;
};

const parseAllowedOrigins = (value: string | undefined): string[] => {
  if (!value) {
    return ["*"];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const getRequiredValue = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
};

export const env = {
  nodeEnv: parseNodeEnv(process.env.NODE_ENV),
  port: parsePort(process.env.PORT),
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
  jwtSecret: getRequiredValue("JWT_SECRET", "rentnest-development-secret"),
  jwtExpiresIn: getRequiredValue("JWT_EXPIRES_IN", "7d"),
  stripeSecretKey: getRequiredValue("STRIPE_SECRET_KEY", "sk_test_placeholder"),
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  stripeSuccessUrl: getRequiredValue(
    "STRIPE_SUCCESS_URL",
    "http://localhost:5000/api/payments/success"
  ),
  stripeCancelUrl: getRequiredValue(
    "STRIPE_CANCEL_URL",
    "http://localhost:5000/api/payments/cancel"
  )
};
