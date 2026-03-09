// ─── City Wave Templates ───
// 7 wave archetypes that cycle through the city economy.

import type { CityWave, CityWaveId } from "./types";

export const CITY_WAVES: Record<CityWaveId, CityWave> = {
  stability: {
    id: "stability",
    nameFa: "ثبات اقتصادی",
    emoji: "⚖️",
    descriptionFa: "شهر در وضعیت پایدار به سر می‌بره. فرصت‌ها متوازنن.",
    sectorMods: {
      tech:         { healthDelta: +0.5, salaryMod: 0,    jobDemandDelta: 0 },
      finance:      { healthDelta: +0.3, salaryMod: 0,    jobDemandDelta: 0 },
      retail:       { healthDelta: +0.2, salaryMod: 0,    jobDemandDelta: 0 },
      services:     { healthDelta: +0.2, salaryMod: 0,    jobDemandDelta: 0 },
      construction: { healthDelta: 0,    salaryMod: 0,    jobDemandDelta: 0 },
      manufacturing:{ healthDelta: 0,    salaryMod: 0,    jobDemandDelta: 0 },
    },
    globalInflationDelta: 0,
    investmentBonus: 1.0,
    minDays: 4,
    maxDays: 7,
  },

  tech_boom: {
    id: "tech_boom",
    nameFa: "رونق تکنولوژی 🚀",
    emoji: "🚀",
    descriptionFa: "سرمایه‌گذاری در استارت‌آپ‌ها اوج گرفته. حقوق IT داره بالا می‌ره.",
    sectorMods: {
      tech:         { healthDelta: +2.5, salaryMod: +0.04, jobDemandDelta: +3 },
      finance:      { healthDelta: +1.0, salaryMod: +0.01, jobDemandDelta: +1 },
      construction: { healthDelta: +0.5, salaryMod: 0,     jobDemandDelta: +1 },
      retail:       { healthDelta: -0.3, salaryMod: -0.01, jobDemandDelta: -1 },
      manufacturing:{ healthDelta: -0.5, salaryMod: -0.01, jobDemandDelta: -1 },
      services:     { healthDelta: +0.8, salaryMod: +0.01, jobDemandDelta: +1 },
    },
    globalInflationDelta: +0.5,
    investmentBonus: 1.3,
    minDays: 5,
    maxDays: 10,
  },

  recession: {
    id: "recession",
    nameFa: "رکود اقتصادی",
    emoji: "📉",
    descriptionFa: "اقتصاد سرد شده. کارفرماها استخدام رو کاهش دادن و دستمزدها پایینه.",
    sectorMods: {
      tech:         { healthDelta: -1.5, salaryMod: -0.03, jobDemandDelta: -3 },
      finance:      { healthDelta: -2.0, salaryMod: -0.04, jobDemandDelta: -4 },
      retail:       { healthDelta: -2.5, salaryMod: -0.05, jobDemandDelta: -5 },
      construction: { healthDelta: -1.0, salaryMod: -0.02, jobDemandDelta: -2 },
      services:     { healthDelta: -1.5, salaryMod: -0.03, jobDemandDelta: -3 },
      manufacturing:{ healthDelta: -1.0, salaryMod: -0.02, jobDemandDelta: -2 },
    },
    globalInflationDelta: +1.0,
    investmentBonus: 0.7,
    minDays: 5,
    maxDays: 9,
  },

  construction_surge: {
    id: "construction_surge",
    nameFa: "ساخت‌وساز داغه",
    emoji: "🏗️",
    descriptionFa: "پروژه‌های عمرانی بزرگ شروع شدن. تقاضا برای کارگران مهارتی بالاست.",
    sectorMods: {
      construction: { healthDelta: +3.0, salaryMod: +0.05, jobDemandDelta: +6 },
      manufacturing:{ healthDelta: +1.5, salaryMod: +0.02, jobDemandDelta: +3 },
      services:     { healthDelta: +1.0, salaryMod: +0.01, jobDemandDelta: +2 },
      tech:         { healthDelta: -0.5, salaryMod: 0,     jobDemandDelta: -1 },
      finance:      { healthDelta: +0.5, salaryMod: 0,     jobDemandDelta: +1 },
      retail:       { healthDelta: +0.8, salaryMod: 0,     jobDemandDelta: +1 },
    },
    globalInflationDelta: +0.3,
    investmentBonus: 1.1,
    minDays: 4,
    maxDays: 8,
  },

  finance_bull: {
    id: "finance_bull",
    nameFa: "بازار گاوی",
    emoji: "🐂",
    descriptionFa: "بازار سهام و رمزارز در اوج. سرمایه‌گذاری‌ها پربازده‌ترن.",
    sectorMods: {
      finance:      { healthDelta: +3.0, salaryMod: +0.05, jobDemandDelta: +4 },
      tech:         { healthDelta: +1.5, salaryMod: +0.02, jobDemandDelta: +2 },
      retail:       { healthDelta: +1.0, salaryMod: +0.01, jobDemandDelta: +1 },
      construction: { healthDelta: +0.5, salaryMod: 0,     jobDemandDelta: +1 },
      services:     { healthDelta: +0.8, salaryMod: 0,     jobDemandDelta: +1 },
      manufacturing:{ healthDelta: -0.3, salaryMod: 0,     jobDemandDelta: 0  },
    },
    globalInflationDelta: +0.8,
    investmentBonus: 1.5,
    minDays: 4,
    maxDays: 7,
  },

  retail_holiday: {
    id: "retail_holiday",
    nameFa: "فصل خرید",
    emoji: "🛍️",
    descriptionFa: "نوروز یا عید فطره. فروشگاه‌ها پر مشتریه و درآمد خرده‌فروشی اوج گرفته.",
    sectorMods: {
      retail:       { healthDelta: +3.5, salaryMod: +0.06, jobDemandDelta: +7 },
      services:     { healthDelta: +2.0, salaryMod: +0.03, jobDemandDelta: +4 },
      manufacturing:{ healthDelta: +1.0, salaryMod: +0.01, jobDemandDelta: +2 },
      finance:      { healthDelta: +0.5, salaryMod: 0,     jobDemandDelta: +1 },
      tech:         { healthDelta: -0.3, salaryMod: 0,     jobDemandDelta: 0  },
      construction: { healthDelta: -0.5, salaryMod: -0.01, jobDemandDelta: -1 },
    },
    globalInflationDelta: +1.2,
    investmentBonus: 1.0,
    minDays: 5,
    maxDays: 8,
  },

  manufacturing_revival: {
    id: "manufacturing_revival",
    nameFa: "احیای صنعت",
    emoji: "🏭",
    descriptionFa: "خطوط تولید دوباره فعال شدن. تقاضا برای کارگر ماهر بالاست.",
    sectorMods: {
      manufacturing:{ healthDelta: +3.0, salaryMod: +0.05, jobDemandDelta: +6 },
      construction: { healthDelta: +1.5, salaryMod: +0.02, jobDemandDelta: +3 },
      services:     { healthDelta: +0.8, salaryMod: 0,     jobDemandDelta: +2 },
      retail:       { healthDelta: +0.5, salaryMod: 0,     jobDemandDelta: +1 },
      tech:         { healthDelta: -0.5, salaryMod: -0.01, jobDemandDelta: -1 },
      finance:      { healthDelta: 0,    salaryMod: 0,     jobDemandDelta: 0  },
    },
    globalInflationDelta: +0.2,
    investmentBonus: 1.1,
    minDays: 4,
    maxDays: 7,
  },
};

// Wave transition order (cyclical, weighted)
export const WAVE_CYCLE_ORDER: CityWaveId[] = [
  "stability",
  "tech_boom",
  "construction_surge",
  "stability",
  "finance_bull",
  "retail_holiday",
  "stability",
  "recession",
  "manufacturing_revival",
];

export const INITIAL_CITY_WAVE: CityWaveId = "stability";
