#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../lib/db.js';
import Guide from '../models/Guide.js';
import { sampleGuides } from '../lib/guides.js';

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Please set it in your environment or in a .env file.');
    process.exit(1);
  }

  await connectDB();

  let migrated = 0;

  for (const g of sampleGuides) {
    const doc = {
      title: g.title || 'Untitled',
      slug: g.slug || (g.title ? g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `${Date.now()}`),
      category: g.category || 'Guides',
      content: g.content || '',
      excerpt: g.excerpt || '',
      image: g.image || '',
      images: Array.isArray(g.images) ? g.images : (g.image ? [g.image] : []),
      tags: Array.isArray(g.tags) ? g.tags : [],
      readTime: typeof g.readTime === 'number' ? g.readTime : parseInt(g.readTime) || 5,
      published: true,
    };

    await Guide.findOneAndUpdate({ slug: doc.slug }, doc, { upsert: true, new: true, setDefaultsOnInsert: true });
    migrated += 1;
  }

  console.log(`Migrated ${migrated} guides into the database.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Migration failed:', err?.message || err);
  process.exit(1);
});
