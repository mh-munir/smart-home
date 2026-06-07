'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product, showBuyButton = true }) {
  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-950/10 flex flex-col">
      {/* Image */}
      <div className="relative w-full h-48 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden border-b border-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        {product.category && (
          <span className="mb-3 w-fit rounded-full bg-teal-50 px-3 py-1 text-[11px] uppercase font-bold tracking-wide text-teal-700">
            {product.category}
          </span>
        )}

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-serif font-bold leading-snug text-gray-950 mb-3 transition-colors line-clamp-2 group-hover:text-teal-700">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-amber-400" aria-hidden="true">&#9733;</span>
            <span className="text-sm text-gray-700 font-semibold">{product.rating}</span>
          </div>
        )}

        {/* Price */}
        {product.price && (
          <p className="text-lg font-bold text-teal-600 mb-3">{product.price}</p>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-center font-semibold text-sm text-teal-800 transition-colors hover:bg-teal-100"
          >
            View Details
          </Link>
          {showBuyButton ? (
            <a
              href={product.affiliateLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-gray-950 px-3 py-2 text-center font-semibold text-sm text-white transition-colors hover:bg-teal-700"
            >
              Buy Now
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
