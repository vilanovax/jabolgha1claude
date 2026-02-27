import type { EconomicIndicators, IndicatorKey, WavePhase } from "./types";

const WAVE_BIAS: Record<WavePhase, Record<IndicatorKey, number>> = {
  startup_wave:   { IT_Demand: +2, Startup_Growth: +3, Inflation_Index: +1, Unemployment_Rate: -1, Education_Boom: +1, Import_Pressure: 0 },
  it_growth:      { IT_Demand: +3, Startup_Growth: +1, Inflation_Index: +1, Unemployment_Rate: -2, Education_Boom: +2, Import_Pressure: +1 },
  saturation:     { IT_Demand: -1, Startup_Growth: -2, Inflation_Index: +2, Unemployment_Rate: +1, Education_Boom: 0, Import_Pressure: +2 },
  mini_recession: { IT_Demand: -2, Startup_Growth: -3, Inflation_Index: +3, Unemployment_Rate: +3, Education_Boom: -1, Import_Pressure: +1 },
  recovery:       { IT_Demand: +1, Startup_Growth: +1, Inflation_Index: -1, Unemployment_Rate: -1, Education_Boom: +1, Import_Pressure: -1 },
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function driftIndicators(
  current: EconomicIndicators,
  wavePhase: WavePhase,
): EconomicIndicators {
  const bias = WAVE_BIAS[wavePhase];
  const result = { ...current };

  for (const key of Object.keys(current) as IndicatorKey[]) {
    const phaseBias = bias[key] * 0.3;
    const noise = (Math.random() - 0.5) * 2;
    const meanRevert = (50 - current[key]) * 0.02;
    const delta = phaseBias + noise + meanRevert;
    result[key] = clamp(current[key] + delta, 0, 100);
  }

  return result;
}
