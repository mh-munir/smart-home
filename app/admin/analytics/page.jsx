import React from "react";
import { connectDB, hasMongoDBConfig } from "@/lib/db";
import Product from "@/models/Product";
import Blog from "@/models/Blog";

function fmt(n) {
  if (typeof n !== "number") return "0";
  return n.toLocaleString();
}

export default async function AnalyticsPage() {
  let totalVisitors = 0;
  let totalProducts = 0;
  let totalBlogs = 0;
  let affiliateClicks = 0;
  let conversions = 0;
  let conversionRate = "0.0";
  let topProducts = [];
  let topArticles = [];

  if (hasMongoDBConfig()) {
    try {
      await connectDB();

      totalProducts = await Product.countDocuments();
      totalBlogs = await Blog.countDocuments();

      const productAgg = (await Product.aggregate([
        {
          $group: {
            _id: null,
            clicksSum: { $sum: "$clicks" },
            conversionsSum: { $sum: "$conversions" },
            viewsSum: { $sum: "$views" },
          },
        },
      ]))[0] || {};

      const blogAgg = (await Blog.aggregate([
        {
          $group: {
            _id: null,
            clicksSum: { $sum: "$clicks" },
            viewsSum: { $sum: "$views" },
          },
        },
      ]))[0] || {};

      affiliateClicks = (productAgg.clicksSum || 0) + (blogAgg.clicksSum || 0);
      conversions = productAgg.conversionsSum || 0;
      totalVisitors = (productAgg.viewsSum || 0) + (blogAgg.viewsSum || 0);

      conversionRate = affiliateClicks > 0 ? ((conversions / affiliateClicks) * 100).toFixed(1) : "0.0";

      topProducts = await Product.find({})
        .sort({ clicks: -1 })
        .limit(3)
        .select("title clicks")
        .lean();

      topArticles = await Blog.find({})
        .sort({ views: -1 })
        .limit(3)
        .select("title views")
        .lean();
    } catch (err) {
      console.error("Analytics query failed:", err);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📈 Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 font-semibold mb-2">Total Visitors</h3>
          <p className="text-3xl font-bold text-primary-500">{fmt(totalVisitors)}</p>
          <p className="text-xs text-gray-500 mt-2">↑ — from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 font-semibold mb-2">Affiliate Clicks</h3>
          <p className="text-3xl font-bold text-orange-500">{fmt(affiliateClicks)}</p>
          <p className="text-xs text-gray-500 mt-2">↑ — from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 font-semibold mb-2">Conversions</h3>
          <p className="text-3xl font-bold text-green-500">{fmt(conversions)}</p>
          <p className="text-xs text-gray-500 mt-2">↑ — from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 font-semibold mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold text-purple-500">{conversionRate}%</p>
          <p className="text-xs text-gray-500 mt-2">↑ — from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProducts.length === 0 && (
              <div className="text-gray-500">No products found</div>
            )}
            {topProducts.map((p) => (
              <div key={p._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>{p.title}</span>
                <span className="font-bold">{fmt(p.clicks)} clicks</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Top Articles</h2>
          <div className="space-y-3">
            {topArticles.length === 0 && (
              <div className="text-gray-500">No articles found</div>
            )}
            {topArticles.map((a) => (
              <div key={a._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>{a.title}</span>
                <span className="font-bold">{fmt(a.views)} views</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
