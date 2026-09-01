import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatKsh } from "@/lib/utils";
import { SITE, WHATSAPP_LINK, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Order" };

function labelOf(
  list: readonly { value: string; label: string }[],
  value: string
) {
  return list.find((s) => s.value === value)?.label || value;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  if (!user) redirect("/login?next=/account");

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: true, deliveryZone: true },
  });
  if (!order) notFound();

  const waText = encodeURIComponent(
    `Hi ARTHVRA, I have paid for order ${order.orderNumber} (${formatKsh(order.total)}).`
  );

  return (
    <div className="container-max py-8 sm:py-12">
      <nav className="mb-6 text-sm text-ash">
        <Link href="/account" className="hover:text-ink">
          Account
        </Link>{" "}
        / {order.orderNumber}
      </nav>
      <PageHeader
        title={order.orderNumber}
        description={`${labelOf(ORDER_STATUSES, order.status)} · ${labelOf(PAYMENT_STATUSES, order.paymentStatus)}`}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider">Items</h2>
            <ul className="mt-4 divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 py-3 text-sm">
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-medium">{formatKsh(item.totalPrice)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-line p-5 text-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider">Delivery</h2>
            <p className="mt-3 font-semibold">{order.deliveryName}</p>
            <p className="mt-1 text-ash">
              {order.deliveryAddress}
              <br />
              {order.deliveryTown}, {order.deliveryCounty}
              {order.deliveryArea ? ` · ${order.deliveryArea}` : ""}
              <br />
              {order.deliveryPhone}
            </p>
            {order.deliveryZone && (
              <p className="mt-3 text-ash">
                Zone: {order.deliveryZone.name}
                {order.deliveryZone.estimatedDelivery
                  ? ` · ${order.deliveryZone.estimatedDelivery}`
                  : ""}
              </p>
            )}
          </section>
        </div>

        <aside className="h-fit space-y-4">
          <div className="rounded-2xl bg-mist p-5 text-sm">
            <div className="flex justify-between">
              <span className="text-ash">Subtotal</span>
              <span>{formatKsh(order.subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-ash">Delivery</span>
              <span>{order.deliveryFee === 0 ? "Free" : formatKsh(order.deliveryFee)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-line pt-3 text-base font-bold">
              <span>Total</span>
              <span>{formatKsh(order.total)}</span>
            </div>
          </div>

          {order.paymentStatus !== "PAID" && (
            <div className="rounded-2xl border border-line p-5 text-sm">
              <h2 className="font-bold uppercase tracking-wider">How to pay</h2>
              {order.paymentMethod === "MPESA" ? (
                <p className="mt-3 text-ash leading-relaxed">
                  Send <strong className="text-ink">{formatKsh(order.total)}</strong> via M-Pesa
                  to <strong className="text-ink">{SITE.phone}</strong>. Use{" "}
                  <strong className="text-ink">{order.orderNumber}</strong> as the reference.
                </p>
              ) : (
                <p className="mt-3 text-ash leading-relaxed">
                  Bank transfer details will be confirmed on WhatsApp. Quote{" "}
                  <strong className="text-ink">{order.orderNumber}</strong> and the amount{" "}
                  <strong className="text-ink">{formatKsh(order.total)}</strong>.
                </p>
              )}
              <a
                href={`${WHATSAPP_LINK}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ember mt-4 w-full px-4 py-2.5 text-sm rounded-full"
              >
                Confirm payment on WhatsApp
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
