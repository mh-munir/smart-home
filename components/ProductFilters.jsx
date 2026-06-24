"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

function ProductFilters({ products, categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get("brand") || ""
  );
  const [selectedRating, setSelectedRating] = useState(
    searchParams.get("rating") || ""
  );
  const [priceRange, setPriceRange] = useState(
    searchParams.get("price") || ""
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "newest"
  );
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique categories and brands from products
  const allCategories = useMemo(() => {
    if (categories && categories.length > 0) return categories;
    const cats = new Set(products?.map((p) => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [products, categories]);

  const allBrands = useMemo(() => {
    const brands = new Set(
      products
        ?.map((p) => {
          const title = p.title || "";
          const parts = title.split(" ");
          return parts[0] || "";
        })
        .filter(Boolean)
    );
    return Array.from(brands).sort();
  }, [products]);

  const updateURL = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/products?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    updateURL({ category: cat });
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    updateURL({ brand: brand });
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    updateURL({ rating: rating });
  };

  const handlePriceChange = (price) => {
    setPriceRange(price);
    updateURL({ price: price });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    updateURL({ sort: sort });
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedRating("");
    setPriceRange("");
    setSortBy("newest");
    router.push("/products", { scroll: false });
  };

  const hasFilters = selectedCategory || selectedBrand || selectedRating || priceRange;

  return (
    <div className="mb-6">
      {/* Mobile filter toggle */}
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium mb-4"
        aria-expanded={showFilters}
        aria-controls="product-filters"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {hasFilters && (
          <span className="w-5 h-5 bg-teal-500 text-white rounded-full text-xs flex items-center justify-center">
            !
          </span>
        )}
      </button>

      <div id="product-filters" className={`${showFilters ? "block" : "hidden"} md:block`}>
        <div className="flex flex-wrap gap-3 items-center">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            aria-label="Filter by brand"
          >
            <option value="">All Brands</option>
            {allBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            value={selectedRating}
            onChange={(e) => handleRatingChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            aria-label="Filter by rating"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>

          {/* Price Range Filter */}
          <select
            value={priceRange}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            aria-label="Filter by price range"
          >
            <option value="">Any Price</option>
            <option value="0-25">Under $25</option>
            <option value="25-50">$25 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100+">$100+</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ProductFilters);