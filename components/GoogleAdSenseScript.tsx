import { isAdSenseEnabled } from '@/lib/adsense-config';

export default function GoogleAdSenseScript({ nonce }: { nonce?: string }) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  if (!isAdSenseEnabled() || !publisherId) return null;

  const formattedPublisherId = publisherId.startsWith('pub-') ? publisherId : `pub-${publisherId}`;
  const adClient = formattedPublisherId.startsWith('pub-') ? `ca-${formattedPublisherId}` : formattedPublisherId;

  // Render a server-side <script> tag so the per-request nonce can be applied
  return (
    <script
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      async={true}
      nonce={nonce}
      crossOrigin="anonymous"
      // @ts-ignore Allow data- attribute on script
      data-ad-client={adClient}
    />
  );
}
