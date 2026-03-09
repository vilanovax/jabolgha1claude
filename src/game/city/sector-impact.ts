// ─── Sector Impact Resolver ───
// Applies wave modifiers and event impacts to sector states.
// Called once per day during city simulation.

import type { SectorState, SectorId, CityWave, ActiveCityEvent } from "./types";

const SECTOR_DEFAULTS: Record<SectorId, Omit<SectorState, "health" | "trend" | "salaryMultiplier" | "jobDemand">> = {
  tech:         { id: "tech",         nameFa: "فناوری",        emoji: "💻" },
  finance:      { id: "finance",      nameFa: "مالی",          emoji: "🏦" },
  construction: { id: "construction", nameFa: "ساخت‌وساز",    emoji: "🏗️" },
  retail:       { id: "retail",       nameFa: "خرده‌فروشی",   emoji: "🛍️" },
  services:     { id: "services",     nameFa: "خدمات",         emoji: "🔧" },
  manufacturing:{ id: "manufacturing",nameFa: "صنعت",          emoji: "🏭" },
};

export function createInitialSectors(): Record<SectorId, SectorState> {
  const sectors = {} as Record<SectorId, SectorState>;
  const ids: SectorId[] = ["tech", "finance", "construction", "retail", "services", "manufacturing"];
  for (const id of ids) {
    sectors[id] = {
      ...SECTOR_DEFAULTS[id],
      health: 60,
      trend: "flat",
      salaryMultiplier: 1.0,
      jobDemand: 50,
    };
  }
  return sectors;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Apply one day of wave + event effects to all sectors.
 * Returns a new sectors record (immutable).
 */
export function applyDailyImpacts(
  sectors: Record<SectorId, SectorState>,
  wave: CityWave,
  activeEvents: ActiveCityEvent[],
): Record<SectorId, SectorState> {
  const ids: SectorId[] = ["tech", "finance", "construction", "retail", "services", "manufacturing"];
  const updated = { ...sectors };

  for (const id of ids) {
    const prev = sectors[id];
    let healthDelta = 0;
    let salaryDelta = 0;
    let jobDemandDelta = 0;

    // Natural mean-reversion toward 60
    const meanReversion = (60 - prev.health) * 0.03;
    healthDelta += meanReversion;

    // Wave modifiers
    const waveMod = wave.sectorMods[id];
    if (waveMod) {
      healthDelta    += waveMod.healthDelta;
      salaryDelta    += waveMod.salaryMod;
      jobDemandDelta += waveMod.jobDemandDelta;
    }

    // Event modifiers
    for (const ev of activeEvents) {
      if (ev.affectedSectors.includes(id)) {
        healthDelta    += ev.sectorHealthDelta;
        salaryDelta    += ev.salaryImpact;
        jobDemandDelta += ev.jobDemandDelta;
      }
    }

    const newHealth = clamp(prev.health + healthDelta, 0, 100);
    const newSalary = clamp(prev.salaryMultiplier + salaryDelta, 0.5, 1.8);
    const newDemand = clamp(prev.jobDemand + jobDemandDelta, 0, 100);

    const trend: "up" | "flat" | "down" =
      healthDelta > 0.5 ? "up" : healthDelta < -0.5 ? "down" : "flat";

    updated[id] = {
      ...prev,
      health: Math.round(newHealth * 10) / 10,
      salaryMultiplier: Math.round(newSalary * 100) / 100,
      jobDemand: Math.round(newDemand),
      trend,
    };
  }

  return updated;
}

/**
 * Calculate a composite economy health score (0-100) from all sectors.
 */
export function calcEconomyHealth(sectors: Record<SectorId, SectorState>): number {
  const weights: Record<SectorId, number> = {
    tech:         0.25,
    finance:      0.20,
    construction: 0.15,
    retail:       0.15,
    services:     0.15,
    manufacturing:0.10,
  };
  let total = 0;
  for (const [id, w] of Object.entries(weights) as [SectorId, number][]) {
    total += sectors[id].health * w;
  }
  return Math.round(total);
}
