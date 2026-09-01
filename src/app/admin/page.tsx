import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatKsh } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminHomePage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login?next=/admin");

  const [productCount, orderCount, pendingPayments, paidOrders, users] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: { in: ["PENDING", "PAYMENT_INITIATED"] } } }),
    prisma.order.findMany({
      where: { paymentStatus: "PAID" },
      select: { total: true },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Products", value: String(productCount), href: "/admin/products" },
    { label: "Orders", value: String(orderCount), href: "/admin/orders" },
    { label: "Awaiting payment", value: String(pendingPayments), href: "/admin/orders" },
    { label: "Paid revenue", value: formatKsh(revenue), href: "/admin/orders" },
    { label: "Customers", value: String(users), href: "/admin" },
  ];

  return (
    <div>
      <p className="mb-6 text-sm text-ash">Signed in as {admin.email}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-line p-5 hover:border-ink"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-ash">{s.label}</p>
            <p className="mt-2 font-display text-2xl font-bold">{s.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
