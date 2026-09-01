import type { Metadata } from "next";
import { getDealProducts } from "@/lib/queries";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";

export const metadata: Metadata = {
  title: "Deals",
  description: "On-sale gym, training, running, kids and game products at ARTHVRA ATHLETICS.",
};

export default async function DealsPage() {
  const products = await getDealProducts();

  return (
    <div className="container-max py-8 sm:py-12">
      <PageHeader
        title="Deals"
        description="Reduced prices on selected gear. Free delivery on qualifying orders."
      />
      <ProductGrid
        products={products}
        emptyTitle="No deals right now"
        emptyText="Check back soon, or browse the full shop."
      />
    </div>
  );
}
