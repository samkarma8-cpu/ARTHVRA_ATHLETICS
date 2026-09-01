import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Kenyan Shillings (KES/KSh).
 * Examples: 1250 -> "KSh 1,250", 1200.5 -> "KSh 1,200.50"
 */
export function formatKsh(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "KSh 0";
  }
  const value = Number(amount);
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    currencyDisplay: "symbol",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value).replace("KES", "KSh");
}

/** Create a URL-friendly slug from a string. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Generate a unique human-friendly order number. */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AV-${year}${month}${day}-${rand}`;
}

/** Generate a random hex token for password resets / M-Pesa references. */
export function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

/** Calculate estimated gross profit (admin-only). */
export function calcGrossProfit(
  sellingPrice: number,
  supplierCost: number,
  acquisitionCost: number,
  otherCosts = 0
): number {
  return sellingPrice - supplierCost - acquisitionCost - otherCosts;
}

/** Calculate margin percentage (admin-only). */
export function calcMarginPct(
  sellingPrice: number,
  supplierCost: number,
  acquisitionCost: number,
  otherCosts = 0
): number {
  const profit = calcGrossProfit(sellingPrice, supplierCost, acquisitionCost, otherCosts);
  if (sellingPrice <= 0) return 0;
  return (profit / sellingPrice) * 100;
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Get a date string in YYYY-MM-DD local format. */
export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}
