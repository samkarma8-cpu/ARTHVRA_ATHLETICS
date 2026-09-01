"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useCart, cartSubtotal, effectivePrice } from "@/store/cart";
import { formatKsh } from "@/lib/utils";

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function CartView() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = hydrated ? cartSubtotal(items) : 0;

  if (!hydrated) {
    return (
      <div>
        <PageHeader title="Cart" description="Loading your bag…" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <PageHeader title="Cart" description="Your bag is empty." />
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl bg-mist text-center">
          <p className="text-lg font-semibold">Nothing here yet</p>
          <p className="mt-1 text-sm text-ash">Add gear from the shop to get started.</p>
          <Link href="/shop" className="btn btn-ember mt-5 px-6 py-3 text-sm rounded-full">
            Shop now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Cart"
        description={`${items.length} item${items.length === 1 ? "" : "s"} in your bag`}
      />
      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => {
            const unit = effectivePrice(item);
            return (
              <li key={item.productId} className="flex gap-4 py-5">
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-mist sm:h-28 sm:w-24"
                >
                  <Image
                    src={item.image || "/product-placeholder.svg"}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-semibold leading-snug hover:text-ember"
                    >
                      {item.name}
                    </Link>
                    <p className="shrink-0 text-sm font-bold">{formatKsh(unit * item.quantity)}</p>
                  </div>
                  <p className="mt-1 text-sm text-ash">{formatKsh(unit)} each</p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center rounded-lg border border-line">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center hover:bg-mist"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center hover:bg-mist"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-ash hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-2xl border border-line bg-mist p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ash">Subtotal</span>
              <span className="font-semibold">{formatKsh(subtotal)}</span>
            </div>
            <p className="text-xs text-ash">Delivery is calculated at checkout.</p>
          </div>
          <Link
            href="/checkout"
            className="btn btn-ember mt-6 w-full px-5 py-3 text-sm rounded-full"
          >
            Checkout
          </Link>
          <Link
            href="/shop"
            className="btn btn-ghost mt-2 w-full px-5 py-2.5 text-sm rounded-lg"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
