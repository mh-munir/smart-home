"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: "dashboard" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/products", label: "Products", icon: "products" },
      { href: "/admin/add", label: "Add Content", icon: "add" },
      { href: "/admin/blogs", label: "Blogs", icon: "blogs" },
      { href: "/admin/guides", label: "Guides", icon: "guides" },
    ],
  },
  {
    label: "Audience",
    items: [
      { href: "/admin/subscribers", label: "Subscribers", icon: "subscribers" },
      { href: "/admin/analytics", label: "Analytics", icon: "analytics" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: "settings" },
      { href: "/admin/hero-slider", label: "Hero Slider", icon: "slider" },
    ],
  },
];

// Freeze nav items to prevent accidental runtime mutation that can
// produce server/client rendering differences during HMR or runtime updates.
navSections.forEach((section) => {
  section.items.forEach((it) => Object.freeze(it));
  Object.freeze(section.items);
});
Object.freeze(navSections);

const Icon = ({ name, isActive }) => {
  const color = isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200";
  const s = `w-4.5 h-4.5 ${color} transition-colors duration-200`;

  switch (name) {
    case "dashboard":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "products":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8l-9-4.5L3 8l9 4.5L21 8z" />
          <path d="M3 8v8l9 4.5" />
          <path d="M21 8v8l-9 4.5" />
          <path d="M12 12.5v8.5" />
        </svg>
      );
    case "add":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "slider":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 12h20" />
          <circle cx="7" cy="12" r="1.5" fill="currentColor" />
          <path d="M16 10l3 2-3 2" />
        </svg>
      );
    case "blogs":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
          <path d="M7 8h10M7 12h6" />
        </svg>
      );
    case "guides":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          <path d="M8 7h8M8 11h5" />
        </svg>
      );
    case "subscribers":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case "analytics":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20h18" />
          <path d="M5 16l4-5 4 3 5-7" />
          <circle cx="18" cy="7" r="1.5" fill="currentColor" />
        </svg>
      );
    case "settings":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      );
    default:
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
};

function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop for mobile when sidebar is open */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 backdrop-blur-sm" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
        suppressHydrationWarning
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      </div>

      <aside
        role="navigation"
        aria-label="Admin sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-65 flex flex-col bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white transition-transform duration-300 ease-in-out md:fixed md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
        suppressHydrationWarning
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-linear-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide text-white leading-none">Smart Home</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Admin Panel</span>
          </div>
          {/* Mobile close button */}
          <button
            className="ml-auto md:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5 scrollbar-thin" suppressHydrationWarning>
          {navSections.map((section) => (
            <div key={section.label}>
              <h3 className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {section.label}
              </h3>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname?.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                        active
                          ? "bg-primary-500/15 text-white shadow-sm"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {/* Active indicator bar */}
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(0,200,150,0.5)]" />
                      )}

                      <span className="shrink-0 pl-0.5">
                        <Icon name={item.icon} isActive={active} />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <span className="shrink-0 pl-0.5">
              <svg className="w-4.5 h-4.5 text-slate-400 group-hover:text-slate-200 transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </span>
            <span className="truncate">View Site</span>
          </Link>
          <Link
            href="/api/auth/logout"
            prefetch={false}
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <span className="shrink-0 pl-0.5">
              <svg className="w-4.5 h-4.5 text-slate-400 group-hover:text-red-400 transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span className="truncate">Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
    );
  }

export default Sidebar;
