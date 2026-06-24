import Link from "next/link";
import { getAllGuides } from "@/lib/guides";
import NewsletterClientWrapper from "@/components/NewsletterClientWrapper";

export default function GuidesPage() {
  const guides = getAllGuides();

  const categories = [
    'All Guides',
    'Smart Locks',
    'Smart Lighting',
    'Smart Cameras',
    'Smart Speakers',
    'Smart Thermostats',
    'Smart Plugs',
  ];

  return (
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gray-50 border-b border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-4">
            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
              Smart Home Guides
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Master the art of smart home automation with our comprehensive guides and tutorials.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="border-b border-gray-200 py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-4">
            <div className="flex overflow-x-auto gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="whitespace-nowrap px-4 py-2 border border-gray-300 rounded hover:border-teal-600 hover:text-teal-600 transition-colors text-sm font-semibold"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Guide */}
        <section className="py-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 lg:px-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-yellow-300"></div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">Featured Guide</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-gray-100 rounded aspect-video flex items-center justify-center text-6xl">
                🏠
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-teal-600 mb-2">
                  Featured
                </div>
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-3">
                  Your Complete Smart Home Setup Guide
                </h3>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  Learn how to plan, install, and optimize your complete smart home system from start to finish. This guide covers everything from choosing the right hub to securing your network.
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>📖 15 min read</span>
                  <span>•</span>
                  <span>Updated 3 days ago</span>
                </div>
                <Link href="/guides/beginner-smart-locks" className="mt-6 inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-3 font-semibold transition-colors">
                  Read Guide
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* All Guides Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-4">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12">All Guides</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <article key={guide.slug} className="border border-gray-200 hover:shadow-md transition-shadow">
                  {/* Guide Image */}
                  <div className="bg-gray-100 h-48 flex items-center justify-center text-5xl border-b border-gray-200">
                    {guide.image}
                  </div>

                  {/* Guide Content */}
                  <div className="p-6">
                    <div className="text-xs font-bold uppercase tracking-wide text-teal-600 mb-2">
                      {guide.category}
                    </div>
                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-3 hover:text-teal-600 cursor-pointer transition-colors line-clamp-2">
                      <Link href={`/guides/${guide.slug}`} className="block">{guide.title}</Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                      {guide.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-600 pb-4 border-b border-gray-200 mb-4">
                      <span>{guide.readTime}</span>
                      <span>{guide.date}</span>
                    </div>
                    <Link href={`/guides/${guide.slug}`} className="text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors">
                      Read Guide →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 lg:px-4 text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Subscribe for Weekly Guides
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Get new smart home guides and tips delivered to your inbox every week.
            </p>
            <NewsletterClientWrapper source="guides" />
          </div>
        </section>
      </main>
  );
}
