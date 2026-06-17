"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/guides", label: "Guides" },
  { href: "/best-deals", label: "Best Deals" },
  { href: "/about", label: "About" },
];

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const [settings, setSettings] = useState({
    subtitle: "Make your home smarter",
    logo: "/logo.png",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings");

        if (!res.ok) return;

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return;

        const data = await res.json();
        if (data) setSettings(data);
      } catch (err) {
        console.log("Settings load failed");
      }
    };

    loadSettings();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={settings.logo || "/logo.png"}
              alt="Logo"
              width={160}
              height={40}
              priority
              loading="eager"
              className="h-8 w-auto object-contain"
            />

            {settings.subtitle && (
              <span className="hidden lg:block text-xs text-gray-400 font-serif italic border-l border-gray-200 pl-3">
                {settings.subtitle}
              </span>
            )}
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
              aria-label="Toggle menu"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setOpen(false)}
          />

          <nav className="fixed top-20 left-0 right-0 bg-white border-b border-gray-100 z-50 p-4 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-all font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}