// ─── Job-City Bridge ───
// Applies city gameplay modifiers to job listings and hiring probability.

import type { CityGameplayModifiers } from "./city-impact-resolver";
import type { SectorId } from "@/game/city/types";
import { jobCategoryToSector } from "@/game/city/city-helpers";

// Matches the JobListing shape in mock.ts
export interface SeniorityLevel {
  key: string;
  label: string;
  salary: number;
  minXp: number;
  requiredCourses: string[];
  requirements: { skill: string; level: number }[];
}

export interface JobListingForDisplay {
  id: number;
  title: string;
  company: string;
  type: string;
  isRemote?: boolean;
  seniorityLevels: SeniorityLevel[];
  sector: SectorId;
  hiringModifier: number;    // additive % on top of base chance
  listingAvailable: boolean; // false = hidden/suppressed by low demand
}

/**
 * Enrich job listings with city modifiers.
 * Pass the raw jobListings from gameStore + city modifiers.
 */
export function enrichJobListingsWithCity(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jobListings: any[],
  modifiers: CityGameplayModifiers,
): JobListingForDisplay[] {
  return jobListings.map((job) => {
    // Map job type/title to a sector
    const sector = inferJobSector(job);
    const salaryMult = modifiers.jobMarket.salaryMultiplierBySector[sector] ?? 1.0;
    const hiringMod = modifiers.jobMarket.hiringChanceModifierBySector[sector] ?? 0;
    const listingMult = modifiers.jobMarket.jobListingCountMultiplierBySector[sector] ?? 1.0;

    // Scale all seniority level salaries
    const enrichedLevels: SeniorityLevel[] = job.seniorityLevels.map(
      (level: SeniorityLevel) => ({
        ...level,
        salary: Math.round(level.salary * salaryMult),
      })
    );

    // Low demand → some listings become unavailable
    const listingAvailable = listingMult >= 0.6;

    return {
      ...job,
      seniorityLevels: enrichedLevels,
      sector,
      hiringModifier: hiringMod,
      listingAvailable,
    };
  });
}

/**
 * Calculate effective hiring probability including city modifier.
 *
 * baseChance   = job's base acceptance chance (e.g. 0.62)
 * skillScore   = player skill level bonus (0–0.3)
 * reputation   = 0–1
 * cityModifier = from city-impact-resolver (additive)
 */
export function calcHiringProbability(params: {
  baseChance: number;
  skillScore: number;
  reputation: number;
  cityHiringModifier: number;
}): number {
  const { baseChance, skillScore, reputation, cityHiringModifier } = params;
  const raw = baseChance + skillScore * 0.3 + reputation * 0.1 + cityHiringModifier;
  return Math.min(0.95, Math.max(0.05, raw));
}

/**
 * Get the adjusted salary for a specific seniority given city modifiers.
 */
export function getCityAdjustedSalary(
  baseSalary: number,
  sector: SectorId,
  modifiers: CityGameplayModifiers,
): number {
  const mult = modifiers.jobMarket.salaryMultiplierBySector[sector] ?? 1.0;
  return Math.round(baseSalary * mult);
}

/**
 * Infer the city sector for a job listing based on its type / title.
 */
function inferJobSector(job: { type?: string; title?: string }): SectorId {
  const combined = `${job.type ?? ""} ${job.title ?? ""}`.toLowerCase();

  if (combined.includes("استارتاپ") || combined.includes("it") ||
      combined.includes("برنامه") || combined.includes("طراح") ||
      combined.includes("react") || combined.includes("python") ||
      combined.includes("دیجیتال") || combined.includes("نرم‌افزار")) {
    return "tech";
  }
  if (combined.includes("بانک") || combined.includes("مال") ||
      combined.includes("حساب") || combined.includes("سرمایه")) {
    return "finance";
  }
  if (combined.includes("ساخت") || combined.includes("عمران") ||
      combined.includes("معمار") || combined.includes("مهندس")) {
    return "construction";
  }
  if (combined.includes("فروش") || combined.includes("خرده") ||
      combined.includes("فروشگاه") || combined.includes("بازاریابی")) {
    return "retail";
  }
  if (combined.includes("کارخانه") || combined.includes("تولید") ||
      combined.includes("صنعت")) {
    return "manufacturing";
  }
  return "services";
}

/**
 * Get a human-readable Persian city impact string for a job sector.
 * Used in Job Market UI.
 */
export function getJobCityImpactLabel(
  sector: SectorId,
  modifiers: CityGameplayModifiers,
): { text: string; positive: boolean } | null {
  const hiringMod = modifiers.jobMarket.hiringChanceModifierBySector[sector];
  const salaryMult = modifiers.jobMarket.salaryMultiplierBySector[sector];

  if (hiringMod > 0.05) {
    return { text: `استخدام +${Math.round(hiringMod * 100)}٪ (رونق شهر)`, positive: true };
  }
  if (hiringMod < -0.05) {
    return { text: `استخدام ${Math.round(hiringMod * 100)}٪ (رکود بازار)`, positive: false };
  }
  if (salaryMult > 1.08) {
    return { text: `حقوق +${Math.round((salaryMult - 1) * 100)}٪ (تقاضای بالا)`, positive: true };
  }
  if (salaryMult < 0.95) {
    return { text: `حقوق ${Math.round((salaryMult - 1) * 100)}٪ (بازار سرد)`, positive: false };
  }
  return null;
}
