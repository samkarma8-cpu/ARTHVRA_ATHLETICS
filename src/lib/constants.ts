// ============================================================
// ARTHVRA ATHLETICS — Shared Constants & Site Configuration
// ============================================================

export const SITE = {
  name: "ARTHVRA ATHLETICS",
  motto: "MADE TO MOVE",
  tagline:
    "Fitness, training, running, play and everyday movement — all in one place.",
  email: "jgacara254@gmail.com",
  phone: "0745237413",
  phoneIntl: "+254745237413",
  whatsapp: "254745237413",
  instagram: "Arthvra Athletics",
  tiktok: "Arthvra Athletics",
  facebook: "Arthvra Athletics",
  socialLinks: {
    instagram: "",
    tiktok: "",
    facebook: "",
  },
  currency: "KES",
  currencySymbol: "KSh",
} as const;

export const WHATSAPP_LINK = `https://wa.me/${SITE.whatsapp}`;

export const DEFAULT_FREE_DELIVERY_THRESHOLD = 3500;
export const DEFAULT_STORE_EMAIL = SITE.email;

export const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "READY_FOR_DISPATCH", label: "Ready for Dispatch" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
] as const;

export const PAYMENT_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PAYMENT_INITIATED", label: "Payment Initiated" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
] as const;

export const PAYMENT_METHODS = [
  { value: "MPESA", label: "M-Pesa" },
  { value: "BANK", label: "Pay via Bank" },
] as const;

export const PRODUCT_STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

export const ANALYTICS_EVENT_TYPES = [
  "PRODUCT_VIEW",
  "SEARCH",
  "ADD_TO_CART",
  "REMOVE_FROM_CART",
  "CHECKOUT_STARTED",
  "PAYMENT_INITIATED",
  "ORDER_COMPLETED",
  "ABANDONED_CART",
] as const;

export interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  imageUrl?: string;
}

export const CATEGORY_SEEDS: CategorySeed[] = [
  { name: "Gym & Fitness", slug: "gym-fitness", description: "Resistance bands, skipping ropes, gym gloves, mats, rollers, shakers and everything for the gym.", sortOrder: 1 },
  { name: "Training", slug: "training", description: "Agility ladders, training cones, hurdles, marker discs and reaction equipment for serious training.", sortOrder: 2 },
  { name: "Running & Athletics", slug: "running-athletics", description: "Running belts, waist bags, socks, caps, headbands, hydration and reflective accessories.", sortOrder: 3 },
  { name: "Kids Sports", slug: "kids-sports", description: "Kids' sports bags, water bottles, skipping ropes and accessories to get little ones moving.", sortOrder: 4 },
  { name: "Kids Toys", slug: "kids-toys", description: "Affordable, educational and building toys for play and development.", sortOrder: 5 },
  { name: "Board Games", slug: "board-games", description: "Family board games, strategy and educational games for game night.", sortOrder: 6 },
];

export interface DeliveryZoneSeed {
  name: string;
  fee: number;
  estimatedDelivery: string;
  freeDeliveryThreshold: number;
  sortOrder: number;
}

export const DELIVERY_ZONE_SEEDS: DeliveryZoneSeed[] = [
  { name: "Nairobi", fee: 250, estimatedDelivery: "1–3 business days", freeDeliveryThreshold: 5000, sortOrder: 1 },
  { name: "Kiambu", fee: 300, estimatedDelivery: "1–3 business days", freeDeliveryThreshold: 5000, sortOrder: 2 },
  { name: "Central Kenya", fee: 400, estimatedDelivery: "2–4 business days", freeDeliveryThreshold: 6000, sortOrder: 3 },
  { name: "Other regions in Kenya", fee: 500, estimatedDelivery: "3–6 business days", freeDeliveryThreshold: 7000, sortOrder: 4 },
];

export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Gym & Fitness", href: "/category/gym-fitness" },
  { label: "Training", href: "/category/training" },
  { label: "Running & Athletics", href: "/category/running-athletics" },
  { label: "Kids", href: "/category/kids-sports" },
  { label: "Kids Toys", href: "/category/kids-toys" },
  { label: "Board Games", href: "/category/board-games" },
  { label: "Deals", href: "/deals" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const MOBILE_NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/shop" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" },
  { label: "Account", href: "/account" },
];

export const AUTH_COOKIE_NAME = "arthvra_session";
export const CUSTOMER_ROLE = "CUSTOMER";
export const ADMIN_ROLE = "ADMIN";
