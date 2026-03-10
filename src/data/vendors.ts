// ─── Vendor System ────────────────────────────────────────────────────────────
// Generic vendor abstraction — ready for real brand sponsorship skins later.

export type VendorId =
  | "online_store"       // دیجی‌مال — general online marketplace
  | "food_delivery"      // اسنپ‌فود — food delivery app
  | "jomeh_bazaar"       // جمعه‌بازار — physical bazaar
  | "ride_service";      // اسنپ — ride-hailing app

export type VendorChannelType = "online" | "physical";

export interface VendorDefinition {
  id: VendorId;
  nameFa: string;
  descriptionFa: string;
  emoji: string;
  channelType: VendorChannelType;
  // Online vendors: items arrive after deliveryDays (energy cost: 0)
  deliveryDays?: number;
  // Physical vendors: immediate but costs energy to go
  energyCostToVisit?: number;
  // Price modifier applied to all items (1.0 = base price)
  priceMultiplier: number;
  // Color for UI accent
  accentColor: string;
  // Categories this vendor sells
  categories: string[];
}

export const VENDORS: Record<VendorId, VendorDefinition> = {
  online_store: {
    id: "online_store",
    nameFa: "دیجی‌مال",
    descriptionFa: "خرید آنلاین — ارسال ۲ روزه، بدون هزینه انرژی",
    emoji: "📦",
    channelType: "online",
    deliveryDays: 2,
    priceMultiplier: 1.05,  // 5% markup for convenience
    accentColor: "#e11d48",
    categories: ["electronics", "appliance", "furniture", "room", "vehicle"],
  },

  food_delivery: {
    id: "food_delivery",
    nameFa: "سفارش غذا",
    descriptionFa: "غذا در خانه — ارسال فوری، بدون هزینه انرژی",
    emoji: "🛵",
    channelType: "online",
    deliveryDays: 0,    // same-day, applied next action cycle
    priceMultiplier: 1.20, // 20% markup vs buying from market yourself
    accentColor: "#f97316",
    categories: ["food"],
  },

  jomeh_bazaar: {
    id: "jomeh_bazaar",
    nameFa: "جمعه‌بازار",
    descriptionFa: "بازار فیزیکی — قیمت پایین‌تر، هزینه انرژی برای رفت‌وآمد",
    emoji: "🏪",
    channelType: "physical",
    energyCostToVisit: 15,
    priceMultiplier: 0.80, // 20% cheaper than market price
    accentColor: "#a3e635",
    categories: ["electronics", "appliance", "furniture", "room", "food", "vehicle"],
  },

  ride_service: {
    id: "ride_service",
    nameFa: "سرویس حمل‌ونقل",
    descriptionFa: "کمک به رفت‌وآمد — صرفه‌جویی در انرژی",
    emoji: "🚕",
    channelType: "online",
    deliveryDays: 0,
    priceMultiplier: 1.0,
    accentColor: "#06b6d4",
    categories: ["transport"],
  },
};

export function getVendor(id: VendorId): VendorDefinition {
  return VENDORS[id];
}
