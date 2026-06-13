'use client';

import { useEffect } from 'react';
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

  // Ensure publisher ID has correct format and build ad client id
  const formattedPublisherId = publisherId.startsWith('pub-') ? publisherId : `pub-${publisherId}`;
  const adClient = formattedPublisherId.startsWith('pub-') ? `ca-${formattedPublisherId}` : formattedPublisherId;
  // Use the canonical AdSense script URL and specify client via `data-ad-client`
  const adSenseUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`;

  useEffect(() => {
    // Monitor script loading status
    const checkScriptLoaded = () => {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        if (isDev) {
          console.log('✅ AdSense library loaded successfully');
        }
        return true;
      }
      return false;
    };

    // Check periodically for script availability
    const interval = setInterval(checkScriptLoaded, 500);
    return () => clearInterval(interval);
  }, [isDev]);

  const handleScriptLoad = () => {
    if (isDev) {
      console.log('✅ AdSense script tag loaded');
    }
  };

  const handleScriptError = (err?: any) => {
    console.error('❌ AdSense script failed to load', err || {}, {
      url: adSenseUrl,
      adClient,
      publisher: publisherId ? '***' + publisherId.slice(-8) : 'not-set',
      timestamp: new Date().toISOString(),
      suggestions: [
        'Verify NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is correct in Vercel env',
        'Check if AdSense account is approved',
        'Verify no CSP policy is blocking the script',
        'Check browser console for CORS/network errors',
        'Ensure you are not using ad blockers',
      ],
    });

    // Dev-only retry: re-insert the canonical script element with data-ad-client
    if (isDev) {
      setTimeout(() => {
        const script = document.createElement('script');
        script.src = adSenseUrl;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-ad-client', adClient);
        script.onload = () => console.log('✅ AdSense retried load succeeded');
        script.onerror = (e) => console.error('❌ AdSense retry failed', e);
        document.head.appendChild(script);
      }, 2000);
    }
  };

  return (
    <Script
      async
      src={adSenseUrl}
      strategy="afterInteractive"
      onLoad={handleScriptLoad}
      onError={(e) => handleScriptError(e)}
      crossOrigin="anonymous"
      suppressHydrationWarning
      data-ad-client={adClient}
    />
  );
}
