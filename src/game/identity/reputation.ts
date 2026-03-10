// ─── Reputation System ────────────────────────────────────────

import type { PlayerReputation, ReputationTier } from "./types";

export function getReputationTier(value: number): ReputationTier {
  if (value >= 80) return "city_star";
  if (value >= 60) return "well_known";
  if (value >= 40) return "professional";
  if (value >= 20) return "trusted";
  return "unknown";
}

export function getReputationTierLabelFa(tier: ReputationTier): string {
  switch (tier) {
    case "city_star":   return "ستاره شهر";
    case "well_known":  return "شناخته‌شده";
    case "professional": return "حرفه‌ای";
    case "trusted":     return "قابل اعتماد";
    case "unknown":     return "ناشناس";
  }
}

export function getReputationTierColor(tier: ReputationTier): string {
  switch (tier) {
    case "city_star":   return "#F0C966";   // gold
    case "well_known":  return "#a78bfa";   // purple
    case "professional": return "#60a5fa";  // blue
    case "trusted":     return "#4ade80";   // green
    case "unknown":     return "rgba(255,255,255,0.3)";
  }
}

export function buildReputation(value: number): PlayerReputation {
  return {
    value: Math.max(0, Math.min(100, value)),
    tier: getReputationTier(value),
  };
}

// ─── Reputation change events ─────────────────────────────────

export type ReputationEvent =
  | "work_shift_completed"
  | "mission_completed"
  | "opportunity_taken"
  | "job_accepted"
  | "loan_defaulted"
  | "bill_missed"
  | "opportunity_failed"
  | "scam_caught";

const REPUTATION_DELTAS: Record<ReputationEvent, number> = {
  work_shift_completed:  1,
  mission_completed:     2,
  opportunity_taken:     3,
  job_accepted:          3,
  loan_defaulted:        -8,
  bill_missed:           -4,
  opportunity_failed:    -3,
  scam_caught:           -10,
};

export function applyReputationEvent(
  current: number,
  event: ReputationEvent,
): number {
  return Math.max(0, Math.min(100, current + (REPUTATION_DELTAS[event] ?? 0)));
}
