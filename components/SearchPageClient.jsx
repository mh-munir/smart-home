"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function SearchPageClient({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({
    products: [],
    blogs: [],
    categories: [],
    suggestions: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const inputRef = useRef(null);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);

  const fetchResults = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults({ products: [], blogs: [], categories: [], suggestions: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch {
      // Search failed silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "products", label: "Products", count: results.products.length },
    { id: "blogs", label: "Blogs", count: results.blogs.length },
    { id: "categories", label: "Categories", count: results.categories.length },
  ];

  const hasResults =
    results.products.length > 0 ||
    results.blogs.length > 0 ||
    results.categories.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, blogs, categories..."
                  className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white"
                  aria-label="Search products, blogs, and categories"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 text-xs opacity-75">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-500">Searching...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && query.length >= 2 && !hasResults && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
            <p className="text-gray-500 max-w-md">
              We couldn't find anything matching "{query}". Try different keywords or browse our categories.
            </p>
            <Link
              href="/products"
              className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Initial State */}
        {!loading && query.length < 2 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Smart Home Products</h2>
            <p className="text-gray-500 max-w-md">
              Find the best smart home devices, read expert reviews, and discover deals.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {["Smart Lock", "Camera", "Thermostat", "Lighting", "Speaker"].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition text-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && hasResults && (
          <div className="space-y-8">
            {/* Suggestions */}
            {results.suggestions.length > 0 && activeTab === "all" && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Suggestions:</span>
                {results.suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(suggestion)}
                    className="text-sm text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Products */}
            {(activeTab === "all" || activeTab === "products") &&
              results.products.length > 0 && (
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.products.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product.slug}`}
                        className="flex gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        {product.image ? (
                          <div className="w-20 h-20 relative rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                            🛒
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-teal-600">
                            {product.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {product.category && (
                              <span className="text-xs text-teal-600 capitalize">
                                {product.category}
                              </span>
                            )}
                            {product.rating && (
                              <span className="text-xs text-gray-500">⭐ {product.rating}</span>
                            )}
                          </div>
                          {product.price && (
                            <p className="text-sm font-bold text-teal-600 mt-1">
                              {product.price}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            {/* Blogs */}
            {(activeTab === "all" || activeTab === "blogs") &&
              results.blogs.length > 0 && (
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Blog Posts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.blogs.map((blog) => (
                      <Link
                        key={blog._id}
                        href={`/blog/${blog.slug}`}
                        className="flex gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        {blog.image ? (
                          <div className="w-20 h-20 relative rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={blog.image}
                              alt={blog.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                            📝
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 line-clamp-2">
                            {blog.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {blog.category && (
                              <span className="text-xs text-teal-600 capitalize">
                                {blog.category}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {blog.readTime} min read
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            {/* Categories */}
            {(activeTab === "all" || activeTab === "categories") &&
              results.categories.length > 0 && (
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Categories</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/category/${encodeURIComponent(category.name)}`}
                        className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        {category.thumbnail ? (
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={category.thumbnail}
                              alt={category.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-teal-50 rounded-lg flex items-center justify-center text-2xl shrink-0">
                            📂
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">{category.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">Browse products</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SearchPageClient);