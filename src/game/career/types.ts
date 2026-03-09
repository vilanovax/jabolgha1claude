// ─── Career Progression System — Core Types ───

export type CareerTrack =
  | "tech"
  | "data"
  | "design"
  | "education"
  | "marketing"
  | "finance"
  | "operations"
  | "management";

export type CareerLevel =
  | "intern"
  | "junior"
  | "mid"
  | "senior"
  | "lead"
  | "manager"
  | "executive";

export type CareerPathBranch =
  | "specialist"
  | "leadership"
  | "entrepreneur"
  | null;

/** Progress within a single career track */
export interface CareerProgress {
  track: CareerTrack;
  level: CareerLevel;
  roleTitleFa: string;

  careerXp: number;
  yearsOfExperience: number;      // cumulative (non-calendar), based on shifts
  professionalReputation: number; // 0–100

  completedWorkShifts: number;
  acceptedJobsCount: number;
  successfulWorkStreaks: number;   // consecutive shift days

  currentEmployerId?: string | null;
  branch?: CareerPathBranch;
}

/** Full player career state — primary track + optional history in others */
export interface PlayerCareerState {
  primaryTrack: CareerTrack | null;
  trackProgress: Partial<Record<CareerTrack, CareerProgress>>;
}

/** What the promotion engine returns */
export interface PromotionResult {
  eligible: boolean;
  nextLevel?: CareerLevel;
  missingRequirementsFa: string[];
  readinessPercent: number; // 0-100
}

/** Config entry for one level in the ladder */
export interface CareerLevelDefinition {
  level: CareerLevel;
  minCareerXp: number;
  minYearsOfExperience: number;   // e.g. 0.5 = half year
  minReputation: number;
  minCompletedShifts?: number;
  minAcceptedJobs?: number;
}
