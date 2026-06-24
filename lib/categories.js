import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

// In-memory cache for categories
let cachedCategories = null;
let categoriesCacheTime = 0;
const CACHE_TTL = 300_000; // 5 minutes

export async function getCategories() {
  // Return cached data if fresh
  if (cachedCategories && Date.now() - categoriesCacheTime < CACHE_TTL) {
    return cachedCategories;
  }

  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();
    const result = categories.map((cat) => ({
      _id: cat._id.toString(),
      name: cat.name,
      thumbnail: cat.thumbnail || null,
    }));

    cachedCategories = result;
    categoriesCacheTime = Date.now();
    return result;
  } catch {
    return cachedCategories || [];
  }
}

export function invalidateCategoriesCache() {
  cachedCategories = null;
  categoriesCacheTime = 0;
}

/**
 * Fetches all categories with their products grouped underneath.
 * Used to dynamically render service category sections on the homepage.
 * Only includes categories that have at least one product.
 * Returns categories sorted by name, each with a URL-friendly slug.
 */
export async function getCategoriesWithProducts() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();
    if (!categories || categories.length === 0) return [];

    const results = [];

    for (const cat of categories) {
      const products = await Product.find({ category: cat.name })
        .sort({ rating: -1, clicks: -1 })
        .lean();

      if (products.length === 0) continue;

      const thumbnail = cat.thumbnail || (products.length > 0 ? products[0].image || null : null);

      results.push({
        _id: cat._id.toString(),
        name: cat.name,
        thumbnail,
        slug: cat.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        products: products.map((p) => ({
          _id: p._id.toString(),
          title: p.title,
          slug: p.slug,
          image: p.image || null,
          price: p.price || null,
          rating: p.rating || 4.5,
          category: p.category || null,
        })),
      });
    }

    return results;
  } catch {
    return [];
  }
}
