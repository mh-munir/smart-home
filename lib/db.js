import mongoose from "mongoose";
import dns from "dns";

export const hasMongoDBConfig = () =>
  typeof process.env.MONGODB_URI === "string" &&
  process.env.MONGODB_URI.trim().length > 0;

const isBuildPhase =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.argv.some((a) => a.includes("build"));

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Cache the connection promise to prevent multiple concurrent connect calls
let connectingPromise = null;

// High-performance MongoDB connection with pooling, retries and optional DNS servers
export const connectDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  // If a connection attempt is already in progress, reuse it
  if (connectingPromise) return connectingPromise;

  if (!hasMongoDBConfig()) {
    throw new Error("MONGODB_URI is not configured");
  }

  // Optionally override DNS servers used by Node resolver to avoid flaky local DNS
  if (process.env.MONGO_DNS_SERVERS) {
    try {
      const servers = process.env.MONGO_DNS_SERVERS.split(",").map((s) => s.trim()).filter(Boolean);
      if (servers.length) dns.setServers(servers);
    } catch {
      // Ignore DNS server configuration errors
    }
  }

  // During build: use short timeouts and no retries so pages can be
  // statically generated with empty data when MongoDB is unavailable.
  const maxRetries = isBuildPhase
    ? 1
    : Number(process.env.MONGO_CONNECT_RETRIES) || 3;
  const serverSelectionTimeoutMS = isBuildPhase
    ? 5000
    : Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 20000;

  const options = {
    // Connection pooling for high traffic
    maxPoolSize: 10,
    minPoolSize: 5,

    // Timeouts
    serverSelectionTimeoutMS,
    socketTimeoutMS: 45000,
    connectTimeoutMS: isBuildPhase ? 3000 : 10000,

    // Disable command buffering — queries will fail immediately if not connected
    // instead of queuing and timing out after 10s
    bufferCommands: false,

    // Performance optimization
    retryWrites: true,
    retryReads: true,
    journal: true,

    // Connection monitoring
    serverMonitoringMode: "auto",
  };

  connectingPromise = (async () => {
    let attempt = 0;
    while (true) {
      try {
        attempt += 1;
        await mongoose.connect(process.env.MONGODB_URI, options);

        // Ensure the connection is truly ready before returning
        if (mongoose.connection.readyState !== 1) {
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Timed out waiting for Mongoose readyState === 1"));
            }, 5000);
            mongoose.connection.once("connected", () => {
              clearTimeout(timeout);
              resolve();
            });
            mongoose.connection.once("error", (err) => {
              clearTimeout(timeout);
              reject(err);
            });
          });
        }

        // Connection successful
        return mongoose.connection;
      } catch (error) {
        if (attempt >= maxRetries) {
          connectingPromise = null;
          throw error;
        }
        // Exponential backoff (capped)
        const delay = Math.min(30000, 1000 * Math.pow(2, attempt));
        await sleep(delay);
      }
    }
  })();

  try {
    return await connectingPromise;
  } finally {
    connectingPromise = null;
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
