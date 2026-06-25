"use client";

import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface FeaturedProductsProps {
  featuredProducts?: any[];
  allProducts?: any[];
}

/**
 * Below-the-fold featured products section + sidebar.
 * Extracted as a client component so it can be dynamically imported
 * and hydrated off the critical path.
 */
export default function FeaturedProducts({ featuredProducts = [], allProducts = [] }: FeaturedProductsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-4 py-12 bg-white">
      <div className="w-full">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 items-start">
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-gray-100 p-6 shadow-sm bg-white mb-6">
              <p className="text-xs font-medium text-teal-600 uppercase tracking-wider">Curated Picks</p>
              <h2 className="mt-2 text-4xl font-serif font-bold text-gray-900">Featured Products</h2>
              <p className="mt-3 text-gray-600">Smart-home upgrades selected for practical features, clean setup, and everyday value.</p>
            </div>

            {featuredProducts.length === 0 ? (
              <div className="rounded-xl border border-gray-100 p-8 shadow-sm bg-white">
                <p className="text-gray-600">No featured products at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product: any) => (
                  <ProductCard key={product._id} product={product} showBuyButton={true} />
                ))}
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900">The Latest</h3>
                    <div className="mt-2 h-1 w-32 bg-yellow-300 rounded" />
                  </div>
                  <Link href="/products" className="text-xs text-teal-600 font-semibold hidden sm:inline">See all</Link>
                </div>

                <ul className="space-y-5">
                  {allProducts.slice(0, 3).map((product: any, idx: number) => (
                    <li key={product._id} className="flex items-start gap-4">
                      {product.image ? (
                        <div className="w-24 h-16 relative rounded-md overflow-hidden">
                          <Image src={product.image} alt={product.title} fill sizes="96px" loading="lazy" className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-16 bg-gray-100 rounded-md flex items-center justify-center text-sm">🛒</div>
                      )}

                      <div className="flex-1">
                        <Link href={`/products/${product.slug}`} className="text-sm font-semibold text-gray-900 hover:text-teal-600 line-clamp-2">{product.title}</Link>
                        <div className="text-xs text-gray-500 mt-1">{product.category || 'Smart Home'}{product.price ? ` • ${product.price}` : ''}</div>
                        <div className="text-xs text-gray-400 mt-1">{Math.max(1, (idx + 1) * 2)} hours ago</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-gray-100 p-6 rounded-lg shadow-sm">
                <h4 className="text-lg font-serif font-bold text-gray-900">Our Favorites</h4>
                <div className="mt-2 h-1 w-40 bg-teal-300 rounded" />
                <div className="mt-4 grid gap-4">
                  {allProducts.slice(3, 6).map((p: any) => (
                    <a key={p._id} href={`/products/${p.slug}`} className="flex items-center gap-4 bg-gray-50 p-2 rounded hover:bg-gray-100">
                      {p.image ? (
                        <div className="w-20 h-14 relative rounded-sm overflow-hidden">
                          <Image src={p.image} alt={p.title} fill sizes="80px" loading="lazy" className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-10 bg-gray-100 rounded-sm" />
                      )}
                      <div className="text-sm text-gray-800 line-clamp-2">{p.title}</div>
                      <div className="ml-auto text-sm text-teal-600 font-semibold">{p.price}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}