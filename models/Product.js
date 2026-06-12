import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true, // Index for faster searches
      text: true,  // Enable full-text search
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      index: true, // Index for slug lookups
    },
    image: {
      type: String,
      default: null,
    },
    price: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: 4.5,
      index: true, // Index for sorting by rating
    },
    affiliateLink: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: null,
      index: true, // Index for category filtering
    },
    description: {
      type: String,
      default: null,
    },
    clicks: {
      type: Number,
      default: 0,
      index: true, // Index for popular products
    },
    conversions: {
      type: Number,
      default: 0,
    },
    // High-traffic optimization fields
    views: {
      type: Number,
      default: 0,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
      index: true, // For cache invalidation
    },
  },
  { 
    timestamps: true,
    // Optimize document structure
    minimize: true,
  }
);

// Compound index for efficient filtering and sorting
ProductSchema.index({ category: 1, rating: -1 });
ProductSchema.index({ category: 1, clicks: -1 });

// TTL index for automatic cleanup (optional)
ProductSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

// Create text index for full-text search
ProductSchema.index({ title: "text", description: "text" });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
