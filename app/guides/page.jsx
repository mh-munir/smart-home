'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function GuidesPage() {
  const guides = [
    {
      id: 1,
      title: "Complete Beginner's Guide to Smart Locks",
      category: 'Smart Locks',
      excerpt: 'Learn everything you need to know about choosing and installing smart locks for your home.',
      image: '🔒',
      readTime: '8 min read',
      date: '2 days ago',
    },
    {
      id: 2,
      title: "Smart Lighting 101: Create the Perfect Ambiance",
      category: 'Smart Lighting',
      excerpt: 'Discover how smart bulbs can transform your home lighting and save energy.',
      image: '💡',
      readTime: '6 min read',
      date: '3 days ago',
    },
    {
      id: 3,
      title: 'Security Cameras: Installation & Best Practices',
      category: 'Smart Cameras',
      excerpt: 'A comprehensive guide to choosing, installing, and using smart security cameras effectively.',
      image: '📹',
      readTime: '10 min read',
      date: '5 days ago',
    },
    {
      id: 4,
      title: "Smart Thermostat Setup Guide",
      category: 'Smart Thermostats',
      excerpt: 'Save money on energy bills with a smart thermostat. Learn setup and optimization tips.',
      image: '🌡️',
      readTime: '7 min read',
      date: '1 week ago',
    },
    {
      id: 5,
      title: "Choosing Smart Speakers for Your Home",
      category: 'Smart Speakers',
      excerpt: 'Compare the best smart speakers and find the perfect one for your needs.',
      image: '🔊',
      readTime: '9 min read',
      date: '1 week ago',
    },
    {
      id: 6,
      title: 'Smart Plugs 101: Control Everything',
      category: 'Smart Plugs',
      excerpt: 'Turn any device into a smart device with smart plugs. Learn how to use them.',
      image: '⚡',
      readTime: '5 min read',
      date: '2 weeks ago',
    },
  ];

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
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gray-50 border-b border-gray-200 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
              Smart Home Guides
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Master the art of smart home automation with our comprehensive guides and tutorials.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="border-b border-gray-200 py-6 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
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
        <section className="py-12 px-4 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
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
                <button className="mt-6 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 font-semibold transition-colors">
                  Read Guide
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* All Guides Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12">All Guides</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <article key={guide.id} className="border border-gray-200 hover:shadow-md transition-shadow">
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
                      {guide.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {guide.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-600 pb-4 border-b border-gray-200 mb-4">
                      <span>{guide.readTime}</span>
                      <span>{guide.date}</span>
                    </div>
                    <a href="#" className="text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors">
                      Read Guide →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4 bg-gray-50 border-t border-gray-200">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Subscribe for Weekly Guides
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Get new smart home guides and tips delivered to your inbox every week.
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
      </main>
      <Footer />
    </>
  );
}
