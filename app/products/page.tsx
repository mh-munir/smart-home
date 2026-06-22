import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts, getProductsByCategory } from "@/lib/products";

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

  let products: any[];

  if (category) {
    // Filter by category directly from DB
    products = await getProductsByCategory(category);
  } else {
    products = (await getProducts()) || [];
  }

  // Apply text search filter on top of category filter
  if (q) {
    products = products.filter((p: any) => {
      const hay = `${String(p.title || "")} ${String(p.description || "")} ${String(p.category || "")}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }

  return (
    <main className="min-h-screen bg-white py-12">
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 lg:px-4">
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
