"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = pathname?.split("/").filter(Boolean).slice(-1)[0]?.replace(/-/g, " ") || "Admin";

  if (isLoginPage) {
    return children;
  }

  return (
    <div className="flex" suppressHydrationWarning>
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

        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-between bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">{pageTitle && pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)}</h1>
            <span className="text-sm text-gray-500">Admin Panel</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <input
                type="search"
                placeholder="Search..."
                className="w-64 border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-sm hover:shadow">
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span className="hidden sm:inline text-sm text-gray-700">Admin</span>
            </button>
          </div>
        </div>

        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}
