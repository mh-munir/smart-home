import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { withRateLimit, getClientIp } from "@/lib/rate-limit";

async function trackClickHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, productId, categoryId, blogId, affiliateId, url } = body;

    if (!eventType) {
      return NextResponse.json({ error: "eventType is required" }, { status: 400 });
    }

    const validTypes = ["product_click", "affiliate_click", "category_click", "blog_click"];
    if (!validTypes.includes(eventType)) {
      return NextResponse.json({ error: "Invalid eventType" }, { status: 400 });
    }

    await connectDB();

    // Dynamically import ClickEvent to avoid build issues
    const { default: ClickEvent } = await import("@/models/ClickEvent");

    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || "";

    await ClickEvent.create({
      eventType,
      productId: productId || null,
      categoryId: categoryId || null,
      blogId: blogId || null,
      affiliateId: affiliateId || null,
      url: url || null,
      referrer,
      userAgent,
      ip,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Click tracking error:", error);
    return NextResponse.json({ success: true }); // Don't fail the user
  }
}

async function analyticsHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30", 10);

    await connectDB();

    const { default: ClickEvent } = await import("@/models/ClickEvent");

    const since = new Date();
    since.setDate(since.getDate() - days);

    // Total clicks
    const totalClicks = await ClickEvent.countDocuments({ createdAt: { $gte: since } });

    // Clicks by type
    const clicksByType = await ClickEvent.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
    ]);

    // Top products by clicks
    const topProducts = await ClickEvent.aggregate([
      { $match: { createdAt: { $gte: since }, eventType: { $in: ["product_click", "affiliate_click"] }, productId: { $ne: null } } },
      { $group: { _id: "$productId", clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 10 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $project: { _id: 1, title: "$product.title", slug: "$product.slug", clicks: 1 } },
    ]);

    // Top categories by clicks
    const topCategories = await ClickEvent.aggregate([
      { $match: { createdAt: { $gte: since }, eventType: "category_click", categoryId: { $ne: null } } },
      { $group: { _id: "$categoryId", clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 10 },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $project: { _id: 1, name: "$category.name", clicks: 1 } },
    ]);

    // Top affiliate links
    const topAffiliateLinks = await ClickEvent.aggregate([
      { $match: { createdAt: { $gte: since }, eventType: "affiliate_click", affiliateId: { $ne: null } } },
      { $group: { _id: "$affiliateId", clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 10 },
    ]);

    // Clicks over time (daily)
    const clicksOverTime = await ClickEvent.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Blog referral clicks
    const topBlogs = await ClickEvent.aggregate([
      { $match: { createdAt: { $gte: since }, eventType: "blog_click", blogId: { $ne: null } } },
      { $group: { _id: "$blogId", clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 10 },
      { $lookup: { from: "blogs", localField: "_id", foreignField: "_id", as: "blog" } },
      { $unwind: { path: "$blog", preserveNullAndEmptyArrays: true } },
      { $project: { _id: 1, title: "$blog.title", slug: "$blog.slug", clicks: 1 } },
    ]);

    return NextResponse.json({
      totalClicks,
      clicksByType: clicksByType.reduce((acc: Record<string, number>, item: any) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      topProducts,
      topCategories,
      topAffiliateLinks,
      clicksOverTime,
      topBlogs,
      period: `${days} days`,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return withRateLimit(trackClickHandler, {
    maxRequests: 120,
    windowMs: 60_000,
    keyPrefix: "track:",
  })(request);
}

export async function GET(request: NextRequest) {
  return withRateLimit(analyticsHandler, {
    maxRequests: 30,
    windowMs: 60_000,
    keyPrefix: "analytics:",
  })(request);
}

export const dynamic = "force-dynamic";
