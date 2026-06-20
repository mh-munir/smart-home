import React from "react";
import Link from "next/link";
import { connectDB, hasMongoDBConfig } from "@/lib/db";
import Product from "@/models/Product";
import Blog from "@/models/Blog";
import Subscriber from "@/models/Subscriber";
import Guide from "@/models/Guide";
import { LineChart, DonutChart } from "@/components/admin/DashboardCharts";

function fmt(n) {
  if (typeof n !== "number") return "0";
  return n.toLocaleString();
}

function ago(date) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/* ──── Stat card icons (inline SVGs) ──── */
const ClicksIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);
const ViewsIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const ConversionsIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
const SubscribersIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const ProductsIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const BlogsIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

export default async function AdminDashboard() {
  // ── Default zero-state data ──
  let stats = {
    totalProducts: 0,
    totalBlogs: 0,
    totalGuides: 0,
    totalSubscribers: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalViews: 0,
    donutPercentage: 0,
    lastMonthSubscribers: 0,
  };
  let monthlyClicks = [];
  let recentProducts = [];
  let recentBlogs = [];

  if (hasMongoDBConfig()) {
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
      const donutPercentage = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;

      stats = {
        totalProducts,
        totalBlogs,
        totalGuides,
        totalSubscribers,
        totalClicks,
        totalConversions,
        totalViews,
        donutPercentage,
        lastMonthSubscribers,
      };

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

      const monthlyDataMap = {};
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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

      monthlyClicks = Object.values(monthlyDataMap)
        .sort((a, b) => a.year - b.year || a.month - b.month)
        .map((d) => ({
          label: monthNames[d.month - 1],
          clicks: d.clicks,
          views: d.views,
        }));

      // ── Recent products (top by clicks) ──
      recentProducts = await Product.find()
        .sort({ clicks: -1 })
        .limit(5)
        .select("title clicks conversions views category createdAt")
        .lean();

      // ── Recent blogs (top by views) ──
      recentBlogs = await Blog.find()
        .sort({ views: -1 })
        .limit(5)
        .select("title views clicks author createdAt")
        .lean();
    } catch (err) {
      console.error("Admin dashboard query failed:", err);
    }
  }

  // ── Dynamic stat cards ──
  const statCards = [
    { label: "Total Clicks", value: fmt(stats.totalClicks), icon: ClicksIcon, color: "text-blue-600 bg-blue-50" },
    { label: "Total Views", value: fmt(stats.totalViews), icon: ViewsIcon, color: "text-purple-600 bg-purple-50" },
    { label: "Conversions", value: fmt(stats.totalConversions), icon: ConversionsIcon, color: "text-emerald-600 bg-emerald-50" },
    { label: "Subscribers", value: fmt(stats.totalSubscribers), icon: SubscribersIcon, color: "text-orange-600 bg-orange-50" },
  ];

  const secondStatCards = [
    { label: "Products", value: fmt(stats.totalProducts), icon: ProductsIcon, color: "text-cyan-600 bg-cyan-50", href: "/admin/products" },
    { label: "Blog Posts", value: fmt(stats.totalBlogs), icon: BlogsIcon, color: "text-rose-600 bg-rose-50", href: "/admin/blogs" },
    { label: "Guides", value: fmt(stats.totalGuides), icon: BlogsIcon, color: "text-amber-600 bg-amber-50", href: "/admin/guides" },
    { label: "Engagement Rate", value: `${stats.donutPercentage}%`, icon: ConversionsIcon, color: "text-indigo-600 bg-indigo-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin" className="hover:text-gray-700">Admin</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-800 font-medium">Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Activity — This month</h1>
          <p className="text-sm text-gray-500 mt-1">Stay updated with your latest affiliate performance.</p>
        </div>
      </div>

      {/* ── Primary Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Secondary Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {secondStatCards.map((card) => {
          const Icon = card.icon;
          const Wrapper = card.href ? Link : "div";
          const wrapperProps = card.href ? { href: card.href } : {};
          return (
            <Wrapper
              key={card.label}
              {...wrapperProps}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon />
                </div>
                {card.href && (
                  <svg className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </Wrapper>
          );
        })}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Performance Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Clicks Overview</h2>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-bold text-gray-900">{fmt(stats.totalClicks)}</span>
                <span className="text-sm text-gray-500">total clicks</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              Clicks
            </div>
          </div>
          <div className="mt-4">
            <LineChart data={monthlyClicks} />
          </div>
        </div>

        {/* Engagement Donut */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Engagement</h2>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">{fmt(stats.totalViews)}</span>
            <span className="text-sm text-gray-500">total views</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <DonutChart percentage={stats.donutPercentage} />
          </div>
          <div className="flex items-center justify-center gap-5 mt-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" />Views</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Clicks</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" />Conversions</span>
          </div>
        </div>
      </div>

      {/* ── Top Products & Recent Blogs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
                <p className="text-sm text-gray-500 mt-0.5">{stats.totalProducts} products total</p>
              </div>
              <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-gray-100">
                  <th className="text-left py-3 px-6 font-medium text-gray-500">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Clicks</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Conv.</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-500">Views</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">No products yet</td>
                  </tr>
                ) : (
                  recentProducts.map((p) => (
                    <tr key={p._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-6 font-medium text-gray-900 truncate max-w-50">{p.title}</td>
                      <td className="py-3 px-4 text-gray-500">{p.category || "—"}</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">{fmt(p.clicks)}</td>
                      <td className="py-3 px-4 text-right text-gray-600">{fmt(p.conversions)}</td>
                      <td className="py-3 px-6 text-right text-gray-600">{fmt(p.views)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Top Blog Posts</h2>
                <p className="text-sm text-gray-500 mt-0.5">{stats.totalBlogs} posts total</p>
              </div>
              <Link href="/admin/blogs" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-gray-100">
                  <th className="text-left py-3 px-6 font-medium text-gray-500">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Author</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Views</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Clicks</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-500">Published</th>
                </tr>
              </thead>
              <tbody>
                {recentBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">No blog posts yet</td>
                  </tr>
                ) : (
                  recentBlogs.map((b) => (
                    <tr key={b._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-6 font-medium text-gray-900 truncate max-w-50">{b.title}</td>
                      <td className="py-3 px-4 text-gray-500">{b.author || "—"}</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">{fmt(b.views)}</td>
                      <td className="py-3 px-4 text-right text-gray-600">{fmt(b.clicks)}</td>
                      <td className="py-3 px-6 text-right text-gray-500 text-xs">{ago(b.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}