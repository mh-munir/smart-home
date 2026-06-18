"use client";

import React, { useState, useEffect } from "react";

type ProductForm = {
  title: string;
  category: string;
  price: string;
  affiliateLink: string;
  description: string;
  images: File[];
  previews: string[];
};

const ProductAddForm = () => {
  const [form, setForm] = useState<ProductForm>({
    title: "",
    category: "",
    price: "",
    affiliateLink: "",
    description: "",
    images: [],
    previews: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      form.previews.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [form.previews]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const previews = arr.map((f) => URL.createObjectURL(f));
    // Revoke old previews
    form.previews.forEach((p) => URL.revokeObjectURL(p));
    setForm((prev) => ({ ...prev, images: arr, previews }));
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const imagesBase64: string[] = [];
      for (const f of form.images) {
        imagesBase64.push(await fileToBase64(f));
      }

      const payload = {
        title: form.title,
        category: form.category,
        price: form.price,
        affiliateLink: form.affiliateLink,
        description: form.description,
        images: imagesBase64,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create product");
      }

      alert("Product created successfully");
      window.location.href = "/admin/products";
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error creating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-1">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            title="Product title"
            placeholder="e.g. Smart Wi-Fi Plug"
            className="w-full border rounded p-2"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-semibold mb-1">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              title="Product category"
              placeholder="e.g. Smart Home"
              className="w-full border rounded p-2"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-semibold mb-1">Price</label>
            <input
              id="price"
              name="price"
              type="text"
              title="Product price"
              placeholder="e.g. USD $19.99"
              className="w-full border rounded p-2"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label htmlFor="affiliateLink" className="block text-sm font-semibold mb-1">Affiliate Link</label>
          <input
            id="affiliateLink"
            name="affiliateLink"
            type="url"
            title="Affiliate URL for this product"
            placeholder="https://affiliate.example.com/product/123"
            className="w-full border rounded p-2"
            value={form.affiliateLink}
            onChange={(e) => setForm((p) => ({ ...p, affiliateLink: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            rows={6}
            title="Product description"
            placeholder="Short description or introduction for this product"
            className="w-full border rounded p-2"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-semibold mb-1">Images</label>
          <input
            id="images"
            name="images"
            type="file"
            title="Upload product images"
            aria-label="Product images"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700"
          />
          <div className="mt-4 grid grid-cols-3 gap-4">
            {form.previews.map((p, i) => (
              <img key={i} src={p} alt={`Preview ${i + 1}`} className="w-full h-32 object-cover rounded" />
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAddForm;
