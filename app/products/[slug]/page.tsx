import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type ProductDoc = {
  _id?: { toString?: () => string };
  slug?: string;
  title?: string;
  description?: string;
  price?: string;
  image?: string;
  images?: string[];
  category?: string;
  affiliateLink?: string;
  affiliateLinks?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    await connectDB();
    const entry = (await Product.findOne({ slug }).lean()) as ProductDoc | null;
    if (entry) {
      return {
        title: `${entry.title} | ${SITE_NAME}`,
        description: entry.description || `${entry.title}`,
        alternates: {
          canonical: `${SITE_URL}/products/${entry.slug}`,
        },
        openGraph: {
          title: entry.title,
          description: entry.description || "",
          url: `${SITE_URL}/products/${entry.slug}`,
          type: "article",
        },
      };
    }
  } catch {
    // ignore DB errors and fallback to API sample
  }

  // Fallback metadata when DB not available
  return {
    title: `Product | ${SITE_NAME}`,
    description: `Product details on ${SITE_NAME}`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product: ProductDoc | null = null;
  try {
    await connectDB();
    product = (await Product.findOne({ slug }).lean()) as ProductDoc | null;
  } catch {
    // ignore DB errors and try API fallback
  }

  if (!product) {
    // Try the API fallback (this will return the sample product if DB isn't configured)
    try {
      const res = await fetch(`${SITE_URL}/api/products?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        product = await res.json();
      }
    } catch {
      // ignore
    }
  }

  if (!product) notFound();

  // Related products (from DB when available)
  let relatedProducts: Array<ProductDoc> = [];
  try {
    if (product && product.category) {
      await connectDB();
      const list = (await Product.find({ category: product.category }).sort({ createdAt: -1 }).limit(4).lean()) as ProductDoc[];
      relatedProducts = list.filter((p) => p.slug !== product?.slug).slice(0, 3);
    }
  } catch {
    // ignore
  }

  const productImages = product.images && product.images.length ? product.images : product.image ? [product.image] : [];
  const productDate = product.createdAt?.toISOString?.() || new Date().toISOString();

  const renderContentBlocks = (content = "") => {
    const paragraphs = content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const images = productImages.length > 1 ? productImages.slice(1) : [];
    const blocks: ReactNode[] = [];
    let imageIndex = 0;

    const renderLines = (para: string, keyPrefix: string) => {
      const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 1) {
        const line = lines[0];
        if (line.startsWith("## ")) return <h2 key={`${keyPrefix}-h2`} className="text-3xl font-bold mt-10 mb-4 text-gray-900 leading-tight">{line.replace(/^##\s*/, "")}</h2>;
        if (line.startsWith("### ")) return <h3 key={`${keyPrefix}-h3`} className="text-2xl font-bold mt-8 mb-3 text-gray-900">{line.replace(/^###\s*/, "")}</h3>;
        if (line.startsWith("**") && line.endsWith("**")) return <p key={`${keyPrefix}-bold`} className="text-gray-800 mb-4 font-semibold leading-relaxed">{line.replace(/^\*\*/, "").replace(/\*\*$/, "")}</p>;
        if (line.includes("**")) {
          const parts = line.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={`${keyPrefix}-mixed`} className="text-gray-800 mb-4 leading-relaxed">
              {parts.map((part, idx) => (part.startsWith("**") && part.endsWith("**") ? <strong key={idx}>{part.replace(/^\*\*/, "").replace(/\*\*$/, "")}</strong> : part))}
            </p>
          );
        }
        if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) return <p key={`${keyPrefix}-italic`} className="text-gray-600 mb-4 italic leading-relaxed">{line.replace(/^\*/, "").replace(/\*$/, "")}</p>;
        return <p key={`${keyPrefix}-p`} className="text-gray-800 mb-4 leading-relaxed">{line}</p>;
      }

      if (lines.every((l) => l.startsWith("- "))) {
        return (
          <ul key={`${keyPrefix}-ul`} className="list-disc pl-6 mb-4 text-gray-800 space-y-1">
            {lines.map((l, idx) => (<li key={idx} className="leading-relaxed">{l.replace(/^\-\s*/, "")}</li>))}
          </ul>
        );
      }

      if (lines.every((l) => /^\d+[\.\)]\s/.test(l))) {
        return (
          <ol key={`${keyPrefix}-ol`} className="list-decimal pl-6 mb-4 text-gray-800 space-y-1">
            {lines.map((l, idx) => (<li key={idx} className="leading-relaxed">{l.replace(/^\d+[\.\)]\s*/, "")}</li>))}
          </ol>
        );
      }

      return <p key={`${keyPrefix}-pjoin`} className="text-gray-800 mb-4 leading-relaxed">{lines.join(" ")}</p>;
    };

    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i];
      blocks.push(<div key={`para-${i}`}>{renderLines(para, `para-${i}`)}</div>);

      if (images.length > 0 && imageIndex < images.length) {
        const shouldInsert = (i > 0 && i % 3 === 0) || (i === paragraphs.length - 1 && imageIndex < images.length);
        if (shouldInsert) {
          blocks.push(
            <figure key={`img-${i}`} className="my-8">
              <Image
                src={images[imageIndex]}
                alt={`${product.title} - image ${imageIndex + 2}`}
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

    while (imageIndex < images.length) {
      blocks.push(
        <figure key={`extra-img-${imageIndex}`} className="my-8">
          <Image
            src={images[imageIndex]}
            alt={`${product.title} - image ${imageIndex + 2}`}
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
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 pt-8 pb-12 sm:pt-12 sm:pb-16">
        <h1 className="text-[2.5rem] sm:text-[3rem] leading-tight font-bold text-gray-900 mb-4 tracking-tight">{product.title}</h1>

        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold shrink-0">PR</div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{product.category || SITE_NAME}</p>
            <p className="text-xs text-gray-500">Updated {new Date(productDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>

        {productImages.length > 0 && (
          <figure className="mb-8">
            <Image
              src={productImages[0]}
              alt={product.title || ""}
              width={1200}
              height={720}
              unoptimized
              className="w-full h-auto rounded-sm object-cover"
            />
          </figure>
        )}

        <article className="prose prose-lg max-w-none">
          {renderContentBlocks(product.description || "")}
        </article>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-teal-50 p-6 rounded-lg mb-10">
            <h3 className="text-xl font-bold mb-4">Buy This Product</h3>
            <a href={product.affiliateLink || "#"} target="_blank" rel="noopener noreferrer" className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg">Buy Now</a>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <Link key={item.slug} href={`/products/${item.slug}`} className="border rounded-lg overflow-hidden">
                  {item.image && (
                    <div className="w-full h-48 relative">
                      <Image
                        src={item.image}
                        alt={item.title || ""}
                        width={800}
                        height={480}
                        unoptimized
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-teal-600 mt-2">{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
