import HeroSlider from "@/components/HeroSlider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SchemaMarkup from "@/components/SchemaMarkup";
import { getHeroSlides } from "@/lib/hero-slides";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Home Smart Products - Best Smart Home Devices Reviews & Buying Guide 2026",
  description:
    "Find the best home smart products with expert reviews and comprehensive buying guides. Smart locks, cameras, lighting, thermostats & more. Trusted affiliate recommendations.",
  keywords:
    "home smart products, smart home devices, smart lock reviews, smart camera, smart lighting, smart thermostat, home automation, best smart home gadgets",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smart-home.vercel.app",
    siteName: "SmartHome Affiliate",
    title: "Home Smart Products - Best Smart Home Devices & Reviews",
    description:
      "Expert reviews of home smart products. Find the best smart home devices for your needs with our comprehensive guides.",
  },
};

export default async function Home() {
  const [products, heroSlides] = await Promise.all([
    getProducts(),
    getHeroSlides(),
  ]);

  const categories = ['Smart Locks', 'Smart Cameras', 'Smart Lighting', 'Smart Speakers', 'Smart Thermostats', 'Smart Plugs'];
  const featuredProducts = products?.slice(0, 4) || [];
  const allProducts = products || [];

  return (
    <>
      <SchemaMarkup 
        title="Home Smart Products - Best Smart Home Devices Reviews & Buying Guide 2026"
        description="Find the best home smart products with expert reviews and comprehensive buying guides. Smart locks, cameras, lighting, thermostats & more."
        url="https://smart-home.vercel.app"
        type="WebSite"
      />
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <HeroSlider slides={heroSlides} />

        {/* Category Navigation */}
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto gap-8 text-sm font-semibold">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href={`#${cat}`}
                  className="whitespace-nowrap text-gray-700 hover:text-teal-600 transition-colors py-4 border-b-2 border-transparent hover:border-teal-600 uppercase tracking-wide text-xs"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Featured Products */}
            <section className="lg:col-span-2">
              <div className="mb-6 rounded-2xl border border-gray-200 bg-linear-to-br from-white via-white to-teal-50/60 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600">
                  Curated picks
                </p>
                <h2 className="mt-2 text-3xl font-serif font-bold text-gray-950">
                  Featured Products
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Smart-home upgrades selected for practical features, clean setup, and everyday value.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {featuredProducts.map((product) => (
                  <div key={product._id} className="transition-transform duration-300 hover:-translate-y-1">
                    <ProductCard product={product} showBuyButton={false} />
                  </div>
                ))}
              </div>
            </section>

            {/* Right Sidebar - Latest + Featured/Recommended */}
            <aside className="space-y-8 lg:col-span-1">
              <div>
                <div className="border-b-4 border-yellow-300 pb-3 mb-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-900">The Latest</h2>
                </div>
                <div className="space-y-6">
                  {allProducts.slice(0, 3).map((product, idx) => (
                    <article key={product._id} className="border-b border-gray-200 pb-4">
                      <div className="text-xs text-teal-600 font-bold uppercase tracking-wide mb-2">
                        {idx * 2} HOURS AGO
                      </div>
                      <h3 className="text-sm font-serif font-bold text-gray-900 mb-1 line-clamp-2 hover:text-teal-600 cursor-pointer transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {product.category || 'Smart Home'}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 pb-3 border-b-2 border-teal-600">
                  Our Favorites
                </h3>
                <div className="space-y-4">
                  {allProducts.slice(0, 2).map((product) => (
                    <div key={product._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="text-xs text-teal-600 font-bold uppercase tracking-wide mb-1">
                        {product.category || 'Smart Home'}
                      </div>
                      <h4 className="text-sm font-serif font-bold text-gray-900 mb-2 hover:text-teal-600 cursor-pointer transition-colors line-clamp-2">
                        {product.title}
                      </h4>
                      {product.price && (
                        <p className="text-sm font-bold text-teal-600">{product.price}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* All Products Grid */}
        {allProducts.length > 3 && (
          <section className="py-16 px-4 border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12">All Products</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allProducts.slice(3).map((product) => (
                  <ProductCard key={product._id} product={product} showBuyButton={false} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="py-16 px-4 bg-gray-50 border-t border-gray-200">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
              Get Smart Home Tips
            </h3>
            <p className="text-gray-700 mb-6">
              Subscribe to get the latest smart home reviews and buying guides delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-100"
                required
              />
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 font-bold transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">About SmartHome Affiliate</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Welcome to your trusted guide for smart home technology. We help you find the perfect smart home solutions for your lifestyle and budget.
              </p>
              <p>
                Our mission is to empower you with honest, expert reviews and recommendations. From smart locks to intelligent lighting systems, we&apos;ve got comprehensive guides and product comparisons.
              </p>
              <p>
                Each product is carefully selected based on quality, value, and real customer feedback.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
