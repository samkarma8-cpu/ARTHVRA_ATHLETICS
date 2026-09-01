"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/store/cart";
import { cn, formatKsh } from "@/lib/utils";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    image: string;
    stockQuantity: number;
    isPreOrder: boolean;
  };
}

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function ProductActions({ product }: ProductActionsProps) {
  const hydrated = useHydrated();
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const [goToCart, setGoToCart] = useState(false);

  const maxQty = product.isPreOrder ? 999 : Math.max(product.stockQuantity, 1);
  const outOfStock = product.stockQuantity <= 0 && !product.isPreOrder;
  const effective = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.image,
        stockQuantity: maxQty,
      },
      qty
    );
    setAdded(true);
    if (goToCart) {
      router.push("/cart");
    } else {
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="space-y-5">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl font-bold">
          {formatKsh(effective)}
        </span>
        {product.discountPrice && product.discountPrice < product.price && (
          <span className="text-lg text-slant line-through">
            {formatKsh(product.price)}
          </span>
        )}
      </div>

      {/* Stock status */}
      <div className="text-sm">
        {outOfStock ? (
          <span className="font-semibold text-red-600">Out of stock</span>
        ) : product.isPreOrder ? (
          <span className="font-semibold text-indigo-600">Available on pre-order</span>
        ) : (
          <span className="font-medium text-emerald-600">
            In stock — {product.stockQuantity} available
          </span>
        )}
      </div>

      {/* Quantity */}
      {!outOfStock && (
        <div className="flex items-center gap-3">
          <span className="label m-0">Quantity</span>
          <div className="inline-flex items-center rounded-lg border border-line">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center hover:bg-mist"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm font-semibold">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              className="flex h-10 w-10 items-center justify-center hover:bg-mist"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={outOfStock || !hydrated}
          onClick={handleAdd}
          className={cn(
            "btn btn-ember flex-1 px-6 py-3.5 text-sm rounded-full",
            outOfStock && "opacity-50 cursor-not-allowed"
          )}
        >
          {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          {added ? "Added to Cart" : "Add to Cart"}
        </button>
        <button
          type="button"
          disabled={outOfStock || !hydrated}
          onClick={() => { setGoToCart(true); handleAdd(); }}
          className={cn(
            "btn btn-outline px-6 py-3.5 text-sm rounded-full",
            outOfStock && "opacity-50 cursor-not-allowed"
          )}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
