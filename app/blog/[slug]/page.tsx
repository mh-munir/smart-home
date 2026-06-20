import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { getBlogArticle, getLatestArticles } from "@/lib/blog";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type BlogArticleDoc = {
  _id?: { toString?: () => string };
  slug?: string;
  title?: string;
  description?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author?: string;
  date?: string;
  createdAt?: Date;
  readTime?: number;
  images?: string[];
  imageUrls?: string[];
  tags?: string[];
};

type RelatedArticle = {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  readTime?: number;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try DB first, fallback to static articles
  try {
    await connectDB();
    const entry = (await Blog.findOne({ slug, published: true }).lean()) as BlogArticleDoc | null;
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
  } catch {
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

  let article: BlogArticleDoc | null = null;
  try {
    await connectDB();
    article = (await Blog.findOne({ slug, published: true }).lean()) as BlogArticleDoc | null;
  } catch {
    // ignore DB errors and fallback to static list
  }

  if (!article) {
    article = getBlogArticle(slug);
    if (!article) notFound();
  }

  // Related articles: attempt DB, otherwise fallback to static
    const relatedArticles: RelatedArticle[] = (await (async () => {
    try {
      if (typeof article._id !== "undefined") {
        const latest = (await Blog.find({ published: true }).sort({ createdAt: -1 }).limit(4).lean()) as BlogArticleDoc[];
        return latest.map((a) => ({ id: a._id?.toString?.() ?? String(a._id), slug: a.slug, title: a.title, excerpt: a.description || "", readTime: a.readTime || 5 }));
      }
    } catch {
      // fallback
    }
    return getLatestArticles(3);
  })());
  const articleTags = article.tags ?? [];
  const articleDate =
    article.createdAt?.toISOString?.() || article.date || new Date().toISOString();
  const articleAuthor = article.author || SITE_NAME;
  const articleReadTime = article.readTime || 5;
  const articleImages =
    article.images?.length ? article.images : article.imageUrls ?? [];

  // Get author initials for avatar
  const authorInitials = articleAuthor
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      {/* Main Article Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 pt-8 pb-12 sm:pt-12 sm:pb-16">
        {/* Hero Header */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-sm">
          <div className="`bg-gradient-to-r` from-teal-600 to-indigo-600 p-8 text-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                {article.category && (
                  <span className="inline-block bg-white/10 text-white px-3 py-1 rounded-full text-xs font-semibold">{article.category}</span>
                )}
                <h1 className="mt-4 text-[2.25rem] sm:text-[3rem] leading-tight font-extrabold">{article.title}</h1>
                {(article.description || article.excerpt) && (
                  <p className="mt-3 text-sm opacity-90 max-w-2xl">{article.description || article.excerpt}</p>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-bold shrink-0">{authorInitials}</div>
                  <div>
                    <p className="text-sm font-semibold">{articleAuthor}</p>
                    <p className="text-xs opacity-90">Updated {new Date(articleDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} • {articleReadTime} min read</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="bg-white text-teal-700 px-3 py-2 rounded-full text-sm font-semibold">Share</button>
                <a href="#" className="bg-white/20 text-white px-3 py-2 rounded-full text-sm">Subscribe</a>
              </div>
            </div>
          </div>

          {articleImages.length > 0 && (
            <figure className="w-full h-64 sm:h-96 overflow-hidden">
              <Image
                src={articleImages[0]}
                alt={article.title || ""}
                width={1200}
                height={720}
                unoptimized
                className="w-full h-full object-cover"
              />
            </figure>
          )}
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          {(() => {
            const content = article.content || "";
            const paragraphs = content
              .split(/\n\s*\n/)
              .map((p: string) => p.trim())
              .filter(Boolean);
            const images = (articleImages.length > 1
              ? articleImages.slice(1)
              : []) as string[];
            const blocks: ReactNode[] = [];
            let imageIndex = 0;

            const renderLines = (para: string, keyPrefix: string) => {
              const lines = para.split("\n").map((l: string) => l.trim()).filter(Boolean);
              if (lines.length === 1) {
                const line = lines[0];
                if (line.startsWith("## ")) {
                  return (
                    <h2 key={`${keyPrefix}-h2`} className="text-3xl font-bold mt-10 mb-4 text-gray-900 leading-tight">
                      {line.replace(/^##\s*/, "")}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3 key={`${keyPrefix}-h3`} className="text-2xl font-bold mt-8 mb-3 text-gray-900">
                      {line.replace(/^###\s*/, "")}
                    </h3>
                  );
                }
                // Handle bold paragraphs
                if (line.startsWith("**") && line.endsWith("**")) {
                  return (
                    <p key={`${keyPrefix}-bold`} className="text-gray-800 mb-4 font-semibold leading-relaxed">
                      {line.replace(/^\*\*/, "").replace(/\*\*$/, "")}
                    </p>
                  );
                }
                // Handle lines with inline bold
                if (line.includes("**")) {
                  const parts = line.split(/(\*\*[^*]+\*\*)/g);
                  return (
                    <p key={`${keyPrefix}-mixed`} className="text-gray-800 mb-4 leading-relaxed">
                      {parts.map((part, idx) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return <strong key={idx}>{part.replace(/^\*\*/, "").replace(/\*\*$/, "")}</strong>;
                        }
                        return part;
                      })}
                    </p>
                  );
                }
                // Handle italic text
                if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
                  return (
                    <p key={`${keyPrefix}-italic`} className="text-gray-600 mb-4 italic leading-relaxed">
                      {line.replace(/^\*/, "").replace(/\*$/, "")}
                    </p>
                  );
                }
                return (
                  <p key={`${keyPrefix}-p`} className="text-gray-800 mb-4 leading-relaxed">
                    {line}
                  </p>
                );
              }

              // Multiple lines - check if it's a list
              if (lines.every((l: string) => l.startsWith("- "))) {
                return (
                  <ul key={`${keyPrefix}-ul`} className="list-disc pl-6 mb-4 text-gray-800 space-y-1">
                    {lines.map((l: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">{l.replace(/^-\s*/, "")}</li>
                    ))}
                  </ul>
                );
              }

              // Check if lines start with numbers (ordered list)
              if (lines.every((l: string) => /^\d+[\.\)]\s/.test(l))) {
                return (
                  <ol key={`${keyPrefix}-ol`} className="list-decimal pl-6 mb-4 text-gray-800 space-y-1">
                    {lines.map((l: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">{l.replace(/^\d+[\.\)]\s*/, "")}</li>
                    ))}
                  </ol>
                );
              }

              // Join multi-line paragraphs
              return (
                <p key={`${keyPrefix}-pjoin`} className="text-gray-800 mb-4 leading-relaxed">
                  {lines.join(" ")}
                </p>
              );
            };

            for (let i = 0; i < paragraphs.length; i++) {
              const para = paragraphs[i];

              blocks.push(
                <div key={`para-${i}`}>
                  {renderLines(para, `para-${i}`)}
                </div>
              );

              // Insert an image after every 2-3 paragraphs (spread images naturally)
              if (images.length > 0 && imageIndex < images.length) {
                const shouldInsert =
                  (i > 0 && i % 3 === 0) ||
                  (i === paragraphs.length - 1 && imageIndex < images.length);
                if (shouldInsert) {
                  blocks.push(
                    <figure key={`img-${i}`} className="my-8">
                        { }
                        <Image
                          src={images[imageIndex]}
                          alt={`${article.title} - image ${imageIndex + 2}`}
                          width={1200}
                          height={720}
                          unoptimized
                          className="w-full h-auto rounded-sm object-cover"
                          loading="lazy"
                        />
                      </figure>
                  );
                  imageIndex++;
                }
              }
            }

            // Render any remaining images
            while (imageIndex < images.length) {
              blocks.push(
                <figure key={`extra-img-${imageIndex}`} className="my-8">
                  <Image
                    src={images[imageIndex]}
                    alt={`${article.title} - image ${imageIndex + 2}`}
                    width={1200}
                    height={720}
                    unoptimized
                    className="w-full h-auto rounded-sm object-cover"
                    loading="lazy"
                  />
                </figure>
              );
              imageIndex++;
            }

            return blocks;
          })()}
        </article>

          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
              <ul className="space-y-2">
                {relatedArticles.map((ra) => (
                  <li key={ra.slug || ra.id}>
                    <Link href={`/blog/${ra.slug}`} className="text-teal-600 hover:underline">
                      {ra.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Sponsor Notice */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">
            This article is sponsored by the{" "}
            <Link href="#" className="text-teal-600 hover:text-teal-700 not-italic font-medium">
              {SITE_NAME}
            </Link>
            .
          </p>
        </div>

        {/* Tags */}
        {articleTags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {articleTags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/category/${encodeURIComponent(tag)}`}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Box */}
        <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-800 text-white flex items-center justify-center text-lg font-bold shrink-0">
              {authorInitials}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{articleAuthor}</p>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                Expert contributor to {SITE_NAME} with extensive experience in smart home technology and product reviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}