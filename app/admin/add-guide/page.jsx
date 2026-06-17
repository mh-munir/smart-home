"use client";
import { useState } from 'react';

export default function AddGuidePage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Guides');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, category, content }),
      });
      if (!res.ok) throw new Error('Failed');
      alert('Guide created');
      setTitle(''); setSlug(''); setCategory('Guides'); setContent('');
    } catch (err) {
      alert('Failed to create guide');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">➕ Add Guide</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full px-4 py-3 border" required />
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug (kebab-case)" className="w-full px-4 py-3 border" required />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full px-4 py-3 border" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content (HTML)" rows={10} className="w-full px-4 py-3 border" />
        <div>
          <button disabled={loading} className="bg-teal-600 text-white px-6 py-3 rounded">{loading ? 'Saving...' : 'Save Guide'}</button>
        </div>
      </form>
    </div>
  );
}
