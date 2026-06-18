import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { connectDB } from '../lib/db.js';
import Product from '../models/Product.js';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/check-product-slug.mjs <slug>');
  process.exit(1);
}

(async () => {
  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      console.log('NOT FOUND');
      process.exit(0);
    }
    console.log(JSON.stringify(product, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err?.message || err);
    process.exit(1);
  }
})();
