import Link from "next/link";
import BlogList from "@/components/BlogList";
import NewsletterClientWrapper from "@/components/NewsletterClientWrapper";
import type { BlogArticle } from "@/components/BlogCard";
import { getLatestArticles, getAllBlogCategories } from "@/lib/blog";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

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

type DbBlogDoc = {
  _id?: { toString?: () => string };
  slug?: string;
  title?: string;
  description?: string;
  content?: string;
  author?: string;
  createdAt?: Date;
  date?: string | null;
  category?: string;
  readTime?: number;
  featured?: boolean;
  image?: string;
  images?: string[];
  imageUrls?: string[];
  tags?: string[];
};

export default async function BlogPage() {
  let latestArticles: BlogArticle[] = [];
  let categories: string[] = [];

  try {
    await connectDB();
    const docs = await Blog.find({ published: true }).sort({ createdAt: -1 }).limit(100).lean();
    latestArticles = docs.map((a: DbBlogDoc) => ({
      id: a._id?.toString?.() ?? a.slug,
      slug: a.slug,
      title: a.title,
      excerpt: a.description || "",
      author: a.author || "",
      date: a.createdAt?.toISOString() || a.date || null,
      category: a.category,
      readTime: a.readTime || 5,
      featured: a.featured || false,
      image: a.image || a.images?.[0] || a.imageUrls?.[0] || undefined,
      tags: a.tags || [],
    }));
    categories = Array.from(
      new Set(docs.map((d: DbBlogDoc) => d.category).filter(Boolean) as string[])
    ).sort();
  } catch {
    // fallback to static articles when DB isn't available
    latestArticles = getLatestArticles(12);
    categories = getAllBlogCategories();
  }

  return (

      <section>
        <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-teal-600 to-teal-600 text-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-4 py-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Smart Home Blog
            </h1>
            <p className="text-xl text-teal-100 max-w-2xl">
              Expert guides, reviews, and tutorials to help you build and optimize your smart home
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-4 py-12">
          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Categories</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                All Articles
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${encodeURIComponent(category)}`}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-teal-100 hover:text-teal-600 transition capitalize"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <BlogList articles={latestArticles} pageSize={12} />

          {/* Newsletter Section */}
          <section className="w-full mt-16 bg-linear-to-r from-teal-600 to-teal-600 text-white rounded-lg p-8 md:p-12">
            <div className="max-w-7xl mx-auto px-4 lg:px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-teal-100 mb-6">
                Get the latest smart home tips, reviews, and guides delivered to your inbox weekly.
              </p>
              <div className="[&_input]:bg-white [&_input]:text-gray-900 [&_button]:bg-white [&_button]:text-teal-700 [&_button:hover]:bg-gray-100">
                <NewsletterClientWrapper source="blog" />
              </div>
            </div>
          </section>
        </div>
      </div>
      </section>
  );
}
