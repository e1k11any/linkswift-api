import express from "express";
import dotenv from "dotenv";
import urlRoutes from "./routes/url.routes.js";
import redirectRoutes from "./routes/redirect.routes.js";
import errorHandler from "./middleware/errorHandler.js";

// Load env vars
dotenv.config();

const app = express();

// Middlewares
app.use(express.json()); // To parse JSON request bodies

// Simple root route
app.get("/", (req, res) => {
  res.send("LinkSwift API is running... 🚀");
});

// --- API Routes ---
app.use("/api/v1", urlRoutes);
app.use("/", redirectRoutes);

app.use(errorHandler);

export default app;
