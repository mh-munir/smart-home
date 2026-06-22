"use client";

import { useMemo, useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function ProductCard({ product, showBuyButton = true, priority = false }) {
  const [showAffiliateMenu, setShowAffiliateMenu] = useState(false);
  const router = useRouter();

  const formattedDate = useMemo(() => {
    if (!product?.createdAt) return null;
    return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' }).format(new Date(product.createdAt));
  }, [product?.createdAt]);
  // Memoized active affiliate links
  const affiliateLinks = useMemo(() => {
    const links = [];
    if (product?.affiliateLinks && typeof product?.affiliateLinks === 'object') {
      Object.entries(product?.affiliateLinks || {}).forEach(([key, value]) => {
        if (value && value.url && value.enabled) {
          links.push({
            id: key,
            url: value.url,
            name: key.charAt(0).toUpperCase() + key.slice(1),
          });
        }
      });
    }
    return links;
  }, [product?.affiliateLinks]);

  const mainLink = affiliateLinks.length > 0 ? affiliateLinks[0] : null;
  const otherLinks = affiliateLinks.slice(1);

  const handleAffiliateClick = useCallback(() => {
    if (typeof window !== 'undefined' && product?._id && mainLink) {
      fetch('/api/track-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          affiliateId: mainLink.id,
          type: 'click',
        }),
      }).catch(() => {});
    }
  }, [product?._id, mainLink]);

  const handleMoreDetails = useCallback(() => {
    if (product?.slug) router.push(`/products/${product.slug}`);
  }, [router, product?.slug]);

  return (
    <article className="group bg-white border border-gray-200 rounded-lg overflow-hidden transition-transform duration-300 transform-gpu hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
      <div className="flex-1 flex flex-col pb-4">
        
          {/* Image Header */}
          <div className="relative w-full h-40 bg-linear-to-br from-teal-50 to-teal-100 overflow-hidden">
            {product?.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={priority}
                loading={priority ? 'eager' : 'lazy'}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">🛒</div>
            )}

            {/* Offer Badge */}
            {product?.offer && (
              <div className="absolute top-0 right-0 z-10 overflow-hidden rounded-bl-xl">
<div className="bg-linear-to-br from-red-500 via-red-600 to-rose-700 text-white px-3 py-1.5 shadow-lg backdrop-blur-sm">
                  <span className="text-[10px] font-medium uppercase tracking-wider opacity-90 block leading-tight">Deal</span>
                  <span className="text-sm font-extrabold leading-tight block drop-shadow-sm">{product.offer}</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-4 py-3 flex flex-col flex-1">
            {/* Meta Row - Category and Rating */}
            <div className="flex items-center justify-between mb-2">
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

            <div className="flex justify-between mb-2 items-start">
              {/* Price and Description */}
              {product.price && (
                <p className="text-lg font-bold text-teal-600 mb-3">{product.price}</p>
              )}

              {formattedDate && <span className="text-gray-500">{formattedDate}</span>}
            </div>

            {product.description && (
              <p className="text-gray-600 line-clamp-2 flex-1 text-sm">
                {product.description}
              </p>
            )}
          </div>
        

        {/* Footer - single CTA (affiliate buy or details) */}
        <div className="px-4">
          {mainLink ? (
            <a
              href={mainLink.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleAffiliateClick}
              className="flex w-full items-center gap-2 text-md font-semibold justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-3 rounded-md transition shadow-sm"
              aria-label={`Buy on ${mainLink.name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Buy on {mainLink.name}
            </a>
          ) : (
            <button
              type="button"
              onClick={handleMoreDetails}
              className="flex w-full items-center gap-2 text-md font-semibold justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-3 rounded-md transition shadow-sm"
              aria-label={`More details about ${product.title}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              More Details
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
