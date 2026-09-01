import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { DELIVERY_ZONE_SEEDS, SITE } from "@/lib/constants";
import { formatKsh } from "@/lib/utils";

export const metadata: Metadata = { title: "Delivery Policy" };

export default function DeliveryPolicyPage() {
  return (
    <div className="container-max max-w-3xl py-8 sm:py-12">
      <PageHeader
        title="Delivery policy"
        description="How orders move from our store to you."
      />
      <div className="space-y-5 text-sm leading-relaxed text-ash">
        <p>
          Orders are packed after payment is confirmed. Delivery times start from the day we
          dispatch, not the day the order is placed.
        </p>
        <ul className="space-y-2">
          {DELIVERY_ZONE_SEEDS.map((z) => (
            <li key={z.name}>
              <strong className="text-ink">{z.name}</strong> — {formatKsh(z.fee)},{" "}
              {z.estimatedDelivery}. Free delivery from {formatKsh(z.freeDeliveryThreshold)}.
            </li>
          ))}
        </ul>
        <p>
          Please keep your phone on. If a courier cannot reach you, the order may be delayed.
          For help, WhatsApp {SITE.phone}.
        </p>
      </div>
    </div>
  );
}
