"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    rating: "4.5",
    category: "Smart Home",
    // legacy single link kept for backwards compatibility
    affiliateLink: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, image: data.url }));
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
        setImagePreview("");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: "" }));
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Product added successfully!");
        setForm({
          title: "",
          price: "",
          image: "",
          rating: "4.5",
          category: "Smart Home",
          affiliateLink: "",
          description: "",
        });
        setImagePreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.push("/admin/products");
      } else {
        alert("Error adding product");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl min-h-screen">
      <h1 className="text-3xl font-bold mb-6">➕ Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Product Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Smart Door Lock Pro"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Price</label>
            <input
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g., $99.99"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Rating</label>
            <input
              type="number"
              step="0.1"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              placeholder="4.5"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Product Image</label>
          <div className="flex items-center gap-4">
            <label
              className={`flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                uploading
                  ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                  : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
              }`}
            >
              {uploading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                  <span className="text-sm text-gray-500">Uploading...</span>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-3xl">📷</span>
                  <span className="text-sm text-gray-500 block mt-1">Click to upload</span>
                  <span className="text-xs text-gray-400 block">JPG, PNG, WebP</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {(imagePreview || form.image) && (
              <div className="relative">
                <img
                  src={imagePreview || form.image}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option>Smart Home</option>
            <option>Smart Locks</option>
            <option>Smart Lock</option>
            <option>Smart Cameras</option>
            <option>Smart Camera</option>
            <option>Smart Lighting</option>
            <option>Smart Speakers</option>
            <option>Smart Thermostats</option>
            <option>Smart Thermostat</option>
            <option>Smart Sensors</option>
            <option>Smart Plugs</option>
            <option>Smart Home Hubs</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Affiliate Link
          </label>
          <input
            type="url"
            name="affiliateLink"
            value={form.affiliateLink}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product description..."
            rows="4"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}