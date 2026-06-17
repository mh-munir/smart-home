"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export function ConditionalNavbar() {
  const pathname = usePathname();
  if (!pathname || pathname.startsWith("/admin")) return null;
  return <Navbar />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (!pathname || pathname.startsWith("/admin")) return null;
  return <Footer />;
}
