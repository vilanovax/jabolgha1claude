// ─── City Helpers ───
// Player-facing query functions — call these from UI or game logic.

import type { CityState, SectorId, CityPlayerSummary } from "./types";
import { CITY_WAVES } from "./seed-waves";

/**
 * Get the effective salary multiplier for a specific job sector.
 * Combines sector health, active events, and wave bonus.
 */
export function getSectorSalaryMultiplier(state: CityState, sectorId: SectorId): number {
  return state.sectors[sectorId]?.salaryMultiplier ?? 1.0;
}

/**
 * Get the effective investment return multiplier (wave + finance sector health).
 */
export function getInvestmentMultiplier(state: CityState): number {
  const wave = CITY_WAVES[state.currentWaveId];
  const financeHealth = state.sectors.finance?.health ?? 60;

  let multiplier = wave.investmentBonus;

  // Events that have investmentImpact affect the total
  for (const ev of state.activeEvents) {
    multiplier += ev.investmentImpact;
  }

  // Finance sector health modulates ±20%
  const financeMod = (financeHealth - 60) / 60 * 0.2;
  multiplier += financeMod;

  return Math.max(0.4, Math.round(multiplier * 100) / 100);
}

/**
 * Get the cost-of-living multiplier (higher = more expensive daily life).
 * Based on inflation level (0-100 → 0.8x to 1.5x).
 */
export function getCostOfLivingMultiplier(state: CityState): number {
  // Inflation 45 (normal) → 1.0x
  // Inflation 90 → 1.45x
  // Inflation 10 → 0.80x
  const mult = 0.80 + (state.inflationLevel / 100) * 0.65;
  return Math.round(mult * 100) / 100;
}

/**
 * Build a full CityPlayerSummary for UI consumption.
 */
export function getCityPlayerSummary(state: CityState): CityPlayerSummary {
  const wave = CITY_WAVES[state.currentWaveId];
  return {
    economyHealth: state.economyHealth,
    waveNameFa: wave.nameFa,
    waveEmoji: wave.emoji,
    waveDescFa: wave.descriptionFa,
    sectors: Object.values(state.sectors),
    activeEvents: state.activeEvents,
    salaryMultiplierForSector: (sectorId: SectorId) =>
      getSectorSalaryMultiplier(state, sectorId),
    investmentMultiplier: getInvestmentMultiplier(state),
    costOfLivingMultiplier: getCostOfLivingMultiplier(state),
  };
}

/**
 * Map a job category to the most relevant city sector.
 * Used to get salary multiplier for job listings.
 */
export function jobCategoryToSector(category: string): SectorId {
  const mapping: Record<string, SectorId> = {
    it: "tech",
    programming: "tech",
    design: "tech",
    marketing: "services",
    finance: "finance",
    accounting: "finance",
    construction: "construction",
    engineering: "construction",
    retail: "retail",
    sales: "retail",
    logistics: "manufacturing",
    manufacturing: "manufacturing",
    food: "services",
    healthcare: "services",
    education: "services",
  };
  return mapping[category.toLowerCase()] ?? "services";
}

/**
 * Get a Persian label for economy health score.
 */
export function getEconomyHealthLabelFa(health: number): { label: string; color: string } {
  if (health >= 75) return { label: "رونق", color: "#4ade80" };
  if (health >= 55) return { label: "پایدار", color: "#60a5fa" };
  if (health >= 35) return { label: "پرنوسان", color: "#fbbf24" };
  return { label: "رکود", color: "#f87171" };
}

/**
 * Returns sector trend icon for UI.
 */
export function trendIcon(trend: "up" | "flat" | "down"): string {
  if (trend === "up")   return "↑";
  if (trend === "down") return "↓";
  return "→";
}

/**
 * Returns sector trend color for UI.
 */
export function trendColor(trend: "up" | "flat" | "down"): string {
  if (trend === "up")   return "#4ade80";
  if (trend === "down") return "#f87171";
  return "#94a3b8";
}
