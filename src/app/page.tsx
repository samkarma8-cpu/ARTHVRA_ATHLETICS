import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/constants";
import {
  getCategories,
  getFeaturedProducts,
  getNewArrivals,
  getUnderPrice,
  getProductsByCategory,
} from "@/lib/queries";
import { ProductCard } from "@/components/product/ProductCard";

type CategoryItem = Awaited<ReturnType<typeof getCategories>>[number];
type ProductItem = Awaited<ReturnType<typeof getFeaturedProducts>>[number];

function SectionHeader({
  title,
  href,
  linkLabel = "View all",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <h2 className="section-title text-2xl sm:text-3xl">{title}</h2>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-ember transition-colors"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [categories, featured, newArrivals, under1000, gym, kids, familyGames]: [
    CategoryItem[],
    ProductItem[],
    ProductItem[],
    ProductItem[],
    ProductItem[],
    [ProductItem[], ProductItem[]],
    ProductItem[],
  ] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getNewArrivals(8),
    getUnderPrice(8, 1000),
    getProductsByCategory("gym-fitness", 8),
    Promise.all([
      getProductsByCategory("kids-sports", 4),
      getProductsByCategory("kids-toys", 4),
    ]),
    getProductsByCategory("board-games", 4),
  ]);

  const kidsPicks: ProductItem[] = [...(kids[0] ?? []), ...(kids[1] ?? [])].slice(0, 8);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section
        className="relative overflow-hidden bg-pitch text-paper"
        style={{
          backgroundImage: "url('/hero-bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container-max relative z-10 flex min-h-[70vh] flex-col items-start justify-center py-16 sm:min-h-[78vh]">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">
            {SITE.motto}
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            {SITE.name.split(" ")[0]}
            <span className="block text-ember">Athletics</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/80 sm:text-lg">
            {SITE.tagline}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="btn btn-ember px-7 py-3.5 text-sm rounded-full">
              Shop Now
            </Link>
            <Link
              href="/shop"
              className="btn btn-outline px-7 py-3.5 text-sm rounded-full border-paper/60 text-paper hover:bg-paper hover:text-ink"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED CATEGORIES ===================== */}
      <section className="py-14 sm:py-20">
        <div className="container-max">
          <SectionHeader title="Featured Categories" href="/shop" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl bg-mist p-5 text-center transition-colors hover:bg-ember hover:text-white"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-ink text-sm font-bold uppercase transition-colors group-hover:bg-white/20 group-hover:text-white">
                  {cat.name.slice(0, 2)}
                </span>
                <span className="text-sm font-semibold leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BEST SELLERS ===================== */}
      <section className="py-6 sm:py-10">
        <div className="container-max">
          <SectionHeader title="Best Sellers" href="/shop" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TRENDING / UNDER 1000 ===================== */}
      <section className="py-6 sm:py-10">
        <div className="container-max">
          <SectionHeader title="Popular Under KSh 1,000" href="/deals" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {under1000.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FITNESS ESSENTIALS ===================== */}
      <section className="py-6 sm:py-10">
        <div className="container-max">
          <SectionHeader title="Fitness Essentials" href="/category/gym-fitness" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {gym.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== KIDS' PICKS ===================== */}
      <section className="py-6 sm:py-10">
        <div className="container-max">
          <SectionHeader title="Kids' Picks" href="/category/kids-sports" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {kidsPicks.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FAMILY GAMES ===================== */}
      <section className="py-6 sm:py-10">
        <div className="container-max">
          <SectionHeader title="Family Games" href="/category/board-games" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {familyGames.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== NEW ARRIVALS ===================== */}
      <section className="py-6 sm:py-10 pb-20">
        <div className="container-max">
          <SectionHeader title="New Arrivals" href="/shop?sort=newest" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== VALUE PROPS ===================== */}
      <section className="bg-mist py-14">
        <div className="container-max grid gap-8 sm:grid-cols-3">
          {[
            { title: "Made for Kenya", text: "Priced and sized for the Kenyan market." },
            { title: "Fast Delivery", text: "Affordable delivery across Nairobi, Kiambu and beyond." },
            { title: "WhatsApp Support", text: `Talk to us on WhatsApp at ${SITE.phone}.` },
          ].map((v) => (
            <div key={v.title} className="text-center">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight">{v.title}</h3>
              <p className="mt-2 text-sm text-ash">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}