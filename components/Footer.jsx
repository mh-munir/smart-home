'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-white text-xl font-serif font-bold mb-3">SmartHome</h3>
            <p className="text-sm leading-relaxed mb-4">
              Expert smart home reviews and buying guides to help you make the best decisions for your home.
            </p>
            <div className="flex gap-4 text-lg">
              <a href="#" className="hover:text-teal-400 transition-colors">f</a>
              <a href="#" className="hover:text-teal-400 transition-colors">𝕏</a>
              <a href="#" className="hover:text-teal-400 transition-colors">📷</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
              <li><Link href="/review" className="hover:text-teal-400 transition-colors">Reviews</Link></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Guides</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Best Deals</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-wide">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Smart Locks</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Smart Cameras</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Smart Lighting</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Smart Speakers</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Disclaimer</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>&copy; 2026 SmartHome Affiliate. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Made for smart home enthusiasts</p>
        </div>
      </div>
    </footer>
  );
}
