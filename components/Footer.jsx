import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-white text-xl font-serif font-bold mb-3">SmartHome</h3>
            <p className="text-sm leading-relaxed mb-4">
              Expert smart home reviews and buying guides to help you make the best decisions for your home.
            </p>
            <div className="flex gap-4 text-lg">
              <Link href="#" className="hover:text-teal-400 transition-colors">f</Link>
              <Link href="#" className="hover:text-teal-400 transition-colors">𝕏</Link>
              <Link href="#" className="hover:text-teal-400 transition-colors">📷</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
              <li><Link href="/blog" className="hover:text-teal-400 transition-colors">Blog</Link></li>
              <li><Link href="/about" className="hover:text-teal-400 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-wide">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/guides" className="hover:text-teal-400 transition-colors">Guides</Link></li>
              <li><Link href="/category/reviews" className="hover:text-teal-400 transition-colors">Reviews</Link></li>
              <li><Link href="/category/comparison" className="hover:text-teal-400 transition-colors">Comparisons</Link></li>
              <li><Link href="/blog" className="hover:text-teal-400 transition-colors">All Articles</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-wide">Information</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/author" className="hover:text-teal-400 transition-colors">Our Team</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-teal-400 transition-colors">Cookie Policy</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-teal-400 transition-colors">Affiliate Disclosure</Link></li>
              <li><Link href="/sitemap" className="hover:text-teal-400 transition-colors">Sitemap</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-teal-400 transition-colors">Disclaimer</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact</Link></li>
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
