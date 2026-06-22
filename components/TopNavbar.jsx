"use client";

import { useState, useEffect, useRef, memo } from "react";
import { useRouter } from "next/navigation";

/* ───── Icons ───── */

const SearchIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const socialLinks = [
  { name: "Facebook", icon: FacebookIcon, href: "#" },
  { name: "X (Twitter)", icon: TwitterIcon, href: "#" },
  { name: "Instagram", icon: InstagramIcon, href: "#" },
  { name: "YouTube", icon: YouTubeIcon, href: "#" },
  { name: "LinkedIn", icon: LinkedInIcon, href: "#" },
];

/* ───── Component ───── */

function TopNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  function handleSearch(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`);
      searchRef.current?.blur();
    }
  }

  /* ⌘K / Ctrl+K keyboard shortcut */
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const desktopSearchClass = isFocused
    ? "w-80 lg:w-96 border-teal-500/50 bg-white/7 shadow-[0_0_20px_-4px_rgba(20,184,166,0.15)]"
    : "w-64 lg:w-72 border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/6";

  return (
    <div className="relative bg-linear-to-r from-[#0a0f1a] via-[#111827] to-[#0a0f1a] text-gray-300 text-[13px] overflow-hidden">
      {/* Subtle animated gradient accent line at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-teal-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-11">
          {/* ── Social Icons ── */}
          <div className="flex items-center gap-1">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-7 h-7 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label={social.name}
              >
                <social.icon />
                {/* Tooltip */}
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-[11px] font-medium text-gray-200 opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
                  {social.name}
                </span>
              </a>
            ))}
          </div>

          {/* ── Search Bar (Desktop) ── */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex items-center"
            role="search"
            aria-label="Site search"
          >
            <div
              className={`relative flex items-center rounded-xl border transition-all duration-300 ease-out ${desktopSearchClass}`}
            >
              <div className="flex items-center justify-center pl-3.5">
                <SearchIcon
                  className={`transition-colors duration-200 ${
                    isFocused ? "text-teal-400" : "text-gray-500"
                  }`}
                />
              </div>

              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search products, blogs, guides..."
                className="flex-1 bg-transparent px-3 py-2 text-[13px] text-gray-200 placeholder-gray-500 outline-none"
              />

              {/* Keyboard shortcut badge */}
              {!isFocused && !searchQuery && (
                <div className="hidden lg:flex items-center gap-0.5 pr-3 text-gray-600 select-none">
                  <kbd className="flex items-center justify-center h-5 min-w-5 rounded-sm border border-white/10 bg-white/5 px-1 font-mono text-[10px] font-medium text-gray-500">
                    ⌘
                  </kbd>
                  <kbd className="flex items-center justify-center h-5 min-w-5 rounded-sm border border-white/10 bg-white/5 px-1 font-mono text-[10px] font-medium text-gray-500">
                    K
                  </kbd>
                </div>
              )}

              {/* Submit button (visible when focused or has text) */}
              {(isFocused || searchQuery) && (
                <button
                  type="submit"
                  className="flex items-center justify-center w-7 h-7 mr-1.5 rounded-lg bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-colors duration-200"
                  aria-label="Search"
                >
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* ── Mobile Search ── */}
          <form
            onSubmit={handleSearch}
            className="flex sm:hidden items-center flex-1 max-w-45"
            role="search"
            aria-label="Site search"
          >
            <div className="relative flex items-center w-full rounded-lg border border-white/8 bg-white/4 focus-within:border-teal-500/50 focus-within:bg-white/7 transition-all duration-300">
              <div className="flex items-center justify-center pl-2.5">
                <SearchIcon className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent px-2 py-1.5 text-xs text-gray-200 placeholder-gray-500 outline-none"
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="flex items-center justify-center w-6 h-6 mr-1 rounded-md bg-teal-500/20 text-teal-400 transition-colors"
                  aria-label="Search"
                >
                  <ArrowRightIcon className="w-3 h-3" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default memo(TopNavbar);
