import type { Metadata } from "next";
import dynamic from "next/dynamic";

const SearchPageClient = dynamic(
  () => import("@/components/SearchPageClient"),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

type Props = {
  searchParams?: Promise<{ q?: string } | undefined>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolved = await searchParams;
  const q = resolved?.q || "";
  if (q) {
    return {
      title: `Search: ${q} - SmartHome Affiliate`,
      description: `Search results for "${q}" - Find smart home products, blogs, and guides.`,
      robots: "noindex, follow",
    };
  }
  return {
    title: "Search - SmartHome Affiliate",
    description: "Search smart home products, blog posts, and categories.",
    robots: "noindex, follow",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const resolved = await searchParams;
  const q = resolved?.q || "";

  return (
    <main id="main-content" className="min-h-screen">
      <SearchPageClient initialQuery={q} />
    </main>
  );
}