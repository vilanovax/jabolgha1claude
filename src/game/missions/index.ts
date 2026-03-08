// ─── Mission Engine Public API ───

// Core types
export type {
  Mission,
  MissionCategory,
  MissionStatus,
  MissionObjective,
  MissionRewards,
  MissionTemplate,
  MissionGenerationContext,
  GameplayEvent,
  GeneratedMissionSet,
  StoryArc,
  StoryEpisode,
  PlayerMissionProfile,
} from "./types";

// Store
export { useMissionStore } from "./store";

// Analyzer
export { analyzePlayerForMissions } from "./analyzer";

// Progress
export {
  updateMissionProgress,
  isMissionCompleted,
  getMissionProgressPercent,
  getMissionRemainingTextFa,
  getObjectiveTarget,
} from "./progress";

// Rewards
export {
  scaleMoneyTarget,
  scaleXpReward,
  scaleMissionRewards,
  getMissionRewardPreviewFa,
} from "./rewards";

// Selector
export { generateMissionsForNewDay } from "./selector";

// Story Arcs
export { STORY_ARCS, getStoryArc, getNextAvailableArc } from "./story-arcs";

// Achievements
export { ACHIEVEMENTS, createAchievementMissions, updateAchievements } from "./achievements";
export type { AchievementDef, AchievementCheckState } from "./achievements";

// Helpers
export {
  getCategoryDisplay,
  getMissionDisplayData,
  sortMissionsByPriority,
} from "./helpers";

// Templates
export {
  DAILY_TEMPLATES,
  WEEKLY_TEMPLATES,
  EVENT_TEMPLATES,
  RESCUE_TEMPLATES,
} from "./templates";
