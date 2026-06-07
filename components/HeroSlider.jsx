"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSlider({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!slides?.length || slides.length === 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  if (!slides?.length) {
    return (
      <section className="relative overflow-hidden bg-linear-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Smart Home Gadgets Guide
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-orange-50">
            Find the best smart home products with expert reviews and buying
            guides.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gray-950 text-white">
      <div className="absolute inset-0 bg-black/45 z-10" />

      {slides.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </div>
      ))}

      <div className="relative z-20 max-w-7xl mx-auto px-4 py-20 md:py-28 min-h-[420px] flex items-center">
        <div className="max-w-3xl">
          <p className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm uppercase tracking-[0.24em] text-orange-100">
            Featured Smart Home Picks
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            {slides[activeIndex].title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-100 md:text-xl">
            {slides[activeIndex].description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={slides[activeIndex].ctaLink || "/review"}
              className="inline-flex items-center rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-400"
            >
              {slides[activeIndex].ctaText || "Explore Products"}
            </Link>
            <Link
              href="/admin/hero-slider"
              className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Manage Slider
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide._id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === activeIndex ? "bg-white w-8" : "bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
