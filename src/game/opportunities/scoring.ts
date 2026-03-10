import type { OpportunityTemplate, OpportunityType, OpportunityContextProfile, OpportunityMemory } from "./types";

// ─── City Wave → preferred opportunity types ─────────────────────────────────
const WAVE_TYPE_BIAS: Record<string, OpportunityType[]> = {
  tech_boom:             ["career", "skill"],
  startup_wave:          ["economic", "network"],
  finance_bull:          ["economic"],
  construction_surge:    ["lifestyle"],
  mini_recession:        ["economic", "city"],
  education_surge:       ["skill", "career"],
  retail_holiday:        ["lifestyle", "network"],
  stable:                [],
};

// ─── Identity archetype → preferred opportunity types ─────────────────────────
const ARCHETYPE_TYPE_BIAS: Record<string, OpportunityType[]> = {
  entrepreneur:  ["economic", "network"],
  investor:      ["economic", "city"],
  specialist:    ["skill", "career"],
  professional:  ["career", "network"],
  safe_planner:  ["lifestyle", "city"],
  undecided:     [],
};

// ─── Max expected money gain per outcome (for excitement calc) ────────────────
function maxMoneyGain(template: OpportunityTemplate): number {
  return template.outcomes.reduce((max, o) => {
    const m = o.effects.money ?? 0;
    return m > max ? m : max;
  }, 0);
}

// ─── 6-factor scoring (0–100) ─────────────────────────────────────────────────

interface ScoringInput {
  context: OpportunityContextProfile;
  memory: OpportunityMemory;
  recentlyResolvedTemplateIds: string[];
  currentWavePhase: string;
}

export function scoreOpportunity(
  template: OpportunityTemplate,
  input: ScoringInput,
): number {
  const { context, memory, recentlyResolvedTemplateIds, currentWavePhase } = input;

  // ── 1. Relevance (0.30) ───────────────────────────────────────────────────
  let relevance = 0.5; // neutral baseline

  // Type matches what the player has been doing recently
  const recentAccepts = context.identityArchetype
    ? (ARCHETYPE_TYPE_BIAS[context.identityArchetype] ?? [])
    : [];
  if (recentAccepts.includes(template.type)) relevance += 0.2;

  // Player has accepted this type before
  const pastAccepts = memory.acceptedByType[template.type] ?? 0;
  if (pastAccepts >= 2) relevance += 0.15;
  else if (pastAccepts === 1) relevance += 0.08;

  // Financial stress: avoid expensive opportunities
  if (context.isFinanciallyStressed && (template.cost.money ?? 0) > 10_000_000) {
    relevance -= 0.25;
  }

  // Player needs income: prefer money-generating types
  if (context.liquidityLevel === "low" && ["career", "economic", "city"].includes(template.type)) {
    relevance += 0.2;
  }

  relevance = Math.max(0, Math.min(1, relevance));

  // ── 2. CityFit (0.20) ────────────────────────────────────────────────────
  let cityFit = 0.4; // neutral

  const waveBias = WAVE_TYPE_BIAS[currentWavePhase] ?? [];
  if (waveBias.includes(template.type)) cityFit = 0.9;

  // Explicit wave requirement match
  if (
    template.requirements.requiredWaveType &&
    template.requirements.requiredWaveType === currentWavePhase
  ) {
    cityFit = 1.0;
  }

  // ── 3. Affordability (0.15) ──────────────────────────────────────────────
  let affordability = 1.0;
  const cost = template.cost.money ?? 0;
  const money = context.liquidityLevel === "high"
    ? 80_000_000
    : context.liquidityLevel === "medium"
      ? 30_000_000
      : 8_000_000;

  if (cost > 0) {
    if (money < cost)          affordability = 0.0;
    else if (money < cost * 1.5) affordability = 0.3;
    else if (money < cost * 2)   affordability = 0.55;
    else if (money < cost * 3)   affordability = 0.75;
    else                         affordability = 1.0;
  }

  // ── 4. IdentityMatch (0.15) ──────────────────────────────────────────────
  let identityMatch = 0.5;
  const archBias = context.identityArchetype
    ? (ARCHETYPE_TYPE_BIAS[context.identityArchetype] ?? [])
    : [];
  if (archBias.includes(template.type)) identityMatch = 1.0;

  // Career track match
  if (
    template.requirements.requiredTrack &&
    template.requirements.requiredTrack === (context.strongestDomain ?? "")
  ) {
    identityMatch = Math.min(1, identityMatch + 0.25);
  }

  // ── 5. Novelty (0.10) ────────────────────────────────────────────────────
  const novelty = recentlyResolvedTemplateIds.includes(template.id) ? 0.0 : 1.0;

  // ── 6. Excitement (0.10) ─────────────────────────────────────────────────
  let excitement = 0.3;
  if (template.rarity === "epic")        excitement = 1.0;
  else if (template.rarity === "rare")   excitement = 0.7;

  const maxGain = maxMoneyGain(template);
  if (maxGain >= 50_000_000) excitement = Math.max(excitement, 0.9);
  else if (maxGain >= 20_000_000) excitement = Math.max(excitement, 0.6);

  // ── Weighted sum → 0–100 ─────────────────────────────────────────────────
  const score =
    relevance    * 30 +
    cityFit      * 20 +
    affordability * 15 +
    identityMatch * 15 +
    novelty      * 10 +
    excitement   * 10;

  return Math.round(score);
}
