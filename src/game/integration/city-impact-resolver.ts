// ─── City Impact Resolver ───
// Single source of truth: converts CityState → CityGameplayModifiers.
// All gameplay systems consume these modifiers — keeps integration de-coupled.

import type { CityState, SectorId } from "@/game/city/types";
import { CITY_WAVES } from "@/game/city/seed-waves";
import { getCostOfLivingMultiplier, getInvestmentMultiplier } from "@/game/city/city-helpers";

// ── Asset types for investment ──
export type InvestmentAsset =
  | "stocks"
  | "crypto"
  | "gold"
  | "startup"
  | "bank_savings"
  | "real_estate";

export interface CityGameplayModifiers {
  /** Per-sector salary/hiring modifiers for Job Market */
  jobMarket: {
    salaryMultiplierBySector: Record<SectorId, number>;
    hiringChanceModifierBySector: Record<SectorId, number>; // additive %, e.g. +0.12
    jobListingCountMultiplierBySector: Record<SectorId, number>;
  };

  /** Investment return/risk modifiers */
  investment: {
    returnModifierByAsset: Record<InvestmentAsset, number>; // multiplicative, e.g. 1.15
    riskModifierByAsset: Record<InvestmentAsset, number>;   // additive chance, e.g. +0.05
  };

  /** Living cost modifiers */
  economy: {
    costOfLivingMultiplier: number; // 0.8–1.45
    rentMultiplier: number;
    foodPriceMultiplier: number;
    transportMultiplier: number;
  };

  /** Tags that unlock special mission types */
  missions: {
    eventMissionTypes: string[]; // e.g. ["tech_boom_event", "inflation_event"]
    missionWeightBoosts: Partial<Record<string, number>>; // template-id → weight boost
  };
}

const SECTOR_IDS: SectorId[] = [
  "tech", "finance", "construction", "retail", "services", "manufacturing",
];

/**
 * Derive full gameplay modifiers from current city state.
 * Pure function — no side effects.
 */
export function getCityGameplayModifiers(cityState: CityState): CityGameplayModifiers {
  const wave = CITY_WAVES[cityState.currentWaveId];
  const sectors = cityState.sectors;

  // ── Job Market ──
  const salaryMult: Record<SectorId, number> = {} as Record<SectorId, number>;
  const hiringMod: Record<SectorId, number> = {} as Record<SectorId, number>;
  const listingMult: Record<SectorId, number> = {} as Record<SectorId, number>;

  for (const id of SECTOR_IDS) {
    const sector = sectors[id];
    const health = sector.health;

    // Salary: from sector's own multiplier (already updated daily by simulation)
    salaryMult[id] = sector.salaryMultiplier;

    // Hiring chance: health > 60 → positive modifier, health < 40 → negative
    hiringMod[id] = (health - 50) / 500; // maps 0–100 → -0.10 to +0.10

    // Job listing count: high demand = more listings
    listingMult[id] = 0.5 + (sector.jobDemand / 100);
  }

  // ── Investment ──
  const investMult = getInvestmentMultiplier(cityState);
  const inflationHigh = cityState.inflationLevel > 60;
  const recession = cityState.currentWaveId === "recession";
  const financeBull = cityState.currentWaveId === "finance_bull";
  const techBoom = cityState.currentWaveId === "tech_boom";

  const returnByAsset: Record<InvestmentAsset, number> = {
    stocks:       financeBull ? 1.35 : recession ? 0.75 : investMult,
    crypto:       techBoom ? 1.4 : recession ? 0.6 : investMult * 0.95,
    gold:         inflationHigh ? 1.25 : recession ? 1.15 : 1.05,
    startup:      techBoom ? 1.3 : recession ? 0.7 : investMult * 1.05,
    bank_savings: inflationHigh ? 0.9 : 1.08, // real return eroded by inflation
    real_estate:  cityState.currentWaveId === "construction_surge" ? 1.2 : 1.05,
  };

  const riskByAsset: Record<InvestmentAsset, number> = {
    stocks:       recession ? 0.25 : 0.1,
    crypto:       recession ? 0.35 : 0.15,
    gold:         0.05,
    startup:      recession ? 0.4 : 0.2,
    bank_savings: 0.0,
    real_estate:  0.05,
  };

  // ── Economy ──
  const colMult = getCostOfLivingMultiplier(cityState);

  // ── Missions ──
  const eventMissionTypes: string[] = cityState.activeEvents
    .filter((ev) => ev.missionEventTag)
    .map((ev) => ev.missionEventTag!);

  // Wave-based mission weight boosts
  const missionWeightBoosts: Partial<Record<string, number>> = {};
  if (techBoom) {
    missionWeightBoosts["tech_career"] = 1.5;
    missionWeightBoosts["study_tech"] = 1.3;
  }
  if (recession) {
    missionWeightBoosts["financial_survival"] = 2.0;
    missionWeightBoosts["save_money"] = 1.8;
  }
  if (cityState.currentWaveId === "retail_holiday") {
    missionWeightBoosts["earn_money"] = 1.5;
  }

  return {
    jobMarket: {
      salaryMultiplierBySector: salaryMult,
      hiringChanceModifierBySector: hiringMod,
      jobListingCountMultiplierBySector: listingMult,
    },
    investment: {
      returnModifierByAsset: returnByAsset,
      riskModifierByAsset: riskByAsset,
    },
    economy: {
      costOfLivingMultiplier: colMult,
      rentMultiplier: 1 + (cityState.inflationLevel - 45) / 200,
      foodPriceMultiplier: 1 + (cityState.inflationLevel - 45) / 350,
      transportMultiplier: 1 + (cityState.inflationLevel - 45) / 600,
    },
    missions: {
      eventMissionTypes,
      missionWeightBoosts,
    },
  };
}
