import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "FAQ" };

const FAQS = [
  {
    q: "Where do you deliver?",
    a: "We deliver across Kenya. Nairobi and Kiambu are typically 1–3 business days. Other regions take longer depending on the courier.",
  },
  {
    q: "How do I pay?",
    a: `Pay via M-Pesa to ${SITE.phone} using your order number as the reference, or request bank details on WhatsApp. Your order is confirmed once payment is received.`,
  },
  {
    q: "When is delivery free?",
    a: "Free delivery applies when your subtotal meets the threshold for your delivery zone. Thresholds are shown at checkout.",
  },
  {
    q: "Can I return an item?",
    a: "Unused items in original packaging can be returned within 7 days of delivery. See the returns policy for details.",
  },
  {
    q: "Do you hold stock?",
    a: "Most products are in stock. Pre-order items show a lead time on the product page.",
  },
];

export default function FaqPage() {
  return (
    <div className="container-max max-w-3xl py-8 sm:py-12">
      <PageHeader title="FAQ" description="Common questions about shopping with ARTHVRA." />
      <dl className="space-y-6">
        {FAQS.map((item) => (
          <div key={item.q} className="border-b border-line pb-6">
            <dt className="font-semibold">{item.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-ash">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
