"use client";

import { useEffect } from "react";

export default function PWARegistration() {
  useEffect(() => {
    // Only register the service worker in production to avoid caching issues during development
    if (process.env.NODE_ENV === "production" && typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
          // Service worker registration failed silently
        });
    }
  }, []);

  return null;
}