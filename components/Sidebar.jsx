"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/add-product", label: "Add Product" },
  { href: "/admin/hero-slider", label: "Hero Slider" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/guides", label: "Guides" },
  { href: "/admin/add-blog", label: "Add Blog" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/analytics", label: "Analytics" },
];

// Freeze nav items to prevent accidental runtime mutation that can
// produce server/client rendering differences during HMR or runtime updates.
navItems.forEach((it) => Object.freeze(it));
Object.freeze(navItems);

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

  const getIcon = (label) => {
    switch (label) {
      case "Dashboard":
        return (
          <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v8h8V3h-8zM3 21h8v-8H3v8z" />
          </svg>
        );
      case "Products":
        return (
          <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
          </svg>
        );
      case "Add Product":
        return (
          <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" />
          </svg>
        );
      case "Blogs":
        return (
          <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
          </svg>
        );
      case "Guides":
        return (
          <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 20l9-5-9-5-9 5 9 5z" />
          </svg>
        );
      case "Settings":
        return (
          <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l0 0a2 2 0 1 1-2.83 2.83l0 0a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l0 0A2 2 0 1 1 2.27 16.82l0 0A1.65 1.65 0 0 0 2.6 15a1.65 1.65 0 0 0-.33-1.82l0 0A2 2 0 1 1 4.6 9.33l0 0A1.65 1.65 0 0 0 5.59 8.3 1.65 1.65 0 0 0 6.5 6.79V6a2 2 0 1 1 4 0v.79a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l0 0A2 2 0 1 1 19.4 8.18l0 0A1.65 1.65 0 0 0 19.4 15z" />
          </svg>
        );
      case "Analytics":
        return (
          <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 3v18h18" />
            <path d="M7 13v6M12 7v12M17 11v8" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Backdrop for mobile when sidebar is open */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!mobileOpen}
        suppressHydrationWarning
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      </div>

      <aside
        role="navigation"
        aria-label="Admin sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 text-white transition-transform duration-200 md:static md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!mobileOpen}
        suppressHydrationWarning
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <button
              className="md:hidden p-2 rounded text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2 flex-1" suppressHydrationWarning>
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
              const itemClass = active ? 'flex items-center gap-3 rounded px-4 py-2 transition-colors bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow' : 'flex items-center gap-3 rounded px-4 py-2 transition-colors text-gray-200 hover:bg-gray-800';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={itemClass}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="`flex-shrink-0`">{getIcon(item.label)}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <Link
              href="/api/auth/logout"
              prefetch={false}
              className="block rounded px-4 py-2 transition-colors text-gray-200 hover:bg-red-700"
            >
              Logout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}