"use client";

import { usePathname } from "next/navigation";
import TopNavbar from "@/components/TopNavbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayoutShell({ children, navSettings }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <TopNavbar />}
      {!isAdmin && <Navbar settings={navSettings} />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
