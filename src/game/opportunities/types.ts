export type OpportunityType = "economic" | "career" | "network" | "skill" | "city" | "lifestyle";
export type OpportunityStatus = "available" | "accepted" | "resolved" | "expired" | "rejected";
export type OpportunityRarity = "common" | "rare" | "epic";

/** Classifies how good/bad an outcome was — drives chain unlocks & memory */
export type OutcomeTier = "big_win" | "small_win" | "neutral" | "setback";

export interface OpportunityEffect {
  money?: number;
  xp?: number;
  stars?: number;
  reputation?: number;
  happiness?: number;
  stress?: number;
  careerXp?: number;         // fires career XP in career store
  unlockActions?: string[];
  unlockItems?: string[];
}

export interface OpportunityOutcome {
  tier?: OutcomeTier;        // used for chain logic and memory (inferred if missing)
  labelFa: string;
  probability: number;        // 0–1, sum across outcomes must = 1
  effects: OpportunityEffect;
  narrativeTextFa: string;
}

export interface OpportunityRequirements {
  minLevel?: number;
  minMoney?: number;
  minReputation?: number;
  requiredTrack?: string;
  requiredSkillIds?: string[];
  requiredWaveType?: string;  // e.g. "startup_wave"
  maxActiveLoans?: number;    // e.g. 0 means no active loans
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  titleFa: string;
  descriptionFa: string;
  source: "city_wave" | "player_behavior" | "market" | "network" | "mission_chain" | "random" | "chain";
  cost: {
    money?: number;
    energy?: number;
    timeMinutes?: number;
  };
  requirements: OpportunityRequirements;
  expiresAtDay: number;       // game day it expires on
  status: OpportunityStatus;
  outcomes: OpportunityOutcome[];
  recommendedReasonFa?: string;
  rarity: OpportunityRarity;
  // Chain metadata
  chainId?: string;           // which chain this belongs to
  chainStep?: number;         // 1-based step in chain
}

export interface OpportunityTemplate {
  id: string;
  type: OpportunityType;
  titleFa: string;
  descriptionFa: string;
  source: Opportunity["source"];
  rarity: OpportunityRarity;
  durationDays: number;
  cost: Opportunity["cost"];
  requirements: OpportunityRequirements;
  outcomes: OpportunityOutcome[];
  // Chain metadata
  isChainStep?: boolean;      // if true, excluded from normal daily generation
  chainId?: string;
  chainStep?: number;
}

/** Legacy analysis shape — kept for backward compat */
export interface PlayerOpportunityAnalysis {
  canTakeFinancialRisk: boolean;
  needsLowRiskOptions: boolean;
  strongCareerTrack: string | null;
  hasSpareCash: boolean;
  isUnderFinancialPressure: boolean;
  highSkillSpecialization: boolean;
  goodNetworkPotential: boolean;
}

/** Advanced context profile produced by the upgraded analyzer */
export interface OpportunityContextProfile extends PlayerOpportunityAnalysis {
  liquidityLevel: "low" | "medium" | "high";
  riskTolerance: "low" | "medium" | "high";
  careerMomentum: "weak" | "normal" | "strong";
  strongestDomain?: string;
  identityArchetype?: string;
  reputationTier?: string;
  cityOpportunityBias: OpportunityType[];   // types favored by current city wave
  isFinanciallyStressed: boolean;
  isOpportunityRich: boolean;
}

/** Tracks player behavior around opportunities across sessions */
export interface OpportunityMemory {
  acceptedByType: Record<string, number>;
  rejectedByType: Record<string, number>;
  successfulByType: Record<string, number>;  // big_win count per type
  totalResolved: number;
}
