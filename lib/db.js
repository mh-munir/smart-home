import mongoose from "mongoose";
import dns from "dns";

export const hasMongoDBConfig = () =>
  typeof process.env.MONGODB_URI === "string" &&
  process.env.MONGODB_URI.trim().length > 0;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// High-performance MongoDB connection with pooling, retries and optional DNS servers
export const connectDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!hasMongoDBConfig()) {
    throw new Error("MONGODB_URI is not configured");
  }

  // Optionally override DNS servers used by Node resolver to avoid flaky local DNS
  if (process.env.MONGO_DNS_SERVERS) {
    try {
      const servers = process.env.MONGO_DNS_SERVERS.split(",").map((s) => s.trim()).filter(Boolean);
      if (servers.length) dns.setServers(servers);
    } catch (e) {
      console.warn("Failed to set custom DNS servers for Node resolver:", e?.message || e);
    }
  }

  const maxRetries = Number(process.env.MONGO_CONNECT_RETRIES) || 3;
  const serverSelectionTimeoutMS = Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 20000;

  const options = {
    // Connection pooling for high traffic
    maxPoolSize: 10,
    minPoolSize: 5,

    // Timeouts
    serverSelectionTimeoutMS,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,

    // Performance optimization
    retryWrites: true,
    retryReads: true,
    journal: true,

    // Connection monitoring
    serverMonitoringMode: "auto",
  };

  let attempt = 0;
  while (true) {
    try {
      attempt += 1;
      await mongoose.connect(process.env.MONGODB_URI, options);
      console.log("MongoDB Connected with optimized pooling");
      return mongoose.connection;
    } catch (error) {
      console.error(`MongoDB connection error (attempt ${attempt}):`, error?.message || error);
      if (attempt >= maxRetries) {
        throw error;
      }
      // Exponential backoff (capped)
      const delay = Math.min(30000, 1000 * Math.pow(2, attempt));
      console.log(`Retrying MongoDB connection in ${delay}ms...`);
      await sleep(delay);
    }
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
