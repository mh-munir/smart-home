import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Products - Smart Home Affiliate",
  description: "Browse all smart home products and reviews.",
};

export default async function ProductsPage({ searchParams }: { searchParams?: { q?: string } | Promise<{ q?: string } | undefined> }) {
  const resolvedSearchParams = await (searchParams as any);
  const q = String(resolvedSearchParams?.q || "").trim();
  const allProducts = (await getProducts()) || [];
  const products = q
    ? allProducts.filter((p: any) => {
        const hay = `${String(p.title || "")} ${String(p.description || "")} ${String(p.category || "")}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      })
    : allProducts;

  return (
    <main className="min-h-screen bg-white py-12">
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 lg:px-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">All Products</h1>
          {q ? (
            <p className="text-sm text-gray-600 mb-4">Showing results for "{q}" — {products.length} result{products.length === 1 ? "" : "s"}</p>
          ) : null}

          {products.length === 0 ? (
            <div className="rounded-xl border border-gray-100 p-8 shadow-sm bg-white">
              <p className="text-gray-600">No products available.</p>
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
