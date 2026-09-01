import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatKsh } from "@/lib/utils";

export const metadata: Metadata = { title: "Products — Admin" };

export default async function AdminProductsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login?next=/admin/products");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-wider text-ash">
            <th className="py-3 pr-4">Product</th>
            <th className="py-3 pr-4">Category</th>
            <th className="py-3 pr-4">Price</th>
            <th className="py-3 pr-4">Stock</th>
            <th className="py-3 pr-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-line">
              <td className="py-3 pr-4">
                <Link href={`/product/${p.slug}`} className="font-semibold hover:text-ember">
                  {p.name}
                </Link>
                <p className="text-xs text-ash">{p.sku}</p>
              </td>
              <td className="py-3 pr-4">{p.category.name}</td>
              <td className="py-3 pr-4">
                {p.discountPrice ? (
                  <>
                    {formatKsh(p.discountPrice)}{" "}
                    <span className="text-xs text-slant line-through">
                      {formatKsh(p.sellingPrice)}
                    </span>
                  </>
                ) : (
                  formatKsh(p.sellingPrice)
                )}
              </td>
              <td className="py-3 pr-4">{p.stockQuantity}</td>
              <td className="py-3 pr-4">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
