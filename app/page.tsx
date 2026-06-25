import dynamic from "next/dynamic";
import SchemaMarkup from "@/components/SchemaMarkup";
import HomepageClientWidgets from "@/components/HomepageClientWidgets";
import HeroSliderWrapper from "@/components/HeroSliderWrapper";
import HeroSliderServer from "@/components/HeroSliderServer";
import TrustSection from "@/components/TrustSection";
import { getHeroSlides } from "@/lib/hero-slides";
import { getProducts } from "@/lib/products";
import { getCategoriesWithProducts } from "@/lib/categories";
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

// Dynamic import for below-the-fold featured products section
const FeaturedProducts = dynamic(() => import("@/components/FeaturedProducts"), {
  ssr: true,
    loading: () => (
      <section className="max-w-7xl mx-auto px-4 lg:px-4 py-12 bg-white">
        <div className="h-12 w-64 bg-gray-100 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    ),
  }
);

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
  const [products, heroSlides, categoriesWithProducts] = await Promise.all([
    getProducts(),
    getHeroSlides(),
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
        {/* Hero Section — server shell for LCP + client overlay for interactivity */}
        <div className="relative overflow-hidden">
          <HeroSliderServer slides={heroSlides} />
          <div className="absolute inset-0 z-30">
            <HeroSliderWrapper slides={heroSlides} />
          </div>
        </div>

        {/* Dynamic Service Category Sections — auto-generated from database */}
        <ServiceCategories categoriesWithProducts={categoriesWithProducts} />

        {/* Below-the-fold: Featured Products + Sidebar (client component for hydration off critical path) */}
        <FeaturedProducts
          featuredProducts={featuredProducts}
          allProducts={allProducts}
        />

        {/* Below-the-fold homepage widgets */}
        <HomepageClientWidgets />

        {/* Trust Section — server component, imported directly (no dynamic wrapper) */}
        <TrustSection />

        {/* About Section */}
        <section className="max-w-7xl mx-auto px-4 lg:px-4 py-16 bg-white">
          <div className="w-full">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">About SmartHome Affiliate</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Welcome to your trusted guide for smart home technology. We help you find the perfect smart home solutions for your lifestyle and budget.
              </p>
              <p>
                Our mission is to empower you with honest, expert reviews and recommendations. From smart locks to intelligent lighting systems, we've got comprehensive guides and product comparisons.
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