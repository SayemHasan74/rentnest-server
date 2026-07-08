import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.port, () => {
  console.log(`RentNest API listening on port ${env.port}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received. Closing RentNest API server.`);

  server.close(() => {
    console.log("RentNest API server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
