"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// Defer ThemeProvider and CompareProvider with ssr: false.
// These providers read from localStorage (client-only state), so rendering
// them only on the client avoids unnecessary server work and hydration cost.
// Children that consume these contexts (e.g. CompareButton) fall back to
// safe defaults when the context is not yet available.
const ThemeProvider = dynamic(() => import("@/components/ThemeProvider").then(m => m.ThemeProvider), {
  ssr: false,
  loading: () => null,
});

const CompareProvider = dynamic(() => import("@/components/CompareProvider").then(m => m.CompareProvider), {
  ssr: false,
  loading: () => null,
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