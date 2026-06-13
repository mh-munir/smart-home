import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getBlogArticle, getLatestArticles } from "@/lib/blog";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try DB first, fallback to static articles
  try {
    await connectDB();
    const entry = await Blog.findOne({ slug }).lean();
    if (entry) {
      return {
        title: `${entry.title} | ${SITE_NAME}`,
        description: entry.description || entry.excerpt || "",
        keywords: (entry.tags || []).join(", "),
        alternates: {
          canonical: `${SITE_URL}/blog/${entry.slug}`,
        },
        openGraph: {
          title: entry.title,
          description: entry.description || entry.excerpt || "",
          url: `${SITE_URL}/blog/${entry.slug}`,
          type: "article",
          publishedTime: entry.createdAt,
          authors: [entry.author || SITE_NAME],
          tags: entry.tags || [],
        },
        article: {
          publishedTime: entry.createdAt,
          authors: [entry.author || SITE_NAME],
          tags: entry.tags || [],
        },
      };
    }
  } catch (err) {
    // ignore DB errors and fallback to static
  }

  const article = getBlogArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The article you're looking for doesn't exist.",
    };
  }

  const tags = article.tags ?? [];

  return {
    title: `${article.title} | ${SITE_NAME}`,
    description: article.excerpt,
    keywords: tags.join(", "),
    alternates: {
      canonical: `${SITE_URL}/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${SITE_URL}/blog/${article.slug}`,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      tags,
    },
    article: {
      publishedTime: article.date,
      authors: [article.author],
      tags,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let article: any = null;
  try {
    await connectDB();
    article = await Blog.findOne({ slug }).lean();
  } catch (err) {
    // ignore DB errors and fallback to static list
  }

  if (!article) {
    article = getBlogArticle(slug);
    if (!article) notFound();
  }

  const relatedArticles = (await (async () => {
    try {
        if (typeof article._id !== "undefined") {
        // from DB - fetch latest from DB
        const latest = await Blog.find({ published: true }).sort({ createdAt: -1 }).limit(4).lean();
        return latest.map((a: any) => ({ id: a._id?.toString?.() ?? String(a._id), slug: a.slug, title: a.title, excerpt: a.description || "", readTime: a.readTime || 5 }));
      }
    } catch (e) {
      // fallback
    }
    return getLatestArticles(3);
  })()).filter((a: any) => a.slug !== article.slug).slice(0, 3);
  const articleTags = article.tags ?? [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Article Header */}
        <div className="bg-linear-to-r from-teal-600 to-teal-600 text-white py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-teal-100 capitalize">{article.category}</span>
              <span className="text-teal-100">•</span>
              <span className="text-teal-100">{article.readTime} min read</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              {article.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-teal-100">
              <span>By {article.author}</span>
              <span>•</span>
              <span>{new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
          </div>
        </div>

        {article.images && article.images.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.images.slice(0, 5).map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${article.title} image ${idx + 1}`}
                  className="w-full h-64 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Article Content */}
          <article className="prose prose-lg max-w-none mb-16">
            {article.content.split("\n").map((paragraph: string, index: number) => {
              if (paragraph.startsWith("##")) {
                return (
                  <h2 key={index} className="text-3xl font-bold mt-8 mb-4 text-gray-900">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("###")) {
                return (
                  <h3 key={index} className="text-2xl font-bold mt-6 mb-3 text-gray-900">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("- ")) {
                return null;
              }
              if (paragraph.trim() === "") {
                return <br key={index} />;
              }
              if (paragraph.startsWith("**")) {
                return (
                  <p key={index} className="text-gray-700 mb-4 font-semibold">
                    {paragraph}
                  </p>
                );
              }
              return (
                <p key={index} className="text-gray-700 mb-4">
                  {paragraph}
                </p>
              );
            })}
          </article>

          {/* Tags */}
          <div className="border-t border-gray-200 py-8 mb-8">
            <h3 className="text-sm font-bold text-gray-900 mb-3">TAGS</h3>
            <div className="flex flex-wrap gap-2">
              {articleTags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Section */}
          <div className="bg-gray-50 p-6 rounded-lg mb-12 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">About the Author</h3>
            <p className="text-gray-700">
              {article.author} is an expert contributor to {SITE_NAME} with extensive experience in smart home technology and product reviews.
            </p>
          </div>

          {/* Share Section */}
          <div className="border-t border-b border-gray-200 py-6 mb-12">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share This Article</h3>
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${SITE_URL}/blog/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}/blog/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                Facebook
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${SITE_URL}/blog/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle: any) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/blog/${relatedArticle.slug}`}
                    className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="bg-linear-to-r from-teal-500 to-teal-500 h-32 flex items-center justify-center text-3xl">
                      📚
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-teal-600 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Want more smart home tips?
            </h3>
            <p className="text-gray-700 mb-4">
              Subscribe to our newsletter for weekly guides, reviews, and exclusive offers.
            </p>
            <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition font-semibold">
              Subscribe Now
            </button>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  const { blogArticles } = await import("@/lib/blog");
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}
