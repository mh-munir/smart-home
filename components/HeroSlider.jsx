"use client";

import { useEffect, useState, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/image-placeholder";

function HeroSlider({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [brokenMap, setBrokenMap] = useState({});
  const LOCAL_FALLBACK = "/logo.png";

  const handleSlideError = useCallback((slideId) => {
    setBrokenMap((s) => ({ ...s, [slideId]: true }));
  }, []);

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

  const activeSlide = slides[activeIndex];
  const src = brokenMap[activeSlide._id] ? LOCAL_FALLBACK : activeSlide.image;
  const isFallbackLogo = src === LOCAL_FALLBACK;

  return (
    <section className="relative overflow-hidden bg-gray-950 text-white min-h-105 md:min-h-130">
      {/* Single background image — only the active slide is in the DOM */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/45 z-10" />
        <Image
          src={src}
          alt={activeSlide.title}
          fill
          sizes="100vw"
          className={isFallbackLogo ? "object-contain" : "object-cover"}
          preload
          fetchPriority="high"
          onError={() => handleSlideError(activeSlide._id)}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 py-20 md:py-28 min-h-105 md:min-h-130 flex items-center">
        <div className="max-w-3xl">
          <p className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm uppercase tracking-[0.24em] text-orange-100">
            Featured Smart Home Picks
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            {activeSlide.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-100 md:text-xl">
            {activeSlide.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={activeSlide.ctaLink || "/blog"}
              className="inline-flex items-center rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600">
              {activeSlide.ctaText || "Explore Products"}
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-3">
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

export default memo(HeroSlider);
