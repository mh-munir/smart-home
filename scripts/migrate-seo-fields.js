/**
 * Migration script: Add SEO fields and ensure slugs for existing Products & Blogs.
 *
 * Usage:
 *   node scripts/migrate-seo-fields.js
 *
 * What it does:
 *  1. For every Product missing a slug, generates one from the title.
 *  2. For every Blog missing a slug, generates one from the title.
 *  3. Ensures slug uniqueness by appending a counter if needed.
 *  4. Sets metaTitle, metaDescription, canonicalUrl to null if undefined.
 *
 * Safe to run multiple times — it only touches records that need updating.
 */

import mongoose from "mongoose";
import { generateSlug } from "../utils/generateSlug.js";

// ─── MongoDB connection ───
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set.");
  process.exit(1);
}

// Inline schema definitions (mirrors models/ without Mongoose model registration conflicts)
const ProductSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true, index: true },
    metaTitle: { type: String, default: null },
    metaDescription: { type: String, default: null },
    canonicalUrl: { type: String, default: null },
  },
  { strict: false }
);

const BlogSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true, index: true },
    metaTitle: { type: String, default: null },
    metaDescription: { type: String, default: null },
    canonicalUrl: { type: String, default: null },
  },
  { strict: false }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Blog =
  mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

// ─── Helpers ───

async function ensureUniqueSlug(Model, slug, excludeId) {
  let candidate = slug;
  let counter = 2;
  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Model.exists(query);
    if (!exists) return candidate;
    candidate = `${slug}-${counter}`;
    counter++;
  }
}

async function migrateCollection(Model, modelName) {
  const docs = await Model.find({}).select("_id title slug metaTitle metaDescription canonicalUrl").lean();
  let updated = 0;
  let skipped = 0;

  for (const doc of docs) {
    const updates = {};

    // Ensure slug exists
    if (!doc.slug) {
      const baseSlug = generateSlug(doc.title || `${modelName}-${Date.now()}`);
      const slug = baseSlug || `${modelName}-${Date.now()}`;
      updates.slug = await ensureUniqueSlug(Model, slug, doc._id);
    }

    // Ensure SEO fields exist (set to null if missing)
    if (doc.metaTitle === undefined) updates.metaTitle = null;
    if (doc.metaDescription === undefined) updates.metaDescription = null;
    if (doc.canonicalUrl === undefined) updates.canonicalUrl = null;

    if (Object.keys(updates).length > 0) {
      await Model.updateOne({ _id: doc._id }, { $set: updates });
      updated++;
      console.log(
        `  ✓ ${modelName}: ${doc.title || doc._id} → slug: ${updates.slug || doc.slug || "(kept)"}`
      );
    } else {
      skipped++;
    }
  }

  return { updated, skipped };
}

// ─── Main ───

async function main() {
  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected.\n");

  console.log("─── Migrating Products ───");
  const productResult = await migrateCollection(Product, "Product");
  console.log(
    `\n  Products: ${productResult.updated} updated, ${productResult.skipped} already OK\n`
  );

  console.log("─── Migrating Blogs ───");
  const blogResult = await migrateCollection(Blog, "Blog");
  console.log(
    `\n  Blogs: ${blogResult.updated} updated, ${blogResult.skipped} already OK\n`
  );

  console.log("🎉 Migration complete.");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});