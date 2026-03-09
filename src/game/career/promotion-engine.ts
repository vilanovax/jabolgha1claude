// ─── Promotion Engine ───
// Checks if a career track is ready for the next level.
// Promotion is explicit — never automatic.

import type { CareerProgress, PromotionResult } from "./types";
import {
  CAREER_LADDER,
  getNextLevel,
  getLevelIndex,
} from "./career-config";

/**
 * Check whether the player is eligible to be promoted in a given track.
 * Returns full result including missing requirements in Persian.
 */
export function checkCareerPromotionEligibility(
  progress: CareerProgress,
): PromotionResult {
  const nextLevel = getNextLevel(progress.level);
  if (!nextLevel) {
    return {
      eligible: false,
      missingRequirementsFa: ["شما به بالاترین سطح رسیده‌اید."],
      readinessPercent: 100,
    };
  }

  const def = CAREER_LADDER.find((d) => d.level === nextLevel);
  if (!def) {
    return { eligible: false, missingRequirementsFa: [], readinessPercent: 0 };
  }

  const missing: string[] = [];

  if (progress.careerXp < def.minCareerXp) {
    missing.push(
      `تجربه حرفه‌ای: ${progress.careerXp} / ${def.minCareerXp} XP شغلی`,
    );
  }
  if (progress.yearsOfExperience < def.minYearsOfExperience) {
    missing.push(
      `سابقه کاری: ${progress.yearsOfExperience.toFixed(1)} / ${def.minYearsOfExperience} سال`,
    );
  }
  if (progress.professionalReputation < def.minReputation) {
    missing.push(
      `اعتبار حرفه‌ای: ${progress.professionalReputation} / ${def.minReputation}`,
    );
  }
  if (def.minCompletedShifts && progress.completedWorkShifts < def.minCompletedShifts) {
    missing.push(
      `شیفت‌های کاری: ${progress.completedWorkShifts} / ${def.minCompletedShifts} شیفت`,
    );
  }
  if (def.minAcceptedJobs && progress.acceptedJobsCount < def.minAcceptedJobs) {
    missing.push(
      `قبولی شغل: ${progress.acceptedJobsCount} / ${def.minAcceptedJobs} بار`,
    );
  }

  // Calculate readiness as weighted progress toward all requirements
  const scores: number[] = [
    Math.min(1, def.minCareerXp > 0 ? progress.careerXp / def.minCareerXp : 1),
    Math.min(1, def.minYearsOfExperience > 0 ? progress.yearsOfExperience / def.minYearsOfExperience : 1),
    Math.min(1, def.minReputation > 0 ? progress.professionalReputation / def.minReputation : 1),
    Math.min(1, def.minCompletedShifts ? progress.completedWorkShifts / def.minCompletedShifts : 1),
    Math.min(1, def.minAcceptedJobs ? progress.acceptedJobsCount / def.minAcceptedJobs : 1),
  ];
  const readinessPercent = Math.round(
    (scores.reduce((a, b) => a + b, 0) / scores.length) * 100,
  );

  return {
    eligible: missing.length === 0,
    nextLevel: missing.length === 0 ? nextLevel : undefined,
    missingRequirementsFa: missing,
    readinessPercent,
  };
}

/**
 * Apply promotion — returns updated progress (immutable).
 * Caller must verify eligibility first.
 */
export function applyPromotion(progress: CareerProgress): CareerProgress {
  const nextLevel = getNextLevel(progress.level);
  if (!nextLevel) return progress;

  const { CAREER_TITLE_MAP } = require("./career-config") as typeof import("./career-config");

  return {
    ...progress,
    level: nextLevel,
    roleTitleFa: CAREER_TITLE_MAP[progress.track][nextLevel],
  };
}

/**
 * Determine whether a job's seniority key is a good fit for the player's career level.
 * Returns a bonus/penalty multiplier for hiring chance: 1.0 = neutral, <1 = penalty, >1 = bonus.
 */
export function getCareerLevelFitMultiplier(
  playerLevel: string,
  jobSeniorityKey: string, // "junior" | "mid" | "senior"
): number {
  const SENIORITY_LEVEL_MAP: Record<string, string> = {
    junior: "junior",
    mid:    "mid",
    senior: "senior",
  };
  const jobLevel = SENIORITY_LEVEL_MAP[jobSeniorityKey] ?? "junior";

  // Map player career level to seniority bucket
  const careerToSeniority: Record<string, string> = {
    intern:    "intern",
    junior:    "junior",
    mid:       "mid",
    senior:    "senior",
    lead:      "senior",
    manager:   "senior",
    executive: "senior",
  };
  const playerBucket = careerToSeniority[playerLevel] ?? "junior";

  if (playerBucket === jobLevel) return 1.15;                // perfect fit
  if (playerBucket === "intern" && jobLevel === "junior") return 0.75; // slightly below
  if (playerBucket === "junior" && jobLevel === "mid")  return 0.7;
  if (playerBucket === "junior" && jobLevel === "senior") return 0.35; // overreach
  if (playerBucket === "mid"    && jobLevel === "junior") return 1.1;  // overqualified but ok
  if (playerBucket === "mid"    && jobLevel === "senior") return 0.7;
  if (playerBucket === "senior" && jobLevel === "mid")  return 1.05;  // overqualified
  if (playerBucket === "senior" && jobLevel === "junior") return 1.0;
  return 1.0;
}

/**
 * Career level fit label for UI.
 */
export function getCareerFitLabelFa(
  playerLevel: string,
  jobSeniorityKey: string,
): { label: string; color: string } | null {
  const multiplier = getCareerLevelFitMultiplier(playerLevel, jobSeniorityKey);
  if (multiplier >= 1.1) return { label: "مناسب سطح شما", color: "#4ade80" };
  if (multiplier >= 0.8) return { label: "قابل دسترس", color: "#fbbf24" };
  if (multiplier < 0.5)  return { label: "سطح بالا", color: "#f87171" };
  return null;
}

/**
 * Compare two career levels. Returns negative if a < b, 0 if equal, positive if a > b.
 */
export function compareCareerLevels(a: string, b: string): number {
  return getLevelIndex(a as never) - getLevelIndex(b as never);
}
