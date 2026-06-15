"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoginPage) {
    return children;
  }

  return (
    <div className="flex">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Mobile top bar with toggle */}
        <div className="md:hidden bg-white border-b border-gray-200 p-2 flex items-center">
          <button
            aria-label="Open sidebar"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="ml-3 font-bold text-lg">Admin</div>
        </div>

        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
