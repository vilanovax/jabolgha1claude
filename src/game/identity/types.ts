// ─── Game Identity System — Core Types ───────────────────────────
// Gives the player a character identity beyond numbers.

// ──────────────────────────────────────────────────────────────────
// Archetype — behavioral style of the player
// ──────────────────────────────────────────────────────────────────

export type ArchetypeId =
  | "entrepreneur"
  | "specialist"
  | "professional"
  | "investor"
  | "safe_planner"
  | "undecided";

export interface PlayerArchetype {
  id: ArchetypeId;
  nameFa: string;
  emoji: string;
  descriptionFa: string;
  /** Higher = more weight when generating these opportunity types */
  modifiers: {
    opportunityWeight: number;    // 0.5 – 1.5×, applied to opp scoring
    jobOfferWeight: number;       // 0.8 – 1.3×, hiring chance boost
    investmentLuck: number;       // 0.9 – 1.2×, applied to invest return
  };
}

// ──────────────────────────────────────────────────────────────────
// Title — earned label for the player
// ──────────────────────────────────────────────────────────────────

export type TitleId = string;

export interface TitleUnlockConditions {
  minLevel?: number;
  minMoney?: number;
  minSavings?: number;
  minReputation?: number;
  minSkillLevel?: number;         // any hard skill at this level
  archetypeId?: ArchetypeId;
  careerTrack?: string;           // e.g. "tech", "finance"
}

export interface PlayerTitle {
  id: TitleId;
  nameFa: string;
  emoji: string;
  unlockConditions: TitleUnlockConditions;
  /** Small passive bonuses while title is active */
  bonuses?: {
    reputationGain?: number;      // per day
    opportunityWeight?: number;
  };
}

// ──────────────────────────────────────────────────────────────────
// Reputation — how the city sees the player
// ──────────────────────────────────────────────────────────────────

export type ReputationTier =
  | "unknown"       // 0–19
  | "trusted"       // 20–39
  | "professional"  // 40–59
  | "well_known"    // 60–79
  | "city_star";    // 80–100

export interface PlayerReputation {
  value: number;          // 0–100
  tier: ReputationTier;
}

// ──────────────────────────────────────────────────────────────────
// Life Path — career narrative trajectory
// ──────────────────────────────────────────────────────────────────

export interface LifePathStep {
  id: string;
  nameFa: string;
  emoji: string;
  reached: boolean;
}

// ──────────────────────────────────────────────────────────────────
// Identity State — the full identity snapshot
// ──────────────────────────────────────────────────────────────────

export interface IdentityState {
  archetype: PlayerArchetype;
  activeTitle: PlayerTitle;
  unlockedTitleIds: TitleId[];
  reputation: PlayerReputation;
  lifePath: LifePathStep[];
}

// ──────────────────────────────────────────────────────────────────
// Input signals for the IdentityAnalyzer
// ──────────────────────────────────────────────────────────────────

export interface IdentitySignals {
  level: number;
  money: number;           // checking account
  savings: number;
  reputation: number;      // legacy numeric from game
  careerTrack: string | null;
  careerLevel: string | null;
  totalWorkShifts: number;
  totalStudySessions: number;
  totalInvested: number;
  totalMoneyEarned: number;
  dayInGame: number;
  maxHardSkillLevel: number;
  hasActiveJob: boolean;
  activeLoansCount: number;
  totalRiskyActions: number;   // investments + sponsored actions
}
