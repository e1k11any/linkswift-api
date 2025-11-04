import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    longUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true, // <-- CRITICAL: This is our index!
      trim: true,
    },
    // (Optional but good) We'll add this later for analytics
    // clicks: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// This is the model we will interact with in our controllers
const Url = mongoose.model("Url", urlSchema);

export default Url;
