import Link from "next/link";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { SITE, WHATSAPP_LINK, MAIN_NAV } from "@/lib/constants";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M16.5 3c.3 2.3 1.6 3.8 3.9 4v2.6c-1.5.1-2.8-.4-3.9-1.2v6.1c0 3.5-2.4 5.9-5.7 5.9-3 0-5.3-2.2-5.3-5.3 0-2.9 2.2-5.1 5.2-5.1.3 0 .6 0 .9.1v2.7c-.3-.1-.6-.2-1-.2-1.5 0-2.6 1.1-2.6 2.6 0 1.5 1.1 2.6 2.6 2.6 1.7 0 2.8-1.2 2.8-3V3h3.1z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M13.5 21v-7h2.4l.4-2.7h-2.8V9.7c0-.8.2-1.3 1.4-1.3h1.5V6c-.3 0-1.3-.1-2.4-.1-2.3 0-3.9 1.4-3.9 4v1.4H8v2.7h2.1V21h3.4z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-pitch text-paper">
      <div className="container-max grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <p className="font-display text-2xl font-bold uppercase tracking-tight">{SITE.name}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-paper/60">
            {SITE.motto}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">{SITE.tagline}</p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ember-dark"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-paper/50">Shop</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {MAIN_NAV.slice(1, 8).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper/80 hover:text-ember transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-paper/50">Support</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="text-paper/80 hover:text-ember transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-paper/80 hover:text-ember transition-colors">Contact</Link></li>
            <li><Link href="/faq" className="text-paper/80 hover:text-ember transition-colors">FAQ</Link></li>
            <li><Link href="/delivery-policy" className="text-paper/80 hover:text-ember transition-colors">Delivery Policy</Link></li>
            <li><Link href="/returns-policy" className="text-paper/80 hover:text-ember transition-colors">Returns Policy</Link></li>
            <li><Link href="/privacy-policy" className="text-paper/80 hover:text-ember transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-paper/80 hover:text-ember transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-paper/50">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-paper/80">
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
              <a href={`mailto:${SITE.email}`} className="hover:text-ember transition-colors">{SITE.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-ember" />
              <a href={`tel:${SITE.phoneIntl}`} className="hover:text-ember transition-colors">{SITE.phone}</a>
            </li>
            <li className="flex items-center gap-4 pt-1">
              <a href={SITE.socialLinks.instagram || "#"} aria-label="Instagram" className="text-paper/70 hover:text-ember transition-colors">
                <InstagramIcon />
              </a>
              <a href={SITE.socialLinks.tiktok || "#"} aria-label="TikTok" className="text-paper/70 hover:text-ember transition-colors">
                <TikTokIcon />
              </a>
              <a href={SITE.socialLinks.facebook || "#"} aria-label="Facebook" className="text-paper/70 hover:text-ember transition-colors">
                <FacebookIcon />
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-paper/50">
            IG / TikTok / FB: {SITE.instagram}
          </p>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-max flex flex-col items-center justify-between gap-3 py-5 text-xs text-paper/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>{SITE.motto}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Prices in Kenyan Shillings (KSh)</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
