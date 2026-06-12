import mongoose from "mongoose";
import AdminUser from "../models/AdminUser.js";
import Product from "../models/Product.js";
import Blog from "../models/Blog.js";
import dotenv from "dotenv";
import { hashPassword, generateSecurePassword } from "../lib/password-utils.js";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-home-affiliate";

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected for seeding");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

/**
 * Create default admin user
 */
async function seedAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@smartome.local";
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "SmartAdmin123!@#";
    const adminFullName = process.env.ADMIN_DEFAULT_FULLNAME || "Default Admin";

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`⚠️  Admin user already exists: ${adminEmail}`);
      return;
    }

    // Create new admin user
    const adminUser = new AdminUser({
      email: adminEmail,
      password: adminPassword, // Will be hashed by the pre-save hook
      fullName: adminFullName,
      role: "super_admin",
      isActive: true,
      permissions: {
        manageProducts: true,
        manageBlogs: true,
        manageHeroSlides: true,
        manageAdmins: true,
        viewAnalytics: true,
      },
    });

    await adminUser.save();
    console.log("✅ Default admin user created successfully!");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("   ⚠️  IMPORTANT: Change this password immediately after logging in!");
    
    return adminUser;
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  }
}

/**
 * Seed dummy products (existing)
 */
async function seedProducts() {
  try {
    const count = await Product.countDocuments();
    
    if (count > 0) {
      console.log(`⚠️  Products already exist (${count} found). Skipping product seeding.`);
      return;
    }

    const dummyProducts = [
      // Smart Lock & Security
      {
        title: "Smart Door Lock Pro - WiFi & Fingerprint (Amazon)",
        slug: "smart-door-lock-pro",
        price: "$129.99",
        rating: 4.8,
        category: "Smart Lock",
        description: "Professional smart door lock with WiFi connectivity, fingerprint recognition, and mobile app control.",
      },
      {
        title: "4K Ultra HD Smart Security Camera (Amazon)",
        slug: "4k-smart-security-camera",
        price: "$79.99",
        rating: 4.6,
        category: "Smart Camera",
        description: "4K resolution with night vision, motion detection, and two-way audio.",
      },
      
      // Smart Lighting
      {
        title: "Smart LED Bulb Starter Kit (16M Colors) (Amazon)",
        slug: "smart-led-bulb-kit",
        price: "$39.99",
        rating: 4.5,
        category: "Smart Lighting",
        description: "16 million color options, dimmable, compatible with Alexa and Google Home.",
      },
      {
        title: "Smart LED Light Strip 32.8ft RGB WiFi (Amazon)",
        slug: "smart-led-light-strip",
        price: "$34.99",
        rating: 4.7,
        category: "Smart Lighting",
        description: "WiFi controlled RGB LED strips, app control, music sync, perfect for bedroom and living room.",
      },
      
      // Smart Kitchen Appliances
      {
        title: "Smart WiFi Coffee Maker with Timer (Amazon)",
        slug: "smart-coffee-maker",
        price: "$89.99",
        rating: 4.6,
        category: "Smart Kitchen",
        description: "Brew coffee remotely, timer control, voice assistant compatible, keeps coffee warm for 2 hours.",
      },
      {
        title: "Smart Electric Kettle WiFi Control (Amazon)",
        slug: "smart-electric-kettle",
        price: "$54.99",
        rating: 4.5,
        category: "Smart Kitchen",
        description: "Temperature control, schedules, auto shut-off, voice control compatible, 1.7L capacity.",
      },
      {
        title: "Smart Rice Cooker with App Control (Amazon)",
        slug: "smart-rice-cooker",
        price: "$79.99",
        rating: 4.7,
        category: "Smart Kitchen",
        description: "WiFi enabled, multiple cooking modes, remote monitoring, perfect rice every time.",
      },
      {
        title: "Smart Oven Thermometer WiFi Enabled (Amazon)",
        slug: "smart-oven-thermometer",
        price: "$44.99",
        rating: 4.4,
        category: "Smart Kitchen",
        description: "Wireless meat thermometer, app alerts, cooking guides, dual temperature sensors.",
      },
      {
        title: "Smart Refrigerator Door Lock (Amazon)",
        slug: "smart-fridge-lock",
        price: "$69.99",
        rating: 4.6,
        category: "Smart Kitchen",
        description: "WiFi controlled fridge lock, app notifications, timer settings, child safety lock.",
      },
      
      // Smart Furniture
      {
        title: "Smart Electric Bed Frame Adjustable (Amazon)",
        slug: "smart-electric-bed",
        price: "$449.99",
        rating: 4.8,
        category: "Smart Furniture",
        description: "WiFi enabled adjustable bed, head/foot control, sleep tracking, dual zone temperature.",
      },
      {
        title: "Smart Desk with USB Charging Port (Amazon)",
        slug: "smart-charging-desk",
        price: "$199.99",
        rating: 4.5,
        category: "Smart Furniture",
        description: "Height adjustable, built-in WiFi charging pad, LED lighting, app controlled.",
      },
      {
        title: "Smart Sofa with LED Lighting (Amazon)",
        slug: "smart-sofa-led",
        price: "$599.99",
        rating: 4.6,
        category: "Smart Furniture",
        description: "WiFi LED ambient lighting, USB charging ports, voice control compatible.",
      },
      {
        title: "Smart Mattress with Sleep Tracking (Amazon)",
        slug: "smart-mattress",
        price: "$799.99",
        rating: 4.7,
        category: "Smart Furniture",
        description: "Sleep quality monitoring, temperature control zones, app sync with wearables.",
      },
      
      // Home Climate Control
      {
        title: "Smart Thermostat WiFi Temperature Control (Amazon)",
        slug: "smart-thermostat",
        price: "$149.99",
        rating: 4.8,
        category: "Smart Climate",
        description: "Learning thermostat, energy saving, app control, voice assistant compatible.",
      },
      {
        title: "Smart Humidifier WiFi Ultrasonic (Amazon)",
        slug: "smart-humidifier",
        price: "$59.99",
        rating: 4.5,
        category: "Smart Climate",
        description: "WiFi app control, humidity monitoring, auto shut-off, whisper quiet operation.",
      },
      {
        title: "Smart Air Purifier HEPA Filter WiFi (Amazon)",
        slug: "smart-air-purifier",
        price: "$129.99",
        rating: 4.7,
        category: "Smart Climate",
        description: "WiFi monitoring, HEPA + Activated Carbon filters, air quality alerts, covers 300 sq ft.",
      },
      {
        title: "Smart AC Unit Controller WiFi (Amazon)",
        slug: "smart-ac-controller",
        price: "$69.99",
        rating: 4.4,
        category: "Smart Climate",
        description: "Retrofit any AC unit, WiFi control, scheduling, energy monitoring.",
      },
      
      // Smart Entertainment
      {
        title: "Smart Speaker with Alexa (Amazon)",
        slug: "smart-speaker-alexa",
        price: "$99.99",
        rating: 4.8,
        category: "Smart Entertainment",
        description: "Premium sound quality, voice control, home automation hub, music streaming.",
      },
      {
        title: "Smart WiFi Enabled TV 55 inch 4K (Amazon)",
        slug: "smart-tv-55-4k",
        price: "$349.99",
        rating: 4.7,
        category: "Smart Entertainment",
        description: "4K resolution, built-in streaming apps, voice control, HDR support.",
      },
      {
        title: "Smart Projector WiFi 1080p (Amazon)",
        slug: "smart-projector",
        price: "$299.99",
        rating: 4.6,
        category: "Smart Entertainment",
        description: "1080p resolution, WiFi casting, 100 inch screen size, built-in speaker.",
      },
      
      // Smart Home Automation Hub
      {
        title: "Smart Home Hub Central Control (Amazon)",
        slug: "smart-home-hub",
        price: "$199.99",
        rating: 4.8,
        category: "Smart Hub",
        description: "Central control for all devices, voice command, automation routines, 24/7 monitoring.",
      },
      {
        title: "Smart WiFi Repeater Range Extender (Amazon)",
        slug: "smart-wifi-repeater",
        price: "$34.99",
        rating: 4.5,
        category: "Smart Connectivity",
        description: "Extend WiFi range up to 300 sq ft, 1200Mbps speed, easy setup.",
      },
      
      // Smart Home Cleaning
      {
        title: "Robot Vacuum Cleaner WiFi Enabled (Amazon)",
        slug: "robot-vacuum",
        price: "$299.99",
        rating: 4.7,
        category: "Smart Cleaning",
        description: "WiFi app control, automatic charging, mapping technology, 120 min runtime.",
      },
      {
        title: "Smart Washing Machine WiFi Control (Amazon)",
        slug: "smart-washing-machine",
        price: "$699.99",
        rating: 4.6,
        category: "Smart Kitchen",
        description: "WiFi enabled, energy efficient, multiple wash modes, remote monitoring.",
      },
      {
        title: "Smart Mop Robot Automatic (Amazon)",
        slug: "smart-mop-robot",
        price: "$249.99",
        rating: 4.5,
        category: "Smart Cleaning",
        description: "Mopping and vacuuming combo, WiFi control, auto-charge, smart mapping.",
      },
      
      // Smart Plugs & Power
      {
        title: "Smart WiFi Power Strip Surge Protected (Amazon)",
        slug: "smart-power-strip",
        price: "$39.99",
        rating: 4.6,
        category: "Smart Plugs",
        description: "4 Smart outlets, individual control, energy monitoring, voice compatible.",
      },
      {
        title: "Smart Plug WiFi Individual Outlet (Amazon)",
        slug: "smart-plug-individual",
        price: "$19.99",
        rating: 4.4,
        category: "Smart Plugs",
        description: "Remote on/off control, scheduling, energy monitoring, compact design.",
      },
      {
        title: "Smart Power Monitor WiFi (Amazon)",
        slug: "smart-power-monitor",
        price: "$29.99",
        rating: 4.5,
        category: "Smart Plugs",
        description: "Real-time energy usage tracking, bills estimation, identify power wasters.",
      },
    ];

    await Product.insertMany(dummyProducts);
    console.log(`✅ ${dummyProducts.length} dummy products created`);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
}

/**
 * Main seeding function
 */
async function seed() {
  try {
    console.log("🌱 Starting database seeding...\n");
    
    await connectDB();
    
    console.log("📝 Seeding Admin User...");
    await seedAdminUser();
    
    console.log("\n📝 Seeding Products...");
    await seedProducts();
    
    console.log("\n✅ Database seeding completed successfully!\n");
    console.log("🎉 Your website is ready to use!");
    console.log("\n📋 Admin Panel Credentials:");
    console.log(`   URL: http://localhost:3000/admin/login`);
    console.log(`   Email: ${process.env.ADMIN_DEFAULT_EMAIL || "admin@smartome.local"}`);
    console.log(`   Password: ${process.env.ADMIN_DEFAULT_PASSWORD || "SmartAdmin123!@#"}`);
    console.log("\n⚠️  Remember to change these credentials after first login!\n");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run seeding
seed();
