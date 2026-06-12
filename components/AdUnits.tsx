'use client';

import { useEffect } from 'react';
import { isAdSenseEnabled, getAdSlot } from '@/lib/adsense-config';

/**
 * Horizontal Ad Unit (728x90 or 970x90)
 */
export function HorizontalAdUnit({ slot = 'topBanner', className = '' }) {
  const adSlot = getAdSlot(slot);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (isAdSenseEnabled() && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense push failed:', e);
      }
    }
  }, []);

  if (!isAdSenseEnabled() || !adSlot) {
    return null;
  }

  return (
    <div className={`flex justify-center my-6 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={`ca-${publisherId}`}
        data-ad-slot={adSlot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

/**
 * Vertical Ad Unit (300x600 or 300x250)
 */
export function VerticalAdUnit({ slot = 'sidebar', className = '' }) {
  const adSlot = getAdSlot(slot);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (isAdSenseEnabled() && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense push failed:', e);
      }
    }
  }, []);

  if (!isAdSenseEnabled() || !adSlot) {
    return null;
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '300px', height: '600px' }}
        data-ad-client={`ca-${publisherId}`}
        data-ad-slot={adSlot}
        data-ad-format="vertical"
      ></ins>
    </div>
  );
}

/**
 * Square Ad Unit (300x300)
 */
export function SquareAdUnit({ slot = 'sidebar', className = '' }) {
  const adSlot = getAdSlot(slot);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (isAdSenseEnabled() && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense push failed:', e);
      }
    }
  }, []);

  if (!isAdSenseEnabled() || !adSlot) {
    return null;
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '300px', height: '300px' }}
        data-ad-client={`ca-${publisherId}`}
        data-ad-slot={adSlot}
        data-ad-format="square"
      ></ins>
    </div>
  );
}

/**
 * In-Content Ad Unit (728x280 or responsive)
 */
export function InContentAdUnit({ slot = 'inContent', className = '' }) {
  const adSlot = getAdSlot(slot);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (isAdSenseEnabled() && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense push failed:', e);
      }
    }
  }, []);

  if (!isAdSenseEnabled() || !adSlot) {
    return null;
  }

  return (
    <div className={`my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={`ca-${publisherId}`}
        data-ad-slot={adSlot}
      ></ins>
    </div>
  );
}

/**
 * Responsive Ad Unit (auto-responsive)
 */
export function ResponsiveAdUnit({ slot = 'topBanner', className = '' }) {
  const adSlot = getAdSlot(slot);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (isAdSenseEnabled() && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense push failed:', e);
      }
    }
  }, []);

  if (!isAdSenseEnabled() || !adSlot) {
    return null;
  }

  return (
    <div className={`my-6 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={`ca-${publisherId}`}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
