import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatKsh } from "@/lib/utils";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";
import { AdminOrderRow } from "@/components/admin/AdminOrderRow";

export const metadata: Metadata = { title: "Orders — Admin" };

export default async function AdminOrdersPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login?next=/admin/orders");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { name: true, email: true } }, items: true },
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-wider text-ash">
            <th className="py-3 pr-4">Order</th>
            <th className="py-3 pr-4">Customer</th>
            <th className="py-3 pr-4">Total</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Payment</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center text-ash">
                No orders yet.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <AdminOrderRow
                key={order.id}
                order={{
                  id: order.id,
                  orderNumber: order.orderNumber,
                  createdAt: order.createdAt.toISOString(),
                  total: order.total,
                  status: order.status,
                  paymentStatus: order.paymentStatus,
                  customerName: order.user.name,
                  customerEmail: order.user.email,
                  itemCount: order.items.length,
                }}
                orderStatuses={[...ORDER_STATUSES]}
                paymentStatuses={[...PAYMENT_STATUSES]}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
