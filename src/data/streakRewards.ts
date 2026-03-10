export type StreakRewardDef =
  | { type: "energy";    amount: number; emoji: string; labelFa: string }
  | { type: "money";     amount: number; emoji: string; labelFa: string }
  | { type: "xp";        amount: number; emoji: string; labelFa: string }
  | { type: "ticket";                    emoji: string; labelFa: string }
  | { type: "coupon";                    emoji: string; labelFa: string }
  | { type: "room_item"; itemId: string; emoji: string; labelFa: string; descFa: string };

// 6-item repeating cycle — milestone days bypass this
export const STREAK_CYCLE: StreakRewardDef[] = [
  { type: "energy",  amount: 20,       emoji: "⚡", labelFa: "+۲۰ انرژی" },
  { type: "money",   amount: 50_000,   emoji: "💰", labelFa: "+۵۰ هزار تومان" },
  { type: "ticket",                    emoji: "🎫", labelFa: "بلیط شانس" },
  { type: "xp",     amount: 50,        emoji: "⭐", labelFa: "+۵۰ تجربه" },
  { type: "coupon",                    emoji: "🏷️", labelFa: "کوپن بازار ۲۰٪" },
  { type: "money",   amount: 100_000,  emoji: "💰", labelFa: "+۱۰۰ هزار تومان" },
];

// Milestone overrides — keyed by exact streak day number
export const STREAK_MILESTONES: Record<number, StreakRewardDef> = {
  7:  { type: "room_item", itemId: "coffee_machine",  emoji: "☕", labelFa: "دستگاه قهوه",   descFa: "+۱۰ انرژی روزانه" },
  14: { type: "room_item", itemId: "stationary_bike", emoji: "🚲", labelFa: "دوچرخه ثابت",  descFa: "+۸ انرژی + ۵ شادی روزانه" },
  30: { type: "room_item", itemId: "dual_monitor",    emoji: "🖥️", labelFa: "مانیتور دوگانه", descFa: "+۲۰٪ درآمد کاری" },
};

export function getStreakReward(streak: number): StreakRewardDef {
  if (STREAK_MILESTONES[streak]) return STREAK_MILESTONES[streak];
  return STREAK_CYCLE[(streak - 1) % STREAK_CYCLE.length];
}

// Passive work income bonus tiers
export const STREAK_BONUS_TIERS = [
  { minStreak: 30, workIncomeBonus: 0.10 },
  { minStreak: 14, workIncomeBonus: 0.07 },
  { minStreak: 10, workIncomeBonus: 0.05 },
];

export function getStreakWorkBonus(currentStreak: number): number {
  const tier = STREAK_BONUS_TIERS.find((t) => currentStreak >= t.minStreak);
  return tier?.workIncomeBonus ?? 0;
}
