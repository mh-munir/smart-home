"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditBlogPage({ params }) {
  const router = useRouter();
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        if (mounted) setBlog(data);
        if (mounted) setExistingImages(Array.isArray(data.images) ? data.images : (data.image ? [data.image] : []));
      } catch (e) {
        console.error(e);
        alert('Failed to load blog');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="p-8">Loading…</div>;
  if (!blog) return <div className="p-8">Blog not found</div>;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: e.target.title.value,
        category: e.target.category.value,
        content: e.target.content.value,
        published: e.target.published.checked,
      };

      const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });

      const images = existingImages.slice();
      for (const f of newFiles) {
        const b = await fileToBase64(f);
        images.push(b);
      }
      if (images.length > 0) payload.images = images;

      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update');
      alert('Blog updated');
      router.push('/admin/blogs');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">✏️ Edit Blog</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Title</label>
          <input name="title" defaultValue={blog.title} className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Category</label>
          <input name="category" defaultValue={blog.category || ''} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Content (Markdown/HTML)</label>
          <textarea name="content" rows={10} defaultValue={blog.content || ''} className="w-full border p-2 rounded" />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" name="published" defaultChecked={!!blog.published} id="published" />
          <label htmlFor="published" className="text-sm font-medium">Published</label>
        </div>

        <div>
            <div>
              <label className="block text-sm font-bold mb-1">Existing Images</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {existingImages.map((img, i) => (
                  <img src={img} key={i} alt={`img-${i}`} className="h-24 w-36 object-cover rounded border" />
                ))}
              </div>

              <label className="block text-sm font-bold mb-1">Add/Replace Images</label>
              <input type="file" accept="image/*" multiple onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setNewFiles(files);
                setNewPreviews(files.map(f => URL.createObjectURL(f)));
              }} />
              <div className="flex gap-2 flex-wrap mt-2">
                {newPreviews.map((p, i) => (
                  <img src={p} key={i} alt={`new-${i}`} className="h-24 w-36 object-cover rounded border" />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <button type="submit" disabled={saving} className="bg-teal-600 text-white px-4 py-2 rounded">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
        </div>
      </form>
    </div>
  );
}
