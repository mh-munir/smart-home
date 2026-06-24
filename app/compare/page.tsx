import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ComparePageClient = dynamic(
  () => import("@/components/ComparePageClient"),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Compare Products - SmartHome Affiliate",
  description: "Compare smart home products side by side. Find the best device for your needs.",
  robots: "noindex, follow",
};

export default function ComparePage() {
  return (
    <main id="main-content">
      <ComparePageClient />
    </main>
  );
}