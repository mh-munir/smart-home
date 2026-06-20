"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Image from "next/image";
import Link from "next/link";

export default function HomeContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/products");
        const prods = res.ok ? await res.json() : [];
        if (!mounted) return;
        setProducts(Array.isArray(prods) ? prods : []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const featuredProducts = products.slice(0, 4);
  const main = featuredProducts[0];
  const others = featuredProducts.slice(1);

  return (
    <section className="bg-white">
      <div className="grid gap-6 lg:grid-cols-4">
          {/* Main large feature */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="h-80 rounded-lg bg-gray-50 animate-pulse" />
            ) : main ? (
              <article className="relative overflow-hidden rounded-lg shadow-lg">
                {main.image ? (
                  <Image
                    src={main.image}
                    alt={main.title}
                    width={1200}
                    height={720}
                    className="w-full h-72 object-cover lg:h-full"
                    unoptimized
                  />
                ) : (
                  <div className="h-72 bg-gray-100" />
                )}

                <div className="absolute inset-0 `bg-gradient-to-t` from-black/60 to-transparent" />

                <div className="absolute bottom-6 left-6 z-10 text-white">
                  {main.category && <div className="text-xs uppercase text-teal-200 font-semibold mb-2">{main.category}</div>}
                  <h3 className="text-2xl md:text-3xl font-extrabold leading-tight max-w-lg">{main.title}</h3>
                  {main.price && <p className="mt-3 text-lg font-semibold text-teal-300">{main.price}</p>}
                  <div className="mt-4">
                    <Link href={`/products/${main.slug}`} className="inline-block bg-white text-teal-700 px-4 py-2 rounded-md font-semibold">View Deal</Link>
                  </div>
                </div>
              </article>
            ) : (
              <div className="h-80 rounded-lg bg-gray-50" />
            )}
          </div>

          {/* Smaller featured cards */}
          <div className="lg:col-span-2 grid gap-6 grid-cols-1 md:grid-cols-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-40 rounded-lg bg-gray-50 animate-pulse" />
              ))
            ) : others.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-600">No featured products yet.</div>
            ) : (
              others.map((product) => (
                <ProductCard key={product._id} product={product} showBuyButton={false} />
              ))
            )}
          </div>
        </div>
    </section>
  );
}
