"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { cn, formatKsh } from "@/lib/utils";
import { useCart } from "@/store/cart";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  image: string;
  imageAlt: string;
  outOfStock: boolean;
  lowStock: boolean;
  isPreOrder: boolean;
}

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const hydrated = useHydrated();
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const items = useCart((s) => s.items);

  const inCart = hydrated && items.some((i) => i.productId === product.id);
  const onSale =
    product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const handleAdd = () => {
    if (product.outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.image,
      stockQuantity: product.outOfStock ? 0 : 999,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-mist"
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {onSale && (
            <span className="badge badge-sale">Sale</span>
          )}
          {product.outOfStock && (
            <span className="badge badge-out">Out of Stock</span>
          )}
          {product.lowStock && !product.outOfStock && (
            <span className="badge bg-amber-600 text-white">Low Stock</span>
          )}
          {product.isPreOrder && (
            <span className="badge bg-indigo-600 text-white">Pre-Order</span>
          )}
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-medium leading-snug hover:text-ember transition-colors">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            {onSale ? (
              <>
                <span className="text-base font-bold">{formatKsh(product.discountPrice)}</span>
                <span className="text-xs text-slant line-through">{formatKsh(product.price)}</span>
              </>
            ) : (
              <span className="text-base font-bold">{formatKsh(product.price)}</span>
            )}
          </div>
          <button
            type="button"
            aria-label={added ? "Added to cart" : "Add to cart"}
            disabled={product.outOfStock || !hydrated}
            onClick={handleAdd}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
              product.outOfStock
                ? "bg-mist text-slant cursor-not-allowed"
                : "bg-ink text-paper hover:bg-ember"
            )}
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          </button>
        </div>
        {inCart && (
          <span className="mt-1 text-[11px] font-medium text-ember">In cart</span>
        )}
      </div>
    </div>
  );
}
