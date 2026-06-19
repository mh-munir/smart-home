'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product, showBuyButton = true, priority = false }) {
  const [showAffiliateMenu, setShowAffiliateMenu] = useState(false);
  const router = useRouter();

  const formattedDate = useMemo(() => {
    if (!product?.createdAt) return null;
    return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' }).format(new Date(product.createdAt));
  }, [product.createdAt]);

  // Get active affiliate links
  const getAffiliateLinks = () => {
    const links = [];
    if (product.affiliateLinks && typeof product.affiliateLinks === 'object') {
      Object.entries(product.affiliateLinks).forEach(([key, value]) => {
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
  };

  const affiliateLinks = getAffiliateLinks();
  const mainLink = affiliateLinks.length > 0 ? affiliateLinks[0] : null;
  const otherLinks = affiliateLinks.slice(1);

  return (
    <article className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        
          {/* Image Header */}
          <div className="w-full h-40 bg-linear-to-br from-teal-50 to-teal-100 overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                width={640}
                height={256}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105 w-full h-full"
                style={{ objectFit: 'cover' }}
                priority={priority}
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

            <div className="flex justify-between mb-3 items-start">
              {/* Price and Description */}
              {product.price && (
                <p className="text-lg font-bold text-teal-600 mb-3">{product.price}</p>
              )}

              {formattedDate && <span className="text-gray-500">{formattedDate}</span>}
            </div>

            {product.description && (
              <p className="text-gray-600 mb-4 line-clamp-2 flex-1 text-sm">
                {product.description}
              </p>
            )}
          </div>
        

        {/* Footer - Created Date or Stock Info (outside Link so we can add separate actions) */}
        <div className="px-6 pb-0 pt-4">
          <button
            type="button"
            onClick={() => router.push(`/products/${product.slug}`)}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-md transition shadow-sm"
            aria-label={`More details about ${product.title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            More Details
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      {showBuyButton && (
        <div className="px-6 pb-6 pt-4 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push(`/products/${product.slug}`)}
              className="flex-1 rounded-lg border border-gray-300 text-gray-800 px-3 py-2 text-center font-semibold text-sm hover:bg-gray-100 transition"
              aria-label={`View details about ${product.title}`}
            >
              View Details
            </button>

            <button
              type="button"
              onClick={() => router.push(`/products/${product.slug}`)}
              className="flex-1 rounded-lg bg-teal-600 text-white px-3 py-2 text-center font-semibold text-sm hover:bg-teal-700 transition flex items-center justify-center gap-2 shadow-sm"
              aria-label={`More details about ${product.title}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              More Details
            </button>
          </div>
          {mainLink ? (
            <>
              <a
                href={mainLink.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Track click if needed
                  if (typeof window !== 'undefined' && product._id) {
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
                }}
                className="block rounded-lg bg-teal-600 text-white px-3 py-2 text-center font-semibold text-sm hover:bg-teal-700 transition"
              >
                Buy on {mainLink.name}
              </a>
              
              {otherLinks.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowAffiliateMenu(!showAffiliateMenu)}
                    className="w-full rounded-lg bg-gray-200 text-gray-800 px-3 py-2 text-center font-semibold text-sm hover:bg-gray-300 transition"
                  >
                    More Options ▼
                  </button>
                  
                  {showAffiliateMenu && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {otherLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            setShowAffiliateMenu(false);
                            if (typeof window !== 'undefined' && product._id) {
                              fetch('/api/track-conversion', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  productId: product._id,
                                  affiliateId: link.id,
                                  type: 'click',
                                }),
                              }).catch(() => {});
                            }
                          }}
                          className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition first:rounded-t-lg last:rounded-b-lg"
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <a
              href={product.affiliateLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg bg-teal-600 text-white px-3 py-2 text-center font-semibold text-sm hover:bg-teal-700 transition"
            >
              Buy Now
            </a>
          )}
        </div>
      )}
    </article>
  );
}
