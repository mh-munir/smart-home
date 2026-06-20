import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export default async function BestDealsPage() {
  const products = await getProducts();
  const deals = products.filter(p => p.bestDeal || (p.dealType && p.dealType !== ""));

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-linear-to-r from-red-50 to-orange-50 border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-4">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl">🎉</span>
            <div>
              <span className="inline-block bg-red-600 text-white px-3 py-1 rounded text-xs font-bold mb-3">EXCLUSIVE DEALS</span>
              <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Best Smart Home Deals</h1>
              <p className="text-xl text-gray-600 max-w-2xl">Save big on premium smart home products with our curated collection of the hottest deals.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900">Top Deals</h2>
            <span className="text-gray-600 text-sm font-semibold">{deals.length} deals found</span>
          </div>

          {deals.length === 0 ? (
            <div className="text-center py-24 text-gray-600">No deals yet. Add products with a Deal Type to show here.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals.map((product, idx) => (
                <ProductCard key={product._id} product={product} showBuyButton={false} priority={idx === 0} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
