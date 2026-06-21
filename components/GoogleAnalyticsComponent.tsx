 'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { GA4_CONFIG } from '@/lib/google-ads';

interface GoogleAnalyticsProps {
  ga4Id?: string;
}

/**
 * Google Analytics Tracking Component
 * Integrates GTM (Google Tag Manager) and GA4 (Google Analytics 4)
 * AdSense is handled separately in GoogleAdSenseScript component
 */
export function GoogleAnalyticsComponent({
  ga4Id = GA4_CONFIG.MEASUREMENT_ID,
  nonce,
}: GoogleAnalyticsProps & { nonce?: string }) {
  useEffect(() => {
    // Initialize dataLayer if not already present
    if (typeof window !== 'undefined' && !window.dataLayer) {
      window.dataLayer = window.dataLayer || [];
    }
  }, []);

  // Don't render if tracking IDs are not configured
  const isProd = process.env.NODE_ENV === 'production';
  const isPlaceholder = ga4Id === 'G-XXXXXXXXXX';

  // Only load analytics in production with valid IDs to avoid affecting Lighthouse locally
  if (!isProd || !ga4Id || isPlaceholder) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="lazyOnload" nonce={nonce} />
      <Script
        id="ga4-script"
        strategy="lazyOnload"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga4Id}', {
              page_path: window.location.pathname,
              ${GA4_CONFIG.DEBUG_MODE ? "debug_mode: true," : ""}
              allow_google_signals: true,
              allow_ad_personalization_signals: true,
              'anonymize_ip': false,
              'cookie_flags': 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}

/**
 * Event tracking hook
 */
export function useTracking() {
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: window.location.pathname,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, []);
}

/**
 * Product tracking hook
 */
export function useProductTracking(product: Record<string, unknown> | null) {
  type TrackedProduct = {
    price?: number | string;
    currency?: string;
    _id?: string;
    name?: string;
    category?: string;
  } | null;

  useEffect(() => {
    if (!product || typeof window === 'undefined' || !window.gtag) return;

    const p = product as TrackedProduct;
    const price = p?.price;
    const currency = p?.currency || 'USD';

    window.gtag('event', 'view_item', {
      value: price,
      currency,
      items: [
        {
          item_id: p?._id,
          item_name: p?.name,
          price,
          item_category: p?.category,
        },
      ],
    });
  }, [product]);
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
