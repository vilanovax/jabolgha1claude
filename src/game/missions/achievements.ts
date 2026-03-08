// ─── Achievement Definitions ───
// Achievements are passive, always-tracked missions.
// They react to gameplay events but never expire.

import type { Mission, GameplayEvent } from "./types";

export interface AchievementDef {
  id: string;
  titleFa: string;
  emoji: string;
  descriptionFa: string;
  badge: string;
  badgeEmoji: string;
  // Checked against cumulative player state, not individual events
  checkProgress: (state: AchievementCheckState) => number;
  target: number;
  rewards: { xp: number; stars: number; money?: number };
}

export interface AchievementCheckState {
  totalMoneyEarned: number;
  totalJobsAccepted: number;
  totalWorkShifts: number;
  totalStudySessions: number;
  totalExerciseSessions: number;
  totalInvested: number;
  totalCoursesCompleted: number;
  currentSavings: number;
  currentLevel: number;
  daysPlayed: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_10m",
    titleFa: "اولین ۱۰ میلیون",
    emoji: "💰",
    descriptionFa: "۱۰ میلیون پس‌انداز کن",
    badge: "پس‌اندازکار",
    badgeEmoji: "💎",
    target: 10_000_000,
    checkProgress: (s) => s.currentSavings,
    rewards: { xp: 300, stars: 5 },
  },
  {
    id: "first_50m",
    titleFa: "اولین ۵۰ میلیون",
    emoji: "💎",
    descriptionFa: "۵۰ میلیون جمع کن",
    badge: "سرمایه‌گذار جوان",
    badgeEmoji: "💎",
    target: 50_000_000,
    checkProgress: (s) => s.currentSavings,
    rewards: { xp: 500, stars: 10 },
  },
  {
    id: "first_job",
    titleFa: "اولین شغل",
    emoji: "💼",
    descriptionFa: "اولین پیشنهاد کاری را بپذیر",
    badge: "کارمند",
    badgeEmoji: "🏅",
    target: 1,
    checkProgress: (s) => s.totalJobsAccepted,
    rewards: { xp: 100, stars: 1 },
  },
  {
    id: "trusted_employee",
    titleFa: "کارمند قابل‌اعتماد",
    emoji: "📊",
    descriptionFa: "۹۰ شیفت کاری انجام بده",
    badge: "حرفه‌ای",
    badgeEmoji: "🏅",
    target: 90,
    checkProgress: (s) => s.totalWorkShifts,
    rewards: { xp: 400, stars: 8, money: 5_000_000 },
  },
  {
    id: "professional_cert",
    titleFa: "مدرک حرفه‌ای",
    emoji: "🎓",
    descriptionFa: "۵ دوره را تکمیل کن",
    badge: "استاد",
    badgeEmoji: "🎓",
    target: 5,
    checkProgress: (s) => s.totalCoursesCompleted,
    rewards: { xp: 300, stars: 5 },
  },
  {
    id: "fitness_lover",
    titleFa: "ورزشکار",
    emoji: "💪",
    descriptionFa: "۳۰ جلسه ورزش انجام بده",
    badge: "ورزشکار",
    badgeEmoji: "💪",
    target: 30,
    checkProgress: (s) => s.totalExerciseSessions,
    rewards: { xp: 200, stars: 3 },
  },
  {
    id: "first_investment",
    titleFa: "اولین سرمایه‌گذاری",
    emoji: "📈",
    descriptionFa: "اولین سرمایه‌گذاری را انجام بده",
    badge: "سرمایه‌گذار",
    badgeEmoji: "📈",
    target: 1_000_000,
    checkProgress: (s) => s.totalInvested,
    rewards: { xp: 150, stars: 2 },
  },
  {
    id: "week_survivor",
    titleFa: "یک هفته دوام آوردی",
    emoji: "📅",
    descriptionFa: "۷ روز بازی کن",
    badge: "مقاوم",
    badgeEmoji: "🛡️",
    target: 7,
    checkProgress: (s) => s.daysPlayed,
    rewards: { xp: 100, stars: 2 },
  },
];

// Create Mission objects from achievement definitions
export function createAchievementMissions(
  checkState: AchievementCheckState,
  claimedIds: string[]
): Mission[] {
  return ACHIEVEMENTS.map((ach) => {
    const currentProgress = ach.checkProgress(checkState);
    const isClaimed = claimedIds.includes(ach.id);
    const isCompleted = currentProgress >= ach.target;

    return {
      id: ach.id,
      category: "achievement" as const,
      status: isClaimed
        ? "claimed" as const
        : isCompleted
          ? "completed" as const
          : "active" as const,
      titleFa: ach.titleFa,
      emoji: ach.emoji,
      descriptionFa: ach.descriptionFa,
      objectives: [{ type: "earn_money" as const, amount: ach.target }], // placeholder
      progress: { obj_0: currentProgress },
      rewards: ach.rewards,
      createdAtDay: 1,
    };
  });
}

// Update achievements based on new state
export function updateAchievements(
  checkState: AchievementCheckState,
  claimedIds: string[]
): Mission[] {
  return createAchievementMissions(checkState, claimedIds);
}
