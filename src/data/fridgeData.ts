// ─── Food & Fridge System ────────────────────────

export type FoodQuality = "economy" | "standard" | "premium";

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: "dairy" | "protein" | "grain" | "fruit" | "snack" | "drink";
  categoryLabel: string;
  baseShelfLife: number;    // days before expiry (in basic fridge)
  price: number;
  quality: FoodQuality;
  effects: {
    energy: number;
    happiness: number;
    health: number;
  };
  spoiledPenalty?: {        // effects when eaten after expiry
    energy: number;
    health: number;
    happiness: number;
  };
  isSponsored: boolean;
  brand?: string;
  brandEmoji?: string;
}

export interface FridgeTier {
  id: string;
  name: string;
  emoji: string;
  slots: number;
  shelfLifeBonus: number;   // extra days added to all items
  price: number;
  resaleValue: number;
  requiredLevel: number;
  description: string;
  smartFeatures?: SmartFeature[];
  isSponsored?: boolean;
  brand?: string;
}

export type SmartFeature =
  | "expiry_sort"        // auto-sort by expiry in UI
  | "expiry_warning"     // banner when item ≤1 day left
  | "grocery_suggest"    // suggest items to buy based on inventory
  | "shelf_life_boost"   // +1 day extra on top of tier bonus
  | "waste_reduction";   // happiness penalty halved on waste

export interface FridgeSlot {
  foodId: string;
  addedOnDay: number;
  expiresOnDay: number;
  spoiled?: boolean;      // true once expiresOnDay < dayInGame
}

// ─── Food Categories ─────────────────────────

export const FOOD_CATEGORIES: { key: string; label: string; emoji: string }[] = [
  { key: "all",     label: "همه",          emoji: "🍽️" },
  { key: "dairy",   label: "لبنیات",       emoji: "🥛" },
  { key: "protein", label: "پروتئین",      emoji: "🍗" },
  { key: "grain",   label: "غلات و نان",   emoji: "🍞" },
  { key: "fruit",   label: "میوه",         emoji: "🍎" },
  { key: "snack",   label: "تنقلات",       emoji: "🍫" },
  { key: "drink",   label: "نوشیدنی",      emoji: "🧃" },
];

// ─── Fridge Tiers ─────────────────────────────

export const FRIDGE_TIERS: FridgeTier[] = [
  {
    id: "basic",
    name: "یخچال ساده",
    emoji: "❄️",
    slots: 4,
    shelfLifeBonus: 0,
    price: 0,
    resaleValue: 0,
    requiredLevel: 1,
    description: "یخچال پایه با ۴ جای غذا",
    smartFeatures: [],
  },
  {
    id: "medium",
    name: "یخچال خانوادگی",
    emoji: "🧊",
    slots: 8,
    shelfLifeBonus: 1,
    price: 5_000_000,
    resaleValue: 2_500_000,
    requiredLevel: 3,
    description: "۸ جا · عمر غذا +۱ روز",
    smartFeatures: ["expiry_sort"],
  },
  {
    id: "premium",
    name: "یخچال ساید",
    emoji: "🏔️",
    slots: 12,
    shelfLifeBonus: 2,
    price: 15_000_000,
    resaleValue: 8_000_000,
    requiredLevel: 5,
    description: "۱۲ جا · عمر غذا +۲ روز",
    smartFeatures: ["expiry_sort", "expiry_warning"],
  },
  {
    id: "smart",
    name: "یخچال هوشمند",
    emoji: "🤖",
    slots: 16,
    shelfLifeBonus: 3,
    price: 35_000_000,
    resaleValue: 18_000_000,
    requiredLevel: 8,
    description: "۱۶ جا · عمر غذا +۳ روز",
    smartFeatures: ["expiry_sort", "expiry_warning", "grocery_suggest"],
  },
  // ─ Branded Fridges (اسپانسری) ─
  {
    id: "lg",
    name: "یخچال LG",
    emoji: "❄️",
    slots: 18,
    shelfLifeBonus: 3,
    price: 42_000_000,
    resaleValue: 25_000_000,
    requiredLevel: 7,
    description: "۱۸ جا · عمر غذا +۳ روز · ✦ ال‌جی",
    smartFeatures: ["expiry_sort", "expiry_warning", "grocery_suggest"],
    isSponsored: true,
    brand: "ال‌جی",
  },
  {
    id: "samsung",
    name: "یخچال سامسونگ",
    emoji: "🧊",
    slots: 20,
    shelfLifeBonus: 4,
    price: 50_000_000,
    resaleValue: 30_000_000,
    requiredLevel: 8,
    description: "۲۰ جا · عمر غذا +۴ روز · ✦ سامسونگ",
    smartFeatures: ["expiry_sort", "expiry_warning", "grocery_suggest", "shelf_life_boost"],
    isSponsored: true,
    brand: "سامسونگ",
  },
  {
    id: "bosch",
    name: "یخچال بوش",
    emoji: "🧊",
    slots: 24,
    shelfLifeBonus: 5,
    price: 65_000_000,
    resaleValue: 40_000_000,
    requiredLevel: 10,
    description: "۲۴ جا · عمر غذا +۵ روز · ✦ بوش",
    smartFeatures: ["expiry_sort", "expiry_warning", "grocery_suggest", "shelf_life_boost", "waste_reduction"],
    isSponsored: true,
    brand: "بوش",
  },
];

// ─── Food Catalog ─────────────────────────────

export const FOOD_CATALOG: FoodItem[] = [
  // ── Dairy ───
  {
    id: "egg_local",
    name: "تخم‌مرغ محلی",
    emoji: "🍳",
    category: "dairy",
    categoryLabel: "لبنیات",
    baseShelfLife: 5,
    price: 60_000,
    quality: "standard",
    effects: { energy: 25, happiness: 3, health: 5 },
    spoiledPenalty: { energy: -10, health: -12, happiness: -5 },
    isSponsored: false,
  },
  {
    id: "milk_ramak",
    name: "شیر رامک",
    emoji: "🥛",
    category: "dairy",
    categoryLabel: "لبنیات",
    baseShelfLife: 3,
    price: 80_000,
    quality: "standard",
    effects: { energy: 15, happiness: 3, health: 8 },
    spoiledPenalty: { energy: -8, health: -15, happiness: -8 },
    isSponsored: true,
    brand: "رامک",
    brandEmoji: "🥛",
  },
  {
    id: "cheese_kaleh",
    name: "پنیر کاله",
    emoji: "🧀",
    category: "dairy",
    categoryLabel: "لبنیات",
    baseShelfLife: 7,
    price: 150_000,
    quality: "premium",
    effects: { energy: 20, happiness: 5, health: 6 },
    spoiledPenalty: { energy: -5, health: -10, happiness: -5 },
    isSponsored: true,
    brand: "کاله",
    brandEmoji: "🧀",
  },
  {
    id: "yogurt_kaleh",
    name: "ماست کاله",
    emoji: "🫙",
    category: "dairy",
    categoryLabel: "لبنیات",
    baseShelfLife: 4,
    price: 70_000,
    quality: "standard",
    effects: { energy: 10, happiness: 4, health: 7 },
    spoiledPenalty: { energy: -5, health: -12, happiness: -5 },
    isSponsored: true,
    brand: "کاله",
    brandEmoji: "🫙",
  },
  // Economy dairy
  {
    id: "egg_factory",
    name: "تخم‌مرغ کارخانه",
    emoji: "🥚",
    category: "dairy",
    categoryLabel: "لبنیات",
    baseShelfLife: 4,
    price: 38_000,
    quality: "economy",
    effects: { energy: 16, happiness: 1, health: 3 },
    spoiledPenalty: { energy: -12, health: -15, happiness: -8 },
    isSponsored: false,
  },

  // ── Protein ───
  {
    id: "chicken",
    name: "مرغ",
    emoji: "🍗",
    category: "protein",
    categoryLabel: "پروتئین",
    baseShelfLife: 2,
    price: 250_000,
    quality: "standard",
    effects: { energy: 35, happiness: 8, health: 10 },
    spoiledPenalty: { energy: -15, health: -20, happiness: -10 },
    isSponsored: false,
  },
  {
    id: "kebab",
    name: "کباب کوبیده",
    emoji: "🥩",
    category: "protein",
    categoryLabel: "پروتئین",
    baseShelfLife: 1,
    price: 350_000,
    quality: "premium",
    effects: { energy: 40, happiness: 15, health: 5 },
    spoiledPenalty: { energy: -18, health: -22, happiness: -12 },
    isSponsored: false,
  },
  {
    id: "fish",
    name: "ماهی قزل‌آلا",
    emoji: "🐟",
    category: "protein",
    categoryLabel: "پروتئین",
    baseShelfLife: 2,
    price: 400_000,
    quality: "premium",
    effects: { energy: 30, happiness: 10, health: 15 },
    spoiledPenalty: { energy: -12, health: -25, happiness: -10 },
    isSponsored: false,
  },
  {
    id: "sausage",
    name: "سوسیس",
    emoji: "🌭",
    category: "protein",
    categoryLabel: "پروتئین",
    baseShelfLife: 5,
    price: 90_000,
    quality: "economy",
    effects: { energy: 20, happiness: 5, health: -2 },
    spoiledPenalty: { energy: -10, health: -18, happiness: -8 },
    isSponsored: false,
  },

  // ── Grain ───
  {
    id: "bread_sangak",
    name: "نان سنگک",
    emoji: "🍞",
    category: "grain",
    categoryLabel: "غلات و نان",
    baseShelfLife: 1,
    price: 40_000,
    quality: "standard",
    effects: { energy: 15, happiness: 3, health: 2 },
    spoiledPenalty: { energy: -3, health: -5, happiness: -3 },
    isSponsored: false,
  },
  {
    id: "rice",
    name: "برنج پخته",
    emoji: "🍚",
    category: "grain",
    categoryLabel: "غلات و نان",
    baseShelfLife: 2,
    price: 100_000,
    quality: "standard",
    effects: { energy: 25, happiness: 5, health: 3 },
    spoiledPenalty: { energy: -8, health: -12, happiness: -5 },
    isSponsored: false,
  },
  {
    id: "bread_toast",
    name: "نان تست",
    emoji: "🍞",
    category: "grain",
    categoryLabel: "غلات و نان",
    baseShelfLife: 4,
    price: 25_000,
    quality: "economy",
    effects: { energy: 10, happiness: 1, health: 1 },
    spoiledPenalty: { energy: -2, health: -3, happiness: -2 },
    isSponsored: false,
  },

  // ── Fruit ───
  {
    id: "salad",
    name: "سالاد آماده",
    emoji: "🥗",
    category: "fruit",
    categoryLabel: "میوه",
    baseShelfLife: 2,
    price: 120_000,
    quality: "standard",
    effects: { energy: 10, happiness: 5, health: 12 },
    spoiledPenalty: { energy: -5, health: -10, happiness: -8 },
    isSponsored: false,
  },
  {
    id: "apple",
    name: "سیب",
    emoji: "🍎",
    category: "fruit",
    categoryLabel: "میوه",
    baseShelfLife: 6,
    price: 50_000,
    quality: "standard",
    effects: { energy: 8, happiness: 3, health: 8 },
    spoiledPenalty: { energy: -2, health: -5, happiness: -3 },
    isSponsored: false,
  },
  {
    id: "banana",
    name: "موز",
    emoji: "🍌",
    category: "fruit",
    categoryLabel: "میوه",
    baseShelfLife: 3,
    price: 80_000,
    quality: "standard",
    effects: { energy: 12, happiness: 5, health: 6 },
    spoiledPenalty: { energy: -3, health: -6, happiness: -4 },
    isSponsored: false,
  },

  // ── Snack ───
  {
    id: "chocolate",
    name: "شکلات",
    emoji: "🍫",
    category: "snack",
    categoryLabel: "تنقلات",
    baseShelfLife: 30,
    price: 60_000,
    quality: "standard",
    effects: { energy: 10, happiness: 12, health: -2 },
    isSponsored: false,
  },
  {
    id: "cookie_hariri",
    name: "بیسکویت حریری",
    emoji: "🍪",
    category: "snack",
    categoryLabel: "تنقلات",
    baseShelfLife: 20,
    price: 45_000,
    quality: "standard",
    effects: { energy: 8, happiness: 8, health: -1 },
    isSponsored: true,
    brand: "حریری",
    brandEmoji: "🍪",
  },
  {
    id: "chips",
    name: "چیپس",
    emoji: "🥔",
    category: "snack",
    categoryLabel: "تنقلات",
    baseShelfLife: 25,
    price: 35_000,
    quality: "economy",
    effects: { energy: 6, happiness: 6, health: -3 },
    isSponsored: false,
  },

  // ── Drink ───
  {
    id: "juice_pak",
    name: "آب میوه پاک",
    emoji: "🧃",
    category: "drink",
    categoryLabel: "نوشیدنی",
    baseShelfLife: 5,
    price: 90_000,
    quality: "standard",
    effects: { energy: 10, happiness: 7, health: 4 },
    spoiledPenalty: { energy: -5, health: -8, happiness: -5 },
    isSponsored: true,
    brand: "پاک",
    brandEmoji: "🧃",
  },
  {
    id: "doogh",
    name: "دوغ",
    emoji: "🥤",
    category: "drink",
    categoryLabel: "نوشیدنی",
    baseShelfLife: 4,
    price: 35_000,
    quality: "economy",
    effects: { energy: 5, happiness: 4, health: 5 },
    spoiledPenalty: { energy: -5, health: -10, happiness: -6 },
    isSponsored: false,
  },
  {
    id: "coffee",
    name: "قهوه فوری",
    emoji: "☕",
    category: "drink",
    categoryLabel: "نوشیدنی",
    baseShelfLife: 60,
    price: 55_000,
    quality: "standard",
    effects: { energy: 18, happiness: 8, health: 0 },
    isSponsored: false,
  },
];
