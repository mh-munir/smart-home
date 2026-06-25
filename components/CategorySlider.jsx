"use client";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Horizontal scrollable slider for category cards.
 * Supports arrow navigation, mouse drag, and touch swipe.
 */
function CategorySlider({ categories }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });
  const rafRef = useRef(null);

  const checkScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [checkScroll, categories]);

  const scroll = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;
    // Use a fixed card width to avoid forced reflow from reading offsetWidth
    const CARD_WIDTH = 216;
    const GAP = 16;
    el.scrollBy({ left: direction * (CARD_WIDTH + GAP) * 2, behavior: "smooth" });
  }, []);

  const onMouseDown = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragState.current = { startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX);
  }, []);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    const el = scrollRef.current;
    if (el) {
      el.style.cursor = "grab";
      el.style.userSelect = "";
    }
  }, []);

  // Only attach document-level listeners while dragging
  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  if (!categories || categories.length === 0) return null;

  return (
    <div className="relative group/slider">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll categories left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:text-teal-600 transition opacity-0 group-hover/slider:opacity-100 border border-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll categories right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:text-teal-600 transition opacity-0 group-hover/slider:opacity-100 border border-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide cursor-grab"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/products?category=${encodeURIComponent(category.name)}`}
            className="snap-start flex gap-2 border border-red-200 rounded-sm hover:shadow-md transition-shadow shrink-0"
            style={{ minWidth: "200px", maxWidth: "260px" }}
          >
            {category.thumbnail ? (
              <div className="w-16 h-16 overflow-hidden bg-gray-100 shrink-0 relative">
                <Image
                  fill
                  sizes="64px"
                  src={category.thumbnail}
                  alt={category.name}
                  loading="lazy"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-linear-to-br from-teal-50 to-teal-100 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-teal-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
                </svg>
              </div>
            )}
            <div className="px-3 py-2 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 hover:text-teal-600 transition truncate">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {category.products?.length || 0} product{(category.products?.length || 0) !== 1 ? "s" : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default memo(CategorySlider);