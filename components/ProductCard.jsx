'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product, showBuyButton = true }) {
  const formattedDate = product.createdAt
    ? new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(
        new Date(product.createdAt),
      )
    : null;

  return (
    <article className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition h-full flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-1 flex-col"
        aria-label={`View ${product.title}`}
      >
        {/* Image Header */}
        <div className="relative w-full h-40 bg-linear-to-br from-teal-50 to-teal-100 overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🛒
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Meta Row - Category and Rating */}
          <div className="flex items-center justify-between mb-3">
            {product.category && (
              <span className="text-sm font-semibold text-teal-600 capitalize">
                {product.category}
              </span>
            )}
            {product.rating && (
              <span className="text-sm text-gray-600">⭐ {product.rating}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition line-clamp-2">
            {product.title}
          </h3>

          {/* Price and Description */}
          {product.price && (
            <p className="text-lg font-bold text-teal-600 mb-3">{product.price}</p>
          )}

          {product.description && (
            <p className="text-gray-600 mb-4 line-clamp-2 flex-1 text-sm">
              {product.description}
            </p>
          )}

          {/* Footer - Created Date or Stock Info */}
          <div className="flex items-center justify-between text-sm mt-auto">
            <span className="text-gray-500">Smart Home</span>
            {formattedDate && <span className="text-gray-500">{formattedDate}</span>}
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      {showBuyButton && (
        <div className="px-6 pb-6 pt-4">
          <a
            href={product.affiliateLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg bg-teal-600 text-white px-3 py-2 text-center font-semibold text-sm hover:bg-teal-700 transition"
          >
            Buy Now
          </a>
        </div>
      )}
    </article>
  );
}
