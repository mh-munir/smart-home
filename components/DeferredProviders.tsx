"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// Defer CompareProvider with ssr: false.
// Children that consume these contexts (e.g. CompareButton) fall back to
// safe defaults when the context is not yet available.
const CompareProvider = dynamic(() => import("@/components/CompareProvider").then(m => m.CompareProvider), {
  ssr: false,
  loading: () => null,
});

export default function DeferredProviders({ children }: { children: ReactNode }) {
  return (
    <CompareProvider>
      {children}
    </CompareProvider>
  );
}
