// ─── Career Helpers ───
// Pure functions for career XP, experience, reputation, and event handlers.

import type { CareerProgress, CareerTrack } from "./types";
import {
  CAREER_XP_EVENTS,
  SHIFTS_PER_EXPERIENCE_YEAR,
  CAREER_TITLE_MAP,
  getNextLevel,
} from "./career-config";

/** Add career XP and return updated progress (immutable) */
export function gainCareerXp(
  progress: CareerProgress,
  amount: number,
): CareerProgress {
  return { ...progress, careerXp: progress.careerXp + amount };
}

/** Add professional reputation (capped at 100) and return updated progress */
export function gainProfessionalReputation(
  progress: CareerProgress,
  amount: number,
): CareerProgress {
  return {
    ...progress,
    professionalReputation: Math.min(100, progress.professionalReputation + amount),
  };
}

/** Lose professional reputation (floored at 0) */
export function loseProfessionalReputation(
  progress: CareerProgress,
  amount: number,
): CareerProgress {
  return {
    ...progress,
    professionalReputation: Math.max(0, progress.professionalReputation - amount),
  };
}

/**
 * Recompute yearsOfExperience from total completed shifts.
 * Returns updated progress.
 */
export function recomputeExperience(progress: CareerProgress): CareerProgress {
  const years = progress.completedWorkShifts / SHIFTS_PER_EXPERIENCE_YEAR;
  return { ...progress, yearsOfExperience: Math.round(years * 10) / 10 };
}

// ─── Job Event Handlers (return updated CareerProgress) ───

export function onJobAccepted(
  progress: CareerProgress,
  employerId?: string,
): CareerProgress {
  let p = gainCareerXp(progress, CAREER_XP_EVENTS.job_accepted);
  p = gainProfessionalReputation(p, 3);
  return {
    ...p,
    acceptedJobsCount: p.acceptedJobsCount + 1,
    currentEmployerId: employerId ?? p.currentEmployerId,
  };
}

export function onWorkShiftCompleted(
  progress: CareerProgress,
): CareerProgress {
  let p = gainCareerXp(progress, CAREER_XP_EVENTS.work_shift_completed);
  p = gainProfessionalReputation(p, 1);
  const newShifts = p.completedWorkShifts + 1;
  p = { ...p, completedWorkShifts: newShifts };
  p = recomputeExperience(p);

  // Streak bonus: every 5 consecutive shift completions
  if (newShifts % 5 === 0) {
    p = gainCareerXp(p, CAREER_XP_EVENTS.streak_bonus * 5);
    p = gainProfessionalReputation(p, 2);
    p = { ...p, successfulWorkStreaks: p.successfulWorkStreaks + 1 };
  }
  return p;
}

export function onJobLost(progress: CareerProgress): CareerProgress {
  let p = loseProfessionalReputation(progress, 5);
  return { ...p, currentEmployerId: null };
}

export function onInterviewSuccess(progress: CareerProgress): CareerProgress {
  return gainCareerXp(progress, CAREER_XP_EVENTS.interview_success);
}

export function onCareerMissionCompleted(progress: CareerProgress): CareerProgress {
  let p = gainCareerXp(progress, CAREER_XP_EVENTS.mission_career_complete);
  p = gainProfessionalReputation(p, 5);
  return p;
}

/** Set role title from CAREER_TITLE_MAP */
export function refreshRoleTitle(progress: CareerProgress): CareerProgress {
  return {
    ...progress,
    roleTitleFa: CAREER_TITLE_MAP[progress.track][progress.level],
  };
}

/** Ensure track is initialized; return existing or create initial */
export function ensureTrackInitialized(
  progress: CareerProgress | undefined,
  track: CareerTrack,
): CareerProgress {
  if (progress) return progress;
  const { createInitialCareerProgress } = require("./seed-career-tracks") as typeof import("./seed-career-tracks");
  return createInitialCareerProgress(track);
}
