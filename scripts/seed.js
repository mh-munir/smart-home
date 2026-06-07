import mongoose from "mongoose";
import Product from "../models/Product.js";
import Blog from "../models/Blog.js";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-home-affiliate";

const dummyProducts = [
  {
    title: "Smart Door Lock Pro - WiFi & Fingerprint",
    slug: "smart-door-lock-pro",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71w0oWXUFML._AC_SL1500_.jpg",
    price: "$129.99",
    rating: 4.8,
    affiliateLink: "https://amazon.com/s?k=smart+door+lock&tag=smarthomedeal-20",
    category: "Smart Lock",
    description:
      "Professional smart door lock with WiFi connectivity, fingerprint recognition, and mobile app control. Waterproof and easy installation.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "4K Ultra HD Smart Security Camera",
    slug: "4k-smart-security-camera",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71Xa3k1Z1OL._AC_SL1500_.jpg",
    price: "$79.99",
    rating: 4.6,
    affiliateLink: "https://amazon.com/s?k=4k+smart+security+camera&tag=smarthomedeal-20",
    category: "Smart Camera",
    description:
      "4K resolution with night vision, motion detection, and two-way audio. Cloud storage and local recording options available.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart LED Bulb Starter Kit (16M Colors)",
    slug: "smart-led-bulb-kit",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/51HE8-lDXPL._AC_SL1000_.jpg",
    price: "$39.99",
    rating: 4.5,
    affiliateLink: "https://amazon.com/s?k=smart+led+bulb&tag=smarthomedeal-20",
    category: "Smart Lighting",
    description:
      "16 million color options, dimmable, compatible with Alexa and Google Home. Energy efficient LED technology.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart Thermostat - Learning Temperature Control",
    slug: "smart-thermostat",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/61G95TePi5L._AC_SL1500_.jpg",
    price: "$199.99",
    rating: 4.7,
    affiliateLink: "https://amazon.com/s?k=smart+thermostat&tag=smarthomedeal-20",
    category: "Smart Thermostat",
    description:
      "Learning thermostat that adapts to your schedule. Save up to 10% on heating and cooling costs.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart Plug with Energy Monitoring",
    slug: "smart-plug-energy",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/61LdS5IOPYL._AC_SL1500_.jpg",
    price: "$24.99",
    rating: 4.4,
    affiliateLink: "https://amazon.com/s?k=smart+plug&tag=smarthomedeal-20",
    category: "Smart Home",
    description:
      "Remote on/off control, energy monitoring, and scheduling features. Compact design, WiFi enabled.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart Motion Sensor Light",
    slug: "smart-motion-sensor",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71o8Q7XSUXL._AC_SL1500_.jpg",
    price: "$34.99",
    rating: 4.6,
    affiliateLink: "https://amazon.com/s?k=smart+motion+sensor+light&tag=smarthomedeal-20",
    category: "Smart Lighting",
    description:
      "Auto on/off with motion detection. Adjustable sensitivity and timer. Perfect for hallways and bathrooms.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart Door Bell with Video - HD Recording",
    slug: "smart-doorbell-video",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71r5-lPAJkL._AC_SL1500_.jpg",
    price: "$89.99",
    rating: 4.7,
    affiliateLink: "https://amazon.com/s?k=smart+video+doorbell&tag=smarthomedeal-20",
    category: "Smart Camera",
    description:
      "HD video doorbell with night vision, two-way talk, and package detection. Cloud and local storage.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart Garage Door Opener",
    slug: "smart-garage-door",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/61z6-kBvwBL._AC_SL1500_.jpg",
    price: "$99.99",
    rating: 4.5,
    affiliateLink: "https://amazon.com/s?k=smart+garage+door+opener&tag=smarthomedeal-20",
    category: "Smart Home",
    description:
      "Remote control garage door opener. Monitor status, get alerts, and schedule opening/closing times.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart Window & Door Sensor",
    slug: "smart-window-sensor",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71w5-waPyGL._AC_SL1500_.jpg",
    price: "$19.99",
    rating: 4.3,
    affiliateLink: "https://amazon.com/s?k=smart+door+window+sensor&tag=smarthomedeal-20",
    category: "Smart Home",
    description:
      "Wireless door and window sensors. Get instant alerts when doors or windows are opened.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart Speaker - Premium Sound Quality",
    slug: "smart-speaker",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71O2RCJjzIL._AC_SL1500_.jpg",
    price: "$149.99",
    rating: 4.6,
    affiliateLink: "https://amazon.com/s?k=smart+speaker&tag=smarthomedeal-20",
    category: "Smart Home",
    description:
      "High-quality audio, voice assistant control, and smart home integration. Premium sound experience.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart Lighting Strip - RGB Ambient",
    slug: "smart-lighting-strip",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71Aj4U7JvKL._AC_SL1500_.jpg",
    price: "$49.99",
    rating: 4.5,
    affiliateLink: "https://amazon.com/s?k=smart+rgb+light+strip&tag=smarthomedeal-20",
    category: "Smart Lighting",
    description:
      "Addressable RGB light strips for any room. Create custom scenes and automate your lighting.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart Water Leak Detector",
    slug: "smart-water-leak",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/61OSKGxP-aL._AC_SL1500_.jpg",
    price: "$29.99",
    rating: 4.4,
    affiliateLink: "https://amazon.com/s?k=smart+water+leak+detector&tag=smarthomedeal-20",
    category: "Smart Home",
    description:
      "Early detection of water leaks. Get alerts before major damage occurs. Battery powered.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart Air Purifier with HEPA Filter",
    slug: "smart-air-purifier",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71yZpThG0FL._AC_SL1500_.jpg",
    price: "$169.99",
    rating: 4.7,
    affiliateLink: "https://amazon.com/s?k=smart+air+purifier&tag=smarthomedeal-20",
    category: "Smart Home",
    description:
      "HEPA filtration removes 99.97% of particles. Remote control and real-time air quality monitoring.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart Pet Feeder - Automatic with App Control",
    slug: "smart-pet-feeder",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71Pk90nqz6L._AC_SL1500_.jpg",
    price: "$59.99",
    rating: 4.6,
    affiliateLink: "https://amazon.com/s?k=smart+pet+feeder&tag=smarthomedeal-20",
    category: "Smart Home",
    description:
      "Automatic feeding with mobile app control. Schedule meals and monitor pet food intake.",
    clicks: 0,
    conversions: 0,
  },
  {
    title: "Smart Blinds Remote Controller",
    slug: "smart-blinds",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71NZG7MQZSL._AC_SL1500_.jpg",
    price: "$119.99",
    rating: 4.5,
    affiliateLink: "https://amazon.com/s?k=smart+blinds+controller&tag=smarthomedeal-20",
    category: "Smart Home",
    description:
      "Convert existing blinds to smart blinds. Schedule opening and closing, app control included.",
    clicks: 0,
    conversions: 0,
  },
];

const dummyBlogs = [
  {
    title: "Complete Guide: Setting Up Your First Smart Home in 2026",
    slug: "setup-first-smart-home",
    description: "Learn everything you need to know about setting up your first smart home system.",
    content:
      "Setting up a smart home might seem overwhelming, but it's easier than ever. Start with basics like smart lights and plugs...",
    category: "Smart Home Setup",
    keywords: ["smart home", "setup guide", "beginners"],
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71w0oWXUFML._AC_SL1500_.jpg",
    views: 0,
    clicks: 0,
    published: true,
    affiliateProducts: [],
  },
  {
    title: "Top 5 Best Smart Door Locks for Home Security 2026",
    slug: "best-smart-door-locks",
    description: "Comprehensive review of the best smart door locks available this year.",
    content:
      "Smart door locks have revolutionized home security. Here are the top 5 options that offer great features...",
    category: "Smart Locks",
    keywords: ["smart locks", "security", "reviews"],
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71w0oWXUFML._AC_SL1500_.jpg",
    views: 0,
    clicks: 0,
    published: true,
    affiliateProducts: [],
  },
  {
    title: "Smart Lighting Comparison: Which System Should You Choose?",
    slug: "smart-lighting-comparison",
    description: "Detailed comparison of popular smart lighting systems and brands.",
    content:
      "Choosing the right smart lighting system depends on your needs. Let's compare the top options...",
    category: "Smart Lighting",
    keywords: ["smart lights", "comparison", "recommendations"],
    image:
      "https://images-na.ssl-images-amazon.com/images/I/51HE8-lDXPL._AC_SL1000_.jpg",
    views: 0,
    clicks: 0,
    published: true,
    affiliateProducts: [],
  },
  {
    title: "How to Save Money with Smart Thermostats",
    slug: "save-money-smart-thermostat",
    description: "Learn how smart thermostats can reduce your energy bills significantly.",
    content:
      "Smart thermostats can save you money on energy bills. Here's how they work and which ones are best...",
    category: "Smart Climate",
    keywords: ["thermostat", "energy savings", "money"],
    image:
      "https://images-na.ssl-images-amazon.com/images/I/61G95TePi5L._AC_SL1500_.jpg",
    views: 0,
    clicks: 0,
    published: true,
    affiliateProducts: [],
  },
  {
    title: "Smart Home Security Systems: Complete Buyer's Guide",
    slug: "smart-security-guide",
    description: "Everything you need to know about smart home security systems.",
    content:
      "Smart security systems combine cameras, sensors, and alarms. Here's what you need to know...",
    category: "Smart Security",
    keywords: ["security", "cameras", "safety"],
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71Xa3k1Z1OL._AC_SL1500_.jpg",
    views: 0,
    clicks: 0,
    published: true,
    affiliateProducts: [],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("📡 Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    await Blog.deleteMany({});
    console.log("🧹 Cleared existing data");

    // Insert dummy products
    const insertedProducts = await Product.insertMany(dummyProducts);
    console.log(`✅ Added ${insertedProducts.length} dummy products`);

    // Insert dummy blogs
    const insertedBlogs = await Blog.insertMany(dummyBlogs);
    console.log(`✅ Added ${insertedBlogs.length} dummy blogs`);

    // Display sample data
    console.log("\n📊 Sample Product:");
    console.log(insertedProducts[0]);

    console.log("\n📝 Sample Blog:");
    console.log(insertedBlogs[0]);

    console.log("\n✨ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
