import express from "express";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

const app = express();

// Middlewares
app.use(express.json()); // To parse JSON request bodies

// Simple root route
app.get("/", (req, res) => {
  res.send("LinkSwift API is running... 🚀");
});

// We will add our API routes here
// app.use('/api/v1', apiRoutes);
// app.use('/', redirectRoutes);

// We will add our Error Handling middleware here
// app.use(errorHandler);

export default app;
