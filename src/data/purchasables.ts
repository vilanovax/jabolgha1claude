// ─── Unified Purchasable Item Model ───────────────────────────────────────────
// All purchasable items are adapted to this model regardless of source system.

import type { VendorId } from "./vendors";
import { ROOM_ITEMS } from "./roomItems";
import { MARKET_ITEMS } from "./marketplaceData";
import { FOOD_CATALOG } from "./fridgeData";

export type PurchasableCategory =
  | "food"
  | "electronics"
  | "appliance"
  | "furniture"
  | "room"
  | "vehicle"
  | "transport";

export interface UnifiedEffects {
  // Immediate stat effects (food, leisure)
  energy?: number;
  happiness?: number;
  health?: number;
  // Room / passive effects (applied daily)
  workIncomeMultiplier?: number;
  learningSpeedMultiplier?: number;
  dailyEnergyBonus?: number;
  dailyHappinessBonus?: number;
  // Asset effects
  passiveIncomePerDay?: number;
  resaleValue?: number;
}

export type PurchasableSourceSystem = "room" | "market" | "food" | "transport";

export interface PurchasableItem {
  id: string;
  nameFa: string;
  descriptionFa: string;
  emoji: string;
  category: PurchasableCategory;
  basePrice: number;
  requiredLevel?: number;
  effects: UnifiedEffects;
  sourceSystem: PurchasableSourceSystem;
  // Which vendors carry this item (empty = not available in new system)
  availableAt: VendorId[];
  isSponsored?: boolean;
  brand?: string;
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

export function mapRoomItemsToPurchasables(): PurchasableItem[] {
  return ROOM_ITEMS.map((item) => ({
    id: `room_${item.id}`,
    nameFa: item.nameFa,
    descriptionFa: item.descriptionFa,
    emoji: item.emoji,
    category: "room" as PurchasableCategory,
    basePrice: item.price,
    requiredLevel: item.unlockLevel,
    effects: {
      workIncomeMultiplier: item.effects.workIncomeMultiplier,
      learningSpeedMultiplier: item.effects.learningSpeedMultiplier,
      dailyEnergyBonus: item.effects.dailyEnergyBonus,
      dailyHappinessBonus: item.effects.dailyHappinessBonus,
    },
    sourceSystem: "room" as PurchasableSourceSystem,
    availableAt: ["online_store", "jomeh_bazaar"],
  }));
}

export function mapMarketItemsToPurchasables(): PurchasableItem[] {
  return MARKET_ITEMS.map((item) => ({
    id: `market_${item.id}`,
    nameFa: item.name,
    descriptionFa: item.description,
    emoji: item.emoji,
    category: item.category as PurchasableCategory,
    basePrice: item.price,
    requiredLevel: item.requiredLevel,
    effects: {
      energy: item.passiveBonus?.energy,
      happiness: item.passiveBonus?.happiness,
      health: item.passiveBonus?.health,
      resaleValue: item.resaleValue,
    },
    sourceSystem: "market" as PurchasableSourceSystem,
    availableAt: item.isSponsored ? ["online_store"] : ["online_store", "jomeh_bazaar"],
    isSponsored: item.isSponsored,
    brand: item.brand,
  }));
}

export function mapFoodCatalogToPurchasables(): PurchasableItem[] {
  return FOOD_CATALOG.map((food) => ({
    id: `food_${food.id}`,
    nameFa: food.name,
    descriptionFa: `${food.categoryLabel} — ماندگاری ${food.baseShelfLife} روز`,
    emoji: food.emoji,
    category: "food" as PurchasableCategory,
    basePrice: food.price,
    effects: {
      energy: food.effects.energy,
      happiness: food.effects.happiness,
      health: food.effects.health,
    },
    sourceSystem: "food" as PurchasableSourceSystem,
    availableAt: ["food_delivery", "jomeh_bazaar"],
    isSponsored: food.isSponsored,
    brand: food.brand,
  }));
}

// ─── Combined catalog ──────────────────────────────────────────────────────────

let _allPurchasables: PurchasableItem[] | null = null;

export function getAllPurchasables(): PurchasableItem[] {
  if (!_allPurchasables) {
    _allPurchasables = [
      ...mapRoomItemsToPurchasables(),
      ...mapMarketItemsToPurchasables(),
      ...mapFoodCatalogToPurchasables(),
    ];
  }
  return _allPurchasables;
}

export function getPurchasablesForVendor(vendorId: VendorId): PurchasableItem[] {
  return getAllPurchasables().filter((p) => p.availableAt.includes(vendorId));
}

export function findPurchasable(id: string): PurchasableItem | undefined {
  return getAllPurchasables().find((p) => p.id === id);
}
