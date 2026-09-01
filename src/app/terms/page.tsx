import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="container-max max-w-3xl py-8 sm:py-12">
      <PageHeader title="Terms & conditions" />
      <div className="space-y-4 text-sm leading-relaxed text-ash">
        <p>
          By ordering from {SITE.name} you agree that product availability, prices and delivery
          estimates may change. An order is a request to buy; we accept it when payment is
          confirmed and we begin fulfilment.
        </p>
        <p>
          Images are illustrative. Colours and packaging may vary. Pre-order lead times are
          estimates. Kenyan law applies to these terms. For disputes, contact {SITE.email} or
          WhatsApp {SITE.phone} first so we can resolve the issue.
        </p>
      </div>
    </div>
  );
}
