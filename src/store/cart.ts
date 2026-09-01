"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  sku?: string | null;
  price: number;
  discountPrice?: number | null;
  image?: string | null;
  stockQuantity: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const items = [...get().items];
        const existing = items.find((i) => i.productId === item.productId);
        if (existing) {
          existing.quantity = Math.min(existing.quantity + quantity, item.stockQuantity);
        } else {
          items.push({ ...item, quantity: Math.min(quantity, item.stockQuantity) });
        }
        set({ items });
      },
      removeItem: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      updateQuantity: (productId, quantity) => set({
        items: get().items.map((i) =>
          i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stockQuantity)) } : i
        ),
      }),
      clear: () => set({ items: [] }),
    }),
    { name: "arthvra-cart" }
  )
);

export function effectivePrice(item: CartItem): number {
  return item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.price
    ? item.discountPrice
    : item.price;
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + effectivePrice(item) * item.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
