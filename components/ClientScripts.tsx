"use client";

import GoogleTagManager from "@/components/GoogleTagManager";
import { GoogleAnalyticsComponent } from "@/components/GoogleAnalyticsComponent";
import GoogleAdSenseScript from "@/components/GoogleAdSenseScript";

export default function ClientScripts() {
  const isProd = process.env.NODE_ENV === "production";
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const adsense = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  // Only load analytics/ads in production and when IDs are configured
  if (!isProd) return null;

  return (
    <>
      {gtmId ? <GoogleTagManager /> : null}
      {(ga4Id || gtmId) ? (
        <GoogleAnalyticsComponent gtmId={gtmId} ga4Id={ga4Id} />
      ) : null}
      {adsense ? <GoogleAdSenseScript /> : null}
    </>
  );
}
