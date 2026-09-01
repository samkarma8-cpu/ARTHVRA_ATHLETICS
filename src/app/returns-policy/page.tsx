import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Returns Policy" };

export default function ReturnsPolicyPage() {
  return (
    <div className="container-max max-w-3xl py-8 sm:py-12">
      <PageHeader title="Returns policy" />
      <div className="space-y-4 text-sm leading-relaxed text-ash">
        <p>
          You may return unused items in original packaging within 7 days of delivery. Contact us
          on WhatsApp ({SITE.phone}) before sending anything back so we can confirm the return.
        </p>
        <p>
          We do not accept returns on used, damaged, or incomplete items, or on items returned
          without prior notice. Refunds are processed to the original payment method after we
          inspect the goods. Delivery fees are not refundable unless the item was faulty or we
          sent the wrong product.
        </p>
      </div>
    </div>
  );
}
