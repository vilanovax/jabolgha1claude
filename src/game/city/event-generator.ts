// ─── City Event Generator ───
// Selects and activates city events based on current wave, sector health, and day.

import { CITY_EVENT_TEMPLATES } from "./seed-events";
import type { CityWaveId, ActiveCityEvent, CityEvent, SectorState, SectorId } from "./types";

/**
 * Roll for new events at the start of each day.
 * Returns newly activated events (not including already-active ones).
 */
export function generateDailyEvents(params: {
  currentWaveId: CityWaveId;
  sectors: Record<SectorId, SectorState>;
  activeEvents: ActiveCityEvent[];
  dayInGame: number;
  economyHealth: number;
}): ActiveCityEvent[] {
  const { currentWaveId, sectors, activeEvents, dayInGame, economyHealth } = params;

  const activeIds = new Set(activeEvents.map((e) => e.id));

  // Build candidate list
  const candidates = CITY_EVENT_TEMPLATES.filter((tpl) => {
    // Skip already active
    if (activeIds.has(tpl.id)) return false;
    // Check wave constraint
    if (tpl.triggerWaves && !tpl.triggerWaves.includes(currentWaveId)) return false;
    return true;
  });

  if (candidates.length === 0) return [];

  // Score each candidate by sector health & economy state
  const scored = candidates.map((tpl) => {
    let weight = 1;

    // Higher weight if affected sectors are in distress or peak
    for (const sid of tpl.affectedSectors) {
      const h = sectors[sid].health;
      if (tpl.sectorHealthDelta < 0) {
        // Negative events more likely when sector is healthy (natural downturn)
        weight += (h / 100) * 1.5;
      } else {
        // Positive events more likely when sector is struggling
        weight += ((100 - h) / 100) * 1.5;
      }
    }

    // Economy health bias: crises more likely in low economy
    if (tpl.severity === "crisis") {
      weight *= (100 - economyHealth) / 80;
    } else if (tpl.severity === "major") {
      weight *= 0.8;
    }

    return { tpl, weight: Math.max(0.1, weight) };
  });

  // Pseudo-random roll (1 or 0 events per day, occasional 2)
  const roll = pseudoRandom(dayInGame, 0, 100);
  const maxNewEvents = roll > 85 ? 2 : roll > 50 ? 1 : 0;
  if (maxNewEvents === 0) return [];

  // Weighted selection
  const newEvents: ActiveCityEvent[] = [];
  const pool = [...scored];

  for (let i = 0; i < maxNewEvents && pool.length > 0; i++) {
    const totalWeight = pool.reduce((s, c) => s + c.weight, 0);
    let r = pseudoRandom(dayInGame + i * 37, 0, totalWeight * 100) / 100;
    let chosen: CityEvent | null = null;
    let chosenIdx = 0;
    for (let j = 0; j < pool.length; j++) {
      r -= pool[j].weight;
      if (r <= 0) {
        chosen = pool[j].tpl;
        chosenIdx = j;
        break;
      }
    }
    if (!chosen) {
      chosen = pool[pool.length - 1].tpl;
      chosenIdx = pool.length - 1;
    }

    pool.splice(chosenIdx, 1);
    newEvents.push({
      ...chosen,
      startedOnDay: dayInGame,
      remainingDays: chosen.durationDays,
    });
  }

  return newEvents;
}

/**
 * Tick existing events (reduce remainingDays by 1, remove expired).
 */
export function tickActiveEvents(events: ActiveCityEvent[]): ActiveCityEvent[] {
  return events
    .map((e) => ({ ...e, remainingDays: e.remainingDays - 1 }))
    .filter((e) => e.remainingDays > 0);
}

/** Simple deterministic pseudorandom (0 to max) */
function pseudoRandom(seed: number, min: number, max: number): number {
  const h = Math.abs(Math.sin(seed * 9301 + 49297) * 233280);
  return min + (h % (max - min));
}
