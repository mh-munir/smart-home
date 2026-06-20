import { connectDB } from '../lib/db.js';
import Category from '../models/Category.js';

(async () => {
  try {
    await connectDB();
    const cats = await Category.find({}).sort({ name: 1 }).lean();
    console.log(JSON.stringify((cats || []).map((c) => c.name), null, 2));
    process.exit(0);
  } catch (err) {
    console.error('error', err?.message || err);
    process.exit(1);
  }
})();
