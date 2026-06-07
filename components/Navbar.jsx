import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex flex-col">
            <div className="text-2xl font-serif font-bold text-gray-900">
              SmartHome
            </div>
            <div className="text-xs text-gray-600 font-serif italic mt-0.5">
              Make your home smarter
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className="text-gray-700 hover:text-teal-600 font-semibold transition-colors text-xs uppercase tracking-wide"
            >
              Home
            </Link>
            <Link
              href="/review"
              className="text-gray-700 hover:text-teal-600 font-semibold transition-colors text-xs uppercase tracking-wide"
            >
              Reviews
            </Link>
            <Link
              href="/guides"
              className="text-gray-700 hover:text-teal-600 font-semibold transition-colors text-xs uppercase tracking-wide"
            >
              Guides
            </Link>
            <Link
              href="/best-deals"
              className="text-gray-700 hover:text-teal-600 font-semibold transition-colors text-xs uppercase tracking-wide"
            >
              Best Deals
            </Link>
            <a
              href="#"
              className="text-gray-700 hover:text-teal-600 font-semibold transition-colors text-xs uppercase tracking-wide"
            >
              About
            </a>
          </div>

          <Link
            href="/admin"
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
