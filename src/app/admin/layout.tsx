import Link from "next/link";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-max py-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Admin</h1>
        <nav className="flex gap-2">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-mist"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
