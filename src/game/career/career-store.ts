// ─── Career Store ───
// Persisted Zustand store for player career progression.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayerCareerState, CareerTrack, CareerProgress } from "./types";
import {
  onJobAccepted,
  onWorkShiftCompleted,
  onJobLost,
  onInterviewSuccess,
  onCareerMissionCompleted,
  gainProfessionalReputation,
  gainCareerXp,
  ensureTrackInitialized,
} from "./career-helpers";
import {
  checkCareerPromotionEligibility,
  applyPromotion,
} from "./promotion-engine";
import {
  inferCareerTrack,
  createInitialCareerProgress,
} from "./seed-career-tracks";
import {
  getCareerSummaryFa,
  getPrimaryCareerProgress,
  getPromotionReadinessPercent,
  getPromotionMissingRequirementsFa,
} from "./career-ui-helpers";
import type { PromotionResult } from "./types";

// ─── State Shape ─────────────────────────────────────────────

interface CareerStoreState extends PlayerCareerState {
  // Actions
  initTrack: (track: CareerTrack) => void;
  setPrimaryTrack: (track: CareerTrack) => void;

  // Career events
  handleJobAccepted: (jobType?: string, jobTitle?: string, employerId?: string) => void;
  handleWorkShiftCompleted: (jobType?: string, jobTitle?: string) => void;
  handleJobLost: (jobType?: string, jobTitle?: string) => void;
  handleInterviewSuccess: (jobType?: string, jobTitle?: string) => void;
  handleCareerMissionCompleted: (track: CareerTrack) => void;

  // XP / Reputation manual grants
  addCareerXp: (track: CareerTrack, amount: number) => void;
  addReputation: (track: CareerTrack, amount: number) => void;

  // Promotion
  checkPromotion: (track: CareerTrack) => PromotionResult;
  applyPromotion: (track: CareerTrack) => { success: boolean; newTitleFa?: string };

  // Read-only selectors
  getSummary: () => ReturnType<typeof getCareerSummaryFa>;
  getPrimaryProgress: () => CareerProgress | undefined;
  getReadiness: () => number;
  getMissingRequirements: () => string[];

  // Reset
  resetCareer: () => void;
}

// ─── Initial State ────────────────────────────────────────────

const INITIAL: PlayerCareerState = {
  primaryTrack: null,
  trackProgress: {},
};

// ─── Helper: get or init track progress ──────────────────────

function getOrInit(
  state: PlayerCareerState,
  track: CareerTrack,
): CareerProgress {
  return state.trackProgress[track] ?? createInitialCareerProgress(track);
}

function updateTrack(
  state: PlayerCareerState,
  track: CareerTrack,
  updater: (p: CareerProgress) => CareerProgress,
): Partial<PlayerCareerState> {
  const current = getOrInit(state, track);
  const updated = updater(current);
  return {
    trackProgress: { ...state.trackProgress, [track]: updated },
    primaryTrack: state.primaryTrack ?? track,
  };
}

// ─── Store ────────────────────────────────────────────────────

export const useCareerStore = create<CareerStoreState>()(
  persist(
    (set, get) => ({
      ...INITIAL,

      initTrack: (track) => set((s) => ({
        trackProgress: {
          ...s.trackProgress,
          [track]: s.trackProgress[track] ?? createInitialCareerProgress(track),
        },
        primaryTrack: s.primaryTrack ?? track,
      })),

      setPrimaryTrack: (track) => set((s) => {
        const existing = s.trackProgress[track];
        return {
          primaryTrack: track,
          trackProgress: existing
            ? s.trackProgress
            : { ...s.trackProgress, [track]: createInitialCareerProgress(track) },
        };
      }),

      handleJobAccepted: (jobType, jobTitle, employerId) => {
        const track = inferCareerTrack(jobType, jobTitle);
        set((s) => updateTrack(s, track, (p) => onJobAccepted(p, employerId)));
      },

      handleWorkShiftCompleted: (jobType, jobTitle) => {
        const track = inferCareerTrack(jobType, jobTitle);
        set((s) => updateTrack(s, track, onWorkShiftCompleted));
      },

      handleJobLost: (jobType, jobTitle) => {
        const track = inferCareerTrack(jobType, jobTitle);
        set((s) => updateTrack(s, track, onJobLost));
      },

      handleInterviewSuccess: (jobType, jobTitle) => {
        const track = inferCareerTrack(jobType, jobTitle);
        set((s) => updateTrack(s, track, onInterviewSuccess));
      },

      handleCareerMissionCompleted: (track) => {
        set((s) => updateTrack(s, track, onCareerMissionCompleted));
      },

      addCareerXp: (track, amount) => {
        set((s) => updateTrack(s, track, (p) => gainCareerXp(p, amount)));
      },

      addReputation: (track, amount) => {
        set((s) => updateTrack(s, track, (p) => gainProfessionalReputation(p, amount)));
      },

      checkPromotion: (track) => {
        const progress = getOrInit(get(), track);
        return checkCareerPromotionEligibility(progress);
      },

      applyPromotion: (track) => {
        const progress = getOrInit(get(), track);
        const result = checkCareerPromotionEligibility(progress);
        if (!result.eligible) {
          return { success: false };
        }
        const promoted = applyPromotion(progress);
        set((s) => ({
          trackProgress: { ...s.trackProgress, [track]: promoted },
        }));
        return { success: true, newTitleFa: promoted.roleTitleFa };
      },

      getSummary: () => getCareerSummaryFa(get()),
      getPrimaryProgress: () => getPrimaryCareerProgress(get()),
      getReadiness: () => getPromotionReadinessPercent(get()),
      getMissingRequirements: () => getPromotionMissingRequirementsFa(get()),

      resetCareer: () => set(INITIAL),
    }),
    {
      name: "shahre-man-career",
      version: 1,
    },
  ),
);
