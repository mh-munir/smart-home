'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { GTM_CONFIG, GA4_CONFIG } from '@/lib/google-ads';

interface GoogleAnalyticsProps {
  gtmId?: string;
  ga4Id?: string;
}

/**
 * Google Analytics Tracking Component
 * Integrates GTM (Google Tag Manager) and GA4 (Google Analytics 4)
 * AdSense is handled separately in GoogleAdSenseScript component
 */
export function GoogleAnalyticsComponent({
  gtmId = GTM_CONFIG.GTM_ID,
  ga4Id = GA4_CONFIG.MEASUREMENT_ID,
}: GoogleAnalyticsProps) {
  useEffect(() => {
    // Initialize dataLayer if not already present
    if (typeof window !== 'undefined' && !window.dataLayer) {
      window.dataLayer = window.dataLayer || [];
    }
  }, []);

  // Don't render if tracking IDs are not configured
  if (gtmId === 'GTM-XXXXXXXXX' && ga4Id === 'G-XXXXXXXXXX') {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />

      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-script"
        strategy="afterInteractive"
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

      {/* GTM NoScript (Fallback) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
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
export function useProductTracking(product: any) {
  useEffect(() => {
    if (!product || typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'view_item', {
      value: product.price,
      currency: product.currency || 'USD',
      items: [
        {
          item_id: product._id,
          item_name: product.name,
          price: product.price,
          item_category: product.category,
        },
      ],
    });
  }, [product]);
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}
