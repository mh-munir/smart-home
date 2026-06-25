"use client";

import { useEffect } from "react";

/**
 * Google AdSense Script Component
 *
 * Loads the AdSense ad-by-google script exactly once using a plain <script> tag
 * (NOT next/script) to avoid the "data-nscript" attribute that Next.js adds
 * to Script components, which AdSense does not support.
 *
 * - Skips in development or when NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is missing.
 * - Uses useEffect to inject the script client-side, avoiding SSR issues.
 * - De-dupes by checking window.__adsbygoogle_loaded before injecting.
 *
 * @see https://support.google.com/adsense/answer/9274482
 */
export default function GoogleAdSenseScript() {
  useEffect(() => {
    // Only load in production
    if (process.env.NODE_ENV !== "production") return;

    const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
    if (!publisherId) return;

    // De-duplicate: don't load twice
    if (typeof window !== "undefined" && (window as any).__adsbygoogle_loaded) return;

    // Normalise: ensure it starts with "pub-"
    const formattedPublisherId = publisherId.startsWith("pub-")
      ? publisherId
      : `pub-${publisherId}`;

    // AdSense script URL requires ?client=ca-pub-XXXXX
    const scriptSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${formattedPublisherId}`;

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.crossOrigin = "anonymous";

    document.head.appendChild(script);

    if (typeof window !== "undefined") {
      (window as any).__adsbygoogle_loaded = true;
    }
  }, []);

  return null;
}