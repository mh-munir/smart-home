import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-home-affiliate";

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

/**
 * Update products to add (Amazon) if not already present
 */
async function updateProductsWithAmazon() {
  try {
    const products = await Product.find({});
    
    if (products.length === 0) {
      console.log("⚠️  No products found to update");
      return;
    }

    let updatedCount = 0;

    for (const product of products) {
      // Only add (Amazon) if it's not already in the title
      if (!product.title.includes("(Amazon)")) {
        product.title = `${product.title} (Amazon)`;
        await product.save();
        updatedCount++;
        console.log(`✅ Updated: ${product.title}`);
      }
    }

    console.log(`\n📊 Summary: ${updatedCount} product(s) updated with "(Amazon)"`);
  } catch (error) {
    console.error("❌ Error updating products:", error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log("🔄 Starting product update...\n");
    
    await connectDB();
    await updateProductsWithAmazon();
    
    console.log("\n✅ Products updated successfully!\n");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Update failed:", error);
    process.exit(1);
  }
}

// Run update
main();
