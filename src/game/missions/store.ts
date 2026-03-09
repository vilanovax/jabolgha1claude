// ─── Mission Store ───
// Zustand store for mission state management.
// Integrates with the main game store via gameplay events.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Mission,
  GameplayEvent,
  MissionGenerationContext,
  MissionRewards,
} from "./types";
import { updateMissionProgress, isMissionCompleted } from "./progress";
import { generateMissionsForNewDay } from "./selector";
import {
  updateAchievements,
  type AchievementCheckState,
} from "./achievements";

interface MissionStoreState {
  // Active missions
  activeStoryMission: Mission | null;
  activeDailyMissions: Mission[];
  activeWeeklyMissions: Mission[];
  activeEventMission: Mission | null;
  activeRescueMission: Mission | null;

  // Achievements (always tracked)
  achievements: Mission[];

  // Completed but not yet claimed
  completedUnclaimed: Mission[];

  // History
  archivedMissions: Mission[];
  claimedAchievementIds: string[];

  // Story arc tracking
  currentArcId: string | null;
  currentEpisodeIndex: number;
  completedArcIds: string[];

  // Anti-repetition
  recentDailyTemplateIds: string[]; // last 3 days
  recentWeeklyTemplateIds: string[];

  // Cumulative stats for achievements
  cumulativeStats: {
    totalMoneyEarned: number;
    totalJobsAccepted: number;
    totalWorkShifts: number;
    totalStudySessions: number;
    totalExerciseSessions: number;
    totalInvested: number;
  };

  // Actions
  initMissionsForNewDay: (ctx: MissionGenerationContext) => void;
  processGameplayEvent: (event: GameplayEvent, ctx?: MissionGenerationContext) => void;
  claimMissionRewards: (missionId: string) => MissionRewards | null;
  refreshAchievements: (checkState: AchievementCheckState) => void;
  getAllVisibleMissions: () => Mission[];
  getRecommendedMission: () => Mission | null;
}

export const useMissionStore = create<MissionStoreState>()(
  persist(
    (set, get) => ({
      activeStoryMission: null,
      activeDailyMissions: [],
      activeWeeklyMissions: [],
      activeEventMission: null,
      activeRescueMission: null,
      achievements: [],
      completedUnclaimed: [],
      archivedMissions: [],
      claimedAchievementIds: [],
      currentArcId: "family_saving", // start with first arc
      currentEpisodeIndex: 0,
      completedArcIds: [],
      recentDailyTemplateIds: [],
      recentWeeklyTemplateIds: [],
      cumulativeStats: {
        totalMoneyEarned: 0,
        totalJobsAccepted: 0,
        totalWorkShifts: 0,
        totalStudySessions: 0,
        totalExerciseSessions: 0,
        totalInvested: 0,
      },

      initMissionsForNewDay: (ctx) => {
        const state = get();

        // Archive expired daily missions
        const expiredDailies = state.activeDailyMissions.filter(
          (m) => m.status === "active"
        );

        const result = generateMissionsForNewDay(ctx, {
          activeStoryMission: state.activeStoryMission,
          activeWeeklyMissions: state.activeWeeklyMissions,
          completedArcIds: state.completedArcIds,
          currentArcId: state.currentArcId,
          currentEpisodeIndex: state.currentEpisodeIndex,
          recentDailyTemplateIds: state.recentDailyTemplateIds,
          recentWeeklyTemplateIds: state.recentWeeklyTemplateIds,
        });

        // Track recently used template IDs (keep last 3 days worth)
        const newDailyIds = result.dailyMissions
          .map((m) => m.id.split("_").slice(0, 2).join("_"));
        const newWeeklyIds = result.weeklyMissions
          .filter((m) => m.createdAtDay === ctx.day)
          .map((m) => m.id.split("_").slice(0, 2).join("_"));

        set({
          activeStoryMission: result.storyMission ?? state.activeStoryMission,
          activeDailyMissions: result.dailyMissions,
          activeWeeklyMissions: result.weeklyMissions,
          activeEventMission: result.eventMission,
          activeRescueMission: result.rescueMission,
          archivedMissions: [
            ...state.archivedMissions,
            ...expiredDailies,
          ].slice(-50), // keep last 50
          recentDailyTemplateIds: [
            ...state.recentDailyTemplateIds,
            ...newDailyIds,
          ].slice(-9), // ~3 days of dailies
          recentWeeklyTemplateIds: [
            ...state.recentWeeklyTemplateIds,
            ...newWeeklyIds,
          ].slice(-6),
        });
      },

      processGameplayEvent: (event, _ctx?) => {
        const state = get();
        const newCompletedUnclaimed = [...state.completedUnclaimed];

        // Update cumulative stats
        const stats = { ...state.cumulativeStats };
        switch (event.type) {
          case "money_earned":
            stats.totalMoneyEarned += event.amount;
            break;
          case "job_accepted":
            stats.totalJobsAccepted += 1;
            break;
          case "work_shift_completed":
            stats.totalWorkShifts += 1;
            break;
          case "study_session_completed":
            stats.totalStudySessions += 1;
            break;
          case "exercise_completed":
            stats.totalExerciseSessions += 1;
            break;
          case "investment_made":
            stats.totalInvested += event.amount;
            break;
        }

        // Helper to process a mission
        const processMission = (m: Mission | null): Mission | null => {
          if (!m || m.status !== "active") return m;
          const updated = updateMissionProgress(m, event);
          if (isMissionCompleted(updated)) {
            const completed = { ...updated, status: "completed" as const };
            newCompletedUnclaimed.push(completed);
            return null; // remove from active
          }
          return updated;
        };

        // Process all active missions
        const newStory = processMission(state.activeStoryMission);
        const newDailies = state.activeDailyMissions.map((m) => {
          if (m.status !== "active") return m;
          const updated = updateMissionProgress(m, event);
          if (isMissionCompleted(updated)) {
            const completed = { ...updated, status: "completed" as const };
            newCompletedUnclaimed.push(completed);
            return completed;
          }
          return updated;
        });
        const newWeeklies = state.activeWeeklyMissions.map((m) => {
          if (m.status !== "active") return m;
          const updated = updateMissionProgress(m, event);
          if (isMissionCompleted(updated)) {
            const completed = { ...updated, status: "completed" as const };
            newCompletedUnclaimed.push(completed);
            return completed;
          }
          return updated;
        });
        const newEvent = processMission(state.activeEventMission);
        const newRescue = processMission(state.activeRescueMission);

        set({
          activeStoryMission: newStory,
          activeDailyMissions: newDailies,
          activeWeeklyMissions: newWeeklies,
          activeEventMission: newEvent,
          activeRescueMission: newRescue,
          completedUnclaimed: newCompletedUnclaimed,
          cumulativeStats: stats,
        });
      },

      claimMissionRewards: (missionId) => {
        const state = get();

        // Find in completedUnclaimed
        const mission = state.completedUnclaimed.find((m) => m.id === missionId);
        if (!mission) {
          // Check achievements
          const ach = state.achievements.find(
            (m) => m.id === missionId && m.status === "completed"
          );
          if (ach) {
            set({
              claimedAchievementIds: [...state.claimedAchievementIds, missionId],
              achievements: state.achievements.map((a) =>
                a.id === missionId ? { ...a, status: "claimed" as const } : a
              ),
            });
            return ach.rewards;
          }
          return null;
        }

        const rewards = mission.rewards;
        const claimed = { ...mission, status: "claimed" as const };

        // If story mission, advance episode
        if (mission.category === "story" && mission.arcId) {
          const nextEpisode = (mission.episodeIndex ?? 0) + 1;
          set({
            currentEpisodeIndex: nextEpisode,
            activeStoryMission: null, // will be regenerated next day
          });
        }

        set({
          completedUnclaimed: state.completedUnclaimed.filter((m) => m.id !== missionId),
          archivedMissions: [...state.archivedMissions, claimed].slice(-50),
          // Also remove from active lists if still there
          activeDailyMissions: state.activeDailyMissions.map((m) =>
            m.id === missionId ? { ...m, status: "claimed" as const } : m
          ),
          activeWeeklyMissions: state.activeWeeklyMissions.map((m) =>
            m.id === missionId ? { ...m, status: "claimed" as const } : m
          ),
        });

        return rewards;
      },

      refreshAchievements: (checkState) => {
        const state = get();
        const updated = updateAchievements(checkState, state.claimedAchievementIds);
        set({ achievements: updated });
      },

      getAllVisibleMissions: () => {
        const state = get();
        const visible: Mission[] = [];
        if (state.activeStoryMission) visible.push(state.activeStoryMission);
        visible.push(...state.activeDailyMissions);
        visible.push(...state.activeWeeklyMissions);
        if (state.activeEventMission) visible.push(state.activeEventMission);
        if (state.activeRescueMission) visible.push(state.activeRescueMission);
        visible.push(...state.completedUnclaimed);
        return visible;
      },

      // Returns the single best mission for the player to work on next.
      getRecommendedMission: () => {
        const state = get();

        // Priority 1: completed (ready to claim)
        if (state.completedUnclaimed.length > 0) return state.completedUnclaimed[0];

        // Priority 2: rescue mission (urgent)
        if (state.activeRescueMission?.status === "active") return state.activeRescueMission;

        // Priority 3: daily missions with recommendedReasonFa
        const recommendedDaily = state.activeDailyMissions.find(
          (m) => m.status === "active" && m.recommendedReasonFa
        );
        if (recommendedDaily) return recommendedDaily;

        // Priority 4: first active daily
        const firstDaily = state.activeDailyMissions.find((m) => m.status === "active");
        if (firstDaily) return firstDaily;

        // Priority 5: story mission
        if (state.activeStoryMission?.status === "active") return state.activeStoryMission;

        return null;
      },
    }),
    {
      name: "shahre-man-missions",
      version: 1,
    }
  )
);
