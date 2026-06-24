interface LoadingSkeletonProps {
  variant?: "cards" | "list" | "detail" | "hero";
  count?: number;
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className || ""}`} />;
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="h-44 animate-pulse bg-gray-100" />
      <div className="space-y-3 p-5">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-6 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <SkeletonBlock className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <SkeletonBlock className="h-20 w-20 shrink-0 rounded" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-4 w-20" />
        <SkeletonBlock className="h-5 w-3/4" />
        <SkeletonBlock className="h-4 w-full" />
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SkeletonBlock className="h-4 w-48 mb-6" />
      <SkeletonBlock className="h-10 w-3/4 mb-4" />
      <SkeletonBlock className="h-4 w-1/3 mb-8" />
      <SkeletonBlock className="aspect-video w-full rounded-lg mb-8" />
      <div className="space-y-4">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-2/3" />
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <SkeletonBlock className="h-5 w-32 mb-4" />
        <SkeletonBlock className="h-12 w-96 max-w-full mb-4" />
        <SkeletonBlock className="h-5 w-64 max-w-full" />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({
  variant = "cards",
  count = 6,
}: LoadingSkeletonProps) {
  return (
    <div className="min-h-screen bg-white">
      {variant === "hero" && <HeroSkeleton />}
      {variant === "detail" && <DetailSkeleton />}
      {(variant === "cards" || variant === "list") && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          {variant === "cards" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: count }).map((_, i) => (
                <ListSkeleton key={i} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}