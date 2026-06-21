import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function getProducts({ q, fallbackOnError = true } = {}) {
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

    console.warn("Products unavailable:", error.message);
    return [];
  }
}
