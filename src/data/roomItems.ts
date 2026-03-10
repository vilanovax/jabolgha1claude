// ─── Room Item Types ──────────────────────────────────────────────────────────
export interface RoomItemEffects {
  workIncomeMultiplier?: number;    // e.g. 1.15 = +15% salary per shift
  learningSpeedMultiplier?: number; // e.g. 1.2 = +20% XP per study session
  dailyEnergyBonus?: number;        // flat energy gained at day start
  dailyHappinessBonus?: number;     // flat happiness gained at day start
}

export type RoomItemCategory = "work" | "study" | "energy" | "lifestyle" | "decor";

export interface RoomItem {
  id: string;
  nameFa: string;
  descriptionFa: string;
  emoji: string;
  category: RoomItemCategory;
  price: number;
  unlockLevel?: number;
  effects: RoomItemEffects;
}

// ─── Room Tier Definitions ────────────────────────────────────────────────────
export interface RoomTier {
  id: string;
  nameFa: string;
  requiredItems: number; // number of owned items needed
  color: string;
}

export const ROOM_TIERS: RoomTier[] = [
  { id: "basic",        nameFa: "اتاق خوابگاهی",    requiredItems: 0,  color: "#94a3b8" },
  { id: "student",      nameFa: "اتاق دانشجویی",    requiredItems: 2,  color: "#60a5fa" },
  { id: "professional", nameFa: "اتاق حرفه‌ای",     requiredItems: 5,  color: "#a78bfa" },
  { id: "premium",      nameFa: "آپارتمان کامل",    requiredItems: 8,  color: "#facc15" },
];

// ─── Room Item Catalog ────────────────────────────────────────────────────────
export const ROOM_ITEMS: RoomItem[] = [
  // ── Work ──────────────────────────────────────────────────────────────────
  {
    id: "ergonomic_chair",
    nameFa: "صندلی ارگونومیک",
    descriptionFa: "کمر سالم‌تر، تمرکز بیشتر — درآمد کاری ۱۰٪ بهتر",
    emoji: "💺",
    category: "work",
    price: 3_000_000,
    effects: { workIncomeMultiplier: 1.10 },
  },
  {
    id: "dual_monitor",
    nameFa: "مانیتور دوم",
    descriptionFa: "بهره‌وری دوچندان — درآمد کاری ۲۰٪ بیشتر",
    emoji: "🖥️",
    category: "work",
    price: 8_000_000,
    unlockLevel: 3,
    effects: { workIncomeMultiplier: 1.20 },
  },
  {
    id: "high_speed_internet",
    nameFa: "اینترنت فیبر",
    descriptionFa: "اتصال پرسرعت برای کار آنلاین — درآمد کاری ۱۵٪ بالاتر",
    emoji: "📡",
    category: "work",
    price: 5_000_000,
    unlockLevel: 2,
    effects: { workIncomeMultiplier: 1.15 },
  },

  // ── Study ─────────────────────────────────────────────────────────────────
  {
    id: "bookshelf",
    nameFa: "قفسه کتاب",
    descriptionFa: "منابع در دسترس — XP مطالعه ۱۵٪ بیشتر",
    emoji: "📖",
    category: "study",
    price: 2_000_000,
    effects: { learningSpeedMultiplier: 1.15 },
  },
  {
    id: "study_desk",
    nameFa: "میز تحریر حرفه‌ای",
    descriptionFa: "محیط مطالعه ایده‌آل — XP مطالعه ۲۵٪ بیشتر",
    emoji: "🗃️",
    category: "study",
    price: 6_000_000,
    unlockLevel: 4,
    effects: { learningSpeedMultiplier: 1.25 },
  },

  // ── Energy ────────────────────────────────────────────────────────────────
  {
    id: "coffee_machine",
    nameFa: "دستگاه قهوه",
    descriptionFa: "هر روز صبح شروعی پرانرژی — ۱۰ انرژی اضافه",
    emoji: "☕",
    category: "energy",
    price: 2_500_000,
    effects: { dailyEnergyBonus: 10 },
  },
  {
    id: "air_conditioner",
    nameFa: "تهویه مطبوع",
    descriptionFa: "دما کنترل شده — هر روز ۱۵ انرژی بیشتر بازیابی می‌کنی",
    emoji: "❄️",
    category: "energy",
    price: 7_000_000,
    unlockLevel: 3,
    effects: { dailyEnergyBonus: 15 },
  },
  {
    id: "stationary_bike",
    nameFa: "دوچرخه ثابت",
    descriptionFa: "ورزش صبحگاهی در خانه — ۸ انرژی + ۵ سلامت روزانه",
    emoji: "🚲",
    category: "energy",
    price: 4_500_000,
    effects: { dailyEnergyBonus: 8, dailyHappinessBonus: 5 },
  },

  // ── Lifestyle ─────────────────────────────────────────────────────────────
  {
    id: "smart_lamp",
    nameFa: "لامپ هوشمند",
    descriptionFa: "نور مناسب، روحیه بهتر — ۵ شادی روزانه",
    emoji: "💡",
    category: "lifestyle",
    price: 1_500_000,
    effects: { dailyHappinessBonus: 5 },
  },
  {
    id: "comfortable_couch",
    nameFa: "مبل راحتی",
    descriptionFa: "استراحت واقعی — ۸ شادی و ۵ انرژی روزانه",
    emoji: "🛋️",
    category: "lifestyle",
    price: 4_000_000,
    effects: { dailyHappinessBonus: 8, dailyEnergyBonus: 5 },
  },
  {
    id: "game_console",
    nameFa: "کنسول بازی",
    descriptionFa: "سرگرمی ضروری — ۱۲ شادی روزانه",
    emoji: "🎮",
    category: "lifestyle",
    price: 9_000_000,
    unlockLevel: 5,
    effects: { dailyHappinessBonus: 12 },
  },

  // ── Decor ─────────────────────────────────────────────────────────────────
  {
    id: "plant",
    nameFa: "گیاه آپارتمانی",
    descriptionFa: "فضای سبز، آرامش بیشتر — ۳ شادی روزانه",
    emoji: "🌿",
    category: "decor",
    price: 800_000,
    effects: { dailyHappinessBonus: 3 },
  },
  {
    id: "wall_art",
    nameFa: "تابلو دیواری",
    descriptionFa: "اتاق با سبک — ۴ شادی روزانه",
    emoji: "🖼️",
    category: "decor",
    price: 1_200_000,
    effects: { dailyHappinessBonus: 4 },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Compute combined buff multipliers from a list of owned item IDs */
export function getRoomBuffs(ownedItemIds: string[]): Required<RoomItemEffects> {
  const items = ownedItemIds
    .map((id) => ROOM_ITEMS.find((r) => r.id === id))
    .filter(Boolean) as RoomItem[];

  return items.reduce(
    (acc, item) => {
      const e = item.effects;
      return {
        workIncomeMultiplier:    acc.workIncomeMultiplier    * (e.workIncomeMultiplier    ?? 1),
        learningSpeedMultiplier: acc.learningSpeedMultiplier * (e.learningSpeedMultiplier ?? 1),
        dailyEnergyBonus:        acc.dailyEnergyBonus        + (e.dailyEnergyBonus        ?? 0),
        dailyHappinessBonus:     acc.dailyHappinessBonus     + (e.dailyHappinessBonus     ?? 0),
      };
    },
    {
      workIncomeMultiplier:    1,
      learningSpeedMultiplier: 1,
      dailyEnergyBonus:        0,
      dailyHappinessBonus:     0,
    },
  );
}

/** Get current room tier based on number of owned items */
export function getRoomTier(ownedCount: number): RoomTier {
  return (
    [...ROOM_TIERS].reverse().find((t) => ownedCount >= t.requiredItems) ??
    ROOM_TIERS[0]
  );
}
