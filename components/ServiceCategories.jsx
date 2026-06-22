import CategorySlider from "./CategorySlider";

/**
 * Server component that renders a horizontal slider of product categories.
 * Delegates scrolling/interaction to the CategorySlider client component.
 */
export default function ServiceCategories({ categoriesWithProducts }) {
  if (!categoriesWithProducts || categoriesWithProducts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-4 pt-12 bg-white">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-8 bg-teal-500 rounded-full" />
          <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
            Browse by Category
          </span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">
          Product Categories
        </h2>
        <p className="mt-2 text-gray-600">
          Explore our curated selection of smart home products.
        </p>
      </div>

      <CategorySlider categories={categoriesWithProducts} />
    </section>
  );
}
