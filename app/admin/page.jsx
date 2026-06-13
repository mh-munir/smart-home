import React from "react";
import { connectDB, hasMongoDBConfig } from "@/lib/db";
import Product from "@/models/Product";
import Blog from "@/models/Blog";

function fmt(n) {
  if (typeof n !== "number") return "0";
  return n.toLocaleString();
}

export default async function AdminDashboard() {
  let totalProducts = 0;
  let totalBlogs = 0;
  let affiliateClicks = 0;
  let conversions = 0;
  let websiteVisits = 0;
  let conversionRate = "0.0";

  if (hasMongoDBConfig()) {
    try {
      await connectDB();

      totalProducts = await Product.countDocuments();
      totalBlogs = await Blog.countDocuments();

      const [productAgg = {}] = await Product.aggregate([
        {
          $group: {
            _id: null,
            clicksSum: { $sum: "$clicks" },
            conversionsSum: { $sum: "$conversions" },
            viewsSum: { $sum: "$views" },
          },
        },
      ]);

      const [blogAgg = {}] = await Blog.aggregate([
        {
          $group: {
            _id: null,
            clicksSum: { $sum: "$clicks" },
            viewsSum: { $sum: "$views" },
          },
        },
      ]);

      affiliateClicks = (productAgg.clicksSum || 0) + (blogAgg.clicksSum || 0);
      conversions = productAgg.conversionsSum || 0;
      websiteVisits = (productAgg.viewsSum || 0) + (blogAgg.viewsSum || 0);

      conversionRate = affiliateClicks > 0 ? ((conversions / affiliateClicks) * 100).toFixed(1) : "0.0";
    } catch (err) {
      console.error("Admin stats query failed:", err);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-gray-600 font-semibold mb-2">Total Products</h3>
          <p className="text-4xl font-bold text-orange-500">{fmt(totalProducts)}</p>
          <p className="text-sm text-gray-500 mt-2">Active products</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-gray-600 font-semibold mb-2">Total Blogs</h3>
          <p className="text-4xl font-bold text-primary-500">{fmt(totalBlogs)}</p>
          <p className="text-sm text-gray-500 mt-2">Published articles</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-gray-600 font-semibold mb-2">Affiliate Clicks</h3>
          <p className="text-4xl font-bold text-green-500">{fmt(affiliateClicks)}</p>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">📈 Analytics</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Website Visits</span>
              <span className="font-bold">{fmt(websiteVisits)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Affiliate Conversions</span>
              <span className="font-bold">{fmt(conversions)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-bold text-green-600">{conversionRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">🎯 Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition-colors">
              ➕ Add New Product
            </button>
            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded transition-colors">
              📝 Write New Blog
            </button>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-colors">
              🔄 Update SEO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
