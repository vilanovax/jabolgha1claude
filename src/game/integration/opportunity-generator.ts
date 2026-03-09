// ─── Opportunity Generator ───
// Surfaces actionable player opportunities derived from city state.
// Used on City page and optionally in Job Market.

import type { CityState, SectorId } from "@/game/city/types";
import type { CityGameplayModifiers } from "./city-impact-resolver";
import { CITY_WAVES } from "@/game/city/seed-waves";

export type OpportunityType =
  | "job_hiring"
  | "investment_hot"
  | "mission_urgent"
  | "skill_demand"
  | "cost_alert";

export interface CityOpportunity {
  id: string;
  type: OpportunityType;
  emoji: string;
  titleFa: string;
  descFa: string;
  sector?: SectorId;
  ctaFa: string;       // call-to-action label
  ctaHref: string;     // navigation target
  urgency: "low" | "medium" | "high";
  expiresInDays?: number;
}

/**
 * Generate 2–4 player opportunities based on city state and modifiers.
 */
export function generateCityOpportunities(
  cityState: CityState,
  modifiers: CityGameplayModifiers,
  dayInGame: number,
): CityOpportunity[] {
  const opportunities: CityOpportunity[] = [];
  const wave = CITY_WAVES[cityState.currentWaveId];

  // ── 1. High-demand sectors → job opportunity ──
  const topSector = getTopHiringSector(cityState, modifiers);
  if (topSector) {
    opportunities.push({
      id: `job_${topSector.id}_${dayInGame}`,
      type: "job_hiring",
      emoji: topSector.emoji,
      titleFa: `تقاضای بالا: ${topSector.nameFa}`,
      descFa: `استخدام در بخش ${topSector.nameFa} ${Math.round(
        modifiers.jobMarket.hiringChanceModifierBySector[topSector.id] * 100
      )}٪ بیشتر از حد معمال`,
      sector: topSector.id,
      ctaFa: "مشاهده فرصت‌های شغلی",
      ctaHref: "/jobs",
      urgency: topSector.health > 75 ? "high" : "medium",
      expiresInDays: cityState.waveRemainingDays,
    });
  }

  // ── 2. Investment opportunity from wave ──
  if (wave.investmentBonus > 1.1) {
    opportunities.push({
      id: `invest_${cityState.currentWaveId}_${dayInGame}`,
      type: "investment_hot",
      emoji: wave.emoji,
      titleFa: `سرمایه‌گذاری: ${wave.nameFa}`,
      descFa: `در موج ${wave.nameFa}، بازده سرمایه‌گذاری ×${wave.investmentBonus.toFixed(1)} هست.`,
      ctaFa: "سرمایه‌گذاری کن",
      ctaHref: "/bank",
      urgency: wave.investmentBonus > 1.3 ? "high" : "medium",
      expiresInDays: cityState.waveRemainingDays,
    });
  }

  // ── 3. Recession warning ──
  if (cityState.currentWaveId === "recession" || cityState.economyHealth < 40) {
    opportunities.push({
      id: `recession_alert_${dayInGame}`,
      type: "cost_alert",
      emoji: "📉",
      titleFa: "هشدار: رکود اقتصادی",
      descFa: "پس‌انداز کن و هزینه‌هات رو کم کن. الان وقت سرمایه‌گذاری ریسکی نیست.",
      ctaFa: "مدیریت مالی",
      ctaHref: "/bank",
      urgency: "high",
      expiresInDays: cityState.waveRemainingDays,
    });
  }

  // ── 4. Active city events → urgent missions ──
  for (const ev of cityState.activeEvents.slice(0, 2)) {
    if (ev.severity === "crisis" || ev.severity === "major") {
      opportunities.push({
        id: `event_opp_${ev.id}_${dayInGame}`,
        type: ev.sectorHealthDelta < 0 ? "cost_alert" : "investment_hot",
        emoji: ev.emoji,
        titleFa: ev.titleFa,
        descFa: ev.descriptionFa,
        ctaFa: ev.severity === "crisis" ? "اقدام فوری" : "استفاده کن",
        ctaHref: "/missions",
        urgency: ev.severity === "crisis" ? "high" : "medium",
        expiresInDays: ev.remainingDays,
      });
    }
  }

  // ── 5. Skill demand (based on top sector) ──
  if (topSector && (topSector.id === "tech" || topSector.id === "finance")) {
    const skillHint = topSector.id === "tech"
      ? { emoji: "💻", name: "برنامه‌نویسی" }
      : { emoji: "📊", name: "حسابداری" };

    opportunities.push({
      id: `skill_${topSector.id}_${dayInGame}`,
      type: "skill_demand",
      emoji: skillHint.emoji,
      titleFa: `مهارت ${skillHint.name} پرتقاضاست`,
      descFa: `با تقویت مهارت ${skillHint.name} شانس استخدام و حقوقت رو بالا ببر.`,
      ctaFa: "ثبت‌نام در دوره",
      ctaHref: "/skills",
      urgency: "low",
    });
  }

  // Deduplicate and limit
  const seen = new Set<string>();
  const unique = opportunities.filter((o) => {
    if (seen.has(o.id)) return false;
    seen.add(o.id);
    return true;
  });

  return unique.slice(0, 4);
}

/** Find the sector with the highest hiring demand. */
function getTopHiringSector(
  cityState: CityState,
  modifiers: CityGameplayModifiers,
): (typeof cityState.sectors)[SectorId] | null {
  const sectors = Object.values(cityState.sectors);
  const sorted = sectors
    .filter((s) => {
      const hiring = modifiers.jobMarket.hiringChanceModifierBySector[s.id] ?? 0;
      return hiring > 0.03 || s.jobDemand > 65;
    })
    .sort((a, b) => b.jobDemand - a.jobDemand);

  return sorted[0] ?? null;
}
