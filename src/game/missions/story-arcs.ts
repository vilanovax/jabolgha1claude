// ─── Story Arc Definitions ───
// Each arc is a chain of episodic story missions.

import type { StoryArc } from "./types";

export const STORY_ARCS: StoryArc[] = [
  {
    id: "family_saving",
    nameFa: "پس‌انداز خانوادگی",
    theme: "family",
    episodes: [
      {
        titleFa: "یه چیزی برای آینده بذار کنار",
        subtitleFa: "بابا گفت پس‌انداز کن",
        descriptionFa: "پدرت بهت یاد داد که پس‌انداز مهمه. ۱۰ میلیون جمع کن.",
        emoji: "💰",
        character: "👴",
        characterName: "بابا",
        dialogue: "پسرم، یاد بگیر پس‌انداز کنی. آینده‌ات بهش بستگی داره.",
        objectives: [{ type: "save_money", amount: 10_000_000 }],
        rewards: { xp: 120, stars: 1, money: 2_000_000 },
      },
      {
        titleFa: "خرج‌هات رو کنترل کن",
        subtitleFa: "بدون وام دوام بیار",
        descriptionFa: "ثابت کن می‌تونی بدون قرض زندگی کنی.",
        emoji: "🧾",
        character: "👴",
        characterName: "بابا",
        dialogue: "قرض نگیر! با آبرو زندگی کن.",
        objectives: [
          { type: "survive_without_loan", days: 3 },
          { type: "save_money", amount: 5_000_000 },
        ],
        rewards: { xp: 150, stars: 1 },
      },
      {
        titleFa: "پول باید کار کنه",
        subtitleFa: "اولین سرمایه‌گذاری",
        descriptionFa: "وقتشه پولت رو به کار بندازی.",
        emoji: "📈",
        character: "👴",
        characterName: "بابا",
        dialogue: "پول بذار توی یه جای امن. بذار کار کنه برات.",
        objectives: [{ type: "invest_money", amount: 2_000_000 }],
        rewards: { xp: 200, stars: 2, unlockActions: ["medium_invest"] },
      },
      {
        titleFa: "اولین ۵۰ میلیون",
        subtitleFa: "دارایی واقعی",
        descriptionFa: "حالا وقتشه یه سرمایه واقعی جمع کنی.",
        emoji: "💎",
        character: "👴",
        characterName: "بابا",
        dialogue: "آفرین! حالا هدف بعدی: ۵۰ میلیون.",
        objectives: [{ type: "save_money", amount: 50_000_000 }],
        rewards: { xp: 400, stars: 5, money: 5_000_000, badges: ["saver"] },
      },
      {
        titleFa: "استقلال مالی",
        subtitleFa: "خودت شدی",
        descriptionFa: "حالا می‌تونی روی پای خودت وایسی.",
        emoji: "🏆",
        character: "👴",
        characterName: "بابا",
        dialogue: "دیگه نگرانت نیستم. موفق شدی!",
        objectives: [
          { type: "save_money", amount: 100_000_000 },
          { type: "invest_money", amount: 10_000_000 },
        ],
        rewards: { xp: 800, stars: 10, money: 10_000_000, titles: ["مستقل مالی"] },
      },
    ],
  },
  {
    id: "career_growth",
    nameFa: "مسیر حرفه‌ای",
    theme: "career",
    unlockConditions: { minLevel: 2 },
    episodes: [
      {
        titleFa: "اولین شغل زندگیت",
        subtitleFa: "وقتشه کار کنی",
        descriptionFa: "یه کار پیدا کن و شروع کن.",
        emoji: "💼",
        character: "🧑‍💼",
        characterName: "مشاور",
        dialogue: "هر شغلی قدم اوله. مهم اینه شروع کنی.",
        objectives: [{ type: "jobs_accepted", count: 1 }],
        rewards: { xp: 100, stars: 1 },
      },
      {
        titleFa: "ثبات شغلی",
        subtitleFa: "نشون بده قابل اعتمادی",
        descriptionFa: "۵ شیفت کاری را انجام بده.",
        emoji: "📊",
        character: "🧑‍💼",
        characterName: "مشاور",
        dialogue: "استقامت کن. کارفرما باید بهت اعتماد کنه.",
        objectives: [{ type: "complete_work_shift", count: 5 }],
        rewards: { xp: 200, stars: 2, money: 1_000_000 },
      },
      {
        titleFa: "مهارت‌سازی",
        subtitleFa: "یه مهارت جدید بساز",
        descriptionFa: "با مطالعه و دوره، مهارتت رو بالا ببر.",
        emoji: "📚",
        character: "🧑‍💼",
        characterName: "مشاور",
        dialogue: "بدون مهارت، رشد نمی‌کنی. وقت یادگیریه.",
        objectives: [{ type: "study_sessions", count: 5 }],
        rewards: { xp: 250, stars: 2 },
      },
    ],
  },
];

export function getStoryArc(arcId: string): StoryArc | undefined {
  return STORY_ARCS.find((a) => a.id === arcId);
}

export function getNextAvailableArc(
  completedArcIds: string[],
  playerLevel: number,
  playerMoney: number
): StoryArc | undefined {
  return STORY_ARCS.find((arc) => {
    if (completedArcIds.includes(arc.id)) return false;
    const cond = arc.unlockConditions;
    if (cond?.minLevel && playerLevel < cond.minLevel) return false;
    if (cond?.minMoney && playerMoney < cond.minMoney) return false;
    if (cond?.requiredCompletedArcIds) {
      if (!cond.requiredCompletedArcIds.every((id) => completedArcIds.includes(id))) return false;
    }
    return true;
  });
}
