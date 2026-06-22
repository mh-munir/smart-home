import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

/**
 * Fetch all categories sorted by name.
 */
export async function getAllCategoryNames() {
  try {
    await connectDB();
    const Category = (await import("@/models/Category")).default;
    const cats = await Category.find().sort({ name: 1 }).lean();
    return cats.map((c) => ({
      name: c.name,
      slug: c.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }));
  } catch {
    return [];
  }
}

/**
 * Find a category name from a URL slug.
 * Tries exact match first, then fuzzy match.
 */
export async function getCategoryNameFromSlug(slug) {
  const categories = await getAllCategoryNames();
  // Exact slug match
  const match = categories.find((c) => c.slug === slug);
  if (match) return match.name;
  // Fuzzy: decode and normalize
  const decoded = decodeURIComponent(slug).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const fuzzy = categories.find((c) => c.slug === decoded);
  return fuzzy ? fuzzy.name : null;
}

/**
 * Fetch products filtered by category name.
 */
export async function getProductsByCategory(categoryName) {
  try {
    await connectDB();
    const products = await Product.find({ category: categoryName })
      .sort({ rating: -1, clicks: -1 })
      .lean();

    return products.map((product) => ({
      _id: product._id.toString(),
      title: product.title,
      slug: product.slug,
      image: product.image || null,
      price: product.price || null,
      rating: product.rating || 4.5,
      affiliateLink: product.affiliateLink || null,
      affiliateLinks: (product.affiliateLinks && (product.affiliateLinks instanceof Map ? Object.fromEntries(product.affiliateLinks) : product.affiliateLinks)) || {},
      category: product.category || null,
      description: product.description || null,
      bestDeal: product.bestDeal || false,
      dealType: product.dealType || null,
      offer: product.offer || null,
      clicks: product.clicks || 0,
      conversions: product.conversions || 0,
      createdAt: product.createdAt?.toISOString() || null,
      updatedAt: product.updatedAt?.toISOString() || null,
    }));
  } catch {
    return [];
  }
}

export async function getProducts({ q, category, fallbackOnError = true } = {}) {
  try {
    await connectDB();

    let products;

    if (q && String(q).trim().length > 0) {
      // Full-text search using MongoDB text index, sort by text score
      const search = String(q).trim();
      products = await Product.find(
        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .lean();
    } else {
      products = await Product.find().sort({ createdAt: -1 }).lean();
    }

    // Convert to plain serializable objects
    return products.map((product) => ({
      _id: product._id.toString(),
      title: product.title,
      slug: product.slug,
      image: product.image || null,
      price: product.price || null,
      rating: product.rating || 4.5,
      affiliateLink: product.affiliateLink || null,
      affiliateLinks: (product.affiliateLinks && (product.affiliateLinks instanceof Map ? Object.fromEntries(product.affiliateLinks) : product.affiliateLinks)) || {},
      category: product.category || null,
      description: product.description || null,
      bestDeal: product.bestDeal || false,
      dealType: product.dealType || null,
      offer: product.offer || null,
      clicks: product.clicks || 0,
      conversions: product.conversions || 0,
      createdAt: product.createdAt?.toISOString() || null,
      updatedAt: product.updatedAt?.toISOString() || null,
    }));
  } catch (error) {
    if (!fallbackOnError) throw error;

    return [];
  }
}
