"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic imports for code splitting - heavy components loaded on demand
const TopNavbar = dynamic(() => import("@/components/TopNavbar"), {
  ssr: false,
  loading: () => null,
});

const Navbar = dynamic(() => import("@/components/Navbar"), {
  ssr: false,
  loading: () => null,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
  loading: () => null,
});

export function ConditionalNavbar() {
  const pathname = usePathname();
  if (!pathname || pathname.startsWith("/admin")) return null;
  return (
    <>
      <TopNavbar />
      <Navbar />
    </>
  );
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (!pathname || pathname.startsWith("/admin")) return null;
  return <Footer />;
}
