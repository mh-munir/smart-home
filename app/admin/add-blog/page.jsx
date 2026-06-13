"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "guides",
    description: "",
    content: "",
    tags: "",
    published: false,
    affiliateLink: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const results = await Promise.all(files.map((f) => toBase64(f)));
    setImages(results);
    setPreviews(results.map((r) => r));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        content: form.content,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        published: !!form.published,
        images,
        affiliateLink: form.affiliateLink,
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Blog added successfully!");
        router.push("/admin/blogs");
      } else {
        const err = await res.json();
        console.error(err);
        alert("Error adding blog: " + (err?.error || res.statusText));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">➕ Add New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Blog title"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description / Excerpt</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Content (Markdown or plain text)</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="10"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="smart-home,security,guide"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Affiliate Link (optional)</label>
          <input
            type="url"
            name="affiliateLink"
            value={form.affiliateLink}
            onChange={handleChange}
            placeholder="https://example.com/affiliate?ref=..."
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Images (up to 5)</label>
          <input type="file" accept="image/*" multiple onChange={handleFiles} />
          <div className="mt-4 flex gap-4 flex-wrap">
            {previews.map((src, idx) => (
              <img key={idx} src={src} alt={`preview-${idx}`} className="w-32 h-20 object-cover rounded" />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
          <label className="text-gray-700">Published</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Blog"}
        </button>
      </form>
    </div>
  );
}
