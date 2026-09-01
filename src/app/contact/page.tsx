import type { Metadata } from "next";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { SITE, WHATSAPP_LINK } from "@/lib/constants";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to ARTHVRA ATHLETICS on WhatsApp, phone or email.",
};

export default function ContactPage() {
  return (
    <div className="container-max py-8 sm:py-12">
      <PageHeader
        title="Contact"
        description="We reply on WhatsApp fastest. Use the form and we will open a chat with your message."
      />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <ul className="space-y-4 text-sm">
          <li className="flex items-start gap-3 rounded-2xl bg-mist p-5">
            <MessageCircle className="mt-0.5 h-5 w-5 text-ember" />
            <div>
              <p className="font-semibold">WhatsApp</p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-ash hover:text-ember"
              >
                {SITE.phone}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-2xl bg-mist p-5">
            <Phone className="mt-0.5 h-5 w-5 text-ember" />
            <div>
              <p className="font-semibold">Phone</p>
              <a href={`tel:${SITE.phoneIntl}`} className="mt-1 inline-block text-ash hover:text-ember">
                {SITE.phone}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-2xl bg-mist p-5">
            <Mail className="mt-0.5 h-5 w-5 text-ember" />
            <div>
              <p className="font-semibold">Email</p>
              <a href={`mailto:${SITE.email}`} className="mt-1 inline-block text-ash hover:text-ember">
                {SITE.email}
              </a>
            </div>
          </li>
        </ul>
        <ContactForm />
      </div>
    </div>
  );
}
