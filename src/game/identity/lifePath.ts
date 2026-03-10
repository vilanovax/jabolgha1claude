// ─── Life Path System ─────────────────────────────────────────
// A narrative career trajectory based on player actions.

import type { LifePathStep, IdentitySignals } from "./types";

// ─── Path templates by career track ───────────────────────────

const TECH_PATH: Omit<LifePathStep, "reached">[] = [
  { id: "student",       nameFa: "دانشجو",              emoji: "📖" },
  { id: "junior_dev",    nameFa: "برنامه‌نویس مبتدی",   emoji: "💻" },
  { id: "developer",     nameFa: "توسعه‌دهنده",          emoji: "⌨️" },
  { id: "senior_dev",    nameFa: "توسعه‌دهنده ارشد",    emoji: "🖥️" },
  { id: "architect",     nameFa: "معمار نرم‌افزار",      emoji: "🏗️" },
];

const FINANCE_PATH: Omit<LifePathStep, "reached">[] = [
  { id: "student",       nameFa: "دانشجو",              emoji: "📖" },
  { id: "accountant",   nameFa: "حسابدار",              emoji: "🧮" },
  { id: "analyst",      nameFa: "تحلیلگر مالی",         emoji: "📊" },
  { id: "manager",      nameFa: "مدیر مالی",            emoji: "💼" },
  { id: "cfo",          nameFa: "مدیر ارشد مالی",       emoji: "🏦" },
];

const DESIGN_PATH: Omit<LifePathStep, "reached">[] = [
  { id: "student",       nameFa: "دانشجو",              emoji: "📖" },
  { id: "junior_design", nameFa: "طراح مبتدی",          emoji: "✏️" },
  { id: "designer",     nameFa: "طراح",                 emoji: "🎨" },
  { id: "art_director", nameFa: "مدیر هنری",            emoji: "🖼️" },
  { id: "creative_dir", nameFa: "مدیر خلاق",           emoji: "🌟" },
];

const GENERAL_PATH: Omit<LifePathStep, "reached">[] = [
  { id: "student",       nameFa: "تازه‌کار",            emoji: "🌱" },
  { id: "worker",        nameFa: "کارمند",               emoji: "👔" },
  { id: "experienced",   nameFa: "باتجربه",              emoji: "🎯" },
  { id: "senior",        nameFa: "ارشد",                emoji: "🏅" },
  { id: "leader",        nameFa: "رهبر",                emoji: "👑" },
];

function getPathTemplate(careerTrack: string | null): Omit<LifePathStep, "reached">[] {
  switch (careerTrack) {
    case "tech":     return TECH_PATH;
    case "finance":  return FINANCE_PATH;
    case "design":   return DESIGN_PATH;
    default:         return GENERAL_PATH;
  }
}

// ─── Determine how many steps are reached ─────────────────────

function getReachedIndex(signals: IdentitySignals): number {
  const { level, totalWorkShifts, maxHardSkillLevel } = signals;

  if (level >= 8 && maxHardSkillLevel >= 7) return 4; // architect/cfo/creative
  if (level >= 6 && maxHardSkillLevel >= 5) return 3; // senior
  if (level >= 4 && totalWorkShifts >= 15) return 2;  // developer/analyst
  if (level >= 2 || totalWorkShifts >= 3) return 1;   // junior
  return 0;                                           // student
}

// ─── Public API ───────────────────────────────────────────────

export function buildLifePath(signals: IdentitySignals): LifePathStep[] {
  const template = getPathTemplate(signals.careerTrack);
  const reachedIdx = getReachedIndex(signals);

  return template.map((step, i) => ({
    ...step,
    reached: i <= reachedIdx,
  }));
}
