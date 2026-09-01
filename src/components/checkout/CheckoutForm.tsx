"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { useCart, cartSubtotal, effectivePrice } from "@/store/cart";
import { formatKsh } from "@/lib/utils";
import { SITE } from "@/lib/constants";

type Zone = {
  id: string;
  name: string;
  fee: number;
  estimatedDelivery: string | null;
  freeDeliveryThreshold: number | null;
};

type Address = {
  id: string;
  fullName: string;
  phone: string;
  county: string;
  town: string;
  area: string | null;
  deliveryAddress: string;
  deliveryInstructions: string | null;
};

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function CheckoutForm({
  user,
  zones,
  addresses,
}: {
  user: { name: string; email: string; phone: string | null };
  zones: Zone[];
  addresses: Address[];
}) {
  const hydrated = useHydrated();
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const subtotal = hydrated ? cartSubtotal(items) : 0;

  const [deliveryName, setDeliveryName] = useState(user.name);
  const [deliveryPhone, setDeliveryPhone] = useState(user.phone || "");
  const [deliveryCounty, setDeliveryCounty] = useState("");
  const [deliveryTown, setDeliveryTown] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [deliveryZoneId, setDeliveryZoneId] = useState(zones[0]?.id || "");
  const [paymentMethod, setPaymentMethod] = useState<"MPESA" | "BANK">("MPESA");
  const [saveAddress, setSaveAddress] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const zone = useMemo(
    () => zones.find((z) => z.id === deliveryZoneId) ?? zones[0],
    [zones, deliveryZoneId]
  );
  const threshold = zone?.freeDeliveryThreshold ?? 0;
  const deliveryFee = zone
    ? threshold > 0 && subtotal >= threshold
      ? 0
      : zone.fee
    : 0;
  const total = subtotal + deliveryFee;

  const applyAddress = (a: Address) => {
    setDeliveryName(a.fullName);
    setDeliveryPhone(a.phone);
    setDeliveryCounty(a.county);
    setDeliveryTown(a.town);
    setDeliveryArea(a.area || "");
    setDeliveryAddress(a.deliveryAddress);
    setDeliveryInstructions(a.deliveryInstructions || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          deliveryZoneId,
          deliveryName,
          deliveryPhone,
          deliveryCounty,
          deliveryTown,
          deliveryArea,
          deliveryAddress,
          deliveryInstructions,
          paymentMethod,
          saveAddress,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not place this order.");
        return;
      }
      clear();
      router.push(`/account/orders/${data.order.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) {
    return <PageHeader title="Checkout" description="Preparing your order…" />;
  }

  if (items.length === 0) {
    return (
      <div>
        <PageHeader title="Checkout" />
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl bg-mist text-center">
          <p className="text-lg font-semibold">Your cart is empty</p>
          <Link href="/shop" className="btn btn-ember mt-5 px-6 py-3 text-sm rounded-full">
            Shop now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Checkout" description="Delivery details and payment." />
      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {addresses.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider">Saved addresses</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {addresses.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => applyAddress(a)}
                    className="rounded-xl border border-line bg-paper p-4 text-left text-sm hover:border-ink"
                  >
                    <p className="font-semibold">{a.fullName}</p>
                    <p className="mt-1 text-ash">
                      {a.deliveryAddress}, {a.town}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider">Delivery details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="deliveryName">
                  Full name
                </label>
                <input
                  id="deliveryName"
                  required
                  value={deliveryName}
                  onChange={(e) => setDeliveryName(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="deliveryPhone">
                  Phone
                </label>
                <input
                  id="deliveryPhone"
                  required
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                  className="input"
                  placeholder="07xxxxxxxx"
                />
              </div>
              <div>
                <label className="label" htmlFor="deliveryCounty">
                  County
                </label>
                <input
                  id="deliveryCounty"
                  required
                  value={deliveryCounty}
                  onChange={(e) => setDeliveryCounty(e.target.value)}
                  className="input"
                  placeholder="Nairobi"
                />
              </div>
              <div>
                <label className="label" htmlFor="deliveryTown">
                  Town
                </label>
                <input
                  id="deliveryTown"
                  required
                  value={deliveryTown}
                  onChange={(e) => setDeliveryTown(e.target.value)}
                  className="input"
                  placeholder="Westlands"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="deliveryArea">
                Area / estate (optional)
              </label>
              <input
                id="deliveryArea"
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="deliveryAddress">
                Delivery address
              </label>
              <textarea
                id="deliveryAddress"
                required
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="input min-h-[96px]"
                placeholder="Building, street, landmark"
              />
            </div>
            <div>
              <label className="label" htmlFor="deliveryInstructions">
                Delivery instructions (optional)
              </label>
              <input
                id="deliveryInstructions"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                className="input"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
              />
              Save this address for next time
            </label>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider">Delivery zone</h2>
            <div className="grid gap-2">
              {zones.map((z) => (
                <label
                  key={z.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 has-[:checked]:border-ink"
                >
                  <input
                    type="radio"
                    name="zone"
                    checked={deliveryZoneId === z.id}
                    onChange={() => setDeliveryZoneId(z.id)}
                    className="mt-1"
                  />
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-3 text-sm font-semibold">
                      <span>{z.name}</span>
                      <span>{formatKsh(z.fee)}</span>
                    </span>
                    <span className="mt-1 block text-xs text-ash">
                      {z.estimatedDelivery}
                      {z.freeDeliveryThreshold
                        ? ` · Free over ${formatKsh(z.freeDeliveryThreshold)}`
                        : ""}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider">Payment</h2>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 has-[:checked]:border-ink">
              <input
                type="radio"
                name="pay"
                checked={paymentMethod === "MPESA"}
                onChange={() => setPaymentMethod("MPESA")}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-semibold">M-Pesa</span>
                <span className="mt-1 block text-xs text-ash">
                  Send to {SITE.phone} after placing the order. Use your order number as the
                  reference.
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 has-[:checked]:border-ink">
              <input
                type="radio"
                name="pay"
                checked={paymentMethod === "BANK"}
                onChange={() => setPaymentMethod("BANK")}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-semibold">Pay via bank</span>
                <span className="mt-1 block text-xs text-ash">
                  Bank details are shown on the confirmation page. WhatsApp us once paid.
                </span>
              </span>
            </label>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-mist p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider">Your order</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3">
                <span className="text-ash">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium">
                  {formatKsh(effectivePrice(item) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ash">Subtotal</span>
              <span>{formatKsh(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ash">Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : formatKsh(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatKsh(total)}</span>
            </div>
          </div>
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-ember mt-6 w-full px-5 py-3 text-sm rounded-full disabled:opacity-60"
          >
            {loading ? "Placing order…" : "Place order"}
          </button>
          <p className="mt-3 text-center text-xs text-ash">
            Signed in as {user.email}
          </p>
        </aside>
      </form>
    </div>
  );
}
