import { connectDB } from "../lib/db.js";
import Product from "../models/Product.js";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    const res = await Product.deleteMany({});
    console.log(`Deleted ${res.deletedCount ?? 0} product(s)`);
    process.exit(0);
  } catch (err) {
    console.error("Error deleting products:", err);
    process.exit(1);
  }
}

run();
