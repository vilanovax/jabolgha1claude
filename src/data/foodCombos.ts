// ─── Food Combo System ───────────────────────────────────────────────────────
// When a player eats items that form a combo within the same meal session,
// they receive a bonus on top of normal food effects.
// Detection runs in eatFood() against currentMealHistory[].

export interface FoodCombo {
  id: string;
  labelFa: string;
  descFa: string;
  emoji: string;
  requiredItems: string[];    // foodId[] — all must be eaten in same meal session
  bonus: {
    energy?: number;
    happiness?: number;
    health?: number;
  };
}

export const FOOD_COMBOS: FoodCombo[] = [
  {
    id: "chicken_rice",
    labelFa: "مرغ و برنج",
    descFa: "وعده کامل ایرانی",
    emoji: "🍗🍚",
    requiredItems: ["chicken", "rice"],
    bonus: { energy: 10, health: 5 },
  },
  {
    id: "egg_bread",
    labelFa: "تخم‌مرغ و نان",
    descFa: "صبحانه ایرانی",
    emoji: "🍳🍞",
    requiredItems: ["egg_local", "bread_sangak"],
    bonus: { energy: 8, happiness: 3 },
  },
  {
    id: "egg_factory_bread",
    labelFa: "تخم‌مرغ و نان",
    descFa: "صبحانه سریع",
    emoji: "🥚🍞",
    requiredItems: ["egg_factory", "bread_toast"],
    bonus: { energy: 5, happiness: 2 },
  },
  {
    id: "fish_salad",
    labelFa: "ماهی و سالاد",
    descFa: "وعده سالم",
    emoji: "🐟🥗",
    requiredItems: ["fish", "salad"],
    bonus: { health: 12, happiness: 5 },
  },
  {
    id: "cheese_bread",
    labelFa: "پنیر کاله و نان سنگک",
    descFa: "صبحانه برند",
    emoji: "🧀🍞",
    requiredItems: ["cheese_kaleh", "bread_sangak"],
    bonus: { energy: 5, happiness: 8 },
  },
  {
    id: "yogurt_fruit",
    labelFa: "ماست و میوه",
    descFa: "صبحانه سبک",
    emoji: "🫙🍎",
    requiredItems: ["yogurt_kaleh", "apple"],
    bonus: { health: 6, happiness: 4 },
  },
  {
    id: "rice_salad",
    labelFa: "برنج و سالاد",
    descFa: "ناهار متعادل",
    emoji: "🍚🥗",
    requiredItems: ["rice", "salad"],
    bonus: { energy: 5, health: 8 },
  },
  {
    id: "coffee_chocolate",
    labelFa: "قهوه و شکلات",
    descFa: "بوستر انرژی",
    emoji: "☕🍫",
    requiredItems: ["coffee", "chocolate"],
    bonus: { energy: 12, happiness: 6 },
  },
  {
    id: "milk_cookie",
    labelFa: "شیر و بیسکویت",
    descFa: "میان‌وعده کامل",
    emoji: "🥛🍪",
    requiredItems: ["milk_ramak", "cookie_hariri"],
    bonus: { happiness: 8, energy: 3 },
  },
];

/**
 * Returns the first matching combo given the current meal history
 * plus the newly eaten food item.
 */
export function detectCombo(
  newlyEatenId: string,
  mealHistory: string[],
): FoodCombo | null {
  const allEaten = [...mealHistory, newlyEatenId];
  for (const combo of FOOD_COMBOS) {
    const allPresent = combo.requiredItems.every((id) => allEaten.includes(id));
    if (allPresent) return combo;
  }
  return null;
}
