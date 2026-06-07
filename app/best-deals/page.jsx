'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function BestDealsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const deals = [
    {
      id: 1,
      title: 'Smart Door Lock Pro',
      category: 'Smart Locks',
      originalPrice: '$199.99',
      dealPrice: '$129.99',
      discount: '35% OFF',
      badge: 'HOT DEAL',
      image: '🔒',
      rating: 4.8,
    },
    {
      id: 2,
      title: '4K Smart Security Camera',
      category: 'Smart Cameras',
      originalPrice: '$149.99',
      dealPrice: '$89.99',
      discount: '40% OFF',
      badge: 'LIMITED TIME',
      image: '📹',
      rating: 4.6,
    },
    {
      id: 3,
      title: 'Smart LED Bulb Kit (16 Pack)',
      category: 'Smart Lighting',
      originalPrice: '$79.99',
      dealPrice: '$39.99',
      discount: '50% OFF',
      badge: 'FLASH SALE',
      image: '💡',
      rating: 4.7,
    },
    {
      id: 4,
      title: 'Intelligent Thermostat',
      category: 'Smart Thermostats',
      originalPrice: '$249.99',
      dealPrice: '$179.99',
      discount: '28% OFF',
      badge: 'TRENDING',
      image: '🌡️',
      rating: 4.9,
    },
    {
      id: 5,
      title: 'Smart Speaker Pro',
      category: 'Smart Speakers',
      originalPrice: '$199.99',
      dealPrice: '$99.99',
      discount: '50% OFF',
      badge: 'HOT DEAL',
      image: '🔊',
      rating: 4.5,
    },
    {
      id: 6,
      title: 'Smart Plug Bundle (4 Pack)',
      category: 'Smart Plugs',
      originalPrice: '$79.99',
      dealPrice: '$24.99',
      discount: '69% OFF',
      badge: 'MEGA DEAL',
      image: '⚡',
      rating: 4.4,
    },
    {
      id: 7,
      title: 'Smart Video Doorbell',
      category: 'Smart Cameras',
      originalPrice: '$149.99',
      dealPrice: '$99.99',
      discount: '33% OFF',
      badge: 'POPULAR',
      image: '🚪',
      rating: 4.7,
    },
    {
      id: 8,
      title: 'Smart Garage Door Controller',
      category: 'Smart Locks',
      originalPrice: '$129.99',
      dealPrice: '$79.99',
      discount: '38% OFF',
      badge: 'DEALS',
      image: '🏠',
      rating: 4.6,
    },
  ];

  const categories = ['All', 'Smart Locks', 'Smart Cameras', 'Smart Lighting', 'Smart Speakers', 'Smart Thermostats', 'Smart Plugs'];

  const filteredDeals = selectedCategory === 'All' 
    ? deals 
    : deals.filter(deal => deal.category === selectedCategory);

  const getBadgeColor = (badge) => {
    if (badge === 'HOT DEAL' || badge === 'FLASH SALE') return 'bg-red-600';
    if (badge === 'MEGA DEAL') return 'bg-purple-600';
    return 'bg-teal-600';
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-red-50 to-orange-50 border-b border-gray-200 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">🎉</span>
              <div>
                <span className="inline-block bg-red-600 text-white px-3 py-1 rounded text-xs font-bold mb-3">
                  EXCLUSIVE DEALS
                </span>
                <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
                  Best Smart Home Deals
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  Save big on premium smart home products with our curated collection of the hottest deals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hot Deal Banner */}
        <div className="bg-red-600 text-white py-4 px-4 text-center font-bold text-lg">
          ⏰ Limited Time Offers - Save Up to 69% on Smart Home Devices!
        </div>

        {/* Category Filter */}
        <div className="border-b border-gray-200 py-8 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">Filter by Category</p>
            <div className="flex overflow-x-auto gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:border-teal-600 hover:text-teal-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                {selectedCategory === 'All' ? 'All Deals' : `${selectedCategory} Deals`}
              </h2>
              <span className="text-gray-600 text-sm font-semibold">
                {filteredDeals.length} deals found
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDeals.map((deal) => (
                <div key={deal.id} className="border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Deal Badge */}
                  <div className={`${getBadgeColor(deal.badge)} text-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-center`}>
                    {deal.badge}
                  </div>

                  {/* Product Image */}
                  <div className="bg-gray-50 h-40 flex items-center justify-center text-5xl border-b border-gray-200 relative">
                    {deal.image}
                    
                    {/* Discount Badge */}
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-2 rounded-full text-sm font-bold">
                      {deal.discount}
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-4">
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                      {deal.category}
                    </div>
                    
                    <h3 className="text-sm font-serif font-bold text-gray-900 mb-3 hover:text-teal-600 cursor-pointer transition-colors line-clamp-2">
                      {deal.title}
                    </h3>

                    {/* Pricing */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 line-through mb-1">
                        {deal.originalPrice}
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        {deal.dealPrice}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-semibold text-gray-900">{deal.rating}</span>
                    </div>

                    {/* CTA Button */}
                    <a href="#" className="block w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded font-bold text-center text-sm transition-colors">
                      View Deal
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deal Info Section */}
        <section className="py-16 px-4 bg-gray-50 border-y border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12 text-center">Why Shop Our Deals?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Best Prices Guaranteed</h3>
                <p className="text-gray-600">We compare all retailers to bring you the lowest prices on smart home products.</p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Updated Daily</h3>
                <p className="text-gray-600">New deals are added every day. Check back often to find the best offers.</p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Limited Time Offers</h3>
                <p className="text-gray-600">Flash sales and exclusive deals that won&apos;t last. Grab yours while you can!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Never Miss a Deal
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Subscribe to get alerts when new deals are posted and exclusive subscriber-only offers.
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
