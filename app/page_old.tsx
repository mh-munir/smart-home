import HeroSlider from "@/components/HeroSlider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getHeroSlides } from "@/lib/hero-slides";
import { getProducts } from "@/lib/products";

interface Product {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  price?: string;
  rating?: number;
  affiliateLink?: string;
  category?: string;
  description?: string;
  clicks?: number;
  conversions?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const metadata = {
  title: "Smart Home Affiliate - Best Smart Home Gadgets Reviews 2026",
  description:
    "Discover the best smart home gadgets with expert reviews, buying guides, and affiliate recommendations. Find the perfect products for your smart home setup.",
  keywords:
    "smart home, smart lock, smart camera, smart bulb, affiliate, review, buying guide",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smart-home.vercel.app",
    siteName: "Smart Home Affiliate",
  },
};

export default async function Home() {
  const [products, heroSlides] = await Promise.all([
    getProducts(),
    getHeroSlides(),
  ]);

  const categories = ['Smart Locks', 'Smart Cameras', 'Smart Lighting', 'Smart Speakers', 'Smart Thermostats', 'Smart Plugs'];
  const featuredProducts = products?.slice(0, 3) || [];
  const regularProducts = products?.slice(3) || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <HeroSlider slides={heroSlides} />

        {/* Category Navigation */}
        <section className="border-b border-gray-200 sticky top-0 z-40 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex overflow-x-auto gap-6 text-center text-sm md:text-base">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href={`#${cat}`}
                  className="whitespace-nowrap font-semibold text-gray-700 hover:text-indigo-600 transition-colors py-2 px-2 border-b-2 border-transparent hover:border-indigo-600"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="py-16 px-4 bg-linear-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Our Top Picks</h2>
                <p className="text-gray-600 text-lg max-w-2xl">
                  Carefully selected smart home products that we recommend based on quality, value, and customer reviews.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredProducts.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Signup Section */}
        <section className="py-12 px-4 bg-indigo-50 border-y border-indigo-200">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Get the Latest Smart Home Tips
            </h3>
            <p className="text-gray-700 mb-6 text-lg">
              Subscribe to our newsletter and stay updated with the best smart home products and reviews.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* All Products Section */}
        {regularProducts.length > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">All Products</h2>
                <p className="text-gray-600 text-lg">
                  Browse our complete collection of smart home solutions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {regularProducts.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Why Choose Us Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">Why Choose Us?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Expert Reviews</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our team thoroughly tests and reviews every product to ensure quality and value for money.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Curated Selection</h3>
                <p className="text-gray-700 leading-relaxed">
                  We handpick the best smart home products that deliver real value and meet our high standards.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Latest & Greatest</h3>
                <p className="text-gray-700 leading-relaxed">
                  Stay ahead with our constantly updated collection of the newest smart home innovations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">About Smart Home Affiliate</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Welcome to your ultimate guide for smart home technology! We&apos;re dedicated to helping you find the perfect smart home solutions that fit your lifestyle and budget.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Our mission is to empower you with honest, expert reviews and recommendations so you can make informed decisions about the latest smart home innovations.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                From smart locks to intelligent lighting systems, we&apos;ve got you covered with comprehensive guides and product comparisons.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-linear-to-r from-indigo-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Transform Your Home Today
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto">
              Discover the smart home products that will make your life easier, more secure, and more convenient.
            </p>
            <a
              href="#"
              className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              Explore All Products →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
