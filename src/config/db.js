import mongoose from "mongoose";
import { createClient } from "redis";

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are not strictly needed in Mongoose 6+, but good to know
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// --- Redis Client Setup ---
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  // In a production env, you'd also add a password:
  // password: process.env.REDIS_PASSWORD
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

// We need to connect the client manually
// We'll wrap this in a self-invoking async function to use await
(async () => {
  try {
    await redisClient.connect();
    console.log("Redis Client Connected");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

// Export both the DB connector and the (already connecting) Redis client
export { connectDB, redisClient };
