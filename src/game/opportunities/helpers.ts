import { toPersian } from "@/data/mock";
import type { Opportunity, OpportunityType } from "./types";

export function getVisibleOpportunities(
  opportunities: Opportunity[],
  currentDay: number,
): Opportunity[] {
  return opportunities.filter(
    (o) => o.status === "available" && o.expiresAtDay >= currentDay,
  );
}

export function getOpportunityCountdownTextFa(
  opportunity: Opportunity,
  currentDay: number,
): string {
  const daysLeft = opportunity.expiresAtDay - currentDay;

  if (daysLeft <= 0) {
    return "منقضی شده";
  }

  if (daysLeft === 1) {
    return "آخرین روز";
  }

  return toPersian(daysLeft) + " روز مانده";
}

export function getOpportunityRiskLabelFa(opportunity: Opportunity): string {
  // Check if any outcome has a negative money effect (loss)
  const hasLoss = opportunity.outcomes.some(
    (o) => o.effects.money !== undefined && o.effects.money < 0,
  );

  if (hasLoss) {
    return "ریسک بالا";
  }

  // Check if outcomes have significant spread (some much better than others)
  const moneyValues = opportunity.outcomes
    .filter((o) => o.effects.money !== undefined)
    .map((o) => o.effects.money as number);

  if (moneyValues.length >= 2) {
    const max = Math.max(...moneyValues);
    const min = Math.min(...moneyValues);
    // If spread > 50% of max value, consider it medium risk
    if (max > 0 && (max - min) / max > 0.5) {
      return "ریسک متوسط";
    }
  }

  return "ریسک کم";
}

export function getOpportunityRewardPreviewFa(opportunity: Opportunity): string {
  const moneyEffects = opportunity.outcomes
    .filter((o) => o.effects.money !== undefined && o.effects.money > 0)
    .map((o) => o.effects.money as number);

  if (moneyEffects.length === 0) {
    // No money reward — show XP if available
    const maxXp = Math.max(
      ...opportunity.outcomes
        .filter((o) => o.effects.xp !== undefined)
        .map((o) => o.effects.xp as number),
    );
    if (maxXp > 0) {
      return "بازده: +" + toPersian(maxXp) + " XP";
    }
    return "بازده: تجربه";
  }

  const maxMoney = Math.max(...moneyEffects);
  const minMoney = Math.min(...moneyEffects);

  if (maxMoney === minMoney) {
    return "بازده احتمالی: +" + formatMoneyShort(maxMoney);
  }

  return (
    "بازده احتمالی: +" +
    formatMoneyShort(minMoney) +
    " تا +" +
    formatMoneyShort(maxMoney)
  );
}

function formatMoneyShort(n: number): string {
  if (n >= 1_000_000_000) {
    return toPersian((n / 1_000_000_000).toFixed(1)) + "B";
  }
  if (n >= 1_000_000) {
    return toPersian((n / 1_000_000).toFixed(0)) + "M";
  }
  if (n >= 1_000) {
    return toPersian((n / 1_000).toFixed(0)) + "K";
  }
  return toPersian(n);
}

export function getOpportunityTypeEmojiAndLabel(type: OpportunityType): {
  emoji: string;
  labelFa: string;
} {
  switch (type) {
    case "economic":
      return { emoji: "💹", labelFa: "اقتصادی" };
    case "career":
      return { emoji: "💼", labelFa: "شغلی" };
    case "network":
      return { emoji: "🤝", labelFa: "شبکه" };
    case "skill":
      return { emoji: "📚", labelFa: "مهارتی" };
    case "city":
      return { emoji: "🌆", labelFa: "شهری" };
    case "lifestyle":
      return { emoji: "🏠", labelFa: "سبک زندگی" };
    default:
      return { emoji: "✨", labelFa: "فرصت" };
  }
}
