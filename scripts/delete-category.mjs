import { connectDB } from '../lib/db.js';
import Category from '../models/Category.js';

const name = process.argv[2];
if (!name) {
  console.error('Usage: node scripts/delete-category.mjs "Category Name"');
  process.exit(1);
}

(async () => {
  try {
    await connectDB();
    const safe = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const removed = await Category.findOneAndDelete({ name: { $regex: `^${safe}$`, $options: 'i' } });
    if (!removed) {
      console.log('Category not found');
      process.exit(0);
    }
    console.log('Deleted category:', removed.name);
    process.exit(0);
  } catch (err) {
    console.error('Error deleting category:', err?.message || err);
    process.exit(1);
  }
})();
