"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE, MAIN_NAV, WHATSAPP_LINK } from "@/lib/constants";
import { useCart, cartCount } from "@/store/cart";

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

function CartBadge() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const count = hydrated ? cartCount(items) : 0;
  return (
    <span className="relative inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-mist transition-colors">
      <ShoppingBag className="h-5 w-5" aria-hidden />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
      <span className="sr-only">Cart ({count})</span>
    </span>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const hydrated = useHydrated();

  return (
    <header className="sticky top-0 z-50 w-full bg-paper/95 backdrop-blur border-b border-line">
      {/* Announcement bar */}
      <div className="bg-pitch text-paper">
        <div className="container-max flex h-9 items-center justify-between gap-4 text-[11px] font-medium uppercase tracking-wider">
          <span className="truncate">{SITE.motto}</span>
          <Link href="/deals" className="hidden sm:inline-flex items-center gap-1 text-paper/90 hover:text-ember transition-colors">
            Free delivery on qualifying orders — Shop Deals
          </Link>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-paper/90 hover:text-ember transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-max flex h-16 items-center justify-between gap-4">
        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="Open menu"
          className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-mist transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-line bg-pitch shadow-sm">
            <Image
              src="/logo-mark.svg"
              alt="ARTHVRA ATHLETICS logo"
              width={28}
              height={28}
              className="object-cover"
            />
          </span>
          <span className="font-display text-xl font-bold tracking-tight uppercase">
            {SITE.name.split(" ")[0]}
          </span>
          <span className="hidden sm:inline-block h-5 w-px bg-line" />
          <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-ash">
            Athletics
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-ink">
          {MAIN_NAV.slice(0, 8).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:text-ember transition-colors",
                pathname === item.href && "text-ember"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link href="/shop" aria-label="Search" className="inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-mist transition-colors">
            <Search className="h-5 w-5" aria-hidden />
          </Link>
          <Link href="/account" aria-label="Account" className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-mist transition-colors">
            <User className="h-5 w-5" aria-hidden />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-mist transition-colors">
            <Heart className="h-5 w-5" aria-hidden />
          </Link>
          <Link href="/cart" aria-label="Cart" className="inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-mist transition-colors">
            <CartBadge />
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-line bg-paper">
          <div className="container-max py-4">
            <div className="grid grid-cols-1 gap-1">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-2 py-3 text-base font-medium hover:bg-mist rounded-lg transition-colors",
                    pathname === item.href && "text-ember"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 border-t border-line pt-4">
              <Link href="/account" className="btn btn-ghost text-sm px-3 py-2 rounded-lg">
                <User className="h-4 w-4" /> Account
              </Link>
              <Link href="/wishlist" className="btn btn-ghost text-sm px-3 py-2 rounded-lg">
                <Heart className="h-4 w-4" /> Wishlist
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
