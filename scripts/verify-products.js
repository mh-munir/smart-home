import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-home-affiliate";

async function verifyProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");
    
    const products = await Product.find({}).select("title");
    
    console.log("📦 Current Products in Database:");
    console.log("================================\n");
    
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}`);
    });
    
    console.log(`\n📊 Total: ${products.length} product(s)\n`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verifyProducts();
