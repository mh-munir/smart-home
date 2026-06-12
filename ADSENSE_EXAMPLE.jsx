// Example usage of AdSense components

import { HorizontalAdUnit, ResponsiveAdUnit, InContentAdUnit } from "@/components/AdUnits";

export default function ExampleAdSenseUsage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner Ad */}
      <div className="mb-8">
        <HorizontalAdUnit slot="topBanner" />
      </div>

      {/* Main Content */}
      <article className="prose lg:prose-lg max-w-none">
        <h1>Smart Home Guide</h1>
        <p>
          আপনার বাড়িকে স্মার্ট করার সেরা উপায়। এই গাইডে আমরা দেখাব কিভাবে সঠিক
          পণ্য নির্বাচন করতে হয়।
        </p>

        {/* In-Content Ad (after first paragraph) */}
        <InContentAdUnit slot="inContent" />

        <h2>Smart Lighting Setup</h2>
        <p>
          স্মার্ট লাইটিং হল আপনার smart home এর ভিত্তি। এটি শক্তি সাশ্রয়ী এবং সুবিধাজনক।
        </p>

        {/* Another Ad Placement */}
        <ResponsiveAdUnit slot="topBanner" />

        <h2>Security Features</h2>
        <p>নিরাপত্তা সবচেয়ে গুরুত্বপূর্ণ বিষয়। স্মার্ট lock এবং cameras সঠিক পছন্দ।</p>

        {/* Final Ad */}
        <InContentAdUnit slot="inContent" />
      </article>
    </div>
  );
}
