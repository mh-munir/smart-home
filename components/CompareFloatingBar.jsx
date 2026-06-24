"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCompare } from "./CompareProvider";

function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare, count } = useCompare();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg" role="complementary" aria-label="Product comparison bar">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 shrink-0">
            Compare ({count}/4)
          </span>
          <div className="flex gap-2 flex-1 overflow-x-auto">
            {compareList.map((product) => (
                <div
                  key={product._id}
                  className="relative flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 min-w-45"
                >
                  {product.image ? (
                    <div className="w-10 h-10 relative rounded overflow-hidden shrink-0">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-sm shrink-0">
                    🛒
                  </div>
                )}
                <span className="text-xs font-medium text-gray-700 line-clamp-2 flex-1">
                  {product.title}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromCompare(product._id)}
                  className="text-gray-400 hover:text-red-500 transition shrink-0"
                  aria-label={`Remove ${product.title} from comparison`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={clearCompare}
              className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 transition"
            >
              Clear
            </button>
            {count >= 2 && (
              <Link
                href="/compare"
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition"
              >
                Compare Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CompareFloatingBar);