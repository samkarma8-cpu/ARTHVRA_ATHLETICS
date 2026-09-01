import Link from "next/link";
import { ProductCard, type ProductCardData } from "./ProductCard";

export function ProductGrid({
  products,
  emptyTitle = "No products found",
  emptyText = "Try another category or browse the full shop.",
}: {
  products: ProductCardData[];
  emptyTitle?: string;
  emptyText?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl bg-mist px-6 text-center">
        <p className="text-lg font-semibold">{emptyTitle}</p>
        <p className="mt-1 text-sm text-ash">{emptyText}</p>
        <Link href="/shop" className="btn btn-outline mt-5 px-5 py-2.5 text-sm rounded-lg">
          View all products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
