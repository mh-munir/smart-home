"use client";

import { useState, useEffect, memo } from "react";

function StickyAffiliateCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-0 z-40 pointer-events-none" role="complementary" aria-label="Special offer">
      <div className="px-4 flex justify-end">
        <div className="pointer-events-auto bg-linear-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-404">
          <span className="text-sm font-bold hidden sm:inline">🔥 Hot Deals Available!</span>
          <a
            href="/best-deals"
            className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition"
          >
            View Deals
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(StickyAffiliateCTA);