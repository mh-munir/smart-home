import React from "react";
import Link from "next/link";
import { connectDB, hasMongoDBConfig } from "@/lib/db";
import Product from "@/models/Product";
import Blog from "@/models/Blog";
import Subscriber from "@/models/Subscriber";

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
  let totalSubscribers = 0;
  let recentSubscribers = [];

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

      // Subscriber stats
      totalSubscribers = await Subscriber.countDocuments({ isActive: true });
      recentSubscribers = await Subscriber.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
    } catch (err) {
      console.error("Admin stats query failed:", err);
    }
  }

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-gray-600 font-semibold mb-2">📧 Subscribers</h3>
          <p className="text-4xl font-bold text-teal-500">{fmt(totalSubscribers)}</p>
          <a href="/admin/subscribers" className="text-sm text-teal-600 hover:underline mt-2 inline-block">View all →</a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <Link
              href="/admin/add-product"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition-colors text-center"
            >
              ➕ Add New Product
            </Link>
            <Link
              href="/admin/add-blog"
              className="block w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded transition-colors text-center"
            >
              📝 Write New Blog
            </Link>
              <Link
                href="/admin/guides"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition-colors text-center"
              >
                📚 Manage Guides
              </Link>
            <Link
              href="/admin/settings"
              className="block w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-colors text-center"
            >
              🔄 Update SEO
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">📧 Recent Subscribers</h2>
          {recentSubscribers.length > 0 ? (
            <div className="space-y-3">
              {recentSubscribers.map((sub) => (
                <div key={sub._id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{sub.email}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">New</span>
                </div>
              ))}
              <a href="/admin/subscribers" className="block text-center text-teal-600 hover:underline text-sm font-medium mt-3 pt-2 border-t border-gray-100">
                View All Subscribers →
              </a>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No subscribers yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
