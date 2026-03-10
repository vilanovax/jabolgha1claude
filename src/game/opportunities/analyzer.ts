import type { OpportunityContextProfile, OpportunityType } from "./types";

// ─── Wave → city opportunity bias ─────────────────────────────────────────────
const WAVE_BIAS: Record<string, OpportunityType[]> = {
  tech_boom:          ["career", "skill"],
  startup_wave:       ["economic", "network"],
  finance_bull:       ["economic"],
  construction_surge: ["lifestyle"],
  mini_recession:     ["economic", "city"],
  education_surge:    ["skill", "career"],
  retail_holiday:     ["lifestyle", "network"],
  stable:             [],
};

// ─── Reputation tier labels ────────────────────────────────────────────────────
function reputationTierLabel(rep: number): string {
  if (rep >= 80) return "city_star";
  if (rep >= 60) return "well_known";
  if (rep >= 40) return "professional";
  if (rep >= 20) return "trusted";
  return "unknown";
}

// ─── Input ────────────────────────────────────────────────────────────────────
export interface AnalyzerInput {
  money: number;
  savings?: number;
  level: number;
  reputation: number;
  stress?: number;
  energy?: number;
  hasActiveJob: boolean;
  jobTrack?: string;
  activeLoansCount: number;
  skillIds: string[];
  recentCategoryActions: string[];
  currentWavePhase: string;
  // Extended fields
  identityArchetype?: string;
  dayInGame?: number;
}

// ─── Analyzer ─────────────────────────────────────────────────────────────────
export function analyzePlayerOpportunities(input: AnalyzerInput): OpportunityContextProfile {
  const {
    money,
    savings = 0,
    level,
    reputation,
    stress = 30,
    hasActiveJob,
    jobTrack,
    activeLoansCount,
    skillIds,
    currentWavePhase,
    identityArchetype,
  } = input;

  // ── Liquidity ────────────────────────────────────────────────────────────
  const liquidityLevel =
    money > 50_000_000 ? "high" :
    money > 15_000_000 ? "medium" : "low";

  // ── Risk tolerance ───────────────────────────────────────────────────────
  const riskTolerance =
    (money > 30_000_000 && activeLoansCount < 2 && stress < 50) ? "high" :
    (money < 10_000_000 || activeLoansCount >= 2 || stress > 65) ? "low" : "medium";

  // ── Career momentum ──────────────────────────────────────────────────────
  const careerMomentum =
    hasActiveJob && level >= 4 ? "strong" :
    hasActiveJob ? "normal" : "weak";

  // ── City bias ─────────────────────────────────────────────────────────────
  const cityOpportunityBias = WAVE_BIAS[currentWavePhase] ?? [];

  // ── Legacy compat fields ──────────────────────────────────────────────────
  const canTakeFinancialRisk = money > 30_000_000 && activeLoansCount < 2;
  const needsLowRiskOptions  = money < 10_000_000 || activeLoansCount >= 2;
  const strongCareerTrack    = hasActiveJob && jobTrack ? jobTrack : null;
  const hasSpareCash         = money > 50_000_000;
  const isUnderFinancialPressure = money < 5_000_000 || activeLoansCount > 0;
  const highSkillSpecialization  = skillIds.length >= 3;
  const goodNetworkPotential     = reputation > 40 && level >= 3;

  // ── Derived flags ─────────────────────────────────────────────────────────
  const isFinanciallyStressed =
    money < 5_000_000 || activeLoansCount > 1 || stress > 70;

  const isOpportunityRich =
    reputation > 50 && level >= 3 && (savings > 20_000_000 || money > 30_000_000);

  return {
    // Legacy
    canTakeFinancialRisk,
    needsLowRiskOptions,
    strongCareerTrack,
    hasSpareCash,
    isUnderFinancialPressure,
    highSkillSpecialization,
    goodNetworkPotential,
    // Advanced
    liquidityLevel,
    riskTolerance,
    careerMomentum,
    strongestDomain: jobTrack ?? (skillIds[0] ?? undefined),
    identityArchetype,
    reputationTier: reputationTierLabel(reputation),
    cityOpportunityBias,
    isFinanciallyStressed,
    isOpportunityRich,
  };
}
