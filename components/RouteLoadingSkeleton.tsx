type RouteLoadingSkeletonProps = {
  title?: string;
  cards?: number;
};

export default function RouteLoadingSkeleton({
  title = "Loading",
  cards = 6,
}: RouteLoadingSkeletonProps) {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
            {title}
          </p>
          <div className="mt-4 h-10 w-72 max-w-full animate-pulse rounded bg-gray-200" />
          <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="h-44 animate-pulse bg-gray-100" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
