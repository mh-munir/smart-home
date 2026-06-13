import Image from 'next/image';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getBlogArticle, getLatestArticles } from "@/lib/blog";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, DEFAULT_LOGO } from "@/lib/site";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const article = getBlogArticle(params.slug);

  if (!article) {
    return {
      title: "নিবন্ধ খুঁজে পাওয়া যায়নি",
      description: "আপনি যে নিবন্ধটি খুঁজছেন তা বিদ্যমান নেই।",
    };
  }

  const tags = article.tags || [];

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
      publishedTime: article.date ?? undefined,
      authors: article.author ? [article.author] : undefined,
      tags: tags.length ? tags : undefined,
    },
    article: {
      publishedTime: article.date ?? undefined,
      authors: article.author ? [article.author] : undefined,
      tags: tags.length ? tags : undefined,
    },
  };
}

export default function BlogPostAffiliate({
  params,
}: {
  params: { slug: string };
}) {
  const article = getBlogArticle(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getLatestArticles(4).filter(
    (a) => a.id !== article.id
  );

  // Structured data and LCP image helpers
  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const imageUrl = article.image
    ? article.image.startsWith('http')
      ? article.image
      : `${SITE_URL}${article.image}`
    : DEFAULT_OG_IMAGE;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    headline: article.title,
    image: [imageUrl],
    datePublished: article.date ?? undefined,
    author: { '@type': 'Person', name: article.author ?? SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: DEFAULT_LOGO } },
    description: article.excerpt,
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-teal-600">হোম</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-teal-600">ব্লগ</Link>
              <span>/</span>
              <span className="text-gray-900 font-semibold line-clamp-1">{article.title}</span>
            </div>
          </div>
        </div>

        {/* Article Header - Hero Section */}
        <div className="bg-linear-to-r from-teal-600 via-teal-500 to-cyan-500 text-white py-12 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold capitalize">
                {article.category}
              </span>
              <span className="text-white/70">•</span>
              <span className="text-white/90">{article.readTime} মিনিট পড়ুন</span>
              <span className="text-white/70">•</span>
              <span className="text-white/90">
                {article.date
                  ? new Date(article.date).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-lg text-teal-100 mb-8 max-w-2xl">
              {article.excerpt}
            </p>

            {/* Author Section */}
            <div className="flex items-center gap-4 pt-6 border-t border-white/20">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl" aria-hidden="true">
                👤
              </div>
              <div>
                <p className="font-semibold text-white">{article.author}</p>
                <p className="text-teal-100 text-sm">বিশেষজ্ঞ লেখক</p>
              </div>
            </div>
            {/* Optional featured image (prioritized for LCP) */}
            {article.image && (
              <div className="mt-6 max-w-4xl">
                <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={imageUrl}
                    alt={article.title || SITE_NAME}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Article */}
            <div className="lg:col-span-2">
              {/* Table of Contents */}
              <div className="bg-linear-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200 mb-8">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">📑</span> বিষয়বস্তু
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#intro" className="text-teal-600 hover:text-teal-700">পরিচিতি</a></li>
                  <li><a href="#why" className="text-teal-600 hover:text-teal-700">কেন গুরুত্বপূর্ণ?</a></li>
                  <li><a href="#tips" className="text-teal-600 hover:text-teal-700">মূল টিপস</a></li>
                  <li><a href="#faq" className="text-teal-600 hover:text-teal-700">FAQ</a></li>
                </ul>
              </div>

              {/* Article Content */}
              <article className="prose prose-lg max-w-none mb-12">
                {(article.content || "").split("\n").map((paragraph, index) => {
                  if (paragraph.startsWith("##")) {
                    const heading = paragraph.replace("## ", "");
                    const id = heading.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <h2 
                        key={index} 
                        id={id}
                        className="text-3xl font-bold mt-10 mb-6 text-gray-900 scroll-mt-20"
                      >
                        {heading}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith("###")) {
                    return (
                      <h3 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900">
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
                      <p key={index} className="text-gray-700 mb-4 font-semibold leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  }
                  return (
                    <p key={index} className="text-gray-700 mb-4 leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  );
                })}
              </article>

              {/* CTA Box */}
              <div className="bg-linear-to-r from-amber-50 to-orange-50 p-8 rounded-xl border-2 border-amber-200 mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span> আরও জানুন
                </h3>
                <p className="text-gray-700 mb-4">
                  এই বিষয়ে আরও বিস্তারিত জানতে আমাদের পণ্য গাইড দেখুন।
                </p>
                <Link 
                  href="/products"
                  className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  → পণ্য দেখুন
                </Link>
              </div>

              {/* Tags */}
              <div className="border-t border-gray-200 py-8 mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase">বিষয়গুলি</h3>
                <div className="flex flex-wrap gap-3">
                  {(article.tags || []).map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${tag}`}
                      className="inline-block bg-linear-to-r from-teal-100 to-cyan-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold hover:shadow-md transition-all"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <div className="bg-linear-to-r from-teal-50 to-cyan-50 p-8 rounded-xl border border-teal-200 mb-12">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-teal-200 rounded-full flex items-center justify-center text-3xl shrink-0" aria-hidden="true">
                    👨‍💼
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{article.author}</h3>
                    <p className="text-sm text-gray-600">বিশেষজ্ঞ লেখক ও পর্যালোচক</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {article.author} হলেন {SITE_NAME} এর একজন অভিজ্ঞ অবদানকারী যিনি স্মার্ট হোম প্রযুক্তি এবং পণ্য পর্যালোচনায় বিশেষজ্ঞতা রাখেন।
                </p>
              </div>

              {/* CTA - আরও ভালো পণ্য খুঁজুন */}
              <div className="bg-linear-to-r from-teal-600 to-cyan-600 text-white p-8 rounded-xl mb-12 shadow-lg">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛍️</span> এই গাইডে সুপারিশকৃত পণ্য
                </h3>
                <p className="text-teal-100 mb-4">
                  এই নিবন্ধে আমরা যে পণ্যগুলি সুপারিশ করেছি সেগুলি বিশেষ ছাড়ে পাওয়া যাচ্ছে।
                </p>
                <a 
                  href="/products"
                  className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  → প্রস্তাবিত পণ্য দেখুন
                </a>
              </div>

              {/* Share Buttons */}
              <div className="bg-linear-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200 mb-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">📤</span> এই নিবন্ধটি শেয়ার করুন
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all transform hover:scale-105">
                    📘 Facebook
                  </button>
                  <button className="bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold transition-all transform hover:scale-105">
                    𝕏 Twitter
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all transform hover:scale-105">
                    💬 WhatsApp
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-all transform hover:scale-105">
                    📌 Pinterest
                  </button>
                </div>
              </div>

              {/* Download Guide */}
              <div className="bg-linear-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border-2 border-amber-300">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📥</span> গাইড ডাউনলোড করুন
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  এই সম্পূর্ণ গাইডটি PDF হিসাবে ডাউনলোড করুন এবং পরে পড়ুন।
                </p>
                <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-lg transition-all">
                  📄 PDF ডাউনলোড করুন
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Newsletter Signup */}
              <div className="bg-linear-to-br from-teal-600 to-teal-700 text-white p-6 rounded-xl shadow-lg mb-6 sticky top-20">
                <h3 className="font-bold text-lg mb-3">📧 নিউজলেটার</h3>
                <p className="text-sm text-teal-100 mb-4">
                  সাপ্তাহিক টিপস এবং পণ্য আপডেট পান।
                </p>
                <input
                  type="email"
                  name="email"
                  aria-label="নিউজলেটারে সাইন আপ করতে আপনার ইমেল"
                  placeholder="আপনার ইমেল"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 mb-3 text-sm"
                />
                <button
                  type="button"
                  aria-label="নিউজলেটার-সাইন-আপ"
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-2 rounded-lg transition-all"
                >
                  সাইন আপ করুন
                </button>
              </div>

              {/* Related Articles */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                  <span>📚</span> সম্পর্কিত নিবন্ধ
                </h3>
                <div className="space-y-4">
                  {relatedArticles.slice(0, 3).map((relArticle) => (
                    <Link
                      key={relArticle.id}
                      href={`/blog/${relArticle.slug}`}
                      className="group block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-teal-300 transition-all"
                    >
                      <h4 className="font-semibold text-gray-900 group-hover:text-teal-600 text-sm mb-2 line-clamp-2">
                        {relArticle.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>⏱️ {relArticle.readTime} মিনিট</span>
                        <span className="text-teal-600 group-hover:text-teal-700 font-bold">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular Guides */}
              <div className="bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 mb-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">⭐</span> জনপ্রিয় গাইড
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">→ শুরুর জন্য সম্পূর্ণ গাইড</a></li>
                  <li><a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">→ প্রো টিপস এবং কৌশল</a></li>
                  <li><a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">→ সাধারণ প্রশ্নাবলী</a></li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="bg-linear-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">দ্রুত লিঙ্ক</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/products" className="text-teal-600 hover:text-teal-700 font-semibold">→ পণ্য সংগ্রহ</a></li>
                  <li><a href="/category" className="text-teal-600 hover:text-teal-700 font-semibold">→ বিভাগ ব্রাউজ করুন</a></li>
                  <li><a href="/guides" className="text-teal-600 hover:text-teal-700 font-semibold">→ গাইড পড়ুন</a></li>
                  <li><a href="/contact" className="text-teal-600 hover:text-teal-700 font-semibold">→ যোগাযোগ করুন</a></li>
                </ul>
              </div>

              {/* Tip Box */}
              <div className="bg-linear-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span> টিপস
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  এই গাইডে উল্লেখ করা পণ্যগুলি বিশেষ ছাড়ে পাওয়া যাচ্ছে। এখনই চেক করুন!
                </p>
              </div>
            </div>
          </div>

          {/* More Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">আরও নিবন্ধ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedArticles.map((relArticle) => (
                  <Link
                    key={relArticle.id}
                    href={`/blog/${relArticle.slug}`}
                    className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className="bg-linear-to-br from-teal-500 to-teal-600 h-40 flex items-center justify-center text-4xl">
                      📚
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-teal-600 capitalize">
                          {relArticle.category}
                        </span>
                        <span className="text-xs text-gray-600">{relArticle.readTime} মিনিট</span>
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition line-clamp-2 text-sm mb-3">
                        {relArticle.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 text-xs mb-4">
                        {relArticle.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{relArticle.author}</span>
                        <span className="text-teal-600 group-hover:text-teal-700 font-bold">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
