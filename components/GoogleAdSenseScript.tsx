import Script from 'next/script';
import { isAdSenseEnabled } from '@/lib/adsense-config';

export default function GoogleAdSenseScript({ nonce }: { nonce?: string }) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  if (!isAdSenseEnabled() || !publisherId) return null;

  const formattedPublisherId = publisherId.startsWith('pub-') ? publisherId : `pub-${publisherId}`;
  const adClient = formattedPublisherId.startsWith('pub-') ? `ca-${formattedPublisherId}` : formattedPublisherId;

  // Use next/script with lazyOnload strategy to avoid blocking rendering
  const saneNonce = nonce && nonce.length > 0 ? nonce : undefined;
  return (
    <Script
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      strategy="lazyOnload"
      nonce={saneNonce}
      crossOrigin="anonymous"
    />
  );
}
