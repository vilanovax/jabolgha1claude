// ─── جمعه‌بازار (Marketplace) ─────────────────────────

export type MarketCategory = "appliance" | "electronics" | "furniture" | "vehicle" | "housing";

export interface MarketItem {
  id: string;
  name: string;
  emoji: string;
  category: MarketCategory;
  categoryLabel: string;
  price: number;
  resaleValue: number;       // فروش به سیستم
  requiredLevel: number;
  description: string;
  // Stats / passive bonuses when owned
  passiveBonus?: {
    energy?: number;          // per-day bonus
    happiness?: number;
    health?: number;
  };
  // For fridges: link to fridge system
  fridgeSpec?: {
    slots: number;
    shelfLifeBonus: number;
  };
  // For branded items
  isSponsored: boolean;
  brand?: string;
  brandEmoji?: string;
  // Upgrade link: connects to existing upgrade systems
  upgradeLink?: {
    system: "fridge" | "vehicle" | "housing";
    tierId: string;
  };
}

// Peer listing (NPC-simulated or player)
export interface MarketListing {
  id: string;
  itemId: string;
  sellerName: string;
  sellerEmoji: string;
  askingPrice: number;        // قیمت درخواستی
  condition: "new" | "used";  // نو / دست دوم
  listedOnDay: number;
}

export const MARKET_CATEGORIES: { key: MarketCategory | "all"; label: string; emoji: string }[] = [
  { key: "all", label: "همه", emoji: "🏪" },
  { key: "appliance", label: "لوازم خانگی", emoji: "🧊" },
  { key: "electronics", label: "الکترونیک", emoji: "📱" },
  { key: "furniture", label: "مبلمان", emoji: "🛋️" },
  { key: "vehicle", label: "خودرو", emoji: "🚗" },
];

// ─── Market Items Catalog ────────────────────────────

export const MARKET_ITEMS: MarketItem[] = [
  // ═══ Appliances: Fridges ═══
  {
    id: "fridge_basic",
    name: "یخچال ساده",
    emoji: "❄️",
    category: "appliance",
    categoryLabel: "لوازم خانگی",
    price: 0,
    resaleValue: 0,
    requiredLevel: 1,
    description: "۴ جای غذا · پایه",
    fridgeSpec: { slots: 4, shelfLifeBonus: 0 },
    isSponsored: false,
    upgradeLink: { system: "fridge", tierId: "basic" },
  },
  {
    id: "fridge_medium",
    name: "یخچال خانوادگی",
    emoji: "🧊",
    category: "appliance",
    categoryLabel: "لوازم خانگی",
    price: 5_000_000,
    resaleValue: 2_500_000,
    requiredLevel: 3,
    description: "۸ جای غذا · عمر غذا +۱ روز",
    fridgeSpec: { slots: 8, shelfLifeBonus: 1 },
    isSponsored: false,
    upgradeLink: { system: "fridge", tierId: "medium" },
  },
  {
    id: "fridge_premium",
    name: "یخچال ساید",
    emoji: "🏔️",
    category: "appliance",
    categoryLabel: "لوازم خانگی",
    price: 15_000_000,
    resaleValue: 8_000_000,
    requiredLevel: 5,
    description: "۱۲ جای غذا · عمر غذا +۲ روز",
    fridgeSpec: { slots: 12, shelfLifeBonus: 2 },
    isSponsored: false,
    upgradeLink: { system: "fridge", tierId: "premium" },
  },
  {
    id: "fridge_smart",
    name: "یخچال هوشمند",
    emoji: "🤖",
    category: "appliance",
    categoryLabel: "لوازم خانگی",
    price: 35_000_000,
    resaleValue: 18_000_000,
    requiredLevel: 8,
    description: "۱۶ جای غذا · عمر غذا +۳ روز",
    fridgeSpec: { slots: 16, shelfLifeBonus: 3 },
    isSponsored: false,
    upgradeLink: { system: "fridge", tierId: "smart" },
  },
  // ─ Branded Fridges ─
  {
    id: "fridge_samsung",
    name: "یخچال سامسونگ",
    emoji: "🧊",
    category: "appliance",
    categoryLabel: "لوازم خانگی",
    price: 50_000_000,
    resaleValue: 30_000_000,
    requiredLevel: 8,
    description: "۲۰ جای غذا · عمر غذا +۴ روز",
    fridgeSpec: { slots: 20, shelfLifeBonus: 4 },
    isSponsored: true,
    brand: "سامسونگ",
    brandEmoji: "🌟",
    upgradeLink: { system: "fridge", tierId: "samsung" },
  },
  {
    id: "fridge_lg",
    name: "یخچال LG",
    emoji: "❄️",
    category: "appliance",
    categoryLabel: "لوازم خانگی",
    price: 42_000_000,
    resaleValue: 25_000_000,
    requiredLevel: 7,
    description: "۱۸ جای غذا · عمر غذا +۳ روز",
    fridgeSpec: { slots: 18, shelfLifeBonus: 3 },
    isSponsored: true,
    brand: "ال‌جی",
    brandEmoji: "✨",
    upgradeLink: { system: "fridge", tierId: "lg" },
  },
  {
    id: "fridge_bosch",
    name: "یخچال بوش",
    emoji: "🧊",
    category: "appliance",
    categoryLabel: "لوازم خانگی",
    price: 65_000_000,
    resaleValue: 40_000_000,
    requiredLevel: 10,
    description: "۲۴ جای غذا · عمر غذا +۵ روز",
    fridgeSpec: { slots: 24, shelfLifeBonus: 5 },
    isSponsored: true,
    brand: "بوش",
    brandEmoji: "🏆",
    upgradeLink: { system: "fridge", tierId: "bosch" },
  },

  // ═══ Appliances: Other ═══
  {
    id: "washing_machine",
    name: "ماشین لباسشویی",
    emoji: "🫧",
    category: "appliance",
    categoryLabel: "لوازم خانگی",
    price: 12_000_000,
    resaleValue: 5_000_000,
    requiredLevel: 2,
    description: "صرفه‌جویی در انرژی روزانه",
    passiveBonus: { energy: 2 },
    isSponsored: false,
  },
  {
    id: "washing_machine_lg",
    name: "لباسشویی LG",
    emoji: "🫧",
    category: "appliance",
    categoryLabel: "لوازم خانگی",
    price: 25_000_000,
    resaleValue: 14_000_000,
    requiredLevel: 5,
    description: "صرفه‌جویی بیشتر + خوشحالی",
    passiveBonus: { energy: 3, happiness: 2 },
    isSponsored: true,
    brand: "ال‌جی",
    brandEmoji: "✨",
  },
  {
    id: "microwave",
    name: "مایکروویو",
    emoji: "📡",
    category: "appliance",
    categoryLabel: "لوازم خانگی",
    price: 4_000_000,
    resaleValue: 1_500_000,
    requiredLevel: 1,
    description: "سلامت غذا +۱",
    passiveBonus: { health: 1 },
    isSponsored: false,
  },

  // ═══ Electronics ═══
  {
    id: "phone_basic",
    name: "گوشی ساده",
    emoji: "📱",
    category: "electronics",
    categoryLabel: "الکترونیک",
    price: 3_000_000,
    resaleValue: 1_000_000,
    requiredLevel: 1,
    description: "خوشحالی +۱ روزانه",
    passiveBonus: { happiness: 1 },
    isSponsored: false,
  },
  {
    id: "phone_samsung",
    name: "سامسونگ گلکسی",
    emoji: "📱",
    category: "electronics",
    categoryLabel: "الکترونیک",
    price: 20_000_000,
    resaleValue: 12_000_000,
    requiredLevel: 4,
    description: "خوشحالی +۳ روزانه",
    passiveBonus: { happiness: 3 },
    isSponsored: true,
    brand: "سامسونگ",
    brandEmoji: "🌟",
  },
  {
    id: "phone_iphone",
    name: "آیفون ۱۵",
    emoji: "📱",
    category: "electronics",
    categoryLabel: "الکترونیک",
    price: 60_000_000,
    resaleValue: 40_000_000,
    requiredLevel: 7,
    description: "خوشحالی +۵ · سلامت +۱ روزانه",
    passiveBonus: { happiness: 5, health: 1 },
    isSponsored: true,
    brand: "اپل",
    brandEmoji: "🍎",
  },
  {
    id: "laptop_basic",
    name: "لپ‌تاپ معمولی",
    emoji: "💻",
    category: "electronics",
    categoryLabel: "الکترونیک",
    price: 15_000_000,
    resaleValue: 7_000_000,
    requiredLevel: 2,
    description: "انرژی +۱ روزانه",
    passiveBonus: { energy: 1 },
    isSponsored: false,
  },
  {
    id: "laptop_macbook",
    name: "مک‌بوک پرو",
    emoji: "💻",
    category: "electronics",
    categoryLabel: "الکترونیک",
    price: 80_000_000,
    resaleValue: 55_000_000,
    requiredLevel: 6,
    description: "انرژی +۳ · خوشحالی +۲ روزانه",
    passiveBonus: { energy: 3, happiness: 2 },
    isSponsored: true,
    brand: "اپل",
    brandEmoji: "🍎",
  },
  {
    id: "console_ps5",
    name: "پلی‌استیشن ۵",
    emoji: "🎮",
    category: "electronics",
    categoryLabel: "الکترونیک",
    price: 25_000_000,
    resaleValue: 15_000_000,
    requiredLevel: 3,
    description: "خوشحالی +۴ روزانه",
    passiveBonus: { happiness: 4 },
    isSponsored: true,
    brand: "سونی",
    brandEmoji: "🎮",
  },

  // ═══ Furniture ═══
  {
    id: "sofa_basic",
    name: "مبل ساده",
    emoji: "🛋️",
    category: "furniture",
    categoryLabel: "مبلمان",
    price: 8_000_000,
    resaleValue: 3_000_000,
    requiredLevel: 1,
    description: "انرژی +۱ روزانه",
    passiveBonus: { energy: 1 },
    isSponsored: false,
  },
  {
    id: "sofa_luxury",
    name: "مبل راحتی چرمی",
    emoji: "🛋️",
    category: "furniture",
    categoryLabel: "مبلمان",
    price: 30_000_000,
    resaleValue: 16_000_000,
    requiredLevel: 5,
    description: "انرژی +۳ · خوشحالی +۲ روزانه",
    passiveBonus: { energy: 3, happiness: 2 },
    isSponsored: true,
    brand: "ایکیا",
    brandEmoji: "🏠",
  },
  {
    id: "bed_basic",
    name: "تخت معمولی",
    emoji: "🛏️",
    category: "furniture",
    categoryLabel: "مبلمان",
    price: 6_000_000,
    resaleValue: 2_000_000,
    requiredLevel: 1,
    description: "سلامت +۱ روزانه",
    passiveBonus: { health: 1 },
    isSponsored: false,
  },
  {
    id: "bed_tempur",
    name: "تخت تمپور",
    emoji: "🛏️",
    category: "furniture",
    categoryLabel: "مبلمان",
    price: 45_000_000,
    resaleValue: 25_000_000,
    requiredLevel: 6,
    description: "سلامت +۳ · انرژی +۳ روزانه",
    passiveBonus: { health: 3, energy: 3 },
    isSponsored: true,
    brand: "تمپور",
    brandEmoji: "🛏️",
  },
  {
    id: "desk_basic",
    name: "میز کار ساده",
    emoji: "🪑",
    category: "furniture",
    categoryLabel: "مبلمان",
    price: 3_000_000,
    resaleValue: 1_000_000,
    requiredLevel: 1,
    description: "خوشحالی +۱ روزانه",
    passiveBonus: { happiness: 1 },
    isSponsored: false,
  },
  {
    id: "desk_ergonomic",
    name: "میز ارگونومیک",
    emoji: "🪑",
    category: "furniture",
    categoryLabel: "مبلمان",
    price: 18_000_000,
    resaleValue: 9_000_000,
    requiredLevel: 4,
    description: "خوشحالی +۲ · سلامت +۲ روزانه",
    passiveBonus: { happiness: 2, health: 2 },
    isSponsored: true,
    brand: "ایکیا",
    brandEmoji: "🏠",
  },
];

// ─── NPC Seller Names ─────────────────────────────────

const NPC_SELLERS = [
  { name: "حسین", emoji: "👨" },
  { name: "مریم", emoji: "👩" },
  { name: "رضا", emoji: "🧑" },
  { name: "زهرا", emoji: "👩" },
  { name: "محمد", emoji: "👨" },
  { name: "فاطمه", emoji: "👩" },
  { name: "علی", emoji: "🧑" },
  { name: "سارا", emoji: "👩" },
];

/** Generate NPC listings for peer marketplace */
export function generateNpcListings(currentDay: number, count: number = 3): MarketListing[] {
  const sellableItems = MARKET_ITEMS.filter((item) => item.price > 0);
  const listings: MarketListing[] = [];

  for (let i = 0; i < count; i++) {
    const item = sellableItems[Math.floor(Math.random() * sellableItems.length)];
    const seller = NPC_SELLERS[Math.floor(Math.random() * NPC_SELLERS.length)];
    // NPC price: 60-90% of retail (used items)
    const discount = 0.6 + Math.random() * 0.3;
    const askingPrice = Math.round(item.price * discount / 100_000) * 100_000;

    listings.push({
      id: `npc_${currentDay}_${i}`,
      itemId: item.id,
      sellerName: seller.name,
      sellerEmoji: seller.emoji,
      askingPrice,
      condition: "used",
      listedOnDay: currentDay,
    });
  }

  return listings;
}
