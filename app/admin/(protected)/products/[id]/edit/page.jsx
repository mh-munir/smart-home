"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        if (mounted) setProduct(data);
        if (mounted) {
          setExistingImages(Array.isArray(data.images) && data.images.length ? data.images : (data.image ? [data.image] : []));
          setMainImagePreview(data.image || '');
        }
      } catch (e) {
        console.error(e);
        alert('Failed to load product');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="p-8">Loading…</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: e.target.title.value,
        price: e.target.price.value,
        category: e.target.category.value,
        rating: parseFloat(e.target.rating.value) || 4.5,
        affiliateLink: e.target.affiliateLink.value,
        bestDeal: e.target.bestDeal.checked,
      };

      // Build images array: start with existing images
      const images = existingImages.slice();

      const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });

      // If a new main image file is selected, put it first
      if (mainImageFile) {
        const b = await fileToBase64(mainImageFile);
        images.unshift(b);
      }

      // Append any additional new files
      for (const f of additionalFiles) {
        const b = await fileToBase64(f);
        images.push(b);
      }

      if (images.length > 0) payload.images = images;

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update');
      alert('Product updated');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">✏️ Edit Product</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Title</label>
          <input name="title" defaultValue={product.title} className="w-full border p-2 rounded" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Price</label>
            <input name="price" defaultValue={product.price || ''} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Rating</label>
            <input name="rating" type="number" step="0.1" defaultValue={product.rating || 4.5} className="w-full border p-2 rounded" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Category</label>
          <input name="category" defaultValue={product.category || ''} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Affiliate Link</label>
          <input name="affiliateLink" defaultValue={product.affiliateLink || ''} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Current Images</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {existingImages.map((img, i) => (
              <img src={img} key={i} alt={`img-${i}`} className="h-24 w-36 object-cover rounded border" />
            ))}
          </div>
          <label className="block text-sm font-bold mb-1">Replace Main Image</label>
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setMainImageFile(file);
              setMainImagePreview(URL.createObjectURL(file));
            }
          }} />
          {mainImagePreview && <img src={mainImagePreview} alt="main-preview" className="mt-2 h-40 w-72 object-cover rounded" />}

          <div className="mt-4">
            <label className="block text-sm font-bold mb-1">Add More Images</label>
            <input type="file" accept="image/*" multiple onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setAdditionalFiles(files);
              setAdditionalPreviews(files.map(f => URL.createObjectURL(f)));
            }} />
            <div className="flex gap-2 flex-wrap mt-2">
              {additionalPreviews.map((p, i) => (
                <img src={p} key={i} alt={`new-${i}`} className="h-24 w-36 object-cover rounded border" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" name="bestDeal" defaultChecked={!!product.bestDeal} id="bestDeal" />
          <label htmlFor="bestDeal" className="text-sm font-medium">Mark as Best Deal</label>
        </div>

        <div>
          <button type="submit" disabled={saving} className="bg-teal-600 text-white px-4 py-2 rounded">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}
