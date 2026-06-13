import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Blog from "../models/Blog.js";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-home-affiliate";

async function main() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not configured. Aborting.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB — preparing to delete all products and blogs");
  } catch (connectErr) {
    console.error("Failed to connect to MongoDB:", connectErr && connectErr.message ? connectErr.message : connectErr);
    process.exit(1);
  }

  try {
    const prodCountBefore = await Product.countDocuments();
    const blogCountBefore = await Blog.countDocuments();
    console.log(`Before: products=${prodCountBefore}, blogs=${blogCountBefore}`);

    const prodDelete = await Product.deleteMany({});
    const blogDelete = await Blog.deleteMany({});

    const prodCountAfter = await Product.countDocuments();
    const blogCountAfter = await Blog.countDocuments();

    console.log(`Deleted ${prodDelete.deletedCount} product(s)`);
    console.log(`Deleted ${blogDelete.deletedCount} blog(s)`);
    console.log(`After: products=${prodCountAfter}, blogs=${blogCountAfter}`);

    console.log("Delete operation complete.");
  } catch (err) {
    console.error("Error during deletion:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
