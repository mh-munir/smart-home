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

        {/* Images will be rendered inline with content below (interleaved) */}

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Article Content */}
          <article className="prose prose-lg max-w-none mb-16">
            {(() => {
              const content = article.content || "";
              const paragraphs = content
                .split(/\n\s*\n/)
                .map((p: string) => p.trim())
                .filter(Boolean);
              const images = (article.images ?? []) as string[];
              const blocks: any[] = [];
              const max = Math.max(paragraphs.length, images.length);

              const renderLines = (para: string, keyPrefix: string) => {
                const lines = para.split("\n").map((l: string) => l.trim()).filter(Boolean);
                if (lines.length === 1) {
                  const line = lines[0];
                  if (line.startsWith("## ")) {
                    return [
                      <h2 key={`${keyPrefix}-h2`} className="text-3xl font-bold mt-8 mb-4 text-gray-900">
                        {line.replace(/^##\s*/, "")}
                      </h2>,
                    ];
                  }
                  if (line.startsWith("### ")) {
                    return [
                      <h3 key={`${keyPrefix}-h3`} className="text-2xl font-bold mt-6 mb-3 text-gray-900">
                        {line.replace(/^###\s*/, "")}
                      </h3>,
                    ];
                  }
                  if (line.startsWith("**")) {
                    return [
                      <p key={`${keyPrefix}-p-bold`} className="text-gray-700 mb-4 font-semibold">
                        {line.replace(/^\*\*/, "")}
                      </p>,
                    ];
                  }
                  return [<p key={`${keyPrefix}-p`} className="text-gray-700 mb-4">{line}</p>];
                }

                if (lines.every((l: string) => l.startsWith("- "))) {
                  return [
                    <ul key={`${keyPrefix}-ul`} className="list-disc pl-6 mb-4 text-gray-700">
                      {lines.map((l: string, idx: number) => (
                        <li key={idx}>{l.replace(/^-+\s*/, "")}</li>
                      ))}
                    </ul>,
                  ];
                }

                return [<p key={`${keyPrefix}-pjoin`} className="text-gray-700 mb-4">{lines.join(" ")}</p>];
              };

              for (let i = 0; i < max; i++) {
                const img = images[i];
                const para = paragraphs[i];

                // When we have both image and paragraph for the same index, render them side-by-side on desktop
                if (img && para) {
                  blocks.push(
                    <div
                      key={`block-${i}`}
                      className={`flex flex-col md:items-center md:gap-6 mb-8 md:flex-row ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}
                    >
                      <figure className="md:w-1/2 w-full mb-4 md:mb-0">
                        <img
                          src={img}
                          alt={`${article.title} image ${i + 1}`}
                          className="w-full h-64 md:h-96 object-cover rounded"
                          loading="lazy"
                        />
                      </figure>

                      <div className="md:w-1/2 w-full prose max-w-none">
                        {renderLines(para, `para-${i}`)}
                      </div>
                    </div>
                  );
                  continue;
                }

                // Image only
                if (img && !para) {
                  blocks.push(
                    <figure key={`img-${i}`} className="mb-8">
                      <img src={img} alt={`${article.title} image ${i + 1}`} className="w-full rounded object-cover" loading="lazy" />
                    </figure>
                  );
                  continue;
                }

                // Paragraph only
                if (para && !img) {
                  blocks.push(
                    <div key={`para-${i}`} className="mb-6 prose prose-lg max-w-none">
                      {renderLines(para, `para-${i}`)}
                    </div>
                  );
                }
              }

              // If there are extra paragraphs beyond images (or vice versa), they are already handled.
              return blocks;
            })()}
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
