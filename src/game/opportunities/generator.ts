import type { Opportunity, OpportunityTemplate, OpportunityContextProfile, OpportunityMemory } from "./types";
import type { AnalyzerInput } from "./analyzer";
import { analyzePlayerOpportunities } from "./analyzer";
import { OPPORTUNITY_TEMPLATES } from "./seed-opportunities";
import { scoreOpportunity } from "./scoring";

// ─── Template requirement check ───────────────────────────────────────────────
function templateMatchesPlayer(
  template: OpportunityTemplate,
  playerInput: AnalyzerInput,
): boolean {
  const req = template.requirements;

  if (req.minMoney !== undefined && playerInput.money < req.minMoney)       return false;
  if (req.minLevel !== undefined && playerInput.level < req.minLevel)       return false;
  if (req.minReputation !== undefined && playerInput.reputation < req.minReputation) return false;
  if (req.maxActiveLoans !== undefined && playerInput.activeLoansCount > req.maxActiveLoans) return false;

  if (req.requiredWaveType !== undefined && req.requiredWaveType !== playerInput.currentWavePhase) {
    return false;
  }

  if (req.requiredTrack !== undefined && req.requiredTrack !== playerInput.jobTrack) {
    return false;
  }

  return true;
}

// ─── Instantiate template → Opportunity ──────────────────────────────────────
function instantiateOpportunity(
  template: OpportunityTemplate,
  currentDay: number,
  isChainInjection = false,
): Opportunity {
  return {
    id: `${template.id}_day${currentDay}`,
    type: template.type,
    titleFa: template.titleFa,
    descriptionFa: template.descriptionFa,
    source: isChainInjection ? "chain" : template.source,
    rarity: template.rarity,
    cost: { ...template.cost },
    requirements: { ...template.requirements },
    expiresAtDay: currentDay + template.durationDays,
    status: "available",
    outcomes: template.outcomes.map((o) => ({ ...o, effects: { ...o.effects } })),
    chainId: template.chainId,
    chainStep: template.chainStep,
  };
}

// ─── Main generator ───────────────────────────────────────────────────────────
export function generateOpportunitiesForDay(
  currentDay: number,
  playerInput: AnalyzerInput,
  activeOpportunitiesCount: number,
  recentlyRejectedTemplateIds: string[],
  pendingChainTemplateIds: string[] = [],
  memory: OpportunityMemory = { acceptedByType: {}, rejectedByType: {}, successfulByType: {}, totalResolved: 0 },
  recentlyResolvedTemplateIds: string[] = [],
): Opportunity[] {
  const generated: Opportunity[] = [];

  // ── Phase 1: inject pending chain steps (priority) ──────────────────────
  const chainTemplates = OPPORTUNITY_TEMPLATES.filter(
    (t) => pendingChainTemplateIds.includes(t.id),
  );
  for (const tpl of chainTemplates) {
    if (activeOpportunitiesCount + generated.length >= 2) break;
    generated.push(instantiateOpportunity(tpl, currentDay, true));
  }

  // ── Phase 2: normal daily generation ───────────────────────────────────
  if (activeOpportunitiesCount + generated.length >= 2) {
    return generated;
  }

  // 30% chance of no new regular opportunity
  if (Math.random() < 0.3) {
    return generated;
  }

  // Build context profile
  const context: OpportunityContextProfile = analyzePlayerOpportunities(playerInput);

  // Pool: regular templates only (exclude chain steps)
  const eligible = OPPORTUNITY_TEMPLATES.filter(
    (t) =>
      !t.isChainStep &&
      !pendingChainTemplateIds.includes(t.id) &&
      templateMatchesPlayer(t, playerInput) &&
      !recentlyRejectedTemplateIds.includes(t.id),
  );

  if (eligible.length === 0) return generated;

  // Score with 6-factor formula
  const scored = eligible.map((t) => ({
    template: t,
    score: scoreOpportunity(t, {
      context,
      memory,
      recentlyResolvedTemplateIds,
      currentWavePhase: playerInput.currentWavePhase,
    }),
  }));

  // Rarity distribution: 70% common, 25% rare, 5% epic
  const rarityRoll = Math.random();
  const targetRarity =
    rarityRoll < 0.70 ? "common" :
    rarityRoll < 0.95 ? "rare" : "epic";

  const rarityPool = scored.filter((s) => s.template.rarity === targetRarity);
  const pool = rarityPool.length > 0 ? rarityPool : scored;

  // Weighted random selection by score
  const totalWeight = pool.reduce((sum, s) => sum + Math.max(s.score, 1), 0);
  let rand = Math.random() * totalWeight;
  let chosen = pool[pool.length - 1].template;

  for (const { template, score } of pool) {
    rand -= Math.max(score, 1);
    if (rand <= 0) { chosen = template; break; }
  }

  generated.push(instantiateOpportunity(chosen, currentDay));
  return generated;
}
