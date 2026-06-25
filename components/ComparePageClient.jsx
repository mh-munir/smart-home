"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCompare } from "./CompareProvider";
import { BLUR_DATA_URL } from "@/lib/image-placeholder";

/**
 * Client-side JSON-LD helper that reads the CSP nonce from a meta tag
 * and injects the script element dynamically so it passes CSP checks.
 */
function JsonLdScript({ data, nonce }) {
  useEffect(() => {
    if (!data) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    if (nonce) script.setAttribute("nonce", nonce);
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [data, nonce]);
  return null;
}

function ComparePageClient() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">📊</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">No Products to Compare</h1>
        <p className="text-gray-500 max-w-md mb-6">
          Add products to your comparison list by clicking the compare button on product cards.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const getMainAffiliate = (product) => {
    if (product.affiliateLinks && typeof product.affiliateLinks === "object") {
      const entries = Object.entries(product.affiliateLinks);
      const enabled = entries.filter(([, v]) => v && v.url && v.enabled);
      if (enabled.length > 0) {
        const [id, data] = enabled[0];
        return { id, url: data.url, name: id.charAt(0).toUpperCase() + id.slice(1) };
      }
    }
    if (product.affiliateLink) {
      return { id: "main", url: product.affiliateLink, name: "Buy Now" };
    }
    return null;
  };

  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Smart home product comparison",
    itemListElement: compareList.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        description: product.description,
        image: product.image,
        category: product.category,
        url: product.slug ? `/products/${product.slug}` : undefined,
        offers: product.price
          ? {
              "@type": "Offer",
              price: Number(String(product.price).replace(/[^0-9.]/g, "")) || undefined,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            }
          : undefined,
        aggregateRating: product.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              ratingCount: 1,
            }
          : undefined,
      },
    })),
  };

  // Read CSP nonce from meta tag for compliant inline JSON-LD script
  const [nonce, setNonce] = useState(undefined);
  useEffect(() => {
    const el = document.querySelector('meta[name="csp-nonce"]');
    if (el) setNonce(el.getAttribute("content") || undefined);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* JSON-LD is injected via useEffect so the nonce is available client-side */}
      <JsonLdScript data={comparisonSchema} nonce={nonce} />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Comparison</h1>
            <p className="text-gray-500 mt-1">Comparing {compareList.length} products side by side</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/products"
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Add More
            </Link>
            <button
              type="button"
              onClick={clearCompare}
              className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-150" role="table">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-48 p-4 text-left text-sm font-semibold text-gray-500 bg-gray-50">
                  Feature
                </th>
                {compareList.map((product) => (
                  <th key={product._id} className="p-4 text-center min-w-50">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => removeFromCompare(product._id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 text-gray-500 rounded-full hover:bg-red-500 hover:text-white transition text-xs"
                        aria-label={`Remove ${product.title}`}
                      >
                        ✕
                      </button>
                      {product.image ? (
                        <div className="w-full h-40 relative rounded-lg overflow-hidden mb-3">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="200px"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-4xl mb-3">
                          🛒
                        </div>
                      )}
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-bold text-gray-900 hover:text-teal-600 transition text-sm line-clamp-2"
                      >
                        {product.title}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price */}
              <tr className="border-b border-gray-100">
                <td className="p-4 text-sm font-semibold text-gray-500 bg-gray-50">Price</td>
                {compareList.map((p) => (
                  <td key={p._id} className="p-4 text-center">
                    <span className="text-lg font-bold text-teal-600">{p.price || "N/A"}</span>
                  </td>
                ))}
              </tr>
              {/* Rating */}
              <tr className="border-b border-gray-100">
                <td className="p-4 text-sm font-semibold text-gray-500 bg-gray-50">Rating</td>
                {compareList.map((p) => (
                  <td key={p._id} className="p-4 text-center">
                    <span className="text-gray-700">{p.rating ? `⭐ ${p.rating}` : "N/A"}</span>
                  </td>
                ))}
              </tr>
              {/* Category */}
              <tr className="border-b border-gray-100">
                <td className="p-4 text-sm font-semibold text-gray-500 bg-gray-50">Category</td>
                {compareList.map((p) => (
                  <td key={p._id} className="p-4 text-center">
                    <span className="text-gray-700 capitalize">{p.category || "N/A"}</span>
                  </td>
                ))}
              </tr>
              {/* Description */}
              <tr className="border-b border-gray-100">
                <td className="p-4 text-sm font-semibold text-gray-500 bg-gray-50">Description</td>
                {compareList.map((p) => (
                  <td key={p._id} className="p-4 text-center">
                    <span className="text-sm text-gray-600 line-clamp-4">{p.description || "No description"}</span>
                  </td>
                ))}
              </tr>
              {/* Affiliate Link */}
              <tr>
                <td className="p-4 text-sm font-semibold text-gray-500 bg-gray-50">Buy</td>
                {compareList.map((p) => {
                  const affiliate = getMainAffiliate(p);
                  return (
                    <td key={p._id} className="p-4 text-center">
                      {affiliate ? (
                        <a
                          href={affiliate.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                        >
                          Buy on {affiliate.name}
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          href={`/products/${p.slug}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                        >
                          View Details
                        </Link>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default memo(ComparePageClient);
