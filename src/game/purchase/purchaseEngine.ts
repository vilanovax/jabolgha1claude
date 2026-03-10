// ─── Purchase Engine (pure — no Zustand) ──────────────────────────────────────
// Stateless functions for calculating prices and validating purchases.

import type { VendorId } from "@/data/vendors";
import { VENDORS } from "@/data/vendors";
import type { PurchasableItem } from "@/data/purchasables";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PurchaseContext {
  playerLevel: number;
  playerMoney: number;      // bank.checking
  playerEnergy: number;
  ownedItemIds: string[];   // inventory + roomItems
  currentDay: number;
}

export interface PurchaseQuote {
  itemId: string;
  vendorId: VendorId;
  basePrice: number;
  finalPrice: number;
  priceMultiplier: number;
  energyCost: number;
  deliveryDays: number;
  deliveryDay: number | null; // null = immediate
  isImmediate: boolean;
}

export interface PurchaseValidationResult {
  valid: boolean;
  reason?: string;
}

// ─── Quote ────────────────────────────────────────────────────────────────────

export function getPurchaseQuote(
  item: PurchasableItem,
  vendorId: VendorId,
  context: PurchaseContext,
): PurchaseQuote {
  const vendor = VENDORS[vendorId];
  const finalPrice = Math.round(item.basePrice * vendor.priceMultiplier);
  const energyCost = vendor.channelType === "physical"
    ? (vendor.energyCostToVisit ?? 0)
    : 0;
  const deliveryDays = vendor.deliveryDays ?? 0;
  const deliveryDay = deliveryDays > 0
    ? context.currentDay + deliveryDays
    : null;

  return {
    itemId: item.id,
    vendorId,
    basePrice: item.basePrice,
    finalPrice,
    priceMultiplier: vendor.priceMultiplier,
    energyCost,
    deliveryDays,
    deliveryDay,
    isImmediate: deliveryDays === 0,
  };
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validatePurchase(
  item: PurchasableItem,
  quote: PurchaseQuote,
  context: PurchaseContext,
): PurchaseValidationResult {
  // Already owned (for non-consumables)
  if (item.sourceSystem !== "food" && context.ownedItemIds.includes(item.id)) {
    return { valid: false, reason: "این آیتم قبلاً خریداری شده" };
  }

  // Level requirement
  if (item.requiredLevel !== undefined && context.playerLevel < item.requiredLevel) {
    return {
      valid: false,
      reason: `نیاز به سطح ${item.requiredLevel} دارد`,
    };
  }

  // Insufficient funds
  if (context.playerMoney < quote.finalPrice) {
    return { valid: false, reason: "موجودی کافی نیست" };
  }

  // Energy check for physical vendors
  if (quote.energyCost > 0 && context.playerEnergy < quote.energyCost) {
    return { valid: false, reason: "انرژی کافی برای رفت‌وآمد نیست" };
  }

  // Vendor must carry this item
  if (!item.availableAt.includes(quote.vendorId)) {
    return { valid: false, reason: "این فروشگاه این محصول را ندارد" };
  }

  return { valid: true };
}

// ─── Effect application helpers (pure, return new state values) ───────────────

export interface StatsDelta {
  moneyDelta: number;      // negative = spent
  energyDelta: number;
  happinessDelta: number;
  healthDelta: number;
}

export function getImmediateStatsDelta(
  quote: PurchaseQuote,
  item: PurchasableItem,
): StatsDelta {
  return {
    moneyDelta: -quote.finalPrice,
    // For physical vendors, deduct energy cost
    energyDelta: -(quote.energyCost ?? 0),
    happinessDelta: 0,
    healthDelta: 0,
  };
}
