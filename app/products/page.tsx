import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Products - Smart Home Affiliate",
  description: "Browse all smart home products and reviews.",
};

export default async function ProductsPage() {
  const products = (await getProducts()) || [];

  return (
    <main className="min-h-screen bg-white py-12">
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 lg:px-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">All Products</h1>

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
