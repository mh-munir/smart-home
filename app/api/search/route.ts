import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Blog from "@/models/Blog";
import Category from "@/models/Category";
import { withRateLimit } from "@/lib/rate-limit";

async function searchHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q || q.length < 2) {
      return NextResponse.json({
        products: [],
        blogs: [],
        categories: [],
        suggestions: [],
      });
    }

    await connectDB();

    // Search products using text index
    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .select("title slug image price rating category")
      .lean();

    // Search blogs
    const blogRegex = { $regex: q, $options: "i" };
    const blogs = await Blog.find({
      published: true,
      $or: [
        { title: blogRegex },
        { description: blogRegex },
        { category: blogRegex },
        { tags: { $in: [q] } },
      ],
    })
      .limit(10)
      .select("title slug image category readTime")
      .lean();

    // Search categories
    const categories = await Category.find({
      name: blogRegex,
    })
      .limit(5)
      .select("name thumbnail")
      .lean();

    // Generate search suggestions from product titles
    const suggestionQuery = q.length >= 2 ? q : q;
    const suggestions = await Product.find(
      { title: { $regex: "^" + suggestionQuery, $options: "i" } },
    )
      .limit(5)
      .select("title")
      .lean();

    return NextResponse.json({
      products: products.map((p: any) => ({
        _id: p._id?.toString?.() || "",
        title: p.title,
        slug: p.slug,
        image: p.image || null,
        price: p.price || null,
        rating: p.rating || 4.5,
        category: p.category || null,
      })),
      blogs: blogs.map((b: any) => ({
        _id: b._id?.toString?.() || "",
        title: b.title,
        slug: b.slug,
        image: b.image || null,
        category: b.category || null,
        readTime: b.readTime || 5,
      })),
      categories: categories.map((c: any) => ({
        _id: c._id?.toString?.() || "",
        name: c.name,
        thumbnail: c.thumbnail || null,
      })),
      suggestions: suggestions.map((s: any) => s.title).filter(Boolean),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return withRateLimit(searchHandler, {
    maxRequests: 30,
    windowMs: 60_000,
    keyPrefix: "search:",
  })(request);
}

export const dynamic = "force-dynamic";
