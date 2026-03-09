// ─── City Wave Engine ───
// Manages wave transitions on a day-by-day basis.

import { CITY_WAVES, WAVE_CYCLE_ORDER } from "./seed-waves";
import type { CityWaveId, CityWave } from "./types";

/**
 * Get the CityWave object for a given wave ID.
 */
export function getCityWave(id: CityWaveId): CityWave {
  return CITY_WAVES[id];
}

/**
 * Get the duration for a wave (random between min and max).
 */
export function getWaveDuration(wave: CityWave, dayInGame: number): number {
  // Deterministic pseudorandom using game day
  const span = wave.maxDays - wave.minDays;
  const pseudo = ((dayInGame * 7 + wave.id.length * 3) % (span + 1));
  return wave.minDays + pseudo;
}

/**
 * Get the next wave ID in the cycle, given the current one.
 */
export function getNextWaveId(currentWaveId: CityWaveId, cyclePosition: number): CityWaveId {
  const nextIndex = (cyclePosition + 1) % WAVE_CYCLE_ORDER.length;
  return WAVE_CYCLE_ORDER[nextIndex];
}

/**
 * Check if the current wave should transition to the next one.
 * Returns: { transitioned, newWaveId, newRemainingDays, newCyclePosition }
 */
export function checkWaveDayTransition(params: {
  currentWaveId: CityWaveId;
  waveRemainingDays: number;
  waveElapsedDays: number;
  cyclePosition: number;
  dayInGame: number;
}): {
  transitioned: boolean;
  newWaveId: CityWaveId;
  newRemainingDays: number;
  newWaveElapsedDays: number;
  newCyclePosition: number;
} {
  const { currentWaveId, waveRemainingDays, waveElapsedDays, cyclePosition, dayInGame } = params;

  if (waveRemainingDays > 1) {
    return {
      transitioned: false,
      newWaveId: currentWaveId,
      newRemainingDays: waveRemainingDays - 1,
      newWaveElapsedDays: waveElapsedDays + 1,
      newCyclePosition: cyclePosition,
    };
  }

  // Time to transition
  const newCyclePosition = (cyclePosition + 1) % WAVE_CYCLE_ORDER.length;
  const newWaveId = WAVE_CYCLE_ORDER[newCyclePosition];
  const newWave = CITY_WAVES[newWaveId];
  const newDuration = getWaveDuration(newWave, dayInGame);

  return {
    transitioned: true,
    newWaveId,
    newRemainingDays: newDuration,
    newWaveElapsedDays: 0,
    newCyclePosition,
  };
}
