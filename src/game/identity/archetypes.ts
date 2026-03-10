// ─── Archetype Definitions + Analyzer ──────────────────────────

import type { PlayerArchetype, ArchetypeId, IdentitySignals } from "./types";

export const ARCHETYPES: Record<ArchetypeId, PlayerArchetype> = {
  entrepreneur: {
    id: "entrepreneur",
    nameFa: "کارآفرین",
    emoji: "🚀",
    descriptionFa: "ریسک‌پذیر، دنبال فرصت‌های بزرگ",
    modifiers: {
      opportunityWeight: 1.4,
      jobOfferWeight: 1.1,
      investmentLuck: 1.15,
    },
  },
  specialist: {
    id: "specialist",
    nameFa: "متخصص",
    emoji: "🎓",
    descriptionFa: "مهارت‌محور، دانش‌دوست",
    modifiers: {
      opportunityWeight: 1.1,
      jobOfferWeight: 1.3,
      investmentLuck: 1.0,
    },
  },
  professional: {
    id: "professional",
    nameFa: "کارمند حرفه‌ای",
    emoji: "💼",
    descriptionFa: "شغل پایدار، روال منظم",
    modifiers: {
      opportunityWeight: 0.9,
      jobOfferWeight: 1.2,
      investmentLuck: 1.0,
    },
  },
  investor: {
    id: "investor",
    nameFa: "سرمایه‌گذار",
    emoji: "📈",
    descriptionFa: "پول روی پول، رشد مالی",
    modifiers: {
      opportunityWeight: 1.2,
      jobOfferWeight: 0.9,
      investmentLuck: 1.2,
    },
  },
  safe_planner: {
    id: "safe_planner",
    nameFa: "برنامه‌ریز محافظه‌کار",
    emoji: "🛡️",
    descriptionFa: "کم‌ریسک، ثبات مالی",
    modifiers: {
      opportunityWeight: 0.8,
      jobOfferWeight: 1.0,
      investmentLuck: 0.9,
    },
  },
  undecided: {
    id: "undecided",
    nameFa: "در حال کشف",
    emoji: "🌱",
    descriptionFa: "هنوز مسیرت را پیدا نکردی",
    modifiers: {
      opportunityWeight: 1.0,
      jobOfferWeight: 1.0,
      investmentLuck: 1.0,
    },
  },
};

// ──────────────────────────────────────────────────────────────────
// Analyzer — scores each archetype from behavioral signals
// ──────────────────────────────────────────────────────────────────

export function analyzeArchetype(signals: IdentitySignals): PlayerArchetype {
  if (signals.dayInGame < 5) return ARCHETYPES.undecided;

  const scores: Record<ArchetypeId, number> = {
    entrepreneur:  0,
    specialist:    0,
    professional:  0,
    investor:      0,
    safe_planner:  0,
    undecided:     0,
  };

  // ── Entrepreneur: high risk, startup investments, many risky actions
  if (signals.totalRiskyActions > 5)  scores.entrepreneur += 2;
  if (signals.totalRiskyActions > 15) scores.entrepreneur += 2;
  if (signals.totalInvested > 5_000_000)  scores.entrepreneur += 1;
  if (signals.totalInvested > 20_000_000) scores.entrepreneur += 2;
  if (signals.activeLoansCount > 0)   scores.entrepreneur += 1;

  // ── Specialist: study sessions, skill levels, course completions
  if (signals.totalStudySessions > 5)  scores.specialist += 2;
  if (signals.totalStudySessions > 15) scores.specialist += 2;
  if (signals.maxHardSkillLevel >= 5)  scores.specialist += 2;
  if (signals.maxHardSkillLevel >= 7)  scores.specialist += 2;

  // ── Professional: work shifts, stable job, consistent routine
  if (signals.totalWorkShifts > 5)   scores.professional += 2;
  if (signals.totalWorkShifts > 20)  scores.professional += 2;
  if (signals.hasActiveJob)          scores.professional += 2;
  if (signals.totalWorkShifts > 0 && signals.totalRiskyActions < 3) scores.professional += 1;

  // ── Investor: high savings, high total invested, low risky actions
  if (signals.savings > 10_000_000)  scores.investor += 1;
  if (signals.savings > 40_000_000)  scores.investor += 2;
  if (signals.totalInvested > 10_000_000) scores.investor += 2;
  if (signals.totalInvested > 30_000_000) scores.investor += 2;

  // ── Safe Planner: low debt, high savings, low risk
  if (signals.activeLoansCount === 0) scores.safe_planner += 2;
  if (signals.savings > signals.money) scores.safe_planner += 1;
  if (signals.totalRiskyActions < 3 && signals.totalWorkShifts > 3) scores.safe_planner += 1;
  if (signals.savings > 20_000_000 && signals.activeLoansCount === 0) scores.safe_planner += 2;

  // Find the highest scorer
  const best = (Object.entries(scores) as [ArchetypeId, number][])
    .filter(([id]) => id !== "undecided")
    .reduce((a, b) => (b[1] > a[1] ? b : a), ["undecided" as ArchetypeId, 0]);

  // Only commit to archetype if score is meaningful
  if (best[1] < 3) return ARCHETYPES.undecided;

  return ARCHETYPES[best[0]];
}
