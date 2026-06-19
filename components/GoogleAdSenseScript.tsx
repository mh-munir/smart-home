"use client";

import { useEffect } from 'react';
import { isAdSenseEnabled } from '@/lib/adsense-config';

export default function GoogleAdSenseScript() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (!isAdSenseEnabled()) return;

    const isDev = window.location?.hostname === 'localhost';

    // Validate publisher ID before loading
    if (!publisherId) {
      if (isDev) {
        console.warn('⚠️ AdSense: NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is not set');
      }
      return;
    }

    // Ensure publisher ID has correct format and build ad client id
    const formattedPublisherId = publisherId.startsWith('pub-') ? publisherId : `pub-${publisherId}`;
    const adClient = formattedPublisherId.startsWith('pub-') ? `ca-${formattedPublisherId}` : formattedPublisherId;
    const adSenseUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`;

    // Prevent duplicate injection
    const hasQueryScript = document.querySelector(
      `script[src*="pagead/js/adsbygoogle.js?client=${adClient}"]`
    );
    const hasDataClientScript = document.querySelector(
      'script[src*="pagead/js/adsbygoogle.js"][data-ad-client]'
    );
    const hasAnyAdSenseScript = document.querySelector(
      'script[src*="pagead/js/adsbygoogle.js"]'
    );

    const getAdsbyGoogle = () => (window as unknown as { adsbygoogle?: unknown }).adsbygoogle;
    if (getAdsbyGoogle() || hasQueryScript || hasDataClientScript || hasAnyAdSenseScript) {
      return;
    }

    // Manually inject the script element — avoids next/script's data-nscript attribute
    const script = document.createElement('script');
    script.src = adSenseUrl;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-ad-client', adClient);
    script.onload = () => {
      if (isDev) {
        console.log('✅ AdSense script loaded successfully');
      }
    };
    script.onerror = () => {
      console.error('❌ AdSense script failed to load', {
        url: adSenseUrl,
        adClient,
        publisher: publisherId ? '***' + publisherId.slice(-8) : 'not-set',
      });
    };
    document.head.appendChild(script);

    // Monitor script loading status
    const interval = setInterval(() => {
      if (getAdsbyGoogle()) {
        if (isDev) {
          console.log('✅ AdSense library loaded successfully');
        }
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [publisherId]);

  // This component renders nothing — the script is injected into <head> via useEffect
  return null;
}
