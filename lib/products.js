import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function getProducts({ fallbackOnError = true } = {}) {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 }).lean();

    // Convert to plain serializable objects
    return products.map(product => ({
      _id: product._id.toString(),
      title: product.title,
      slug: product.slug,
      image: product.image || null,
      price: product.price || null,
      rating: product.rating || 4.5,
      affiliateLink: product.affiliateLink || null,
      category: product.category || null,
      description: product.description || null,
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
