'use client';

import Script from 'next/script';
import { isAdSenseEnabled } from '@/lib/adsense-config';

export default function GoogleAdSenseScript() {
  if (!isAdSenseEnabled()) {
    return null;
  }

  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const isDev = typeof window !== 'undefined' && window.location?.hostname === 'localhost';

  // Validate publisher ID before loading
  if (!publisherId) {
    if (isDev) {
      console.warn('⚠️ AdSense: NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is not set');
    }
    return null;
  }

  const adSenseUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${publisherId}`;

  const handleScriptLoad = () => {
    if (isDev) {
      console.log('✅ AdSense script loaded successfully');
    }
    // Initialize ads if window object has adsbygoogle
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({
          google_ad_client: `ca-${publisherId}`,
          enable_page_level_ads: true,
        });
      } catch (error) {
        if (isDev) {
          console.error('Error initializing AdSense:', error);
        }
      }
    }
  };

  const handleScriptError = (error: any) => {
    console.error('❌ AdSense script failed to load:', {
      message: error?.message || 'Unknown error',
      url: adSenseUrl,
      publisher: publisherId ? '***' + publisherId.slice(-8) : 'not-set',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <Script
      async
      src={adSenseUrl}
      strategy="afterInteractive"
      onLoad={handleScriptLoad}
      onError={handleScriptError}
      crossOrigin="anonymous"
    />
  );
}
