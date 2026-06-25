'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SeoSettings from '@/components/admin/SeoSettings';

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
  slug: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

export default function BlogForm() {
  const [blogData, setBlogData] = useState<BlogData>({
    mainHeading: '',
    category: '',
    mainImage: null,
    mainImagePreview: '',
    mainDescription: '',
    subSections: Array.from({ length: 4 }, () => ({ 
      subHeading: '', 
      image: null, 
      imagePreview: '', 
      content: '' 
    })),
    slug: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previewsRef = useRef<string[]>([]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData({
        ...blogData,
        mainImage: file,
        mainImagePreview: URL.createObjectURL(file), // This is fine for preview
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

      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blogData.mainHeading,
          category: blogData.category,
          content,
          images,
          slug: blogData.slug || undefined,
          metaTitle: blogData.metaTitle || undefined,
          metaDescription: blogData.metaDescription || undefined,
          canonicalUrl: blogData.canonicalUrl || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to publish blog');
      }

      alert('Blog published successfully!');
      window.location.href = '/admin/blogs';

    } catch (error: unknown) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Error publishing blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-4">Add New Blog Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-10">
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
                width={800}
                height={480}
                className="mt-4 max-h-48 rounded-lg w-auto"
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
        </section>

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
                  width={800}
                  height={480}
                  className="mt-4 max-h-48 rounded-lg border object-cover shadow-sm w-auto"
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

        <SeoSettings
          title={blogData.mainHeading}
          slug={blogData.slug}
          onSlugChange={(slug) => setBlogData((prev) => ({ ...prev, slug }))}
          metaTitle={blogData.metaTitle}
          onMetaTitleChange={(metaTitle) => setBlogData((prev) => ({ ...prev, metaTitle }))}
          metaDescription={blogData.metaDescription}
          onMetaDescriptionChange={(metaDescription) => setBlogData((prev) => ({ ...prev, metaDescription }))}
          canonicalUrl={blogData.canonicalUrl}
          onCanonicalUrlChange={(canonicalUrl) => setBlogData((prev) => ({ ...prev, canonicalUrl }))}
          type="blog"
          basePath="/blog"
        />

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-red-500 text-white font-bold py-4 rounded-lg hover:bg-red-600 shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Blog Post'}
        </button>
      </form>
    </div>
  );
}
