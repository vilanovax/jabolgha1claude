// ─── Daily City Simulation ───
// Called once per day (in startNextDay) to advance the city state.
// Returns a new CityState — fully immutable.

import type { CityState } from "./types";
import { applyDailyImpacts, calcEconomyHealth } from "./sector-impact";
import { checkWaveDayTransition } from "./wave-engine";
import { generateDailyEvents, tickActiveEvents } from "./event-generator";
import { getCityWave } from "./wave-engine";
import { CITY_WAVES, WAVE_CYCLE_ORDER, INITIAL_CITY_WAVE } from "./seed-waves";
import { createInitialSectors } from "./sector-impact";

/** Default starting city state */
export function createInitialCityState(): CityState {
  const wave = CITY_WAVES[INITIAL_CITY_WAVE];
  return {
    sectors: createInitialSectors(),
    currentWaveId: INITIAL_CITY_WAVE,
    waveRemainingDays: wave.maxDays,
    waveElapsedDays: 0,
    activeEvents: [],
    economyHealth: 60,
    inflationLevel: 45,
    lastUpdatedDay: 0,
  };
}

/**
 * Run one full day of city simulation.
 * Call this from gameStore.startNextDay().
 */
export function runDailySimulation(state: CityState, dayInGame: number): CityState {
  // 1. Tick existing events (reduce remainingDays, remove expired)
  const tickedEvents = tickActiveEvents(state.activeEvents);

  // 2. Check wave transition
  const cyclePosition = WAVE_CYCLE_ORDER.indexOf(state.currentWaveId);
  const waveResult = checkWaveDayTransition({
    currentWaveId: state.currentWaveId,
    waveRemainingDays: state.waveRemainingDays,
    waveElapsedDays: state.waveElapsedDays,
    cyclePosition: cyclePosition === -1 ? 0 : cyclePosition,
    dayInGame,
  });

  const currentWave = getCityWave(waveResult.newWaveId);

  // 3. Apply daily sector impacts (wave + active events)
  const updatedSectors = applyDailyImpacts(state.sectors, currentWave, tickedEvents);

  // 4. Recalculate economy health
  const economyHealth = calcEconomyHealth(updatedSectors);

  // 5. Generate new events
  const newEvents = generateDailyEvents({
    currentWaveId: waveResult.newWaveId,
    sectors: updatedSectors,
    activeEvents: tickedEvents,
    dayInGame,
    economyHealth,
  });

  const allEvents = [...tickedEvents, ...newEvents];

  // 6. Update inflation level (slow drift based on wave)
  const inflationDelta = currentWave.globalInflationDelta;
  const newInflation = Math.max(10, Math.min(90,
    state.inflationLevel + inflationDelta - (state.inflationLevel - 45) * 0.02
  ));

  return {
    sectors: updatedSectors,
    currentWaveId: waveResult.newWaveId,
    waveRemainingDays: waveResult.newRemainingDays,
    waveElapsedDays: waveResult.newWaveElapsedDays,
    activeEvents: allEvents,
    economyHealth,
    inflationLevel: Math.round(newInflation * 10) / 10,
    lastUpdatedDay: dayInGame,
  };
}
