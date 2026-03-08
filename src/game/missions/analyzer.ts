// ─── Player State Analyzer ───
// Reads player context and produces a behavioral profile for mission selection.

import type { MissionGenerationContext, PlayerMissionProfile } from "./types";

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

export function analyzePlayerForMissions(
  ctx: MissionGenerationContext
): PlayerMissionProfile {
  const p = ctx.player;

  // Financial pressure: high if money is low, debt is high, no savings
  const moneyScore = clamp(1 - p.money / 20_000_000); // pressure grows below 20M
  const debtScore = clamp(p.debt / 50_000_000);
  const savingsScore = clamp(1 - p.savings / 10_000_000);
  const noJob = p.currentJobId ? 0 : 0.3;
  const financialPressure = clamp(
    moneyScore * 0.35 + debtScore * 0.25 + savingsScore * 0.2 + noJob
  );

  // Burnout risk: high stress, many work shifts, low rest
  const stressScore = clamp(p.stress / 100);
  const overwork = clamp(p.workShiftsLast7Days / 7);
  const lowRest = clamp(1 - p.restSessionsLast7Days / 3);
  const burnoutRisk = clamp(
    stressScore * 0.4 + overwork * 0.3 + lowRest * 0.3
  );

  // Career momentum: studying + working + not too many rejections
  const studyActive = clamp(p.studySessionsLast7Days / 5);
  const workActive = clamp(p.workShiftsLast7Days / 5);
  const rejectPenalty = clamp(p.jobRejectionsLast7Days / 3);
  const careerMomentum = clamp(
    studyActive * 0.4 + workActive * 0.4 - rejectPenalty * 0.2
  );

  // Growth need: low level, low xp, not studying much
  const levelNeed = clamp(1 - p.level / 10);
  const studyNeed = clamp(1 - p.studySessionsLast7Days / 4);
  const growthNeed = clamp(levelNeed * 0.5 + studyNeed * 0.5);

  // Exploration need: inverse of routine consistency
  const explorationNeed = clamp(1 - p.routineConsistencyScore);

  // Routine strength
  const routineStrength = clamp(p.routineConsistencyScore);

  // Story readiness: sufficient level, not too stressed, some money
  const storyReadiness = clamp(
    (1 - stressScore) * 0.3 +
    clamp(p.money / 5_000_000) * 0.3 +
    clamp(p.level / 3) * 0.4
  );

  // Struggling: composite check
  const struggling =
    (p.money < 2_000_000 && p.savings < 1_000_000) ||
    p.jobRejectionsLast7Days >= 3 ||
    p.stress > 80 ||
    (p.energy < 20 && p.happiness < 20);

  return {
    growthNeed,
    financialPressure,
    burnoutRisk,
    careerMomentum,
    explorationNeed,
    routineStrength,
    storyReadiness,
    struggling,
  };
}
