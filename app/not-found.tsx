"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* 404 Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-linear-to-r from-teal-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="relative text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-teal-600 via-purple-600 to-pink-600">
              404
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            {"The page you're looking for doesn't exist."}
          </p>
          <p className="text-gray-500 text-base">
            It may have been moved or the link might be incorrect.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, guides, blog posts..."
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                aria-label="Search"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Search
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg text-center text-lg"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="block w-full border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-bold py-4 px-6 rounded-xl transition-all text-center text-lg"
          >
            Browse Products
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 mb-4">
            Need help?
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
            >
              <span aria-hidden="true">📧</span> Contact Us
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
            >
              <span aria-hidden="true">❓</span> Help Center
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}