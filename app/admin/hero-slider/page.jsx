"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  image: "",
  ctaText: "Explore Products",
  ctaLink: "/blog",
  order: "0",
  isActive: true,
};

export default function HeroSliderAdminPage() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    try {
      const res = await fetch("/api/hero-slides?all=true");
      const data = await res.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching slides:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId
      ? `/api/hero-slides/${editingId}`
      : "/api/hero-slides";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to save slide");
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchSlides();
    } catch (error) {
      console.error("Error saving slide:", error);
      alert("Could not save the slide.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(slide) {
    setEditingId(slide._id);
    setForm({
      title: slide.title || "",
      description: slide.description || "",
      image: slide.image || "",
      ctaText: slide.ctaText || "Explore Products",
      ctaLink: slide.ctaLink || "/blog",
      order: String(slide.order ?? 0),
      isActive: Boolean(slide.isActive),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function deleteSlide(id) {
    if (!confirm("Delete this slide?")) return;

    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete slide");
      }

      if (editingId === id) {
        cancelEdit();
      }

      await fetchSlides();
    } catch (error) {
      console.error("Error deleting slide:", error);
      alert("Could not delete the slide.");
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Hero Slider</h1>
        <p className="mt-2 text-gray-600">
          Manage the home page slider image, heading, description, and button
          from here.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-lg"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? "Edit Slide" : "Add New Slide"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Set the image URL, title, description, and CTA for each slide.
              </p>
            </div>
            {editingId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Slide Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                required
                placeholder="https://example.com/hero-image.jpg"
                className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Button Text
                </label>
                <input
                  type="text"
                  name="ctaText"
                  value={form.ctaText}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Button Link
                </label>
                <input
                  type="text"
                  name="ctaLink"
                  value={form.ctaLink}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Slide Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <label className="flex items-center gap-3 rounded-lg border px-4 py-3 mt-8 md:mt-0">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="font-semibold text-gray-700">
                  Show this slide on homepage
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Slide"
                : "Add Slide"}
            </button>
          </div>
        </form>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Current Slides</h2>
            <p className="mt-1 text-sm text-gray-500">
              Slides with a lower order number appear first.
            </p>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading slides...</div>
          ) : slides.length > 0 ? (
            <div className="space-y-4">
              {slides.map((slide) => (
                <div
                  key={slide._id}
                  className="overflow-hidden rounded-2xl border border-gray-200"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 1280px) 100vw, 40vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {slide.title}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              slide.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {slide.isActive ? "Active" : "Hidden"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {slide.description}
                        </p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                          Order {slide.order ?? 0}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(slide)}
                        className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSlide(slide._id)}
                        className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center text-gray-500">
              No slider image added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
