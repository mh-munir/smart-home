"use client";

import dynamic from "next/dynamic";

// Defer non-critical client components to reduce initial JS bundle and hydration cost
const CompareFloatingBar = dynamic(() => import("@/components/CompareFloatingBar"), {
  ssr: false,
  loading: () => null,
});

const PWARegistration = dynamic(() => import("@/components/PWARegistration"), {
  ssr: false,
  loading: () => null,
});

export default function DeferredScripts() {
  return (
    <>
      <PWARegistration />
      <CompareFloatingBar />
    </>
  );
}