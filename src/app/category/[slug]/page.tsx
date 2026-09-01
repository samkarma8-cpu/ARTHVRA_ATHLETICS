import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: category.description || `Shop ${category.name} at ARTHVRA ATHLETICS.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(slug, 100);

  return (
    <div className="container-max py-8 sm:py-12">
      <nav className="mb-6 text-sm text-ash">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-ink">
              Shop
            </Link>
          </li>
          <li>/</li>
          <li className="text-ink">{category.name}</li>
        </ol>
      </nav>
      <PageHeader
        title={category.name}
        description={
          category.description ||
          `${products.length} product${products.length === 1 ? "" : "s"}`
        }
      />
      <ProductGrid products={products} emptyTitle={`No ${category.name} products yet`} />
    </div>
  );
}
