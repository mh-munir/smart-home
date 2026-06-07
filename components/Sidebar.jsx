import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/add-product", label: "Add Product" },
  { href: "/admin/hero-slider", label: "Hero Slider" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-64 bg-gray-900 text-white">
      <div className="p-6">
        <h2 className="mb-8 text-2xl font-bold">Admin Panel</h2>

        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded px-4 py-2 transition-colors hover:bg-orange-500"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/api/auth/logout"
            prefetch={false}
            className="block rounded px-4 py-2 transition-colors hover:bg-red-500"
          >
            Logout
          </Link>
        </nav>
      </div>
    </aside>
  );
}
