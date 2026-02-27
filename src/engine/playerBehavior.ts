import type { EconomicIndicators, PlayerBehaviorSignals } from "./types";

function lerp(current: number, target: number, speed: number): number {
  return current + (target - current) * speed;
}

function jitter(range: number): number {
  return (Math.random() - 0.5) * range;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function simulateBehavior(
  indicators: EconomicIndicators,
  prev: PlayerBehaviorSignals,
): PlayerBehaviorSignals {
  const itJobsTakenPct = clamp(
    lerp(prev.itJobsTakenPct, indicators.IT_Demand * 0.8 + jitter(5), 0.15),
    0, 100,
  );

  const dollarInvestorsPct = clamp(
    lerp(prev.dollarInvestorsPct, indicators.Inflation_Index * 0.5 + indicators.Import_Pressure * 0.3 + jitter(5), 0.15),
    0, 100,
  );

  const unemployedPct = clamp(
    lerp(prev.unemployedPct, indicators.Unemployment_Rate * 0.7 + jitter(3), 0.15),
    0, 100,
  );

  const studyingPct = clamp(
    lerp(prev.studyingPct, indicators.Education_Boom * 0.6 + indicators.Unemployment_Rate * 0.2 + jitter(3), 0.15),
    0, 100,
  );

  const startupFoundersPct = clamp(
    lerp(prev.startupFoundersPct, indicators.Startup_Growth * 0.5 + jitter(4), 0.15),
    0, 100,
  );

  const avgITSkillLevel = clamp(
    lerp(prev.avgITSkillLevel, 3 + indicators.Education_Boom * 0.04 + indicators.IT_Demand * 0.03, 0.05),
    1, 10,
  );

  return { itJobsTakenPct, dollarInvestorsPct, unemployedPct, studyingPct, startupFoundersPct, avgITSkillLevel };
}
