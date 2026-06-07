"use client";

import { useState } from "react";
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
    affiliateLink: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    <div className="p-8 max-w-2xl">
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
          <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
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
            <option>Smart Lock</option>
            <option>Smart Camera</option>
            <option>Smart Lighting</option>
            <option>Smart Thermostat</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Affiliate Link (Amazon)
          </label>
          <input
            type="url"
            name="affiliateLink"
            value={form.affiliateLink}
            onChange={handleChange}
            placeholder="https://amazon.com/..."
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
