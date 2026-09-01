import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Truck, ShieldCheck, RefreshCcw, MessageCircle } from "lucide-react";
import { getProductBySlug, getRelatedProducts, type MappedProduct } from "@/lib/queries";
import { formatKsh } from "@/lib/utils";
import { WHATSAPP_LINK } from "@/lib/constants";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductCard } from "@/components/product/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description?.slice(0, 160) || product.name,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related: MappedProduct[] = await getRelatedProducts(product.slug, product.category.id, 4);

  return (
    <div className="container-max py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ash">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li>/</li>
          <li>
            <Link href={`/category/${product.category.slug}`} className="hover:text-ink">
              {product.category.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <ProductGallery images={product.images} />

        {/* Info */}
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-ash">
            {product.category.name} · {product.reviewCount > 0 ? `${product.reviewCount} review${product.reviewCount === 1 ? "" : "s"}` : "New"}
          </p>

          {/* Ratings */}
          <div className="mt-3 flex items-center gap-2">
            {product.avgRating > 0 ? (
              <>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-4 w-4 ${n <= Math.round(product.avgRating) ? "fill-amber-500 text-amber-500" : "text-line"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-ash">{product.avgRating.toFixed(1)}</span>
              </>
            ) : (
              <span className="text-sm text-ash">No reviews yet</span>
            )}
          </div>

          <div className="mt-6">
            <ProductActions
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                discountPrice: product.discountPrice,
                image: product.images?.[0]?.url || "/product-placeholder.svg",
                stockQuantity: product.stockQuantity,
                isPreOrder: product.isPreOrder,
              }}
            />
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-8 border-t border-line pt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider">Description</h2>
              <p className="mt-3 text-sm leading-relaxed text-ash">{product.description}</p>
            </div>
          )}

          {/* Specs */}
          {(product.sku || product.weight || product.dimensions) && (
            <div className="mt-6 border-t border-line pt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider">Specifications</h2>
              <dl className="mt-3 space-y-2 text-sm">
                {product.sku && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ash">SKU</dt>
                    <dd className="font-medium">{product.sku}</dd>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ash">Weight</dt>
                    <dd className="font-medium">{product.weight}</dd>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ash">Dimensions</dt>
                    <dd className="font-medium">{product.dimensions}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Trust bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            {[
              { icon: Truck, label: "Delivery in Kenya" },
              { icon: ShieldCheck, label: "Secure checkout" },
              { icon: RefreshCcw, label: "Returns policy" },
              { icon: MessageCircle, label: "WhatsApp support" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 rounded-xl bg-mist p-3">
                <item.icon className="h-5 w-5 text-ember" />
                <span className="text-[11px] font-medium text-ash">{item.label}</span>
              </div>
            ))}
          </div>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-ember transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> Questions? Chat with us on WhatsApp
          </a>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title mb-6 text-2xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
