import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";

const schema = z.object({
  status: z.enum(ORDER_STATUSES.map((s) => s.value) as [string, ...string[]]).optional(),
  paymentStatus: z
    .enum(PAYMENT_STATUSES.map((s) => s.value) as [string, ...string[]])
    .optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const updated = await prisma.order.update({
    where: { id },
    data: {
      ...(parsed.data.status ? { status: parsed.data.status } : {}),
      ...(parsed.data.paymentStatus ? { paymentStatus: parsed.data.paymentStatus } : {}),
    },
  });

  return NextResponse.json({ ok: true, order: updated });
}
