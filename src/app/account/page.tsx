import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatKsh } from "@/lib/utils";
import { LogoutButton } from "@/components/account/LogoutButton";
import { ORDER_STATUSES, PAYMENT_STATUSES, ADMIN_ROLE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Account",
};

function labelOf(
  list: readonly { value: string; label: string }[],
  value: string
) {
  return list.find((s) => s.value === value)?.label || value;
}

export default async function AccountPage() {
  const user = await requireUser();
  if (!user) redirect("/login?next=/account");

  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { items: true },
    }),
    prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="container-max py-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          title="Account"
          description={`Signed in as ${user.name} · ${user.email}`}
        />
        <div className="mb-8 flex gap-2">
          {user.role === ADMIN_ROLE && (
            <Link href="/admin" className="btn btn-outline px-4 py-2 text-sm rounded-lg">
              Admin
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider">Recent orders</h2>
            <Link href="/wishlist" className="text-sm font-semibold hover:text-ember">
              Wishlist
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="rounded-2xl bg-mist px-6 py-12 text-center">
              <p className="font-semibold">No orders yet</p>
              <Link href="/shop" className="btn btn-ember mt-4 px-5 py-2.5 text-sm rounded-full">
                Start shopping
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line rounded-2xl border border-line">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex flex-col gap-1 px-5 py-4 hover:bg-mist sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-ash">
                        {order.items.length} item{order.items.length === 1 ? "" : "s"} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-KE")}
                      </p>
                    </div>
                    <div className="text-sm sm:text-right">
                      <p className="font-bold">{formatKsh(order.total)}</p>
                      <p className="text-ash">
                        {labelOf(ORDER_STATUSES, order.status)} ·{" "}
                        {labelOf(PAYMENT_STATUSES, order.paymentStatus)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider">Saved addresses</h2>
          {addresses.length === 0 ? (
            <p className="rounded-2xl bg-mist px-5 py-8 text-sm text-ash">
              Addresses you save at checkout will appear here.
            </p>
          ) : (
            <ul className="space-y-3">
              {addresses.map((a) => (
                <li key={a.id} className="rounded-2xl border border-line p-4 text-sm">
                  <p className="font-semibold">{a.fullName}</p>
                  <p className="mt-1 text-ash">
                    {a.deliveryAddress}
                    <br />
                    {a.town}, {a.county}
                    <br />
                    {a.phone}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
