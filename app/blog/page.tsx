import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getLatestArticles, getAllBlogCategories } from "@/lib/blog";
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

export default function Blog() {
  const latestArticles = getLatestArticles(12);
  const categories = getAllBlogCategories();

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-linear-to-r from-teal-500 to-teal-500 h-40 flex items-center justify-center text-4xl">
                  📚
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-teal-600 capitalize">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-600">{article.readTime} min read</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{article.author}</span>
                    <span className="text-gray-500">
                      {article.date ? new Date(article.date).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(article.tags ?? []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

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
