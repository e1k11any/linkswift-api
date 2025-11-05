import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ MONGO_URI not found in .env file!");
  process.exit(1);
}

console.log(`Attempting to connect to: ${mongoUri}`);

// We'll set a shorter timeout to fail faster
mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 3000, // 3-second timeout
  })
  .then(() => {
    console.log("✅ Database connected successfully!");
    mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Database connection failed:");
    console.error(err.message); // Print the specific error
    process.exit(1);
  });
