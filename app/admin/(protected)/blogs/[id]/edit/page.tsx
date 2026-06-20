'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

interface SubSection {
  subHeading: string;
  image: File | null;
  imagePreview: string;
  content: string;
}

interface BlogData {
  mainHeading: string;
  category: string;
  mainImage: File | null;
  mainImagePreview: string;
  mainDescription: string;
  subSections: SubSection[];
  published: boolean;
}

const EditBlogPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState<BlogData>({
    mainHeading: '',
    category: '',
    mainImage: null,
    mainImagePreview: '',
    mainDescription: '',
    subSections: [],
    published: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previewsRef = useRef<string[]>([]);

  // Load existing blog
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();

        // Parse content to extract main description and sub-sections
        let mainDescription = data.content || '';
        const subSections: SubSection[] = [];

        // Split by ## headings to extract sub-sections
        const parts = mainDescription.split(/\n## /);
        if (parts.length > 1) {
          mainDescription = parts[0].trim();
          for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            const newlineIndex = part.indexOf('\n');
            const subHeading = newlineIndex >= 0 ? part.substring(0, newlineIndex).trim() : part.trim();
            const content = newlineIndex >= 0 ? part.substring(newlineIndex + 1).trim() : '';
            subSections.push({
              subHeading,
              image: null,
              imagePreview: '',
              content,
            });
          }
        }

        if (mounted) {
          setBlogData({
            mainHeading: data.title || '',
            category: data.category || '',
            mainImage: null,
            mainImagePreview: data.image || '',
            mainDescription,
            subSections: subSections.length > 0 ? subSections : Array.from({ length: 4 }, () => ({
              subHeading: '',
              image: null,
              imagePreview: '',
              content: '',
            })),
            published: !!data.published,
          });
        }
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

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData({
        ...blogData,
        mainImage: file,
        mainImagePreview: URL.createObjectURL(file),
      });
    }
  };

  useEffect(() => {
    previewsRef.current = [
      blogData.mainImagePreview,
      ...blogData.subSections.map((section) => section.imagePreview),
    ].filter(Boolean);
  }, [blogData.mainImagePreview, blogData.subSections]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, []);

  const handleSubSectionChange = (index: number, field: keyof SubSection, value: string | File | null) => {
    setBlogData((prev) => {
      const updatedSections = prev.subSections.map((section, sectionIndex) => {
        if (sectionIndex !== index) return section;

        if (field === 'image') {
          return value instanceof File
            ? { ...section, image: value, imagePreview: URL.createObjectURL(value) }
            : { ...section, image: null, imagePreview: '' };
        }

        return typeof value === 'string'
          ? { ...section, [field]: value }
          : section;
      });

      return { ...prev, subSections: updatedSections };
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const addSubSection = () => {
    setBlogData({
      ...blogData,
      subSections: [
        ...blogData.subSections,
        { subHeading: '', image: null, imagePreview: '', content: '' },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const images: string[] = [];
      if (blogData.mainImage) {
        images.push(await fileToBase64(blogData.mainImage));
      }

      for (const section of blogData.subSections) {
        if (section.image) {
          images.push(await fileToBase64(section.image));
        }
      }

      let content = blogData.mainDescription;
      blogData.subSections.forEach((s) => {
        if (s.subHeading || s.content) {
          content += `\n\n## ${s.subHeading}\n${s.content}`;
        }
      });

      const payload: Record<string, unknown> = {
        title: blogData.mainHeading,
        category: blogData.category,
        content,
        published: blogData.published,
      };

      if (images.length > 0) {
        payload.images = images;
      }

      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update blog');
      }

      alert('Blog updated successfully!');
      router.push('/admin/blogs');
    } catch (error: unknown) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Error updating blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-4">✏️ Edit Blog Post</h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Step 1: Main Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-blue-800">Step 1: Main Content</h3>
          <div>
            <label htmlFor="mainHeading" className="block text-sm font-bold text-gray-700 mb-2">Main Heading</label>
            <input
              id="mainHeading"
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter main heading"
              value={blogData.mainHeading}
              onChange={(e) => setBlogData(prev => ({...prev, mainHeading: e.target.value}))}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <input
              id="category"
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. Smart Home"
              value={blogData.category}
              onChange={(e) => setBlogData(prev => ({...prev, category: e.target.value}))}
              required
            />
          </div>

          <div>
            <label htmlFor="mainImage" className="block text-sm font-bold text-gray-700 mb-2">Main Image</label>
            <input
              id="mainImage"
              type="file"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleMainImageChange}
            />
            {blogData.mainImagePreview && (
              <Image
                src={blogData.mainImagePreview}
                alt="Preview"
                unoptimized
                width={800}
                height={480}
                className="mt-4 max-h-48 rounded-lg"
                loading="lazy"
              />
            )}
          </div>

          <div>
            <label htmlFor="mainDescription" className="block text-sm font-bold text-gray-700 mb-2">Text Area (Main Content)</label>
            <textarea
              id="mainDescription"
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Write the main introduction..."
              value={blogData.mainDescription}
              onChange={(e) => setBlogData(prev => ({...prev, mainDescription: e.target.value}))}
            ></textarea>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input
              id="published"
              type="checkbox"
              checked={blogData.published}
              onChange={(e) => setBlogData(prev => ({ ...prev, published: e.target.checked }))}
              className="h-4 w-4"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">Published</label>
          </div>
        </section>

        {/* Steps 2-5+: Sub Sections */}
        {blogData.subSections.map((section, index) => (
          <section key={index} className="p-6 bg-gray-50 rounded-xl border-l-4 border-emerald-500 space-y-4">
            <h3 className="text-xl font-bold text-emerald-800 underline">Step {index + 2}: Sub Content</h3>

            <div>
              <label htmlFor={`subHeading-${index}`} className="block text-sm font-bold text-gray-700 mb-2">Sub Heading</label>
              <input
                id={`subHeading-${index}`}
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder={`Heading for section ${index + 1}`}
                value={section.subHeading}
                onChange={(e) => handleSubSectionChange(index, 'subHeading', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor={`subImage-${index}`} className="block text-sm font-bold text-gray-700 mb-2">Image</label>
              <input
                id={`subImage-${index}`}
                type="file"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white file:text-gray-700 hover:file:bg-gray-100"
                onChange={(e) => handleSubSectionChange(index, 'image', e.target.files ? e.target.files[0] : null)}
              />
              {section.imagePreview && (
                <Image
                  src={section.imagePreview}
                  alt={`Step ${index + 2} Preview`}
                  unoptimized
                  width={800}
                  height={480}
                  className="mt-4 max-h-48 rounded-lg border object-cover shadow-sm"
                  loading="lazy"
                />
              )}
            </div>

            <div>
              <label htmlFor={`subContent-${index}`} className="block text-sm font-bold text-gray-700 mb-2">Text Area</label>
              <textarea
                id={`subContent-${index}`}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Detailed description for this step..."
                value={section.content}
                onChange={(e) => handleSubSectionChange(index, 'content', e.target.value)}
              ></textarea>
            </div>
          </section>
        ))}

        <div className="flex justify-center border-t pt-6">
          <button
            type="button"
            onClick={addSubSection}
            className="flex items-center gap-2 bg-red-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-red-600 transition shadow-md hover:shadow-lg active:scale-95"
          >
            <span className="text-xl font-bold">+</span> Add Another Step
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-500 text-white font-bold py-4 rounded-lg hover:bg-red-600 shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Updating...' : 'Update Blog Post'}
        </button>
      </form>
    </div>
  );
};

export default EditBlogPage;