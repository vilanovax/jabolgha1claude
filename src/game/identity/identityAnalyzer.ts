// ─── Identity Analyzer ────────────────────────────────────────
// Recalculates all identity layers from current game state signals.

import { analyzeArchetype } from "./archetypes";
import { getUnlockedTitleIds, pickBestTitle } from "./titles";
import { buildReputation } from "./reputation";
import { buildLifePath } from "./lifePath";
import type { IdentityState, IdentitySignals } from "./types";

export function analyzeIdentity(signals: IdentitySignals): IdentityState {
  // 1. Archetype
  const archetype = analyzeArchetype(signals);

  // 2. Titles — re-run with archetype ID to allow archetype-locked titles
  const unlockedIds = getUnlockedTitleIds(signals);

  // Also check archetype-specific titles manually
  const extraIds: string[] = [];
  if (archetype.id === "entrepreneur") {
    if (signals.level >= 3) extraIds.push("risk_taker");
    if (signals.level >= 5 && signals.reputation >= 40) extraIds.push("startup_founder");
  }
  if (archetype.id === "investor") {
    if (signals.savings >= 150_000_000) extraIds.push("wealth_builder");
  }
  if (archetype.id === "specialist") {
    if (signals.maxHardSkillLevel >= 7) extraIds.push("tech_specialist");
  }

  const allUnlockedIds = Array.from(new Set([...unlockedIds, ...extraIds]));

  const activeTitle = pickBestTitle(allUnlockedIds, archetype.id);

  // 3. Reputation
  const reputation = buildReputation(signals.reputation);

  // 4. Life Path
  const lifePath = buildLifePath(signals);

  return {
    archetype,
    activeTitle,
    unlockedTitleIds: allUnlockedIds,
    reputation,
    lifePath,
  };
}
