import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description: "ARTHVRA ATHLETICS — fitness, training, running, play and everyday movement.",
};

export default function AboutPage() {
  return (
    <div className="container-max max-w-3xl py-8 sm:py-12">
      <PageHeader title="About us" description={SITE.motto} />
      <div className="space-y-5 text-sm leading-relaxed text-ash">
        <p>
          {SITE.name} is a Kenyan store for people who train, run, play and stay active. We stock
          gym and fitness accessories, training equipment, running gear, kids sports, kids toys
          and board games — priced for the local market and delivered across Kenya.
        </p>
        <p>
          {SITE.tagline} Whether you are setting up a home gym, coaching a team, or looking for
          something the whole family can use, the aim is the same: useful gear, honest prices,
          and support you can actually reach.
        </p>
        <p>
          Questions? WhatsApp us on {SITE.phone} or email{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-ink hover:text-ember">
            {SITE.email}
          </a>
          .
        </p>
      </div>
      <Link href="/shop" className="btn btn-ember mt-8 px-6 py-3 text-sm rounded-full">
        Shop the collection
      </Link>
    </div>
  );
}
