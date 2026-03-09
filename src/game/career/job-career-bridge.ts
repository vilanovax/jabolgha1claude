// ─── Job-Career Bridge ───
// Salary scaling and hiring chance calculation using career progression.

import type { CareerProgress } from "./types";
import { SALARY_MULTIPLIERS } from "./career-config";
import { getCareerLevelFitMultiplier } from "./promotion-engine";
import { inferCareerTrack } from "./seed-career-tracks";

/**
 * Calculate the city + career adjusted salary for a job level.
 */
export function calculateJobSalary(
  baseSalary: number,
  progress: CareerProgress | undefined,
  cityWaveMultiplier = 1.0,
): number {
  const levelMul = progress ? SALARY_MULTIPLIERS[progress.level] : 1.0;
  return Math.round(baseSalary * levelMul * cityWaveMultiplier);
}

export interface HiringChanceParams {
  baseChance: number;             // 35-75 base (from XP ratio)
  jobSeniorityKey: string;        // "junior" | "mid" | "senior"
  playerCareerProgress?: CareerProgress;
  cityHiringBoost?: number;       // additive %, e.g. 0.1 = +10%
  reputationBonus?: number;       // 0-100 scale → divided by 10 for %
}

/**
 * Full hiring chance calculation integrating career level fit, city demand, reputation.
 * Returns a percentage (0-100).
 */
export function calculateHiringChance({
  baseChance,
  jobSeniorityKey,
  playerCareerProgress,
  cityHiringBoost = 0,
  reputationBonus = 0,
}: HiringChanceParams): number {
  const careerLevel = playerCareerProgress?.level ?? "intern";
  const fitMul = getCareerLevelFitMultiplier(careerLevel, jobSeniorityKey);
  const repBonus = reputationBonus / 10; // rep 42 → +4.2%

  const total = baseChance * fitMul
    + cityHiringBoost * 100
    + repBonus;

  return Math.max(5, Math.min(95, Math.round(total)));
}

/**
 * Map job type / title to career track using seed track keywords.
 */
export function inferJobCareerTrack(
  jobType?: string,
  jobTitle?: string,
): ReturnType<typeof inferCareerTrack> {
  return inferCareerTrack(jobType, jobTitle);
}

/**
 * Simple gate: can the player even apply at this seniority given their career level?
 * Returns true if allowed, false if blocked (too high a tier to reach).
 */
export function isCareerLevelEligible(
  playerLevel: string,
  jobSeniorityKey: string,
): boolean {
  const BLOCK_MAP: Record<string, string[]> = {
    intern: [],                          // intern can try everything but with low chance
    junior: [],
    mid:    [],
    senior: [],
    lead:   [],
    manager: [],
    executive: [],
  };
  const blocked = BLOCK_MAP[playerLevel] ?? [];
  return !blocked.includes(jobSeniorityKey);
}
