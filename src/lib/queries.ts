import { prisma } from "./prisma";

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isPreOrder: boolean;
  preOrderLeadTime: string | null;
  category: { id: string; name: string; slug: string };
  images: { url: string; alt: string | null }[];
  _count?: { reviews: number };
}

export const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  sellingPrice: true,
  discountPrice: true,
  stockQuantity: true,
  lowStockThreshold: true,
  isFeatured: true,
  isPreOrder: true,
  preOrderLeadTime: true,
  category: { select: { id: true, name: true, slug: true } },
  images: {
    select: { url: true, alt: true },
    orderBy: { sortOrder: "asc" as const },
    take: 1,
  },
  _count: { select: { reviews: true } },
};

export interface MappedProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isPreOrder: boolean;
  preOrderLeadTime: string | null;
  category: { id: string; name: string; slug: string };
  image: string;
  imageAlt: string;
  reviewCount: number;
  outOfStock: boolean;
  lowStock: boolean;
}

export function mapProduct(p: any): MappedProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.sellingPrice,
    discountPrice: p.discountPrice,
    stockQuantity: p.stockQuantity,
    lowStockThreshold: p.lowStockThreshold,
    isFeatured: p.isFeatured,
    isPreOrder: p.isPreOrder,
    preOrderLeadTime: p.preOrderLeadTime,
    category: p.category,
    image: p.images?.[0]?.url || "/product-placeholder.svg",
    imageAlt: p.images?.[0]?.alt || p.name,
    reviewCount: p._count?.reviews ?? 0,
    outOfStock: p.stockQuantity <= 0 && !p.isPreOrder,
    lowStock: p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold,
  };
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: productSelect,
  });
  return products.map(mapProduct);
}

export async function getNewArrivals(limit = 8) {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: productSelect,
  });
  return products.map(mapProduct);
}

export async function getBestSellers(limit = 8) {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: productSelect,
  });
  // In a real system this sorts by sales; for the trial use featured + random fallback
  return products.sort((a: any, b: any) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)).map(mapProduct);
}

/** Cheap / popular items under a price cap (e.g. KSh 1,000). */
export async function getUnderPrice(limit = 8, cap = 1000) {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", sellingPrice: { lte: cap } },
    orderBy: { sellingPrice: "asc" },
    take: limit,
    select: productSelect,
  });
  return products.map(mapProduct);
}

/** Products within a category by slug. */
export async function getProductsByCategory(slug: string, limit = 20) {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", category: { slug } },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: productSelect,
  });
  return products.map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, status: "ACTIVE" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      category: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!product) return null;
  const reviewCount = product.reviews.length;
  const avgRating =
    reviewCount > 0
      ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviewCount
      : 0;
  return {
    ...mapProduct(product),
    sku: product.sku,
    weight: product.weight,
    dimensions: product.dimensions,
    images: product.images,
    variants: product.variants,
    reviews: product.reviews,
    reviewCount,
    avgRating,
    outOfStock: product.stockQuantity <= 0 && !product.isPreOrder,
  };
}

export async function getRelatedProducts(slug: string, categoryId: string, limit = 4): Promise<MappedProduct[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", categoryId, slug: { not: slug } },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: productSelect,
  });
  return products.map(mapProduct);
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findFirst({
    where: { slug, isActive: true },
    include: { _count: { select: { products: true } } },
  });
}

export async function getDealProducts(limit?: number) {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      discountPrice: { not:null,gt:0},
    },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
    select: productSelect,
  });
  return products
    .map(mapProduct)
    .filter((p: MappedProduct) => p.discountPrice !== null && p.discountPrice < p.price);
}

export async function getDeliveryZones() {
  return prisma.deliveryZone.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}
