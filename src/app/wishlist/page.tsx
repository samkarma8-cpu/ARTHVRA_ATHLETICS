import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapProduct, productSelect } from "@/lib/queries";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";

export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const user = await requireUser();
  if (!user) redirect("/login?next=/wishlist");

  const rows = await prisma.wishlist.findMany({
    where: { userId: user.id, product: { status: "ACTIVE" } },
    orderBy: { createdAt: "desc" },
    include: { product: { select: productSelect } },
  });
  const products = rows.map((r) => mapProduct(r.product));

  return (
    <div className="container-max py-8 sm:py-12">
      <PageHeader
        title="Wishlist"
        description={
          products.length
            ? `${products.length} saved item${products.length === 1 ? "" : "s"}`
            : "Save products you want to come back to."
        }
      />
      <ProductGrid
        products={products}
        emptyTitle="Your wishlist is empty"
        emptyText="Tap the heart on a product to save it here."
      />
    </div>
  );
}
