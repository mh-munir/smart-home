"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({ subtitle: "Make your home smarter", logo: null, favicon: null });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data) setSettings(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const MenuIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const CloseIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const links = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/guides", label: "Guides" },
    { href: "/best-deals", label: "Best Deals" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-4">
            {settings.logo ? (
              <img src={settings.logo} alt="logo" className="h-10 w-auto object-contain" />
            ) : (
              <div className="flex flex-col">
                <div className="text-2xl font-serif font-bold text-gray-900">SmartHome</div>
              </div>
            )}

            <div className="hidden sm:flex flex-col">
              <div className="text-xs text-gray-600 font-serif italic mt-0.5">{settings.subtitle}</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-gray-700 hover:text-teal-600 font-semibold transition-colors text-xs uppercase tracking-wide"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-controls="mobile-menu"
              aria-expanded={open}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${open ? "block" : "hidden"}`} id="mobile-menu">
        <div className="absolute inset-x-0 top-20 bg-white border-t border-gray-200 z-50 p-4">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-gray-800 py-3 px-2 rounded-lg font-medium text-sm hover:bg-gray-50"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        {/* backdrop to close menu when clicking outside */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/20"
            aria-hidden
          />
        )}
      </div>
    </header>
  );
}
