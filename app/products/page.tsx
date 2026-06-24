import Link from "next/link";
import dynamic from "next/dynamic";
import { getProducts, getProductsByCategory } from "@/lib/products";
import { getCategories } from "@/lib/categories";

const ProductCard = dynamic(() => import("@/components/ProductCard"));
const ProductFilters = dynamic(() => import("@/components/ProductFilters"));

type Props = {
  searchParams?: { q?: string; category?: string } | Promise<{ q?: string; category?: string } | undefined>;
};

export async function generateMetadata({ searchParams }: Props) {
  const resolved = await (searchParams as any);
  const category = String(resolved?.category || "").trim();
  if (category) {
    return {
      title: `${category} Products - Smart Home Affiliate`,
      description: `Browse all ${category} products and reviews.`,
    };
  }
  return {
    title: "Products - Smart Home Affiliate",
    description: "Browse all smart home products and reviews.",
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const resolvedSearchParams = await (searchParams as any);
  const q = String(resolvedSearchParams?.q || "").trim();
  const category = String(resolvedSearchParams?.category || "").trim();
  const sort = String(resolvedSearchParams?.sort || "newest").trim();
  const rating = String(resolvedSearchParams?.rating || "").trim();
  const price = String(resolvedSearchParams?.price || "").trim();

  let products: any[];

  if (category) {
    products = await getProductsByCategory(category);
  } else {
    products = (await getProducts()) || [];
  }

  // Apply text search filter
  if (q) {
    products = products.filter((p: any) => {
      const hay = `${String(p.title || "")} ${String(p.description || "")} ${String(p.category || "")}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }

  // Apply rating filter
  if (rating) {
    const minRating = parseFloat(rating);
    products = products.filter((p: any) => (p.rating || 0) >= minRating);
  }

  // Apply price filter
  if (price) {
    products = products.filter((p: any) => {
      const priceStr = p.price || "";
      const match = priceStr.match(/[\d.]+/);
      const priceNum = match ? parseFloat(match[0]) : 0;
      if (price === "0-25") return priceNum <= 25;
      if (price === "25-50") return priceNum > 25 && priceNum <= 50;
      if (price === "50-100") return priceNum > 50 && priceNum <= 100;
      if (price === "100+") return priceNum > 100;
      return true;
    });
  }

  // Apply sorting
  if (sort === "rating") {
    products.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === "popular") {
    products.sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0));
  } else if (sort === "price-low") {
    products.sort((a: any, b: any) => {
      const pa = parseFloat((a.price || "").match(/[\d.]+/)?.[0] || "0");
      const pb = parseFloat((b.price || "").match(/[\d.]+/)?.[0] || "0");
      return pa - pb;
    });
  } else if (sort === "price-high") {
    products.sort((a: any, b: any) => {
      const pa = parseFloat((a.price || "").match(/[\d.]+/)?.[0] || "0");
      const pb = parseFloat((b.price || "").match(/[\d.]+/)?.[0] || "0");
      return pb - pa;
    });
  }

  return (
    <main className="min-h-screen bg-white py-12">
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 lg:px-4">
          {/* Product Filters */}
          <ProductFilters products={products} categories={[]} />

          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            {category ? `${category} Products` : "All Products"}
          </h1>

          {category ? (
            <p className="text-sm text-gray-600 mb-1">
              <Link href="/products" className="text-teal-600 hover:underline">All Products</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{category}</span>
            </p>
          ) : null}

          {(q || category) ? (
            <p className="text-sm text-gray-600 mb-4">
              {q && category
                ? `Showing results for "${q}" in ${category} — `
                : q
                  ? `Showing results for "${q}" — `
                  : `Showing all products in ${category} — `}
              {products.length} result{products.length === 1 ? "" : "s"}
            </p>
          ) : null}

          {products.length === 0 ? (
            <div className="rounded-xl border border-gray-100 p-8 shadow-sm bg-white">
              <p className="text-gray-600">
                {category
                  ? `No products found in the "${category}" category.`
                  : "No products available."}
              </p>
              {category ? (
                <Link href="/products" className="mt-4 inline-block text-teal-600 hover:underline font-medium">
                  Browse all products →
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p: any) => (
                <ProductCard key={p._id ?? p.slug} product={p} showBuyButton={true} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
