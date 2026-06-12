import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  getBlogArticlesByCategory,
  getAllBlogCategories,
  getLatestArticles,
} from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}) {
  const validCategories = getAllBlogCategories();

  if (!validCategories.includes(params.category)) {
    return {
      title: "Category Not Found",
      description: "The category you're looking for doesn't exist.",
    };
  }

  return {
    title: `${params.category.charAt(0).toUpperCase() + params.category.slice(1)} Articles | ${SITE_NAME}`,
    description: `Browse all ${params.category} articles on ${SITE_NAME}. Expert guides, reviews, and tutorials.`,
    alternates: {
      canonical: `${SITE_URL}/category/${params.category}`,
    },
    openGraph: {
      title: `${params.category.charAt(0).toUpperCase() + params.category.slice(1)} Articles`,
      description: `Browse all ${params.category} articles on ${SITE_NAME}.`,
      url: `${SITE_URL}/category/${params.category}`,
      type: "website",
    },
  };
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const validCategories = getAllBlogCategories();

  if (!validCategories.includes(params.category)) {
    notFound();
  }

  const articles = getBlogArticlesByCategory(params.category);
  const allCategories = getAllBlogCategories();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-teal-600 to-teal-600 text-white py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 capitalize">
              {params.category} Articles
            </h1>
            <p className="text-xl text-teal-100 max-w-2xl">
              Explore our collection of {articles.length} articles on {params.category}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Browse Categories</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                All Articles
              </Link>
              {allCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat}`}
                  className={`px-4 py-2 rounded-lg transition capitalize ${
                    cat === params.category
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Articles Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {articles.length} article{articles.length !== 1 ? "s" : ""} in{" "}
              <span className="font-bold capitalize text-gray-900">{params.category}</span>
            </p>
          </div>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <div className="bg-linear-to-r from-blue-500 to-indigo-500 h-40 flex items-center justify-center text-4xl">
                    📚
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-blue-600 capitalize">
                        {article.category}
                      </span>
                      <span className="text-sm text-gray-600">{article.readTime} min</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{article.author}</span>
                      <span className="text-gray-500">
                        {new Date(article.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {article.tags.slice(0, 2).map((tag) => (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                No articles found in this category yet.
              </p>
              <Link href="/blog" className="text-blue-600 hover:underline">
                Browse all articles
              </Link>
            </div>
          )}

          {/* CTA Section */}
          <section className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Don't miss out on new content</h2>
              <p className="text-blue-100 mb-6">
                Subscribe to our newsletter to get the latest guides and reviews delivered to your inbox.
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
                  className="bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
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

export async function generateStaticParams() {
  const categories = getAllBlogCategories();
  return categories.map((category) => ({
    category,
  }));
}
