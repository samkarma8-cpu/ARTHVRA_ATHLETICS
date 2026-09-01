import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { productSelect, mapProduct, type MappedProduct } from "@/lib/queries";
import { ProductCard } from "@/components/product/ProductCard";
import { CATEGORY_SEEDS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shop All — Gym, Training, Running, Kids & Games",
  description:
    "Browse all gym equipment, training gear, running & athletics accessories, kids sports, kids toys and board games in Kenya.",
};

interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
  min?: string;
  max?: string;
  availability?: string;
}

function buildWhere(params: SearchParams) {
  const where: any = { status: "ACTIVE" };
  if (params.q) {
    where.OR = [
      { name: { contains: params.q } },
      { description: { contains: params.q } },
      { sku: { contains: params.q } },
      { subcategory: { contains: params.q } },
    ];
  }
  if (params.category) {
    where.category = { slug: params.category };
  }
  const min = params.min ? parseFloat(params.min) : undefined;
  const max = params.max ? parseFloat(params.max) : undefined;
  if (min !== undefined || max !== undefined) {
    where.sellingPrice = {};
    if (min !== undefined) where.sellingPrice.gte = min;
    if (max !== undefined) where.sellingPrice.lte = max;
  }
  if (params.availability === "in-stock") {
    where.stockQuantity = { gt: 0 };
  } else if (params.availability === "out-of-stock") {
    where.stockQuantity = { lte: 0 };
  }
  return where;
}

function buildOrderBy(sort?: string) {
  switch (sort) {
    case "price-asc":
      return [{ sellingPrice: "asc" as const }];
    case "price-desc":
      return [{ sellingPrice: "desc" as const }];
    case "newest":
      return [{ createdAt: "desc" as const }];
    case "featured":
      return [{ isFeatured: "desc" as const }, { createdAt: "desc" as const }];
    default:
      return [{ createdAt: "desc" as const }];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const where = buildWhere(params);
  const products = await prisma.product.findMany({
    where,
    orderBy: buildOrderBy(params.sort) as any,
    select: productSelect,
  });
  const mapped: MappedProduct[] = products.map(mapProduct);
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const activeCategory = params.category;
  const sort = params.sort || "newest";

  return (
    <div className="container-max py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Shop
        </h1>
        <p className="mt-2 text-sm text-ash">
          {mapped.length} product{mapped.length === 1 ? "" : "s"}
          {params.q ? ` for "${params.q}"` : ""}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <form className="space-y-6">
            {/* Search */}
            <div>
              <label className="label">Search</label>
              <input
                name="q"
                defaultValue={params.q}
                placeholder="Search products, SKU…"
                className="input"
              />
            </div>

            {/* Category */}
            <div>
              <label className="label">Category</label>
              <select name="category" defaultValue={activeCategory || ""} className="input">
                <option value="">All categories</option>
                {CATEGORY_SEEDS.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="label">Price (KSh)</label>
              <div className="flex gap-2">
                <input name="min" type="number" defaultValue={params.min} placeholder="Min" className="input" />
                <input name="max" type="number" defaultValue={params.max} placeholder="Max" className="input" />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="label">Availability</label>
              <select name="availability" defaultValue={params.availability || ""} className="input">
                <option value="">All</option>
                <option value="in-stock">In stock</option>
                <option value="out-of-stock">Out of stock</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="label">Sort by</label>
              <select name="sort" defaultValue={sort} className="input">
                <option value="newest">Newest</option>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary flex-1 px-4 py-2.5 text-sm rounded-lg">
                Apply
              </button>
              <Link href="/shop" className="btn btn-ghost px-4 py-2.5 text-sm rounded-lg">
                Reset
              </Link>
            </div>
          </form>
        </aside>

        {/* Results */}
        <div>
          {mapped.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-mist text-center">
              <p className="text-lg font-semibold">No products found</p>
              <p className="mt-1 text-sm text-ash">Try adjusting your filters or search.</p>
              <Link href="/shop" className="btn btn-outline mt-5 px-5 py-2.5 text-sm rounded-lg">
                View all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {mapped.map((p: MappedProduct) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
