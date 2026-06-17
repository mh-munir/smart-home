import { getGuideBySlug } from '@/lib/guides';

export default async function GuidePage({ params }) {
  const { slug } = params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return (
      <div className="p-12 min-h-screen">
        <h1 className="text-3xl font-bold">Guide not found</h1>
        <p className="text-gray-600 mt-4">We couldn't find the guide you're looking for.</p>
      </div>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-4">{guide.title}</h1>
      <div className="text-sm text-gray-600 mb-6">
        <span className="mr-3">{guide.category}</span>
        <span className="mr-3">•</span>
        <span>{guide.readTime}</span>
      </div>

      <article className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: guide.content }} />
      </article>
    </main>
  );
}
