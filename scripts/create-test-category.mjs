import { connectDB } from '../lib/db.js';
import Category from '../models/Category.js';

const name = process.argv[2] || 'Assistant Test Category';

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

(async () => {
  try {
    await connectDB();
    const existing = await Category.findOne({ name: { $regex: `^${escapeRegex(name)}$`, $options: 'i' } });
    if (existing) {
      console.log('exists', existing.name);
      process.exit(0);
    }
    const created = await Category.create({ name });
    console.log('created', created.name);
    process.exit(0);
  } catch (err) {
    console.error('error', err?.message || err);
    process.exit(1);
  }
})();
