// ─── Mission-City Bridge ───
// Injects city-event-triggered missions into the Mission Engine.
// Called in startNextDay() after city simulation runs.

import type { CityState } from "@/game/city/types";
import type { Mission } from "@/game/missions/types";
import { CITY_WAVES } from "@/game/city/seed-waves";

/**
 * Generate event missions based on active city events and current wave.
 * Returns new Mission objects ready to be set as activeEventMission.
 */
export function generateCityEventMissions(
  cityState: CityState,
  dayInGame: number,
  playerLevel: number,
): Mission[] {
  const missions: Mission[] = [];

  // ── Wave-triggered missions ──
  const waveMission = buildWaveMission(cityState.currentWaveId, dayInGame, playerLevel);
  if (waveMission) missions.push(waveMission);

  // ── City-event-triggered missions (only for events that just started today) ──
  for (const ev of cityState.activeEvents) {
    if (!ev.missionEventTag) continue;
    if (ev.startedOnDay !== dayInGame) continue;

    const evMission = buildEventMission(ev.missionEventTag, ev, dayInGame, playerLevel);
    if (evMission) missions.push(evMission);
  }

  return missions;
}

/** Get city-based weight boosts for mission template selection. */
export function getCityMissionWeightModifiers(
  cityState: CityState,
): Record<string, number> {
  const boosts: Record<string, number> = {};

  const tech = cityState.sectors.tech?.health ?? 60;
  const finance = cityState.sectors.finance?.health ?? 60;
  const retail = cityState.sectors.retail?.health ?? 60;

  if (tech > 70) {
    boosts["work_shift"] = 1.4;
    boosts["study_session"] = 1.3;
  }
  if (finance > 70) {
    boosts["invest_small"] = 1.5;
    boosts["earn_money"] = 1.2;
  }
  if (retail > 70) {
    boosts["earn_money"] = (boosts["earn_money"] ?? 1) * 1.3;
  }
  if (cityState.economyHealth < 40) {
    boosts["save_money"] = 2.0;
    boosts["financial_survival"] = 2.0;
  }

  return boosts;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildWaveMission(
  waveId: string,
  day: number,
  level: number,
): Mission | null {
  if (waveId === "stability") return null;

  type WaveTemplate = Pick<Mission, "titleFa" | "subtitleFa" | "emoji" | "objectives" | "rewards" | "recommendedReasonFa">;
  const missionMap: Record<string, WaveTemplate> = {
    tech_boom: {
      titleFa: "رونق فناوری: کار کن!",
      subtitleFa: "بازار IT داغه. یه شیفت کار کن.",
      emoji: "🚀",
      objectives: [{ type: "complete_work_shift", count: 1 }],
      rewards: { xp: 60 * level, stars: 1, money: 500_000 * level },
      recommendedReasonFa: "موج تکنولوژی فعاله — شانس استخدام بالاست",
    },
    recession: {
      titleFa: "رکود: پول پس‌انداز کن",
      subtitleFa: "اقتصاد ضعیفه. ۲ میلیون پس‌انداز کن.",
      emoji: "💰",
      objectives: [{ type: "save_money", amount: 2_000_000 }],
      rewards: { xp: 80 * level, stars: 2 },
      recommendedReasonFa: "در رکود، پس‌انداز مهم‌ترین کاره",
    },
    finance_bull: {
      titleFa: "بازار گاوی: سرمایه‌گذاری کن",
      subtitleFa: "الان وقت سرمایه‌گذاریه.",
      emoji: "🐂",
      objectives: [{ type: "invest_money", amount: 1_000_000 }],
      rewards: { xp: 70 * level, stars: 2, money: 300_000 * level },
      recommendedReasonFa: "بازار مالی داغه — سرمایه‌گذاری پرسوده",
    },
    construction_surge: {
      titleFa: "موج ساخت‌وساز: درس بخون",
      subtitleFa: "تقاضا برای مهارت‌های فنی بالاست.",
      emoji: "🏗️",
      objectives: [{ type: "study_sessions", count: 2 }],
      rewards: { xp: 60 * level, stars: 1 },
      recommendedReasonFa: "مهارت‌های فنی الان ارزشمندن",
    },
    retail_holiday: {
      titleFa: "فصل خرید: درآمد کسب کن",
      subtitleFa: "جمعه‌بازار شلوغه.",
      emoji: "🛍️",
      objectives: [{ type: "earn_money", amount: 1_500_000 }],
      rewards: { xp: 50 * level, stars: 1, money: 200_000 * level },
      recommendedReasonFa: "فصل خریده — درآمد راحت‌تره",
    },
    manufacturing_revival: {
      titleFa: "احیای صنعت: شیفت بده",
      subtitleFa: "کارخانه‌ها نیرو می‌خوان.",
      emoji: "🏭",
      objectives: [{ type: "complete_work_shift", count: 2 }],
      rewards: { xp: 70 * level, stars: 1, money: 400_000 * level },
      recommendedReasonFa: "صنعت داره احیا می‌شه",
    },
  };

  const template = missionMap[waveId];
  if (!template) return null;

  return {
    ...template,
    id: `city_wave_${waveId}_${day}`,
    category: "event",
    status: "active",
    progress: {},
    createdAtDay: day,
    expiresAtDay: day + 3,
  };
}

function buildEventMission(
  tag: string,
  ev: { titleFa: string; emoji: string; durationDays: number },
  day: number,
  level: number,
): Mission | null {
  type EventTemplate = Pick<Mission, "titleFa" | "subtitleFa" | "emoji" | "objectives" | "rewards">;
  const eventMissionMap: Record<string, EventTemplate> = {
    tech_boom_event: {
      titleFa: "فرصت: ۲ شیفت IT بده",
      emoji: "💻",
      objectives: [{ type: "complete_work_shift", count: 2 }],
      rewards: { xp: 100 * level, stars: 2 },
    },
    job_crisis_event: {
      titleFa: "بحران: پول ذخیره کن",
      emoji: "💼",
      objectives: [{ type: "save_money", amount: 3_000_000 }],
      rewards: { xp: 80 * level, stars: 2 },
    },
    dollar_rise_event: {
      titleFa: "جهش ارزی: سرمایه‌گذاری کن",
      emoji: "💵",
      objectives: [{ type: "invest_money", amount: 2_000_000 }],
      rewards: { xp: 90 * level, stars: 3, money: 500_000 },
    },
    market_crash_event: {
      titleFa: "سقوط بازار: پس‌انداز کن",
      emoji: "📉",
      objectives: [{ type: "save_money", amount: 5_000_000 }],
      rewards: { xp: 120 * level, stars: 3 },
    },
    savings_bonus_event: {
      titleFa: "سود بانکی: ۵ میلیون بذار",
      emoji: "🏦",
      objectives: [{ type: "save_money", amount: 5_000_000 }],
      rewards: { xp: 60 * level, stars: 1, money: 300_000 * level },
    },
    construction_boom_event: {
      titleFa: "رونق مسکن: مطالعه کن",
      emoji: "🏘️",
      objectives: [{ type: "study_sessions", count: 2 }],
      rewards: { xp: 70 * level, stars: 1 },
    },
    retail_event: {
      titleFa: "نوروز: درآمد کسب کن",
      emoji: "🌸",
      objectives: [{ type: "earn_money", amount: 2_000_000 }],
      rewards: { xp: 80 * level, stars: 2, money: 200_000 },
    },
    inflation_event: {
      titleFa: "تورم: هزینه کمتر",
      emoji: "🚫",
      objectives: [{ type: "save_money", amount: 4_000_000 }],
      rewards: { xp: 100 * level, stars: 2 },
    },
    crisis_event: {
      titleFa: "بحران برق: استراحت کن",
      emoji: "⚡",
      objectives: [{ type: "rest_sessions", count: 2 }],
      rewards: { xp: 60 * level, stars: 1 },
    },
  };

  const template = eventMissionMap[tag];
  if (!template) return null;

  return {
    ...template,
    subtitleFa: template.subtitleFa ?? `رویداد: ${ev.titleFa}`,
    id: `city_event_${tag}_${day}`,
    category: "event",
    status: "active",
    progress: {},
    createdAtDay: day,
    expiresAtDay: day + ev.durationDays,
    recommendedReasonFa: "رویداد شهری فعاله!",
  };
}
