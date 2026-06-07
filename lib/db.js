import mongoose from "mongoose";

export const hasMongoDBConfig = () =>
  typeof process.env.MONGODB_URI === "string" &&
  process.env.MONGODB_URI.trim().length > 0;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  if (!hasMongoDBConfig()) {
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
