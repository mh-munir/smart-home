"use client";

import { memo, useCallback } from "react";

function AffiliateLinkButton({ href, productId, affiliateId, affiliateName }) {
  const handleAffiliateClick = useCallback(() => {
    if (!productId || !affiliateId) return;

    fetch("/api/track-conversion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        affiliateId,
        type: "click",
      }),
      keepalive: true,
    }).catch(() => {});
  }, [affiliateId, productId]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleAffiliateClick}
      className="flex w-full items-center gap-2 text-md font-semibold justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-3 rounded-md transition shadow-sm"
      aria-label={`Buy on ${affiliateName}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
      Buy on {affiliateName}
    </a>
  );
}

export default memo(AffiliateLinkButton);
