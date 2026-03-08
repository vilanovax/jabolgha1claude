// ─── Mission Templates ───
// Templates are used to dynamically generate daily/weekly/event/rescue missions.
// Each template has conditions, weight, and factories for objectives + rewards.

import type { MissionTemplate, MissionGenerationContext } from "./types";
import { scaleMoneyTarget, scaleXpReward } from "./rewards";

// ════════════ DAILY TEMPLATES ════════════

export const DAILY_TEMPLATES: MissionTemplate[] = [
  // ── Survival / Wellbeing ──
  {
    id: "daily_eat_breakfast",
    category: "daily",
    emoji: "🍳",
    titleFa: "صبحانه بخور",
    subtitleFa: "شروع روز با انرژی",
    weight: 10,
    objectiveFactory: () => [{ type: "eat_meals", count: 1 }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(20, ctx.player.level),
    }),
    recommendedReasonFactory: (ctx) =>
      ctx.player.hunger < 40 ? "گرسنه‌ای! صبحانه بخور" : undefined,
  },
  {
    id: "daily_exercise",
    category: "daily",
    emoji: "🏋️",
    titleFa: "یک جلسه ورزش کن",
    subtitleFa: "سلامتی بالا، استرس پایین",
    weight: 8,
    objectiveFactory: () => [{ type: "exercise_sessions", count: 1 }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(25, ctx.player.level),
    }),
    recommendedReasonFactory: (ctx) =>
      ctx.player.health < 50 ? "سلامتت پایینه" : undefined,
  },
  {
    id: "daily_rest",
    category: "daily",
    emoji: "🛋️",
    titleFa: "یه استراحت کن",
    subtitleFa: "ذهنت نیاز به آرامش داره",
    weight: 6,
    conditions: { minStress: 30 },
    objectiveFactory: () => [{ type: "rest_sessions", count: 1 }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(15, ctx.player.level),
    }),
    recommendedReasonFactory: (ctx) =>
      ctx.player.stress > 60 ? "استرست بالاست!" : undefined,
  },

  // ── Growth / Study / Work ──
  {
    id: "daily_work_shift",
    category: "daily",
    emoji: "💼",
    titleFa: "یک شیفت کار کن",
    subtitleFa: "درآمد امروز",
    weight: 10,
    conditions: { jobRequired: true },
    objectiveFactory: () => [{ type: "complete_work_shift", count: 1 }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(50, ctx.player.level),
      stars: 1,
      money: scaleMoneyTarget(500_000, ctx.player.level),
    }),
    recommendedReasonFactory: () => "رشد شغلی و درآمد",
  },
  {
    id: "daily_study",
    category: "daily",
    emoji: "📚",
    titleFa: "یک جلسه مطالعه کن",
    subtitleFa: "دانش قدرته",
    weight: 8,
    objectiveFactory: () => [{ type: "study_sessions", count: 1 }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(30, ctx.player.level),
    }),
    recommendedReasonFactory: (ctx) =>
      ctx.player.studySessionsLast7Days < 2
        ? "مدتیه درس نخوندی"
        : undefined,
  },

  // ── Economy / Routine ──
  {
    id: "daily_earn_money",
    category: "daily",
    emoji: "💵",
    titleFa: "امروز درآمد داشته باش",
    subtitleFa: "هر مبلغی",
    weight: 6,
    objectiveFactory: (ctx) => [{
      type: "earn_money",
      amount: scaleMoneyTarget(500_000, ctx.player.level),
    }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(20, ctx.player.level),
    }),
  },
  {
    id: "daily_invest_small",
    category: "daily",
    emoji: "📈",
    titleFa: "یه سرمایه‌گذاری کوچک",
    subtitleFa: "پولت رو به کار بنداز",
    weight: 4,
    conditions: { moneyAbove: 2_000_000 },
    objectiveFactory: (ctx) => [{
      type: "invest_money",
      amount: scaleMoneyTarget(500_000, ctx.player.level),
    }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(25, ctx.player.level),
    }),
  },
];

// ════════════ WEEKLY TEMPLATES ════════════

export const WEEKLY_TEMPLATES: MissionTemplate[] = [
  {
    id: "weekly_work_5",
    category: "weekly",
    emoji: "📈",
    titleFa: "۵ روز پشت سر هم کار کن",
    subtitleFa: "ثبات شغلی",
    weight: 10,
    conditions: { jobRequired: true },
    objectiveFactory: () => [{ type: "complete_work_shift", count: 5 }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(200, ctx.player.level),
      stars: 2,
    }),
  },
  {
    id: "weekly_exercise_3",
    category: "weekly",
    emoji: "🏋️",
    titleFa: "۳ بار ورزش کن",
    subtitleFa: "بدنت رو قوی نگه دار",
    weight: 8,
    objectiveFactory: () => [{ type: "exercise_sessions", count: 3 }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(100, ctx.player.level),
      stars: 1,
    }),
  },
  {
    id: "weekly_study_4",
    category: "weekly",
    emoji: "📚",
    titleFa: "۴ جلسه مطالعه این هفته",
    subtitleFa: "مهارت‌سازی پیوسته",
    weight: 7,
    objectiveFactory: () => [{ type: "study_sessions", count: 4 }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(150, ctx.player.level),
      stars: 1,
    }),
  },
  {
    id: "weekly_earn_5m",
    category: "weekly",
    emoji: "💰",
    titleFa: "این هفته ۵M درآمد داشته باش",
    subtitleFa: "هدف مالی هفتگی",
    weight: 6,
    objectiveFactory: (ctx) => [{
      type: "earn_money",
      amount: scaleMoneyTarget(5_000_000, ctx.player.level),
    }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(180, ctx.player.level),
      stars: 2,
    }),
  },
  {
    id: "weekly_rest_3",
    category: "weekly",
    emoji: "🛋️",
    titleFa: "۳ بار استراحت کن",
    subtitleFa: "از خودت مراقبت کن",
    weight: 5,
    objectiveFactory: () => [{ type: "rest_sessions", count: 3 }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(80, ctx.player.level),
      happiness: 5,
    }),
  },
];

// ════════════ EVENT TEMPLATES ════════════

export const EVENT_TEMPLATES: MissionTemplate[] = [
  {
    id: "event_tech_boom",
    category: "event",
    emoji: "💻",
    titleFa: "فصل استخدام IT",
    subtitleFa: "تقاضای بالا برای مهارت فنی",
    weight: 10,
    conditions: { currentWaveType: "startup_wave" },
    objectiveFactory: () => [{ type: "study_sessions", count: 3 }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(150, ctx.player.level),
      stars: 2,
      money: scaleMoneyTarget(1_000_000, ctx.player.level),
    }),
    recommendedReasonFactory: () => "موج استارتاپ فعاله!",
  },
  {
    id: "event_recession_survive",
    category: "event",
    emoji: "📉",
    titleFa: "از رکود جان سالم ببر",
    subtitleFa: "مدیریت مالی در بحران",
    weight: 8,
    conditions: { currentWaveType: "mini_recession" },
    objectiveFactory: (ctx) => [{
      type: "save_money",
      amount: scaleMoneyTarget(2_000_000, ctx.player.level),
    }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(120, ctx.player.level),
      stars: 1,
    }),
    recommendedReasonFactory: () => "رکود اقتصادی · محتاط باش",
  },
  {
    id: "event_dollar_rise",
    category: "event",
    emoji: "💲",
    titleFa: "دلار بالا رفت",
    subtitleFa: "سرمایه‌گذاری هوشمند",
    weight: 6,
    conditions: { currentWaveType: "bubble" },
    objectiveFactory: (ctx) => [{
      type: "invest_money",
      amount: scaleMoneyTarget(1_000_000, ctx.player.level),
    }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(100, ctx.player.level),
      stars: 1,
    }),
    recommendedReasonFactory: () => "بازار داغه · فرصت سرمایه‌گذاری",
  },
];

// ════════════ RESCUE TEMPLATES ════════════

export const RESCUE_TEMPLATES: MissionTemplate[] = [
  {
    id: "rescue_low_money",
    category: "rescue",
    emoji: "🆘",
    titleFa: "یه کم پول جمع کن",
    subtitleFa: "وضعیت مالیت بحرانیه",
    weight: 10,
    conditions: { moneyBelow: 2_000_000 },
    objectiveFactory: (ctx) => [{
      type: "earn_money",
      amount: scaleMoneyTarget(1_000_000, ctx.player.level),
    }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(40, ctx.player.level),
      money: scaleMoneyTarget(500_000, ctx.player.level),
    }),
    recommendedReasonFactory: () => "پولت داره تموم میشه!",
  },
  {
    id: "rescue_high_stress",
    category: "rescue",
    emoji: "😮‍💨",
    titleFa: "امروز فقط استراحت کن",
    subtitleFa: "استرست خیلی بالاست",
    weight: 10,
    conditions: { minStress: 70 },
    objectiveFactory: () => [{ type: "rest_sessions", count: 1 }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(30, ctx.player.level),
      happiness: 10,
    }),
    recommendedReasonFactory: () => "استرست بالاست · استراحت کن",
  },
  {
    id: "rescue_job_rejections",
    category: "rescue",
    emoji: "📖",
    titleFa: "مهارتت رو ببر بالا",
    subtitleFa: "رد شدن بخشی از مسیره",
    weight: 8,
    objectiveFactory: () => [{ type: "study_sessions", count: 1 }],
    rewardFactory: (ctx) => ({
      xp: scaleXpReward(50, ctx.player.level),
    }),
    recommendedReasonFactory: () => "با مطالعه شانست بالاتر میره",
  },
];
