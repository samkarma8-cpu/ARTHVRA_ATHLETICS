import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getDeliveryZones } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your ARTHVRA ATHLETICS order.",
};

export default async function CheckoutPage() {
  const user = await requireUser();
  if (!user) redirect("/login?next=/checkout");

  const [zones, addresses] = await Promise.all([
    getDeliveryZones(),
    prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="container-max py-8 sm:py-12">
      <CheckoutForm
        user={{ name: user.name, email: user.email, phone: user.phone }}
        zones={zones.map((z) => ({
          id: z.id,
          name: z.name,
          fee: z.fee,
          estimatedDelivery: z.estimatedDelivery,
          freeDeliveryThreshold: z.freeDeliveryThreshold,
        }))}
        addresses={addresses.map((a) => ({
          id: a.id,
          fullName: a.fullName,
          phone: a.phone,
          county: a.county,
          town: a.town,
          area: a.area,
          deliveryAddress: a.deliveryAddress,
          deliveryInstructions: a.deliveryInstructions,
        }))}
      />
    </div>
  );
}
