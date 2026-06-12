import mongoose from "mongoose";

export const hasMongoDBConfig = () =>
  typeof process.env.MONGODB_URI === "string" &&
  process.env.MONGODB_URI.trim().length > 0;

// High-performance MongoDB connection with pooling and caching
export const connectDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!hasMongoDBConfig()) {
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    const options = {
      // Connection pooling for high traffic
      maxPoolSize: 10,
      minPoolSize: 5,
      
      // Timeouts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      
      // Performance optimization
      retryWrites: true,
      retryReads: true,
      journal: true,
      
      // Connection monitoring
      serverMonitoringMode: "auto",
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log("MongoDB Connected with optimized pooling");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Helper function for optimized queries
export const queryDB = async (Model, filter = {}, options = {}) => {
  await connectDB();
  
  const defaultOptions = {
    lean: true, // Return plain objects, not Mongoose docs (faster)
    select: "", // Leave empty to select all fields
  };
  
  const queryOptions = { ...defaultOptions, ...options };
  return Model.findOne(filter, queryOptions.select).lean(queryOptions.lean);
};

// Helper for batch queries with pagination
export const batchQueryDB = async (Model, filter = {}, page = 1, limit = 20, sort = {}) => {
  await connectDB();
  
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    Model.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Model.countDocuments(filter),
  ]);
  
  return {
    data,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};
