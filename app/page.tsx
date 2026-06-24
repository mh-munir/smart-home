import dynamic from "next/dynamic";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import SchemaMarkup from "@/components/SchemaMarkup";
import { getHeroSlides } from "@/lib/hero-slides";
import { getProducts } from "@/lib/products";
import { getCategories, getCategoriesWithProducts } from "@/lib/categories";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

// Lazy-load heavy client components to reduce initial JS bundle
const ServiceCategories = dynamic(() => import("@/components/ServiceCategories"), {
  ssr: true,
  loading: () => (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="h-8 w-64 bg-gray-100 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </section>
  ),
});

const HeroSlider = dynamic(() => import("@/components/HeroSlider"), {
  ssr: true,
  loading: () => (
    <section className="relative overflow-hidden bg-gray-950 text-white min-h-105 flex items-center">
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="h-10 w-64 bg-white/10 rounded animate-pulse" />
        <div className="h-16 w-96 bg-white/10 rounded mt-6 animate-pulse" />
        <div className="h-6 w-80 bg-white/10 rounded mt-4 animate-pulse" />
      </div>
    </section>
  ),
});

// Dynamic import for Newsletter with SSR (required in server components)
const TrustSection = dynamic(() => import("@/components/TrustSection"), {
  ssr: true,
  loading: () => null,
});

const StickyAffiliateCTA = dynamic(() => import("@/components/StickyAffiliateCTA"), {
  ssr: true,
  loading: () => null,
});

const NewsletterClientWrapper = dynamic(() => import("@/components/NewsletterClientWrapper"), {
  ssr: true,
  loading: () => (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse" />
      <div className="w-32 h-12 bg-gray-200 rounded animate-pulse" />
    </div>
  ),
});

export const metadata = {
  title: "Home Smart Products - Best Smart Home Devices Reviews & Buying Guide 2026",
  description:
    "Find the best home smart products with expert reviews and comprehensive buying guides. Smart locks, cameras, lighting, thermostats & more. Trusted affiliate recommendations.",
  keywords:
    "home smart products, smart home devices, smart lock reviews, smart camera, smart lighting, smart thermostat, home automation, best smart home gadgets",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Home Smart Products - Best Smart Home Devices & Reviews",
    description:
      "Expert reviews of home smart products. Find the best smart home devices for your needs with our comprehensive guides.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Home Smart Products - Best Smart Home Devices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Smart Products - Best Smart Home Devices & Reviews",
    description:
      "Expert reviews of home smart products. Find the best smart home devices for your needs with our comprehensive guides.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function Home() {
  const [products, heroSlides, categories, categoriesWithProducts] = await Promise.all([
    getProducts(),
    getHeroSlides(),
    getCategories(),
    getCategoriesWithProducts(),
  ]);

  const featuredProducts = products?.slice(0, 4) || [];
  const allProducts = products || [];

  return (
    <>
      <SchemaMarkup 
        title="Home Smart Products - Best Smart Home Devices Reviews & Buying Guide 2026"
        description="Find the best home smart products with expert reviews and comprehensive buying guides. Smart locks, cameras, lighting, thermostats & more."
        url={SITE_URL}
        type="WebSite"
      />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <HeroSlider slides={heroSlides} categories={categories} />

        {/* Dynamic Service Category Sections — auto-generated from database */}
        <ServiceCategories categoriesWithProducts={categoriesWithProducts} />

        {/* Featured header design (renders 3-per-row ProductCard grid) */}
        
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
                    {featuredProducts.map((product) => (
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
                      <a href="/products" className="text-xs text-teal-600 font-semibold hidden sm:inline">See all</a>
                    </div>

                    <ul className="space-y-5">
                      {allProducts.slice(0, 3).map((product, idx) => (
                        <li key={product._id} className="flex items-start gap-4">
                          {product.image ? (
                            <div className="w-24 h-16 relative rounded-md overflow-hidden">
                              <Image src={product.image} alt={product.title} fill sizes="96px" loading="lazy" className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-24 h-16 bg-gray-100 rounded-md flex items-center justify-center text-sm">🛒</div>
                          )}

                          <div className="flex-1">
                            <a href={`/products/${product.slug}`} className="text-sm font-semibold text-gray-900 hover:text-teal-600 line-clamp-2">{product.title}</a>
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
                      {allProducts.slice(3, 6).map((p) => (
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

                  {/* Subscribe CTA removed per user request */}
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gray-50 border-gray-200 w-full">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 text-center">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
              Get Smart Home Tips
            </h3>
            <p className="text-gray-700 mb-6">
              Subscribe to get the latest smart home reviews and buying guides delivered to your inbox.
            </p>
            {/* Newsletter loaded dynamically - below the fold */}
            <NewsletterClientWrapper source="homepage" />
          </div>
        </section>

        {/* Trust Section */}
        <TrustSection />

        {/* Sticky Affiliate CTA */}
        <StickyAffiliateCTA />

        {/* About Section */}
        <section className="max-w-7xl mx-auto px-4 lg:px-4 py-16 bg-white">
          <div className="w-full">
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
    </>
  );
}
