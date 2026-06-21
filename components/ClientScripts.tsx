import GoogleTagManager from "@/components/GoogleTagManager";
import { GoogleAnalyticsComponent } from "@/components/GoogleAnalyticsComponent";
import GoogleAdSenseScript from "@/components/GoogleAdSenseScript";
import { headers } from "next/headers";

export default async function ClientScripts() {
  const isProd = process.env.NODE_ENV === "production";
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const adsense = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  // Only load analytics/ads in production and when IDs are configured
  if (!isProd) return null;

  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      {gtmId ? <GoogleTagManager nonce={nonce} /> : null}
      {ga4Id ? (
        <GoogleAnalyticsComponent nonce={nonce} ga4Id={ga4Id} />
      ) : null}
      {adsense ? <GoogleAdSenseScript nonce={nonce} /> : null}
    </>
  );
}
