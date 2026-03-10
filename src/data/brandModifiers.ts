// ─── Brand Modifier System ───────────────────────────────────────────────────
// Brands that sponsor the game get real gameplay advantages, not just badges.
// Applied in buyFood() (shelf life) and eatFood() (effect bonuses).

export interface BrandModifier {
  // Applied when buying — stored in FridgeSlot's expiresOnDay
  shelfLifeBonus?: number;           // extra days on top of tier bonus

  // Applied when eating
  effectBonus?: {
    energy?: number;
    happiness?: number;
    health?: number;
  };

  // Applied to purchase price
  priceDiscount?: number;            // 0.9 = 10% off

  // Applied to delivery purchases
  deliveryDiscount?: number;         // 0.85 = 15% off delivery

  // Combo multiplier — brand items grant extra combo bonus
  comboBonus?: number;               // 1.1 = 10% more combo effect

  // Display label shown in UI
  tagFa?: string;                    // e.g. "عمر +۱ روز · سلامت +۲"
}

export const BRAND_MODIFIERS: Record<string, BrandModifier> = {
  "کاله": {
    shelfLifeBonus:  1,
    effectBonus:     { health: 2 },
    comboBonus:      1.1,
    tagFa:           "عمر +۱ · سلامت +۲",
  },
  "رامک": {
    shelfLifeBonus:  1,
    effectBonus:     { energy: 2 },
    tagFa:           "عمر +۱ · انرژی +۲",
  },
  "پاک": {
    effectBonus:     { happiness: 3 },
    priceDiscount:   0.95,
    tagFa:           "خوشحالی +۳ · ۵٪ تخفیف",
  },
  "حریری": {
    shelfLifeBonus:  5,
    tagFa:           "عمر +۵ روز",
  },
  "اسنپ‌فود": {
    deliveryDiscount: 0.85,
    tagFa:            "۱۵٪ تخفیف تحویل",
  },
  "دیجیکالا": {
    priceDiscount:   0.92,
    tagFa:           "۸٪ تخفیف",
  },
};
