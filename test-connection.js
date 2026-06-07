import mongoose from "mongoose";

async function test() {
  console.log("Testing MongoDB connection...");
  console.log("MONGODB_URI:", process.env.MONGODB_URI);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected!");
    
    const products = await mongoose.connection.db.collection("products").countDocuments();
    console.log(`Found ${products} products`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

test();
