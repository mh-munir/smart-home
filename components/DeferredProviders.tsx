"use client";

import dynamic from "next/dynamic";
import { type ReactNode } from "react";

// Defer ThemeProvider and CompareProvider to avoid blocking hydration
// of the critical above-the-fold content
const ThemeProvider = dynamic(() => import("@/components/ThemeProvider").then(m => m.ThemeProvider), {
  ssr: true,
});

const CompareProvider = dynamic(() => import("@/components/CompareProvider").then(m => m.CompareProvider), {
  ssr: true,
});

export default function DeferredProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CompareProvider>
        {children}
      </CompareProvider>
    </ThemeProvider>
  );
}