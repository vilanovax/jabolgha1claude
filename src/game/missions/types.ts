// ─── Mission Engine Core Types ───

export type MissionCategory =
  | "story"
  | "daily"
  | "weekly"
  | "achievement"
  | "event"
  | "rescue";

export type MissionStatus =
  | "locked"
  | "available"
  | "active"
  | "completed"
  | "claimed"
  | "archived";

// What the player must do
export type MissionObjective =
  | { type: "complete_action"; actionId: string; count: number }
  | { type: "earn_money"; amount: number }
  | { type: "save_money"; amount: number }
  | { type: "gain_xp"; amount: number }
  | { type: "complete_work_shift"; count: number }
  | { type: "study_sessions"; count: number }
  | { type: "exercise_sessions"; count: number }
  | { type: "unlock_skill"; skillId: string }
  | { type: "apply_to_jobs"; count: number }
  | { type: "jobs_accepted"; count: number }
  | { type: "invest_money"; amount: number }
  | { type: "keep_streak"; actionType: string; days: number }
  | { type: "survive_without_loan"; days: number }
  | { type: "reach_stat"; stat: "health" | "happiness" | "reputation"; value: number }
  | { type: "eat_meals"; count: number }
  | { type: "rest_sessions"; count: number };

export interface MissionRewards {
  xp?: number;
  money?: number;
  stars?: number;
  energy?: number;
  happiness?: number;
  unlockActions?: string[];
  unlockSkills?: string[];
  unlockJobs?: string[];
  unlockRoomItems?: string[];
  titles?: string[];
  badges?: string[];
}

// A single mission instance
export interface Mission {
  id: string;
  category: MissionCategory;
  status: MissionStatus;

  titleFa: string;
  subtitleFa?: string;
  descriptionFa?: string;
  emoji: string;

  // Story arc linkage
  arcId?: string;
  episodeIndex?: number;

  // What must be done
  objectives: MissionObjective[];

  // Progress per objective: key = "obj_0", "obj_1", etc.
  progress: Record<string, number>;

  rewards: MissionRewards;

  createdAtDay: number;
  expiresAtDay?: number;

  isRepeatable?: boolean;
  priority?: number;

  // Why this mission is recommended
  recommendedReasonFa?: string;

  // Character info for story missions
  character?: string;
  characterName?: string;
  dialogue?: string;
}

// Story arc: a chain of story missions
export interface StoryArc {
  id: string;
  nameFa: string;
  theme: "family" | "career" | "independence" | "risk" | "health";
  episodes: StoryEpisode[];
  unlockConditions?: {
    minLevel?: number;
    minMoney?: number;
    requiredCompletedArcIds?: string[];
  };
}

export interface StoryEpisode {
  titleFa: string;
  subtitleFa?: string;
  descriptionFa?: string;
  emoji: string;
  character: string;
  characterName: string;
  dialogue: string;
  objectives: MissionObjective[];
  rewards: MissionRewards;
}

// Gameplay events that drive mission progress
export type GameplayEvent =
  | { type: "action_completed"; actionId: string }
  | { type: "work_shift_completed" }
  | { type: "study_session_completed" }
  | { type: "exercise_completed" }
  | { type: "rest_completed" }
  | { type: "eat_completed" }
  | { type: "money_earned"; amount: number }
  | { type: "money_saved"; amount: number }
  | { type: "xp_gained"; amount: number }
  | { type: "job_applied" }
  | { type: "job_accepted" }
  | { type: "investment_made"; amount: number }
  | { type: "skill_unlocked"; skillId: string }
  | { type: "day_ended" };

// Context for mission generation
export interface MissionGenerationContext {
  day: number;
  player: {
    level: number;
    xp: number;
    money: number;
    stars: number;
    energy: number;
    hunger: number;
    stress: number;
    happiness: number;
    health: number;
    reputation: number;

    currentJobId?: string | null;
    strongestSkillTree?: string | null;
    studySessionsLast7Days: number;
    workShiftsLast7Days: number;
    exerciseSessionsLast7Days: number;
    restSessionsLast7Days: number;

    jobsAppliedLast7Days: number;
    jobRejectionsLast7Days: number;

    savings: number;
    debt: number;
    investmentsTotal: number;

    routineConsistencyScore: number;
  };
  world: {
    currentWaveType?: string | null;
    inflationLevel?: number;
    unemploymentRate?: number;
    techDemandLevel?: number;
  };
}

// Analyzer output
export interface PlayerMissionProfile {
  growthNeed: number;        // 0-1
  financialPressure: number; // 0-1
  burnoutRisk: number;       // 0-1
  careerMomentum: number;    // 0-1
  explorationNeed: number;   // 0-1
  routineStrength: number;   // 0-1
  storyReadiness: number;    // 0-1
  struggling: boolean;
}

// Mission template for dynamic generation
export interface MissionTemplate {
  id: string;
  category: Exclude<MissionCategory, "story" | "achievement">;
  emoji: string;

  titleFa: string;
  subtitleFa?: string;
  descriptionFa?: string;

  conditions?: {
    minLevel?: number;
    maxLevel?: number;
    moneyBelow?: number;
    moneyAbove?: number;
    maxStress?: number;
    minStress?: number;
    strongestSkillTree?: string;
    currentWaveType?: string;
    jobRequired?: boolean;
    unemployedOnly?: boolean;
  };

  weight: number; // base selection weight

  objectiveFactory: (ctx: MissionGenerationContext) => MissionObjective[];
  rewardFactory: (ctx: MissionGenerationContext) => MissionRewards;
  recommendedReasonFactory?: (ctx: MissionGenerationContext) => string | undefined;
}

// What the selector produces
export interface GeneratedMissionSet {
  storyMission?: Mission | null;
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  eventMission?: Mission | null;
  rescueMission?: Mission | null;
}
