import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Blog from "../models/Blog.js";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-home-affiliate";

// Known dummy product slugs (from seed scripts)
const productSlugs = [
  "smart-door-lock-pro",
  "4k-smart-security-camera",
  "smart-led-bulb-kit",
  "smart-thermostat",
  "smart-plug-energy",
  "smart-motion-sensor",
  "smart-doorbell-video",
  "smart-garage-door",
  "smart-window-sensor",
  "smart-speaker",
  "smart-lighting-strip",
  "smart-water-leak",
  "smart-air-purifier",
  "smart-pet-feeder",
  "smart-blinds",
  "smart-speaker-alexa",
  "smart-tv-55-4k",
  "smart-projector",
  "smart-home-hub",
  "smart-wifi-repeater",
  "robot-vacuum",
  "smart-washing-machine",
  "smart-mop-robot",
  "smart-power-strip",
  "smart-plug-individual",
  "smart-power-monitor",
  "smart-led-light-strip",
  "smart-coffee-maker",
  "smart-electric-kettle",
  "smart-rice-cooker",
  "smart-oven-thermometer",
  "smart-fridge-lock",
  "smart-electric-bed",
  "smart-charging-desk",
  "smart-sofa-led",
  "smart-mattress",
  "smart-humidifier",
  "smart-ac-controller",
  "smart-tv-55-4k",
  "smart-projector",
];

// Known dummy blog slugs (from seed scripts)
const blogSlugs = [
  "setup-first-smart-home",
  "best-smart-door-locks",
  "smart-lighting-comparison",
  "save-money-smart-thermostat",
  "smart-security-guide",
];

async function main() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not configured. Aborting.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB — removing dummy data (safe mode: by slug/affiliate tag)");

  try {
    // Remove products by slug or affiliate tag used in seeds
    const prodDelete = await Product.deleteMany({
      $or: [
        { slug: { $in: productSlugs } },
        { affiliateLink: { $regex: /smarthomedeal-20/ } },
      ],
    });

    console.log(`Deleted ${prodDelete.deletedCount} product(s)`);

    // Remove all blogs
    const blogDelete = await Blog.deleteMany({});
    console.log(`Deleted ${blogDelete.deletedCount} blog(s) (all blogs removed)`);

    console.log("Cleanup complete.");
  } catch (err) {
    console.error("Error during cleanup:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
