import { NextResponse } from "next/server";
import { connectDB, hasMongoDBConfig } from "@/lib/db";
import Product from "@/models/Product";
import Blog from "@/models/Blog";
import Subscriber from "@/models/Subscriber";
import Guide from "@/models/Guide";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  if (!hasMongoDBConfig()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // ── Aggregate counts ──
    const [totalProducts, totalBlogs, totalGuides, totalSubscribers, lastMonthSubscribers] =
      await Promise.all([
        Product.countDocuments(),
        Blog.countDocuments(),
        Guide.countDocuments(),
        Subscriber.countDocuments({ isActive: true }),
        Subscriber.countDocuments({ isActive: true, subscribedAt: { $gte: lastMonthStart, $lt: thisMonthStart } }),
      ]);

    // ── Product aggregates (all-time) ──
    const [productAgg = {}] = await Product.aggregate([
      { $group: { _id: null, clicksSum: { $sum: "$clicks" }, conversionsSum: { $sum: "$conversions" }, viewsSum: { $sum: "$views" } } },
    ]);

    // ── Blog aggregates (all-time) ──
    const [blogAgg = {}] = await Blog.aggregate([
      { $group: { _id: null, clicksSum: { $sum: "$clicks" }, viewsSum: { $sum: "$views" } } },
    ]);

    const totalClicks = (productAgg.clicksSum || 0) + (blogAgg.clicksSum || 0);
    const totalConversions = productAgg.conversionsSum || 0;
    const totalViews = (productAgg.viewsSum || 0) + (blogAgg.viewsSum || 0);

    // ── Monthly clicks (last 12 months) for LineChart ──
    const monthlyProductClicks = await Product.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, clicks: { $sum: "$clicks" }, views: { $sum: "$views" } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyBlogClicks = await Blog.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, clicks: { $sum: "$clicks" }, views: { $sum: "$views" } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Merge monthly data
    const monthlyDataMap = {};
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // Pre-fill last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      monthlyDataMap[key] = { year: d.getFullYear(), month: d.getMonth() + 1, clicks: 0, views: 0 };
    }

    [...monthlyProductClicks, ...monthlyBlogClicks].forEach((entry) => {
      const key = `${entry._id.year}-${entry._id.month}`;
      if (monthlyDataMap[key]) {
        monthlyDataMap[key].clicks += entry.clicks || 0;
        monthlyDataMap[key].views += entry.views || 0;
      }
    });

    const monthlyClicks = Object.values(monthlyDataMap)
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map((d) => ({
        label: months[d.month - 1],
        clicks: d.clicks,
        views: d.views,
      }));

    // ── Donut chart: engagement breakdown ──
    const donutPercentage = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;

    // ── Recent products (top by clicks) ──
    const recentProducts = await Product.find()
      .sort({ clicks: -1 })
      .limit(5)
      .select("title clicks conversions views category createdAt")
      .lean();

    // ── Recent blogs (top by views) ──
    const recentBlogs = await Blog.find()
      .sort({ views: -1 })
      .limit(5)
      .select("title views clicks author createdAt")
      .lean();

    // ── Monthly subscribers ──
    const monthlySubscribers = await Subscriber.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const subMonthlyMap = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      subMonthlyMap[key] = { year: d.getFullYear(), month: d.getMonth() + 1, count: 0 };
    }
    monthlySubscribers.forEach((entry) => {
      const key = `${entry._id.year}-${entry._id.month}`;
      if (subMonthlyMap[key]) subMonthlyMap[key].count += entry.count || 0;
    });

    return NextResponse.json({
      stats: {
        totalProducts,
        totalBlogs,
        totalGuides,
        totalSubscribers,
        totalClicks,
        totalConversions,
        totalViews,
        donutPercentage,
        lastMonthSubscribers,
      },
      monthlyClicks,
      recentProducts,
      recentBlogs,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
