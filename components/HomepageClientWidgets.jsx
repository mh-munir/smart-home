"use client";

import dynamic from "next/dynamic";

const StickyAffiliateCTA = dynamic(
  () => import("./StickyAffiliateCTA"),
  {
    ssr: false,
    loading: () => null,
  }
);

const NewsletterClientWrapper = dynamic(
  () => import("./NewsletterClientWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse" />
        <div className="w-32 h-12 bg-gray-200 rounded animate-pulse" />
      </div>
    ),
  }
);

export default function HomepageClientWidgets() {
  return (
    <>
      <section className="py-16 bg-gray-50 border-gray-200 w-full">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 text-center">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
            Get Smart Home Tips
          </h3>
          <p className="text-gray-700 mb-6">
            Subscribe to get the latest smart home reviews and buying guides delivered to your inbox.
          </p>
          <NewsletterClientWrapper source="homepage" />
        </div>
      </section>
      <StickyAffiliateCTA />
    </>
  );
}
