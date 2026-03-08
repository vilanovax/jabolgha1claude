// ─── Food & Fridge System ────────────────────────

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: "dairy" | "protein" | "grain" | "fruit" | "snack" | "drink";
  categoryLabel: string;
  baseShelfLife: number;    // days before expiry (in basic fridge)
  price: number;
  effects: {
    energy: number;
    happiness: number;
    health: number;
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
  isSponsored?: boolean;
  brand?: string;
}

export interface FridgeSlot {
  foodId: string;
  addedOnDay: number;
  expiresOnDay: number;
}

// ─── Food Categories ─────────────────────────

export const FOOD_CATEGORIES: { key: string; label: string; emoji: string }[] = [
  { key: "all", label: "همه", emoji: "🍽️" },
  { key: "dairy", label: "لبنیات", emoji: "🥛" },
  { key: "protein", label: "پروتئین", emoji: "🍗" },
  { key: "grain", label: "غلات و نان", emoji: "🍞" },
  { key: "fruit", label: "میوه", emoji: "🍎" },
  { key: "snack", label: "تنقلات", emoji: "🍫" },
  { key: "drink", label: "نوشیدنی", emoji: "🧃" },
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
    effects: { energy: 25, happiness: 3, health: 5 },
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
    effects: { energy: 15, happiness: 3, health: 8 },
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
    effects: { energy: 20, happiness: 5, health: 6 },
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
    effects: { energy: 10, happiness: 4, health: 7 },
    isSponsored: true,
    brand: "کاله",
    brandEmoji: "🫙",
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
    effects: { energy: 35, happiness: 8, health: 10 },
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
    effects: { energy: 40, happiness: 15, health: 5 },
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
    effects: { energy: 30, happiness: 10, health: 15 },
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
    effects: { energy: 15, happiness: 3, health: 2 },
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
    effects: { energy: 25, happiness: 5, health: 3 },
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
    effects: { energy: 10, happiness: 5, health: 12 },
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
    effects: { energy: 8, happiness: 3, health: 8 },
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
    effects: { energy: 12, happiness: 5, health: 6 },
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
    effects: { energy: 8, happiness: 8, health: -1 },
    isSponsored: true,
    brand: "حریری",
    brandEmoji: "🍪",
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
    effects: { energy: 10, happiness: 7, health: 4 },
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
    effects: { energy: 5, happiness: 4, health: 5 },
    isSponsored: false,
  },
];
