"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    subtitle: "Make your home smarter",
    logo: "/logo.png",
  });

  useEffect(() => {
    setMounted(true);

    let isCancelled = false;

    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();

        if (!isCancelled && data) {
          setSettings(data);
        }
      } catch (e) {
        if (!isCancelled) {
          setSettings({
            subtitle: "Make your home smarter",
            logo: "/logo.png",
          });
        }
      }
    }

    fetchSettings();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">

          <Link href="/" className="flex items-center gap-3">
            <Image
              src={settings.logo}
              alt="logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />

            <span className="text-sm text-gray-600">
              {settings.subtitle}
            </span>
          </Link>

        </div>
      </div>
    </header>
  );
}