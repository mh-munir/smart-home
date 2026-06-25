'use client';

import { useEffect } from 'react';

export default function GoogleAdSenseScript() {
  useEffect(() => {
    if (document.getElementById('adsense-script')) return;

    const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
    if (!publisherId) return;

    const formattedPublisherId = publisherId.startsWith('ca-pub-')
      ? publisherId
      : publisherId.startsWith('pub-')
        ? `ca-${publisherId}`
        : `ca-pub-${publisherId}`;

    const script = document.createElement('script');
    script.id = 'adsense-script';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${formattedPublisherId}`;

    document.head.appendChild(script);

    return () => {
      // সাধারণত AdSense script remove করা হয় না
    };
  }, []);

  return null;
}