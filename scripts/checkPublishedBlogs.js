import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectDB } from "../lib/db.js";
import Blog from "../models/Blog.js";

async function run() {
  try {
    await connectDB();
    const pubs = await Blog.find({ published: true }).lean();
    console.log(`Published blogs found: ${pubs.length}`);
    pubs.forEach((b) => {
      console.log(`- ${b.title} (slug: ${b.slug})`);
    });
    process.exit(0);
  } catch (err) {
    console.error("Error checking published blogs:", err);
    process.exit(1);
  }
}

run();
