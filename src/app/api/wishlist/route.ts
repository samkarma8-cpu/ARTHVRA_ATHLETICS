import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { mapProduct, productSelect } from "@/lib/queries";

const schema = z.object({ productId: z.string().min(1) });

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const rows = await prisma.wishlist.findMany({
    where: { userId: user.id, product: { status: "ACTIVE" } },
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: productSelect },
    },
  });

  return NextResponse.json({
    productIds: rows.map((r) => r.productId),
    products: rows.map((r) => mapProduct(r.product)),
  });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Product is required." }, { status: 400 });
  }

  const product = await prisma.product.findFirst({
    where: { id: parsed.data.productId, status: "ACTIVE" },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId: user.id, productId: product.id } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return NextResponse.json({ ok: true, inWishlist: false });
  }

  await prisma.wishlist.create({
    data: { userId: user.id, productId: product.id },
  });
  return NextResponse.json({ ok: true, inWishlist: true });
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "Product is required." }, { status: 400 });
  }
  await prisma.wishlist.deleteMany({
    where: { userId: user.id, productId },
  });
  return NextResponse.json({ ok: true, inWishlist: false });
}
