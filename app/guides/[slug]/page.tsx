import { getGuideBySlug } from '@/lib/guides';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return (
      <div className="p-12 min-h-screen">
        <h1 className="text-3xl font-bold">Guide not found</h1>
        <p className="text-gray-600 mt-4">We couldn&apos;t find the guide you&apos;re looking for.</p>
      </div>
    );
  }

  return (
    <main className="bg-white">
      <div className="bg-linear-to-r from-rose-500 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          {guide.category && (
            <div className="mb-3">
              <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold">{guide.category}</span>
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-serif font-extrabold mb-2">{guide.title}</h1>
          <div className="text-sm opacity-90">{guide.readTime} min read</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <article className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(guide.content) }} />
        </article>
      </div>
    </main>
  );
}
