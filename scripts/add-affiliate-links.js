/**
 * Add Multiple Affiliate Links to Product
 * Add or update affiliate links for products
 * Usage: node scripts/add-affiliate-links.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

// Example: Add affiliate links for a product
const exampleProductUpdate = {
  // Find product by title or slug
  slug: 'smart-led-bulb',
  // Add or update these affiliate links
  affiliateLinks: {
    amazon: {
      url: 'https://amazon.com/dp/B0123456789?tag=your-tag',
      enabled: true,
      priority: 1,
    },
    aliexpress: {
      url: 'https://aliexpress.com/item/123456789.html?aff_fcid=your-id',
      enabled: true,
      priority: 2,
    },
    ebay: {
      url: 'https://ebay.com/itm/123456789?campid=your-campaign',
      enabled: true,
      priority: 3,
    },
  },
};

async function addAffiliateLinks() {
  try {
    console.log('📝 Adding affiliate links to products...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to database');

    // Find product by slug
    const product = await Product.findOne({ slug: exampleProductUpdate.slug });
    if (!product) {
      console.error(`❌ Product not found: ${exampleProductUpdate.slug}`);
      process.exit(1);
    }

    console.log(`Found product: ${product.title}`);

    // Initialize affiliateLinks if it doesn't exist
    if (!product.affiliateLinks) {
      product.affiliateLinks = new Map();
    }

    // Add or update affiliate links
    for (const [affiliateId, linkData] of Object.entries(exampleProductUpdate.affiliateLinks)) {
      product.affiliateLinks.set(affiliateId, {
        url: linkData.url,
        enabled: linkData.enabled,
        priority: linkData.priority || 0,
        clicks: 0,
        conversions: 0,
      });
      console.log(`  ✓ Added ${affiliateId} link`);
    }

    await product.save();
    console.log(`\n✓ Successfully updated product: ${product.title}`);

    // Display current affiliate links
    console.log('\n📊 Current affiliate links:');
    for (const [id, data] of product.affiliateLinks) {
      console.log(`  - ${id}: ${data.url} (enabled: ${data.enabled})`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error adding affiliate links:', error);
    process.exit(1);
  }
}

// Function to add affiliate links from a CSV or JSON file
export async function addAffiliateLinksFromFile(filePath) {
  try {
    console.log(`📂 Reading affiliate links from ${filePath}...`);

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home';
    await mongoose.connect(mongoUri);

    // Read and parse file (implement based on file type)
    // const data = await readFile(filePath);

    // For now, just run the example
    await addAffiliateLinks();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run if this is the main script
if (import.meta.url === `file://${process.argv[1]}`) {
  addAffiliateLinks();
}

export default addAffiliateLinks;
