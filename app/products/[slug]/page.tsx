import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import SchemaMarkup from '@/components/SchemaMarkup';
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type ProductDoc = {
  _id?: { toString?: () => string };
  slug?: string;
  title?: string;
  description?: string;
  price?: string;
  rating?: number;
  image?: string;
  images?: string[];
  category?: string;
  affiliateLink?: string;
  brand?: string;
  isActive?: boolean;
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
      const productUrl = `${SITE_URL}/products/${entry.slug}`;
      const productImage = entry.image || entry.images?.[0] || DEFAULT_OG_IMAGE;
      const productDesc = entry.description
        ? entry.description.replace(/[#*_\[\]]/g, "").slice(0, 160)
        : `Buy ${entry.title} - best price and reviews on ${SITE_NAME}`;

      return {
        title: `${entry.title} | ${SITE_NAME}`,
        description: productDesc,
        keywords: `${entry.title}, ${entry.category || "smart home"}, buy online, best price, review`,
        alternates: {
          canonical: productUrl,
        },
        openGraph: {
          title: entry.title,
          description: productDesc,
          url: productUrl,
          siteName: SITE_NAME,
          type: "website",
          images: [
            {
              url: productImage,
              width: 1200,
              height: 630,
              alt: entry.title || "",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: entry.title,
          description: productDesc,
          images: [productImage],
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

  // `product` has been checked above with `notFound()` so assert non-null here
  const prod = product as ProductDoc;

  const productImages = prod.images && prod.images.length ? prod.images : prod.image ? [prod.image] : [];
  const productDate = prod.createdAt?.toISOString?.() || new Date().toISOString();

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
                alt={`${prod.title} - image ${imageIndex + 2}`}
                width={1200}
                height={720}
                className="w-full h-auto rounded-sm object-cover"
                sizes="(max-width: 1024px) 100vw, 768px"
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
            alt={`${prod.title} - image ${imageIndex + 2}`}
            width={1200}
            height={720}
            className="w-full h-auto rounded-sm object-cover"
            sizes="(max-width: 1024px) 100vw, 768px"
            loading="lazy"
          />
        </figure>
      );
      imageIndex++;
    }

    return blocks;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-4 min-h-screen bg-white">
      <SchemaMarkup
        type="Product"
        title={prod.title}
        description={prod.description}
        image={productImages[0]}
        url={`${SITE_URL}/products/${prod.slug}`}
        datePublished={prod.createdAt?.toISOString?.()}
        dateModified={prod.updatedAt?.toISOString?.()}
        price={prod.price}
        priceCurrency={prod.price?.toString().includes('USD') ? 'USD' : undefined}
        sku={prod._id?.toString?.()}
        availability={prod.isActive ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}
        brand={prod.brand || SITE_NAME}
      />
      <div className="pt-8 pb-12 sm:pt-12 sm:pb-16">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <main className="lg:col-span-2">
            <h1 className="text-[2.5rem] sm:text-[3rem] leading-tight font-extrabold text-gray-900 mb-4 tracking-tight">{prod.title}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold shrink-0">PR</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{prod.category || SITE_NAME}</p>
                <p className="text-xs text-gray-500">Updated {new Date(productDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            </div>

            {productImages.length > 0 && (
              <figure className="mb-8 overflow-hidden rounded-lg">
                  <Image
                    src={productImages[0]}
                    alt={prod.title || ""}
                    width={1200}
                    height={720}
                    className="w-full h-auto object-cover rounded-lg"
                    sizes="(max-width: 1024px) 100vw, 768px"
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
              </figure>
            )}

            <article id="details" className="prose prose-lg max-w-none">
              {renderContentBlocks(prod.description || "")}
            </article>

            {relatedProducts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedProducts.map((item) => (
                    <Link key={item.slug} href={`/products/${item.slug}`} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                      {item.image && (
                        <div className="w-full h-40 relative">
                          <Image
                            src={item.image}
                            alt={item.title || ""}
                            width={800}
                            height={480}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <h3 className="font-bold line-clamp-2">{item.title}</h3>
                        <p className="text-teal-600 mt-2 font-semibold">{item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border rounded-lg p-6 shadow">
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-3xl font-bold text-teal-600 mt-2">{prod.price || '—'}</p>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z"/></svg>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">{prod.rating || '4.5'}</div>
                </div>

                <a href={prod.affiliateLink || '#'} target="_blank" rel="noopener noreferrer" className="block mt-6 bg-red-500 hover:bg-red-600 text-white text-center py-3 rounded-lg font-semibold">Buy Now</a>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <p className="text-sm font-semibold">Quick Specs</p>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  {prod.category && <li>Category: {prod.category}</li>}
                  {prod.price && <li>Price: {prod.price}</li>}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
