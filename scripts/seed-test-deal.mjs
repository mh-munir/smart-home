import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { connectDB } from '../lib/db.js';
import Product from '../models/Product.js';

async function main() {
  try {
    await connectDB();
    const ts = Date.now();
    const slug = `test-best-deal-${ts}`;

    const existing = await Product.findOne({ slug });
    if (existing) {
      console.log('Test product already exists:', existing._id.toString());
      return;
    }

    const product = await Product.create({
      title: `Seed Test Best Deal ${ts}`,
      slug,
      image: '',
      images: [],
      price: '$19.99',
      rating: 4.6,
      affiliateLink: '',
      category: 'Smart Locks',
      description: 'Seeded best deal product for testing',
      bestDeal: true,
      dealType: 'HOT DEAL',
      offer: '20% off',
      clicks: 0,
      conversions: 0,
    });

    console.log('Created test product:', product._id.toString(), product.slug);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
