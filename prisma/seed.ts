import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  CATEGORY_SEEDS,
  DELIVERY_ZONE_SEEDS,
} from "../src/lib/constants";

const prisma = new PrismaClient();

// Map product slugs to image URLs (using picsum.photos for reliable placeholders)
const PRODUCT_IMAGES: Record<string, string> = {
  "resistance-bands-set": "https://picsum.photos/400/400?random=1",
  "skipping-rope-speed": "https://picsum.photos/400/400?random=2",
  "gym-gloves-pair": "https://picsum.photos/400/400?random=3",
  "wrist-wraps-pair": "https://picsum.photos/400/400?random=4",
  "shaker-bottle-600ml": "https://picsum.photos/400/400?random=5",
  "sports-water-bottle-1l": "https://picsum.photos/400/400?random=6",
  "gym-towel-microfibre": "https://picsum.photos/400/400?random=7",
  "foam-roller": "https://picsum.photos/400/400?random=8",
  "exercise-yoga-mat": "https://picsum.photos/400/400?random=9",
  "ab-roller": "https://picsum.photos/400/400?random=10",
  "push-up-bars-pair": "https://picsum.photos/400/400?random=11",
  "hand-gripper": "https://picsum.photos/400/400?random=12",
  "gym-duffel-bag": "https://picsum.photos/400/400?random=13",
  "training-cones-set": "https://picsum.photos/400/400?random=14",
  "agility-ladder": "https://picsum.photos/400/400?random=15",
  "training-hurdles-set": "https://picsum.photos/400/400?random=16",
  "marker-discs-set": "https://picsum.photos/400/400?random=17",
  "reaction-training-kit": "https://picsum.photos/400/400?random=18",
  "running-belt": "https://picsum.photos/400/400?random=19",
  "running-waist-bag": "https://picsum.photos/400/400?random=20",
  "running-socks-3pack": "https://picsum.photos/400/400?random=21",
  "sports-cap": "https://picsum.photos/400/400?random=22",
  "headband": "https://picsum.photos/400/400?random=23",
  "phone-armband": "https://picsum.photos/400/400?random=24",
  "reflective-armband-set": "https://picsum.photos/400/400?random=25",
  "kids-sports-bag": "https://picsum.photos/400/400?random=26",
  "kids-water-bottle": "https://picsum.photos/400/400?random=27",
  "kids-skipping-rope": "https://picsum.photos/400/400?random=28",
  "building-blocks-set": "https://picsum.photos/400/400?random=29",
  "educational-puzzle": "https://picsum.photos/400/400?random=30",
  "creative-activity-set": "https://picsum.photos/400/400?random=31",
  "family-board-game": "https://picsum.photos/400/400?random=32",
  "strategy-game": "https://picsum.photos/400/400?random=33",
  "basic-card-game": "https://picsum.photos/400/400?random=34",
};

const PLACEHOLDER = "/product-placeholder.svg";

interface SeedProduct {
  name: string;
  slug: string;
  categorySlug: string;
  subcategory: string;
  description: string;
  supplier: string;
  supplierCost: number;
  acquisitionCost: number;
  sellingPrice: number;
  discountPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  sku: string;
  weight?: string;
  dimensions?: string;
  isFeatured?: boolean;
  isPreOrder?: boolean;
  preOrderLeadTime?: string;
}

const PRODUCTS: SeedProduct[] = [
  // Gym & Fitness
  { name: "Resistance Bands Set (5-Pack)", slug: "resistance-bands-set", categorySlug: "gym-fitness", subcategory: "Resistance Bands", description: "Set of 5 latex resistance bands with different resistance levels for strength, rehab and mobility work.", supplier: "Sample Supplier", supplierCost: 400, acquisitionCost: 100, sellingPrice: 1200, discountPrice: 950, stockQuantity: 40, lowStockThreshold: 8, sku: "GYM-RB-001", weight: "0.5 kg", dimensions: "15 x 10 x 5 cm", isFeatured: true },
  { name: "Skipping Rope (Speed)", slug: "skipping-rope-speed", categorySlug: "gym-fitness", subcategory: "Skipping Ropes", description: "Adjustable speed skipping rope with ball-bearing handles for cardio and boxing training.", supplier: "Sample Supplier", supplierCost: 180, acquisitionCost: 40, sellingPrice: 650, discountPrice: 550, stockQuantity: 60, lowStockThreshold: 10, sku: "GYM-SR-002", weight: "0.3 kg", isFeatured: true },
  { name: "Gym Gloves (Pair)", slug: "gym-gloves-pair", categorySlug: "gym-fitness", subcategory: "Gym Gloves", description: "Padded gym gloves with wrist support for weightlifting and general strength training.", supplier: "Sample Supplier", supplierCost: 300, acquisitionCost: 80, sellingPrice: 900, stockQuantity: 50, lowStockThreshold: 10, sku: "GYM-GG-003", weight: "0.2 kg" },
  { name: "Wrist Wraps (Pair)", slug: "wrist-wraps-pair", categorySlug: "gym-fitness", subcategory: "Wrist Wraps", description: "Supportive wrist wraps for heavy pressing and pressing movements.", supplier: "Sample Supplier", supplierCost: 200, acquisitionCost: 50, sellingPrice: 700, stockQuantity: 45, lowStockThreshold: 8, sku: "GYM-WW-004", weight: "0.2 kg" },
  { name: "Shaker Bottle 600ml", slug: "shaker-bottle-600ml", categorySlug: "gym-fitness", subcategory: "Shaker Bottles", description: "Leak-proof shaker bottle with mixing ball for protein shakes and supplements.", supplier: "Sample Supplier", supplierCost: 220, acquisitionCost: 50, sellingPrice: 750, stockQuantity: 70, lowStockThreshold: 12, sku: "GYM-SB-005", weight: "0.25 kg" },
  { name: "Sports Water Bottle 1L", slug: "sports-water-bottle-1l", categorySlug: "gym-fitness", subcategory: "Sports Water Bottles", description: "BPA-free 1 litre sports water bottle with flip-cap and carry loop.", supplier: "Sample Supplier", supplierCost: 300, acquisitionCost: 60, sellingPrice: 950, discountPrice: 800, stockQuantity: 55, lowStockThreshold: 10, sku: "GYM-WB-006", weight: "0.3 kg" },
  { name: "Gym Towel (Microfibre)", slug: "gym-towel-microfibre", categorySlug: "gym-fitness", subcategory: "Gym Towels", description: "Quick-dry microfibre gym towel with zip pocket.", supplier: "Sample Supplier", supplierCost: 180, acquisitionCost: 40, sellingPrice: 600, stockQuantity: 65, lowStockThreshold: 10, sku: "GYM-GT-007", weight: "0.2 kg" },
  { name: "Foam Roller", slug: "foam-roller", categorySlug: "gym-fitness", subcategory: "Foam Rollers", description: "High-density foam roller for muscle recovery and self massage.", supplier: "Sample Supplier", supplierCost: 600, acquisitionCost: 150, sellingPrice: 1800, discountPrice: 1500, stockQuantity: 30, lowStockThreshold: 6, sku: "GYM-FR-008", weight: "1.2 kg", dimensions: "33 x 14 cm", isFeatured: true },
  { name: "Exercise / Yoga Mat", slug: "exercise-yoga-mat", categorySlug: "gym-fitness", subcategory: "Exercise & Yoga Mats", description: "Non-slip 6mm exercise and yoga mat with carry strap.", supplier: "Sample Supplier", supplierCost: 550, acquisitionCost: 120, sellingPrice: 1600, stockQuantity: 35, lowStockThreshold: 8, sku: "GYM-YM-009", weight: "1.5 kg", dimensions: "183 x 61 cm" },
  { name: "Ab Roller", slug: "ab-roller", categorySlug: "gym-fitness", subcategory: "Ab Rollers", description: "Ab roller with knee pad for core training.", supplier: "Sample Supplier", supplierCost: 350, acquisitionCost: 80, sellingPrice: 1100, stockQuantity: 40, lowStockThreshold: 8, sku: "GYM-AR-010", weight: "0.6 kg" },
  { name: "Push-up Bars (Pair)", slug: "push-up-bars-pair", categorySlug: "gym-fitness", subcategory: "Push-up Bars", description: "Ergonomic push-up stands for chest and arm training.", supplier: "Sample Supplier", supplierCost: 400, acquisitionCost: 90, sellingPrice: 1300, stockQuantity: 38, lowStockThreshold: 8, sku: "GYM-PB-011", weight: "0.9 kg" },
  { name: "Hand Gripper", slug: "hand-gripper", categorySlug: "gym-fitness", subcategory: "Hand Grippers", description: "Adjustable hand grip strengthener for forearm and grip training.", supplier: "Sample Supplier", supplierCost: 150, acquisitionCost: 30, sellingPrice: 550, stockQuantity: 80, lowStockThreshold: 15, sku: "GYM-HG-012", weight: "0.2 kg" },
  { name: "Gym Duffel Bag", slug: "gym-duffel-bag", categorySlug: "gym-fitness", subcategory: "Gym Bags", description: "Durable gym duffel bag with shoe compartment.", supplier: "Sample Supplier", supplierCost: 700, acquisitionCost: 150, sellingPrice: 2200, discountPrice: 1800, stockQuantity: 20, lowStockThreshold: 5, sku: "GYM-GB-013", weight: "0.8 kg", isFeatured: true },

  // Training
  { name: "Training Cones Set (6)", slug: "training-cones-set", categorySlug: "training", subcategory: "Training Cones", description: "Set of 6 agility training cones for drills and speed work.", supplier: "Sample Supplier", supplierCost: 250, acquisitionCost: 60, sellingPrice: 850, stockQuantity: 50, lowStockThreshold: 10, sku: "TRN-TC-014", weight: "0.4 kg" },
  { name: "Agility Ladder", slug: "agility-ladder", categorySlug: "training", subcategory: "Agility Ladders", description: "12-rung adjustable agility ladder with carry bag.", supplier: "Sample Supplier", supplierCost: 500, acquisitionCost: 120, sellingPrice: 1600, discountPrice: 1400, stockQuantity: 30, lowStockThreshold: 6, sku: "TRN-AL-015", weight: "1.0 kg", isFeatured: true },
  { name: "Training Hurdles Set (4)", slug: "training-hurdles-set", categorySlug: "training", subcategory: "Training Hurdles", description: "Set of 4 adjustable training hurdles for plyometric and footwork drills.", supplier: "Sample Supplier", supplierCost: 900, acquisitionCost: 200, sellingPrice: 2800, stockQuantity: 15, lowStockThreshold: 4, sku: "TRN-TH-016", weight: "2.5 kg" },
  { name: "Marker Discs Set (10)", slug: "marker-discs-set", categorySlug: "training", subcategory: "Marker Discs", description: "Set of 10 flat marker discs in assorted colours for drills.", supplier: "Sample Supplier", supplierCost: 200, acquisitionCost: 50, sellingPrice: 750, stockQuantity: 60, lowStockThreshold: 10, sku: "TRN-MD-017", weight: "0.3 kg" },
  { name: "Reaction Training Kit", slug: "reaction-training-kit", categorySlug: "training", subcategory: "Reaction Equipment", description: "Reaction training equipment to improve agility and response time.", supplier: "Sample Supplier", supplierCost: 800, acquisitionCost: 180, sellingPrice: 2600, discountPrice: 2300, stockQuantity: 0, lowStockThreshold: 5, sku: "TRN-RK-018", weight: "1.4 kg", isPreOrder: true, preOrderLeadTime: "7–10 days" },

  // Running & Athletics
  { name: "Running Belt", slug: "running-belt", categorySlug: "running-athletics", subcategory: "Running Belts", description: "Lightweight running belt with key pocket for phone and items.", supplier: "Sample Supplier", supplierCost: 250, acquisitionCost: 60, sellingPrice: 850, stockQuantity: 45, lowStockThreshold: 8, sku: "RUN-RB-019", weight: "0.2 kg" },
  { name: "Running Waist Bag", slug: "running-waist-bag", categorySlug: "running-athletics", subcategory: "Running Waist Bags", description: "Adjustable running waist bag with reflective details.", supplier: "Sample Supplier", supplierCost: 350, acquisitionCost: 80, sellingPrice: 1150, stockQuantity: 40, lowStockThreshold: 8, sku: "RUN-WB-020", weight: "0.3 kg" },
  { name: "Running Socks (3-Pack)", slug: "running-socks-3pack", categorySlug: "running-athletics", subcategory: "Running Socks", description: "Breathable running socks 3-pack with arch support.", supplier: "Sample Supplier", supplierCost: 200, acquisitionCost: 50, sellingPrice: 700, stockQuantity: 80, lowStockThreshold: 15, sku: "RUN-RS-021", weight: "0.2 kg" },
  { name: "Sports Cap", slug: "sports-cap", categorySlug: "running-athletics", subcategory: "Sports Caps", description: "Lightweight breathable sports cap with adjustable strap.", supplier: "Sample Supplier", supplierCost: 300, acquisitionCost: 70, sellingPrice: 950, stockQuantity: 50, lowStockThreshold: 10, sku: "RUN-SC-022", weight: "0.2 kg" },
  { name: "Headband", slug: "headband", categorySlug: "running-athletics", subcategory: "Headbands", description: "Moisture-wicking sports headband.", supplier: "Sample Supplier", supplierCost: 120, acquisitionCost: 30, sellingPrice: 450, stockQuantity: 90, lowStockThreshold: 15, sku: "RUN-HB-023", weight: "0.1 kg" },
  { name: "Phone Armband", slug: "phone-armband", categorySlug: "running-athletics", subcategory: "Phone Armbands", description: "Adjustable armband holder for phones during workouts.", supplier: "Sample Supplier", supplierCost: 180, acquisitionCost: 40, sellingPrice: 700, stockQuantity: 55, lowStockThreshold: 10, sku: "RUN-PA-024", weight: "0.2 kg" },
  { name: "Reflective Armband Set", slug: "reflective-armband-set", categorySlug: "running-athletics", subcategory: "Reflective Accessories", description: "High-visibility reflective armbands for safety at night.", supplier: "Sample Supplier", supplierCost: 150, acquisitionCost: 35, sellingPrice: 550, stockQuantity: 0, lowStockThreshold: 8, sku: "RUN-RA-025", weight: "0.2 kg", isPreOrder: true, preOrderLeadTime: "5–8 days" },

  // Kids Sports
  { name: "Kids Sports Bag", slug: "kids-sports-bag", categorySlug: "kids-sports", subcategory: "Kids' Sports Bags", description: "Colourful kids sports bag with fun design.", supplier: "Sample Supplier", supplierCost: 400, acquisitionCost: 90, sellingPrice: 1300, stockQuantity: 25, lowStockThreshold: 5, sku: "KSP-KB-026", weight: "0.5 kg" },
  { name: "Kids Water Bottle", slug: "kids-water-bottle", categorySlug: "kids-sports", subcategory: "Kids' Water Bottles", description: "BPA-free kids water bottle with fun character print.", supplier: "Sample Supplier", supplierCost: 200, acquisitionCost: 50, sellingPrice: 700, stockQuantity: 60, lowStockThreshold: 10, sku: "KSP-KW-027", weight: "0.2 kg" },
  { name: "Kids Skipping Rope", slug: "kids-skipping-rope", categorySlug: "kids-sports", subcategory: "Kids' Skipping Ropes", description: "Lightweight skipping rope for kids.", supplier: "Sample Supplier", supplierCost: 100, acquisitionCost: 25, sellingPrice: 400, stockQuantity: 70, lowStockThreshold: 12, sku: "KSP-KS-028", weight: "0.2 kg" },

  // Kids Toys
  { name: "Building Blocks Set", slug: "building-blocks-set", categorySlug: "kids-toys", subcategory: "Building Toys", description: "Creative building blocks set for imaginative play.", supplier: "Sample Supplier", supplierCost: 600, acquisitionCost: 130, sellingPrice: 1900, discountPrice: 1600, stockQuantity: 30, lowStockThreshold: 6, sku: "KTY-BB-029", weight: "1.2 kg", isFeatured: true },
  { name: "Educational Puzzle", slug: "educational-puzzle", categorySlug: "kids-toys", subcategory: "Educational Toys", description: "Educational puzzle to boost learning and problem solving.", supplier: "Sample Supplier", supplierCost: 350, acquisitionCost: 80, sellingPrice: 1000, stockQuantity: 40, lowStockThreshold: 8, sku: "KTY-EP-030", weight: "0.6 kg" },
  { name: "Creative Activity Set", slug: "creative-activity-set", categorySlug: "kids-toys", subcategory: "Creative Activity Sets", description: "Creative arts & crafts activity set for kids.", supplier: "Sample Supplier", supplierCost: 400, acquisitionCost: 100, sellingPrice: 1200, stockQuantity: 35, lowStockThreshold: 8, sku: "KTY-CA-031", weight: "0.8 kg" },

  // Board Games
  { name: "Family Board Game", slug: "family-board-game", categorySlug: "board-games", subcategory: "Family Board Games", description: "Classic family board game for game night.", supplier: "Sample Supplier", supplierCost: 700, acquisitionCost: 150, sellingPrice: 2200, discountPrice: 1900, stockQuantity: 20, lowStockThreshold: 5, sku: "BGM-FB-032", weight: "1.0 kg", isFeatured: true },
  { name: "Strategy Game", slug: "strategy-game", categorySlug: "board-games", subcategory: "Strategy Games", description: "Strategy and educational board game for all ages.", supplier: "Sample Supplier", supplierCost: 500, acquisitionCost: 120, sellingPrice: 1600, stockQuantity: 25, lowStockThreshold: 5, sku: "BGM-SG-033", weight: "0.9 kg" },
  { name: "Basic Card Game", slug: "basic-card-game", categorySlug: "board-games", subcategory: "Basic Games", description: "Simple fun card game for family and friends.", supplier: "Sample Supplier", supplierCost: 200, acquisitionCost: 50, sellingPrice: 800, stockQuantity: 50, lowStockThreshold: 10, sku: "BGM-CG-034", weight: "0.3 kg" },
];

async function main() {
  console.log("🌱 Seeding ARTHVRA ATHLETICS database...");

  // ----- Admin user -----
  const adminEmail = "admin@arthvra.co.ke";
  const adminPassword = "Admin@2026";
  const adminHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      name: "ARTHVRA Admin",
      email: adminEmail,
      passwordHash: adminHash,
      phone: "0745237413",
      role: "ADMIN",
    },
  });
  console.log(`  ✓ Admin user: ${adminEmail} / ${adminPassword} (change this)`);

  // ----- Categories -----
  const categoryIdBySlug: Record<string, string> = {};
  for (const c of CATEGORY_SEEDS) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, sortOrder: c.sortOrder },
      create: c,
    });
    categoryIdBySlug[c.slug] = cat.id;
  }
  console.log(`  ✓ ${CATEGORY_SEEDS.length} categories`);

  // ----- Delivery zones -----
  for (const z of DELIVERY_ZONE_SEEDS) {
    await prisma.deliveryZone.upsert({
      where: { id: z.name.toLowerCase().replace(/\s+/g, "-") },
      update: { fee: z.fee, estimatedDelivery: z.estimatedDelivery, freeDeliveryThreshold: z.freeDeliveryThreshold, sortOrder: z.sortOrder },
      create: { id: z.name.toLowerCase().replace(/\s+/g, "-"), ...z },
    });
  }
  console.log(`  ✓ ${DELIVERY_ZONE_SEEDS.length} delivery zones`);

  // ----- Sample products -----
  for (const p of PRODUCTS) {
    const catId = categoryIdBySlug[p.categorySlug];
    if (!catId) {
      console.warn(`  ✗ Missing category for ${p.name}`);
      continue;
    }
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.product.update({
        where: { slug: p.slug },
        data: {
          supplierCost: p.supplierCost,
          acquisitionCost: p.acquisitionCost,
          sellingPrice: p.sellingPrice,
          discountPrice: p.discountPrice ?? null,
          stockQuantity: p.stockQuantity,
          lowStockThreshold: p.lowStockThreshold,
          isFeatured: p.isFeatured ?? false,
          isPreOrder: p.isPreOrder ?? false,
          preOrderLeadTime: p.isPreOrder ? (p as any).preOrderLeadTime ?? null : null,
        },
      });
      // Ensure primary image exists
      const imgCount = await prisma.productImage.count({ where: { productId: existing.id } });
      if (imgCount === 0) {
        const imageUrl = PRODUCT_IMAGES[p.slug] || PLACEHOLDER;
        await prisma.productImage.create({
          data: { productId: existing.id, url: imageUrl, alt: p.name, isPrimary: true },
        });
      }
    } else {
      await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          categoryId: catId,
          subcategory: p.subcategory,
          supplier: p.supplier,
          supplierCost: p.supplierCost,
          acquisitionCost: p.acquisitionCost,
          sellingPrice: p.sellingPrice,
          discountPrice: p.discountPrice ?? null,
          stockQuantity: p.stockQuantity,
          lowStockThreshold: p.lowStockThreshold,
          sku: p.sku,
          weight: p.weight,
          dimensions: p.dimensions,
          isFeatured: p.isFeatured ?? false,
          isPreOrder: p.isPreOrder ?? false,
          preOrderLeadTime: p.isPreOrder ? (p as any).preOrderLeadTime ?? null : null,
          images: {
            create: [{ url: PRODUCT_IMAGES[p.slug] || PLACEHOLDER, alt: p.name, isPrimary: true }],
          },
        },
      });
    }
  }
  console.log(`  ✓ ${PRODUCTS.length} sample products`);

  // ----- Settings (defaults; admin-editable at runtime) -----
  const defaultSettings: Record<string, unknown> = {
    bank_details: {
      bankName: "Equity Bank",
      accountName: "Arthvra Athletics",
      accountNumber: "0100000000000",
      branch: "Nairobi",
      instructions: "Use your order number as the payment reference. Send your payment confirmation via WhatsApp or email after transferring.",
    },
    social_links: {
      instagram: "",
      tiktok: "",
      facebook: "",
    },
    contact: {
      email: "jgacara254@gmail.com",
      phone: "0745237413",
      whatsapp: "254745237413",
    },
    delivery_notes: "Delivery is paid by the customer. Free delivery is available on orders above the threshold for your location.",
    mpesa_config: {
      enabled: false,
      consumerKey: "",
      consumerSecret: "",
      passkey: "",
      shortcode: "",
      env: "sandbox",
    },
    smtp: {
      host: "",
      port: "",
      user: "",
      password: "",
      from: "jgacara254@gmail.com",
      enabled: false,
    },
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
  }
  console.log(`  ✓ ${Object.keys(defaultSettings).length} default settings`);

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
