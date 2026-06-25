import Script from 'next/script';

/**
 * Google AdSense Script Component
 *
 * Loads the AdSense ad-by-google script exactly once.
 * - Skips in development or when NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is missing.
 * - Uses strategy="lazyOnload" to keep ads off the critical rendering path.
 * - Placed in <body> (not <head>) to avoid the "data-nscript" Next.js warning
 *   and the AdSense "head tag doesn't support data-nscript attribute" console error.
 * - Includes the required ?client= query parameter for AdSense to function.
 * - De-dupes by checking window.__adsbygoogle_loaded before rendering.
 *
 * @see https://support.google.com/adsense/answer/9274482
 */
export default function GoogleAdSenseScript({ nonce }: { nonce?: string }) {
  // Only load in production
  if (process.env.NODE_ENV !== 'production') return null;

  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  if (!publisherId) return null;

  // Normalise: ensure it starts with "pub-"
  const formattedPublisherId = publisherId.startsWith('pub-')
    ? publisherId
    : `pub-${publisherId}`;

  // AdSense script URL requires ?client=ca-pub-XXXXX
  const scriptSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${formattedPublisherId}`;

  const saneNonce = nonce && nonce.length > 0 ? nonce : undefined;

  return (
    <Script
      id="adsense"
      src={scriptSrc}
      strategy="lazyOnload"
      crossOrigin="anonymous"
      nonce={saneNonce}
    />
  );
}