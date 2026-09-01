import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="container-max max-w-3xl py-8 sm:py-12">
      <PageHeader title="Privacy policy" />
      <div className="space-y-4 text-sm leading-relaxed text-ash">
        <p>
          {SITE.name} collects the information you give us when you create an account, place an
          order, or contact us — typically your name, email, phone number and delivery address.
          We use this to fulfil orders, support you, and improve the shop.
        </p>
        <p>
          We do not sell your personal information. Payment confirmation may be shared with
          delivery partners so they can complete your order. You can ask us to update or delete
          your account by emailing {SITE.email}.
        </p>
      </div>
    </div>
  );
}
