"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AddGuidePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Guides');
  const [mainDescription, setMainDescription] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [subSections, setSubSections] = useState([{ heading: '', image: null, imagePreview: '', content: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      subSections.forEach(s => s.imagePreview && URL.revokeObjectURL(s.imagePreview));
    };
  }, [mainImagePreview, subSections]);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });

  const handleSubChange = (index, field, value) => {
    setSubSections(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const addSubSection = () => setSubSections(prev => [...prev, { heading: '', image: null, imagePreview: '', content: '' }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const images = [];
      if (mainImage) images.push(await fileToBase64(mainImage));
      for (const s of subSections) {
        if (s.image) images.push(await fileToBase64(s.image));
      }

      let content = mainDescription;
      subSections.forEach(s => {
        if (s.heading || s.content) content += `\n\n## ${s.heading}\n${s.content}`;
      });

      const payload = { title, category, content, images };
      const res = await fetch('/api/guides', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Create failed');
      alert('Guide created');
      router.push('/admin/guides');
    } catch (err) {
      console.error(err);
      alert('Failed to create guide');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold mb-6">➕ Add Guide</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Main Image</label>
          <input type="file" onChange={handleMainImageChange} className="w-full" />
          {mainImagePreview && <Image src={mainImagePreview} alt="preview" unoptimized width={800} height={400} className="mt-3 rounded" />}
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Main Description</label>
          <textarea value={mainDescription} onChange={(e) => setMainDescription(e.target.value)} rows={6} className="w-full border p-2 rounded" />
        </div>

        {subSections.map((s, idx) => (
          <div key={idx} className="p-4 border rounded">
            <input placeholder="Sub heading" value={s.heading} onChange={(e) => handleSubChange(idx, 'heading', e.target.value)} className="w-full mb-2 border p-2 rounded" />
            <input type="file" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleSubChange(idx, 'image', file);
              if (file) handleSubChange(idx, 'imagePreview', URL.createObjectURL(file));
            }} className="w-full mb-2" />
            {s.imagePreview && <Image src={s.imagePreview} alt="sub-preview" unoptimized width={800} height={400} className="mb-2 rounded" />}
            <textarea placeholder="Content" rows={3} value={s.content} onChange={(e) => handleSubChange(idx, 'content', e.target.value)} className="w-full border p-2 rounded" />
          </div>
        ))}

        <div>
          <button type="button" onClick={addSubSection} className="bg-emerald-500 text-white px-4 py-2 rounded">Add Sub Section</button>
        </div>

        <div>
          <button type="submit" disabled={isSubmitting} className="bg-teal-600 text-white px-6 py-3 rounded">{isSubmitting ? 'Saving...' : 'Save Guide'}</button>
        </div>
      </form>
    </div>
  );
}
