"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatKsh } from "@/lib/utils";

export function AdminOrderRow({
  order,
  orderStatuses,
  paymentStatuses,
}: {
  order: {
    id: string;
    orderNumber: string;
    createdAt: string;
    total: number;
    status: string;
    paymentStatus: string;
    customerName: string;
    customerEmail: string;
    itemCount: number;
  };
  orderStatuses: { value: string; label: string }[];
  paymentStatuses: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [saving, setSaving] = useState(false);

  const patch = async (body: { status?: string; paymentStatus?: string }) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) return;
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr className="border-b border-line">
      <td className="py-3 pr-4">
        <p className="font-semibold">{order.orderNumber}</p>
        <p className="text-xs text-ash">
          {new Date(order.createdAt).toLocaleString("en-KE")} · {order.itemCount} item
          {order.itemCount === 1 ? "" : "s"}
        </p>
      </td>
      <td className="py-3 pr-4">
        <p>{order.customerName}</p>
        <p className="text-xs text-ash">{order.customerEmail}</p>
      </td>
      <td className="py-3 pr-4 font-semibold">{formatKsh(order.total)}</td>
      <td className="py-3 pr-4">
        <select
          value={status}
          disabled={saving}
          onChange={(e) => {
            setStatus(e.target.value);
            patch({ status: e.target.value });
          }}
          className="input py-2 text-xs"
        >
          {orderStatuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </td>
      <td className="py-3 pr-4">
        <select
          value={paymentStatus}
          disabled={saving}
          onChange={(e) => {
            setPaymentStatus(e.target.value);
            patch({ paymentStatus: e.target.value });
          }}
          className="input py-2 text-xs"
        >
          {paymentStatuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
