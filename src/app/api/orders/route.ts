import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { logEvent } from "@/lib/analytics";

const itemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

const schema = z.object({
  items: z.array(itemSchema).min(1, "Cart is empty"),
  deliveryZoneId: z.string().min(1, "Select a delivery zone"),
  deliveryName: z.string().min(2, "Name is required"),
  deliveryPhone: z.string().min(9, "Enter a valid phone number"),
  deliveryCounty: z.string().min(2, "County is required"),
  deliveryTown: z.string().min(2, "Town is required"),
  deliveryArea: z.string().optional(),
  deliveryAddress: z.string().min(4, "Delivery address is required"),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(["MPESA", "BANK"]),
  saveAddress: z.boolean().optional(),
});

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const zone = await prisma.deliveryZone.findFirst({
      where: { id: data.deliveryZoneId, isActive: true },
    });
    if (!zone) {
      return NextResponse.json({ error: "Invalid delivery zone." }, { status: 400 });
    }

    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    });
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products are no longer available." },
        { status: 400 }
      );
    }

    const qtyById = new Map(data.items.map((i) => [i.productId, i.quantity]));
    let subtotal = 0;
    const lineItems = products.map((p) => {
      const quantity = qtyById.get(p.id) ?? 0;
      const unitPrice =
        p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.sellingPrice
          ? p.discountPrice
          : p.sellingPrice;
      if (!p.isPreOrder && p.stockQuantity < quantity) {
        throw new Error(`${p.name} only has ${p.stockQuantity} in stock.`);
      }
      subtotal += unitPrice * quantity;
      return {
        productId: p.id,
        productName: p.name,
        productImage: p.images[0]?.url ?? null,
        sku: p.sku,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
        isPreOrder: p.isPreOrder,
      };
    });

    const threshold = zone.freeDeliveryThreshold ?? 0;
    const deliveryFee = threshold > 0 && subtotal >= threshold ? 0 : zone.fee;
    const total = subtotal + deliveryFee;

    const order = await prisma.$transaction(async (tx) => {
      let orderNumber = generateOrderNumber();
      for (let i = 0; i < 5; i++) {
        const clash = await tx.order.findUnique({ where: { orderNumber } });
        if (!clash) break;
        orderNumber = generateOrderNumber();
      }

      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          status: "PENDING",
          paymentStatus: "PAYMENT_INITIATED",
          paymentMethod: data.paymentMethod,
          subtotal,
          discountAmount: 0,
          deliveryFee,
          total,
          deliveryZoneId: zone.id,
          deliveryName: data.deliveryName,
          deliveryPhone: data.deliveryPhone,
          deliveryCounty: data.deliveryCounty,
          deliveryTown: data.deliveryTown,
          deliveryArea: data.deliveryArea || null,
          deliveryAddress: data.deliveryAddress,
          deliveryInstructions: data.deliveryInstructions || null,
          items: {
            create: lineItems.map(({ isPreOrder: _p, ...item }) => item),
          },
        },
        include: { items: true },
      });

      for (const line of lineItems) {
        if (line.isPreOrder) continue;
        await tx.product.update({
          where: { id: line.productId! },
          data: { stockQuantity: { decrement: line.quantity } },
        });
      }

      if (data.saveAddress) {
        await tx.address.create({
          data: {
            userId: user.id,
            fullName: data.deliveryName,
            phone: data.deliveryPhone,
            county: data.deliveryCounty,
            town: data.deliveryTown,
            area: data.deliveryArea || null,
            deliveryAddress: data.deliveryAddress,
            deliveryInstructions: data.deliveryInstructions || null,
            isDefault: false,
          },
        });
      }

      return created;
    });

    await logEvent({
      eventType: "ORDER_COMPLETED",
      userId: user.id,
      metadata: { orderId: order.id, orderNumber: order.orderNumber, total },
    });

    return NextResponse.json({ ok: true, order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    console.error("create order error", error);
    const clientError =
      message.includes("in stock") || message.includes("no longer available");
    return NextResponse.json(
      { error: clientError ? message : "Could not place this order. Please try again." },
      { status: clientError ? 400 : 500 }
    );
  }
}
