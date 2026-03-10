// ─── Title Definitions + Unlock Logic ──────────────────────────

import type { PlayerTitle, IdentitySignals } from "./types";

export const TITLES: PlayerTitle[] = [
  // ── Starting titles ──
  {
    id: "fresh_start",
    nameFa: "تازه‌کار",
    emoji: "🌱",
    unlockConditions: {},   // always available as fallback
  },
  {
    id: "fresh_grad",
    nameFa: "فارغ‌التحصیل تازه",
    emoji: "🎓",
    unlockConditions: { minLevel: 1 },
  },

  // ── Work / Job titles ──
  {
    id: "young_worker",
    nameFa: "کارمند جوان",
    emoji: "👔",
    unlockConditions: { minLevel: 2 },
    bonuses: { reputationGain: 0.3 },
  },
  {
    id: "trusted_employee",
    nameFa: "کارمند قابل اعتماد",
    emoji: "✅",
    unlockConditions: { minLevel: 4, minReputation: 30 },
    bonuses: { reputationGain: 0.5, opportunityWeight: 1.05 },
  },
  {
    id: "senior_worker",
    nameFa: "کارمند ارشد",
    emoji: "🏅",
    unlockConditions: { minLevel: 6, minReputation: 50 },
    bonuses: { reputationGain: 1.0, opportunityWeight: 1.1 },
  },

  // ── Tech / Skill titles ──
  {
    id: "junior_dev",
    nameFa: "برنامه‌نویس مبتدی",
    emoji: "💻",
    unlockConditions: { minLevel: 2, careerTrack: "tech" },
    bonuses: { opportunityWeight: 1.05 },
  },
  {
    id: "young_dev",
    nameFa: "توسعه‌دهنده جوان",
    emoji: "⌨️",
    unlockConditions: { minLevel: 4, careerTrack: "tech", minSkillLevel: 4 },
    bonuses: { reputationGain: 0.5, opportunityWeight: 1.1 },
  },
  {
    id: "pro_dev",
    nameFa: "توسعه‌دهنده حرفه‌ای",
    emoji: "🖥️",
    unlockConditions: { minLevel: 6, careerTrack: "tech", minSkillLevel: 6 },
    bonuses: { reputationGain: 1.0, opportunityWeight: 1.2 },
  },
  {
    id: "tech_specialist",
    nameFa: "متخصص فناوری",
    emoji: "🔬",
    unlockConditions: { minSkillLevel: 7, archetypeId: "specialist" },
    bonuses: { reputationGain: 1.5, opportunityWeight: 1.15 },
  },

  // ── Finance / Investment titles ──
  {
    id: "young_investor",
    nameFa: "سرمایه‌گذار تازه‌کار",
    emoji: "📊",
    unlockConditions: { minMoney: 20_000_000 },
    bonuses: { opportunityWeight: 1.1 },
  },
  {
    id: "smart_saver",
    nameFa: "پس‌انداز‌کار هوشمند",
    emoji: "🏦",
    unlockConditions: { minSavings: 50_000_000 },
    bonuses: { reputationGain: 0.5 },
  },
  {
    id: "wealth_builder",
    nameFa: "سازنده ثروت",
    emoji: "💎",
    unlockConditions: { minSavings: 150_000_000, archetypeId: "investor" },
    bonuses: { reputationGain: 2.0, opportunityWeight: 1.2 },
  },

  // ── Entrepreneur titles ──
  {
    id: "risk_taker",
    nameFa: "ریسک‌پذیر",
    emoji: "🎲",
    unlockConditions: { archetypeId: "entrepreneur", minLevel: 3 },
    bonuses: { opportunityWeight: 1.15 },
  },
  {
    id: "startup_founder",
    nameFa: "کارآفرین نوپا",
    emoji: "🚀",
    unlockConditions: { archetypeId: "entrepreneur", minLevel: 5, minReputation: 40 },
    bonuses: { reputationGain: 1.5, opportunityWeight: 1.25 },
  },

  // ── Reputation / Status titles ──
  {
    id: "city_known",
    nameFa: "شناخته‌شده شهر",
    emoji: "🌟",
    unlockConditions: { minReputation: 60 },
    bonuses: { reputationGain: 2.0, opportunityWeight: 1.2 },
  },
  {
    id: "city_star",
    nameFa: "ستاره شهر",
    emoji: "⭐",
    unlockConditions: { minReputation: 80, minLevel: 7 },
    bonuses: { reputationGain: 3.0, opportunityWeight: 1.3 },
  },
];

// ─── Check which titles a player qualifies for ─────────────────

export function getUnlockedTitleIds(signals: IdentitySignals): string[] {
  return TITLES
    .filter((title) => {
      const c = title.unlockConditions;
      if (c.minLevel && signals.level < c.minLevel) return false;
      if (c.minMoney && signals.money < c.minMoney) return false;
      if (c.minSavings && signals.savings < c.minSavings) return false;
      if (c.minReputation && signals.reputation < c.minReputation) return false;
      if (c.minSkillLevel && signals.maxHardSkillLevel < c.minSkillLevel) return false;
      if (c.careerTrack && signals.careerTrack !== c.careerTrack) return false;
      if (c.archetypeId) {
        // archetypeId condition matched lazily — caller passes archetype id
        // We store archetypeId in signals via careerTrack hack — skip for now
        // (resolved in identityAnalyzer which passes archetype separately)
      }
      return true;
    })
    .map((t) => t.id);
}

/** Pick the most prestigious unlocked title */
export function pickBestTitle(
  unlockedIds: string[],
  archetypeId: string,
): PlayerTitle {
  const fallback = TITLES.find((t) => t.id === "fresh_start")!;

  // Filter to actually unlocked
  const unlocked = TITLES.filter((t) => unlockedIds.includes(t.id));
  if (unlocked.length === 0) return fallback;

  // Prefer archetype-specific title if available
  const archetypeMatch = unlocked.find((t) => t.unlockConditions.archetypeId === archetypeId);
  if (archetypeMatch) return archetypeMatch;

  // Prefer title with highest unlock bar (richest conditions)
  const scored = unlocked.map((t) => {
    const c = t.unlockConditions;
    let score = 0;
    if (c.minLevel) score += c.minLevel * 2;
    if (c.minMoney) score += Math.log10(c.minMoney);
    if (c.minSavings) score += Math.log10(c.minSavings);
    if (c.minReputation) score += c.minReputation;
    if (c.minSkillLevel) score += c.minSkillLevel * 3;
    return { title: t, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].title;
}
