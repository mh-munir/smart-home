'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SubSection {
  subHeading: string;
  image: File | null;
  imagePreview: string;
  content: string;
}

interface ProductData {
  title: string;
  price: string;
  rating: string;
  category: string;
  affiliateLink: string;
  mainImage: File | null;
  mainImagePreview: string;
  mainDescription: string;
  subSections: SubSection[];
}

const AddProductPage = () => {
  const router = useRouter();
  const [productData, setProductData] = useState<ProductData>({
    title: '',
    price: '',
    rating: '4.5',
    category: 'Smart Home',
    affiliateLink: '',
    mainImage: null,
    mainImagePreview: '',
    mainDescription: '',
    subSections: Array.from({ length: 4 }, () => ({
      subHeading: '',
      image: null,
      imagePreview: '',
      content: '',
    })),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previewsRef = useRef<string[]>([]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductData({
        ...productData,
        mainImage: file,
        mainImagePreview: URL.createObjectURL(file),
      });
    }
  };

  useEffect(() => {
    previewsRef.current = [
      productData.mainImagePreview,
      ...productData.subSections.map((section) => section.imagePreview),
    ].filter(Boolean);
  }, [productData.mainImagePreview, productData.subSections]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, []);

  const handleSubSectionChange = (index: number, field: keyof SubSection, value: string | File | null) => {
    setProductData((prev) => {
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
    setProductData({
      ...productData,
      subSections: [
        ...productData.subSections,
        { subHeading: '', image: null, imagePreview: '', content: '' },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const images: string[] = [];
      if (productData.mainImage) {
        images.push(await fileToBase64(productData.mainImage));
      }

      for (const section of productData.subSections) {
        if (section.image) {
          images.push(await fileToBase64(section.image));
        }
      }

      let description = productData.mainDescription;
      productData.subSections.forEach((s) => {
        if (s.subHeading || s.content) {
          description += `\n\n## ${s.subHeading}\n${s.content}`;
        }
      });

      const payload = {
        title: productData.title,
        price: productData.price,
        rating: parseFloat(productData.rating) || 4.5,
        category: productData.category,
        affiliateLink: productData.affiliateLink,
        description,
        images,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to add product');
      }

      alert('Product added successfully!');
      router.push('/admin/products');
    } catch (error: unknown) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Error adding product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Step 1: Main Content */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-blue-800">Step 1: Main Content</h3>

          <div>
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Product Title</label>
            <input
              id="title"
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g., Smart Door Lock Pro"
              value={productData.title}
              onChange={(e) => setProductData(prev => ({ ...prev, title: e.target.value }))}
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
              value={productData.category}
              onChange={(e) => setProductData(prev => ({ ...prev, category: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">Price</label>
              <input
                id="price"
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g., $99.99"
                value={productData.price}
                onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
              <input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="4.5"
                value={productData.rating}
                onChange={(e) => setProductData(prev => ({ ...prev, rating: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="mainImage" className="block text-sm font-bold text-gray-700 mb-2">Main Product Image</label>
            <input
              id="mainImage"
              type="file"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleMainImageChange}
            />
            {productData.mainImagePreview && <img src={productData.mainImagePreview} alt="Preview" className="mt-4 max-h-48 rounded-lg" />}
          </div>

          <div>
            <label htmlFor="mainDescription" className="block text-sm font-bold text-gray-700 mb-2">Text Area (Main Description)</label>
            <textarea
              id="mainDescription"
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Write the main product description..."
              value={productData.mainDescription}
              onChange={(e) => setProductData(prev => ({ ...prev, mainDescription: e.target.value }))}
            ></textarea>
          </div>

          <div>
            <label htmlFor="affiliateLink" className="block text-sm font-bold text-gray-700 mb-2">Affiliate Link</label>
            <input
              id="affiliateLink"
              type="url"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="https://..."
              value={productData.affiliateLink}
              onChange={(e) => setProductData(prev => ({ ...prev, affiliateLink: e.target.value }))}
            />
          </div>
        </section>

        {/* Steps 2-5+: Sub Sections */}
        {productData.subSections.map((section, index) => (
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
                <img src={section.imagePreview} alt={`Step ${index + 2} Preview`} className="mt-4 max-h-48 rounded-lg border object-cover shadow-sm" />
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
            className="flex items-center gap-2 bg-emerald-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-emerald-600 transition shadow-md hover:shadow-lg active:scale-95"
          >
            <span className="text-xl font-bold">+</span> Add Another Step
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;