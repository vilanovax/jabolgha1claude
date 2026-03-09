// ─── Career UI Helpers ───
// UI-facing selectors that return display-ready strings.

import type { PlayerCareerState, CareerTrack } from "./types";
import { getNextLevel, CAREER_TITLE_MAP, LEVEL_ORDER } from "./career-config";
import { checkCareerPromotionEligibility } from "./promotion-engine";

/** Get the primary CareerProgress or undefined */
export function getPrimaryCareerProgress(state: PlayerCareerState) {
  if (!state.primaryTrack) return undefined;
  return state.trackProgress[state.primaryTrack];
}

/** Get the next career level label in Persian */
export function getNextCareerLevelLabelFa(state: PlayerCareerState): string | null {
  const p = getPrimaryCareerProgress(state);
  if (!p) return null;
  const next = getNextLevel(p.level);
  if (!next) return null;
  return CAREER_TITLE_MAP[p.track][next];
}

/** Promotion readiness 0-100% */
export function getPromotionReadinessPercent(state: PlayerCareerState): number {
  const p = getPrimaryCareerProgress(state);
  if (!p) return 0;
  const result = checkCareerPromotionEligibility(p);
  return result.readinessPercent;
}

/** Missing requirements in Persian for promotion */
export function getPromotionMissingRequirementsFa(state: PlayerCareerState): string[] {
  const p = getPrimaryCareerProgress(state);
  if (!p) return [];
  return checkCareerPromotionEligibility(p).missingRequirementsFa;
}

/** Human-readable career summary for profile/jobs page */
export function getCareerSummaryFa(state: PlayerCareerState): {
  trackLabelFa: string;
  levelLabelFa: string;
  roleTitleFa: string;
  yearsOfExp: string;
  reputation: number;
  careerXp: number;
  readinessPercent: number;
  nextRoleTitleFa: string | null;
  isMaxLevel: boolean;
} {
  const p = getPrimaryCareerProgress(state);

  const { CAREER_TRACK_META } = require("./seed-career-tracks") as typeof import("./seed-career-tracks");
  const trackMeta = p ? CAREER_TRACK_META.find((m: { id: CareerTrack }) => m.id === p.track) : null;

  if (!p) {
    return {
      trackLabelFa: "مسیر شغلی انتخاب نشده",
      levelLabelFa: "کارآموز",
      roleTitleFa: "بدون عنوان شغلی",
      yearsOfExp: "۰",
      reputation: 0,
      careerXp: 0,
      readinessPercent: 0,
      nextRoleTitleFa: null,
      isMaxLevel: false,
    };
  }

  const LEVEL_LABELS_FA: Record<string, string> = {
    intern:    "کارآموز",
    junior:    "جونیور",
    mid:       "میدل",
    senior:    "سینیور",
    lead:      "لید",
    manager:   "مدیر",
    executive: "اجرایی",
  };

  const nextLevel = getNextLevel(p.level);
  const nextRoleTitleFa = nextLevel ? CAREER_TITLE_MAP[p.track][nextLevel] : null;
  const result = checkCareerPromotionEligibility(p);

  return {
    trackLabelFa: trackMeta?.labelFa ?? p.track,
    levelLabelFa: LEVEL_LABELS_FA[p.level] ?? p.level,
    roleTitleFa: p.roleTitleFa,
    yearsOfExp: p.yearsOfExperience < 1
      ? `${Math.round(p.yearsOfExperience * 12)} ماه`
      : `${p.yearsOfExperience.toFixed(1)} سال`,
    reputation: p.professionalReputation,
    careerXp: p.careerXp,
    readinessPercent: result.readinessPercent,
    nextRoleTitleFa,
    isMaxLevel: !nextLevel,
  };
}

/** Which career levels exist above the current, as ordered labels */
export function getCareerRoadmapFa(track: CareerTrack, currentLevel: string): Array<{
  level: string;
  titleFa: string;
  unlocked: boolean;
}> {
  const currentIdx = LEVEL_ORDER.indexOf(currentLevel as never);
  return LEVEL_ORDER.map((level, i) => ({
    level,
    titleFa: CAREER_TITLE_MAP[track][level],
    unlocked: i <= currentIdx,
  }));
}
