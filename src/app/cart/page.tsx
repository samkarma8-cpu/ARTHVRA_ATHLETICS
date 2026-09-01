import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your ARTHVRA ATHLETICS shopping cart.",
};

export default function CartPage() {
  return (
    <div className="container-max py-8 sm:py-12">
      <CartView />
    </div>
  );
}
