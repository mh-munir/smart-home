'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
  bestDeal?: boolean;
  dealType?: string;
  offer?: string;
}

export default function ProductForm() {
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
    bestDeal: false,
    dealType: '',
    offer: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const previewsRef = useRef<string[]>([]);
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  const [addCatError, setAddCatError] = useState<string | null>(null);
  const [showManageCategories, setShowManageCategories] = useState<boolean>(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState<boolean>(false);
  const [delError, setDelError] = useState<string | null>(null);

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

  // Load available categories for the dropdown
  useEffect(() => {
    let mounted = true;
    const defaultCats = [
      'Smart Home',
      'Smart Locks',
      'Smart Cameras',
      'Smart Lighting',
      'Smart Speakers',
      'Smart Thermostats',
      'Smart Plugs',
      'Accessories',
      'Home Security',
    ];

    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to load categories');
        const data = await res.json();
        if (!mounted) return;
        const list = Array.isArray(data) && data.length > 0 ? data.filter(Boolean) : defaultCats;
        setCategories(list);
        setProductData((prev) => {
          // keep existing category if still present, otherwise pick the first available
          const preferred = prev.category && list.includes(prev.category) ? prev.category : (list[0] || prev.category);
          return { ...prev, category: preferred };
        });
      } catch (err) {
        setCategories(defaultCats);
        setProductData((prev) => ({ ...prev, category: defaultCats[0] || prev.category }));
      }
    }

    loadCategories();
    return () => { mounted = false; };
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

  const handleAddCategory = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setAddCatError(null);
    const name = newCategory.trim();
    if (!name) {
      setAddCatError('Please enter a category name');
      return;
    }

    setIsAddingCategory(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to add category');

      const createdName = data?.name || name;
      setCategories((prev) => Array.from(new Set([createdName, ...prev])));
      setProductData((prev) => ({ ...prev, category: createdName }));
      setNewCategory('');
      setShowAddCategory(false);
    } catch (err: any) {
      setAddCatError(err?.message || String(err));
    } finally {
      setIsAddingCategory(false);
    }
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
        bestDeal: productData.bestDeal,
        dealType: productData.dealType || '',
        offer: productData.offer || '',
        images,
      };

      const response = await fetch('/api/admin/products', {
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
            <select
              id="category"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                value={productData.category}
                onChange={(e) => setProductData(prev => ({ ...prev, category: e.target.value }))}
              required
            >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
                ) : (
                  <>
                    <option value="Smart Home">Smart Home</option>
                    <option value="Smart Locks">Smart Locks</option>
                    <option value="Smart Cameras">Smart Cameras</option>
                    <option value="Smart Lighting">Smart Lighting</option>
                    <option value="Smart Speakers">Smart Speakers</option>
                    <option value="Smart Thermostats">Smart Thermostats</option>
                    <option value="Smart Plugs">Smart Plugs</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home Security">Home Security</option>
                  </>
                )}
            </select>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className="text-sm text-teal-600 font-medium"
                onClick={() => setShowAddCategory((s) => !s)}
              >
                + Add category
              </button>

                <button
                  type="button"
                  className="text-sm text-gray-600"
                  onClick={() => setShowManageCategories((s) => !s)}
                >
                  Manage categories
                </button>

              {showAddCategory && (
                <div className="flex items-center gap-2 ml-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="border rounded p-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCategory()}
                    disabled={isAddingCategory}
                    className="bg-teal-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                  >
                    {isAddingCategory ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddCategory(false); setNewCategory(''); setAddCatError(null); }}
                    className="text-sm text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {showManageCategories && (
                <div className="mt-3 w-full bg-gray-50 border border-gray-200 rounded p-3">
                  <div className="text-sm font-medium mb-2">Manage categories</div>
                  {delError && <div className="text-sm text-red-600 mb-2">{delError}</div>}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                      <div key={cat} className="flex items-center justify-between bg-white p-2 rounded border">
                        <div className="text-sm text-gray-700">{cat}</div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isDeletingCategory}
                            onClick={async () => {
                              if (!confirm(`Delete category "${cat}"? This will remove it from the admin list.`)) return;
                              setDelError(null);
                              setIsDeletingCategory(true);
                              try {
                                const res = await fetch('/api/categories', {
                                  method: 'DELETE',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ name: cat }),
                                });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data?.error || 'Failed to delete');
                                setCategories((prev) => prev.filter((c) => c !== cat));
                                setProductData((prev) => {
                                  if (prev.category === cat) {
                                    return { ...prev, category: (categories.find((c) => c !== cat) || '') };
                                  }
                                  return prev;
                                });
                              } catch (err: any) {
                                setDelError(err?.message || String(err));
                              } finally {
                                setIsDeletingCategory(false);
                              }
                            }}
                            className="text-sm text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {addCatError && <div className="text-sm text-red-600 mt-1">{addCatError}</div>}
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
            {productData.mainImagePreview && (
              <Image
                src={productData.mainImagePreview}
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

          <div>
            <label htmlFor="dealType" className="block text-sm font-bold text-gray-700 mb-2">Deal Type (shows in Best Deals)</label>
            <select
              id="dealType"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
              value={productData.dealType || ''}
              onChange={(e) => setProductData(prev => ({ ...prev, dealType: e.target.value, bestDeal: e.target.value ? true : false }))}
            >
              <option value="">None</option>
              <option value="HOT DEAL">HOT DEAL</option>
              <option value="LIMITED TIME">LIMITED TIME</option>
              <option value="FLASH SALE">FLASH SALE</option>
              <option value="TRENDING">TRENDING</option>
              <option value="MEGA DEAL">MEGA DEAL</option>
              <option value="POPULAR">POPULAR</option>
            </select>
          </div>

          <div>
            <label htmlFor="offer" className="block text-sm font-bold text-gray-700 mb-2">Offer (e.g., 20% off or $10 off)</label>
            <input
              id="offer"
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g., 20% off"
              value={productData.offer || ''}
              onChange={(e) => setProductData(prev => ({ ...prev, offer: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input
              id="bestDeal"
              type="checkbox"
              checked={productData.bestDeal}
              onChange={(e) => setProductData(prev => ({ ...prev, bestDeal: e.target.checked, dealType: e.target.checked ? (prev.dealType || '') : '' }))}
              className="h-4 w-4"
            />
            <label htmlFor="bestDeal" className="text-sm font-medium text-gray-700">Mark as Best Deal</label>
          </div>
        </section>

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
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}
