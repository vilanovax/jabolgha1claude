// ─── Reward Scaling & Resolution ───
// Scales mission rewards based on player level and mission category.

import type { MissionCategory, MissionRewards } from "./types";

// Scale money targets based on player level
export function scaleMoneyTarget(base: number, playerLevel: number): number {
  // Each level increases money targets by ~15%
  const multiplier = 1 + (playerLevel - 1) * 0.15;
  return Math.round(base * multiplier);
}

// Scale XP rewards based on player level
export function scaleXpReward(base: number, playerLevel: number): number {
  // XP rewards grow slowly to keep progression meaningful
  const multiplier = 1 + (playerLevel - 1) * 0.08;
  return Math.round(base * multiplier);
}

// Scale full reward set
export function scaleMissionRewards(
  category: MissionCategory,
  baseRewards: MissionRewards,
  playerLevel: number
): MissionRewards {
  const scaled = { ...baseRewards };

  // Scale money
  if (scaled.money) {
    scaled.money = scaleMoneyTarget(scaled.money, playerLevel);
  }

  // Scale XP
  if (scaled.xp) {
    scaled.xp = scaleXpReward(scaled.xp, playerLevel);
  }

  // Category multipliers for stars (keep them rare)
  if (scaled.stars) {
    switch (category) {
      case "daily":
        scaled.stars = Math.min(scaled.stars, 1);
        break;
      case "weekly":
        scaled.stars = Math.min(scaled.stars, 3);
        break;
      case "achievement":
      case "story":
        // No cap
        break;
      default:
        scaled.stars = Math.min(scaled.stars, 2);
    }
  }

  return scaled;
}

// Get reward preview strings for UI
export function getMissionRewardPreviewFa(rewards: MissionRewards): string[] {
  const parts: string[] = [];

  if (rewards.xp) parts.push(`+${rewards.xp} XP`);
  if (rewards.stars) parts.push(`+${rewards.stars} ⭐`);
  if (rewards.money) {
    const formatted = rewards.money >= 1_000_000
      ? `${(rewards.money / 1_000_000).toFixed(1)}M`
      : `${(rewards.money / 1_000).toFixed(0)}K`;
    parts.push(`+${formatted} 💰`);
  }
  if (rewards.energy) parts.push(`+${rewards.energy} ⚡`);
  if (rewards.happiness) parts.push(`+${rewards.happiness} 😊`);
  if (rewards.badges?.length) parts.push(`🏅 ${rewards.badges.join(", ")}`);
  if (rewards.titles?.length) parts.push(`🎖️ ${rewards.titles.join(", ")}`);

  return parts;
}
