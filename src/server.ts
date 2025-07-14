import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./config/env";
import app from "./app";
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to MongoDB");
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();

const gracefulShutdown = (reason: string, code: number = 0) => {
  console.log(`${reason} received`);
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(code)
    });
  } else {
    process.exit(code);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown("Uncaught Exception", 1);
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Rejection:", reason);
  gracefulShutdown("Unhandled Rejection", 1);
});

// SIGINT: Triggered when you press Ctrl + C to stop the app manually.

// SIGTERM: Sent by the system to request app shutdown (e.g., from a cloud or Docker).

// uncaughtException: Happens when an error is thrown without a try/catch.

// unhandledRejection: Happens when a Promise is rejected without a .catch().
