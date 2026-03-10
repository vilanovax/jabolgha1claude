import type { Opportunity, OpportunityEffect, OpportunityOutcome, OutcomeTier } from "./types";

// ─── Infer tier from effects if not explicitly set ────────────────────────────
function inferOutcomeTier(outcome: OpportunityOutcome): OutcomeTier {
  if (outcome.tier) return outcome.tier;

  const m = outcome.effects.money ?? 0;
  const rep = outcome.effects.reputation ?? 0;
  const stars = outcome.effects.stars ?? 0;

  if (m < 0 || rep < -5) return "setback";
  if (m === 0 && rep <= 0 && stars === 0) return "neutral";
  if (m > 20_000_000 || stars >= 2 || rep >= 15) return "big_win";
  return "small_win";
}

// ─── Result ───────────────────────────────────────────────────────────────────
export interface ResolveResult {
  outcome: OpportunityOutcome;
  outcomeTier: OutcomeTier;
  appliedEffects: Record<string, number>;
}

// ─── Resolver ────────────────────────────────────────────────────────────────
export function resolveOpportunity(opportunity: Opportunity): ResolveResult {
  const roll = Math.random();
  let accumulated = 0;

  let matchedOutcome: OpportunityOutcome =
    opportunity.outcomes[opportunity.outcomes.length - 1];

  for (const outcome of opportunity.outcomes) {
    accumulated += outcome.probability;
    if (roll <= accumulated) {
      matchedOutcome = outcome;
      break;
    }
  }

  const outcomeTier = inferOutcomeTier(matchedOutcome);

  // Flatten effects into plain Record<string, number>
  const appliedEffects: Record<string, number> = {};
  const effects = matchedOutcome.effects as OpportunityEffect;

  if (effects.money      !== undefined) appliedEffects.money      = effects.money;
  if (effects.xp         !== undefined) appliedEffects.xp         = effects.xp;
  if (effects.stars      !== undefined) appliedEffects.stars       = effects.stars;
  if (effects.reputation !== undefined) appliedEffects.reputation  = effects.reputation;
  if (effects.happiness  !== undefined) appliedEffects.happiness   = effects.happiness;
  if (effects.stress     !== undefined) appliedEffects.stress      = effects.stress;
  if (effects.careerXp   !== undefined) appliedEffects.careerXp    = effects.careerXp;

  return { outcome: matchedOutcome, outcomeTier, appliedEffects };
}
