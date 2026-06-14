import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import BlogList from "@/components/BlogList";
import { getLatestArticles, getAllBlogCategories } from "@/lib/blog";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Blog - Smart Home Guides & Reviews",
  description:
    "Read expert guides, reviews, and tutorials about smart home devices. Learn how to automate your home and save energy.",
  keywords: "smart home blog, guides, reviews, tutorials, smart devices",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog - Smart Home Guides & Reviews",
    description:
      "Read expert guides, reviews, and tutorials about smart home devices.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default async function BlogPage() {
  let latestArticles = [];
  let categories = [];

  try {
    await connectDB();
    const docs = await Blog.find({ published: true }).sort({ createdAt: -1 }).limit(100).lean();
    latestArticles = docs.map((a: any) => ({
      id: a._id?.toString?.() ?? a.slug,
      slug: a.slug,
      title: a.title,
      excerpt: a.description || "",
      content: a.content,
      author: a.author || "",
      date: a.createdAt?.toISOString() || a.date || null,
      category: a.category,
      readTime: a.readTime || 5,
      featured: a.featured || false,
      image: a.image || (a.images && a.images[0]) || null,
      tags: a.tags || [],
    }));
    categories = Array.from(new Set(docs.map((d: any) => d.category).filter(Boolean))).sort();
  } catch (e) {
    // fallback to static articles when DB isn't available
    latestArticles = getLatestArticles(12);
    categories = getAllBlogCategories();
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-teal-600 to-teal-600 text-white py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Smart Home Blog
            </h1>
            <p className="text-xl text-teal-100 max-w-2xl">
              Expert guides, reviews, and tutorials to help you build and optimize your smart home
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Categories</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                All Articles
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${category}`}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-teal-100 hover:text-teal-600 transition capitalize"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <BlogList articles={latestArticles as any} pageSize={12} />

          {/* Newsletter Section */}
          <section className="mt-16 bg-linear-to-r from-teal-600 to-teal-600 text-white rounded-lg p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-teal-100 mb-6">
                Get the latest smart home tips, reviews, and guides delivered to your inbox weekly.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-teal-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
