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

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

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

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded px-4 py-2 transition-colors ${active ? 'bg-teal-600 text-white' : 'text-gray-200 hover:bg-gray-800'}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
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