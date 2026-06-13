/**
 * Multi-Affiliate Product Migration Script
 * Converts existing single-affiliate products to multi-affiliate format
 * Usage: node scripts/migrate-multi-affiliate.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

async function migrateProducts() {
  try {
    console.log('🔄 Starting product migration to multi-affiliate format...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to database');

    // Find all products with single affiliateLink
    const products = await Product.find({ affiliateLink: { $exists: true, $ne: null } });
    console.log(`Found ${products.length} products with single affiliate links`);

    let migratedCount = 0;

    for (const product of products) {
      try {
        // Only migrate if affiliateLinks is empty
        if (!product.affiliateLinks || product.affiliateLinks.size === 0) {
          const affiliateLinks = new Map();

          // Determine which affiliate network this link belongs to
          if (product.affiliateLink.includes('amazon')) {
            affiliateLinks.set('amazon', {
              url: product.affiliateLink,
              enabled: true,
              priority: 1,
              clicks: 0,
              conversions: 0,
            });
          } else if (product.affiliateLink.includes('aliexpress')) {
            affiliateLinks.set('aliexpress', {
              url: product.affiliateLink,
              enabled: true,
              priority: 1,
              clicks: 0,
              conversions: 0,
            });
          } else if (product.affiliateLink.includes('ebay')) {
            affiliateLinks.set('ebay', {
              url: product.affiliateLink,
              enabled: true,
              priority: 1,
              clicks: 0,
              conversions: 0,
            });
          } else if (product.affiliateLink.includes('flipkart')) {
            affiliateLinks.set('flipkart', {
              url: product.affiliateLink,
              enabled: true,
              priority: 1,
              clicks: 0,
              conversions: 0,
            });
          } else if (product.affiliateLink.includes('daraz')) {
            affiliateLinks.set('daraz', {
              url: product.affiliateLink,
              enabled: true,
              priority: 1,
              clicks: 0,
              conversions: 0,
            });
          } else if (product.affiliateLink.includes('rokomari')) {
            affiliateLinks.set('rokomari', {
              url: product.affiliateLink,
              enabled: true,
              priority: 1,
              clicks: 0,
              conversions: 0,
            });
          } else if (product.affiliateLink.includes('ajio')) {
            affiliateLinks.set('ajio', {
              url: product.affiliateLink,
              enabled: true,
              priority: 1,
              clicks: 0,
              conversions: 0,
            });
          } else {
            // Default to generic affiliate link
            affiliateLinks.set('other', {
              url: product.affiliateLink,
              enabled: true,
              priority: 1,
              clicks: 0,
              conversions: 0,
            });
          }

          product.affiliateLinks = affiliateLinks;
          await product.save();
          migratedCount++;
          console.log(`✓ Migrated: ${product.title}`);
        }
      } catch (error) {
        console.error(`✗ Error migrating product ${product.title}:`, error.message);
      }
    }

    console.log(`\n✓ Migration complete! ${migratedCount} products migrated`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateProducts();
