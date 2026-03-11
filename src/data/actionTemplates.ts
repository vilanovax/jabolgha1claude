import type { WavePhase } from "@/engine/types";
import { WORK_INCOME_BASE, QUICK_INVEST } from "./economyConfig";

export interface ActionEffect {
  key: string;       // player stat key: "energy", "happiness", "money", "xp", "stars", "health"
  value: number;     // positive = gain, negative = cost
  label: string;     // Persian display: "⚡ +۳۰ انرژی"
}

export interface ActionRisk {
  chance: number;    // 0-1 probability
  effect: string;    // what happens: "injury", "burnout", "loss"
  label: string;     // Persian: "آسیب‌دیدگی"
  penalty: { key: string; value: number }; // stat penalty when triggered
}

export interface SponsoredVariant {
  brandName: string;       // e.g. "ردبول", "کاله"
  brandEmoji: string;
  displayName: string;     // e.g. "انرژی‌زای ردبول"
  costs: {
    energy?: number;
    money?: number;
    time: number;
  };
  effects: ActionEffect[];
  risk?: ActionRisk;
}

export interface ActionOption {
  id: string;
  name: string;
  emoji: string;
  costs: {
    energy?: number;
    money?: number;
    time: number;     // minutes
  };
  effects: ActionEffect[];
  risk?: ActionRisk;
  sponsoredVariant?: SponsoredVariant;
}

export interface ActionCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  options: [ActionOption, ActionOption, ActionOption];
}

/** Wave-phase modifiers for action effects */
export const WAVE_ACTION_MODIFIERS: Record<WavePhase, {
  label: string;
  categoryModifiers: Record<string, { effectMult?: number; costMult?: number }>;
}> = {
  startup_wave: {
    label: "سود کار +۲۰٪",
    categoryModifiers: {
      work: { effectMult: 1.2 },
      invest: { effectMult: 1.1 },
    },
  },
  it_growth: {
    label: "رشد مهارت +۳۰٪",
    categoryModifiers: {
      study: { effectMult: 1.3 },
      work: { effectMult: 1.1 },
    },
  },
  saturation: {
    label: "بازار اشباع",
    categoryModifiers: {
      work: { effectMult: 0.8 },
      rest: { effectMult: 1.2 },
    },
  },
  mini_recession: {
    label: "تورم! هزینه‌ها بالا",
    categoryModifiers: {
      library: { costMult: 1.3 },
      work: { effectMult: 0.7 },
      invest: { effectMult: 0.6 },
    },
  },
  recovery: {
    label: "بهبود اقتصادی +۱۰٪",
    categoryModifiers: {
      work: { effectMult: 1.1 },
      study: { effectMult: 1.1 },
      invest: { effectMult: 1.1 },
    },
  },
};

export const ACTION_CATEGORIES: ActionCategory[] = [
  // ─── Exercise ────────────────────────
  {
    id: "exercise",
    name: "ورزش",
    emoji: "🏋️",
    description: "فعالیت بدنی برای سلامت و انرژی",
    options: [
      {
        id: "walk",
        name: "پیاده‌روی ساده",
        emoji: "🚶",
        costs: { energy: 10, time: 20 },
        effects: [
          { key: "happiness", value: 5, label: "😊 +۵ خوشحالی" },
          { key: "health", value: 5, label: "❤️ +۵ سلامت" },
        ],
        sponsoredVariant: {
          brandName: "نایکی",
          brandEmoji: "👟",
          displayName: "پیاده‌روی با نایکی",
          costs: { energy: 10, money: 2_000_000, time: 20 },
          effects: [
            { key: "happiness", value: 12, label: "😊 +۱۲ خوشحالی" },
            { key: "health", value: 10, label: "❤️ +۱۰ سلامت" },
            { key: "stars", value: 1, label: "⭐ +۱ ستاره" },
          ],
        },
      },
      {
        id: "gym",
        name: "باشگاه حرفه‌ای",
        emoji: "🏋️",
        costs: { energy: 30, money: 500_000, time: 60 },
        effects: [
          { key: "health", value: 15, label: "❤️ +۱۵ سلامت" },
          { key: "happiness", value: 5, label: "😊 +۵ خوشحالی" },
          { key: "stars", value: 1, label: "⭐ +۱ ستاره" },
        ],
        sponsoredVariant: {
          brandName: "تکنوجیم",
          brandEmoji: "🏋️",
          displayName: "باشگاه تکنوجیم",
          costs: { energy: 30, money: 3_000_000, time: 60 },
          effects: [
            { key: "health", value: 28, label: "❤️ +۲۸ سلامت" },
            { key: "happiness", value: 10, label: "😊 +۱۰ خوشحالی" },
            { key: "stars", value: 2, label: "⭐ +۲ ستاره" },
          ],
        },
      },
      {
        id: "heavy_training",
        name: "تمرین سنگین",
        emoji: "💪",
        costs: { energy: 50, money: 500_000, time: 90 },
        effects: [
          { key: "health", value: 25, label: "❤️ +۲۵ سلامت" },
          { key: "happiness", value: 8, label: "😊 +۸ خوشحالی" },
          { key: "stars", value: 2, label: "⭐ +۲ ستاره" },
        ],
        risk: {
          chance: 0.05,
          effect: "injury",
          label: "آسیب‌دیدگی! 🤕",
          penalty: { key: "energy", value: -30 },
        },
        sponsoredVariant: {
          brandName: "کراس‌فیت",
          brandEmoji: "💪",
          displayName: "تمرین کراس‌فیت",
          costs: { energy: 50, money: 4_000_000, time: 90 },
          effects: [
            { key: "health", value: 40, label: "❤️ +۴۰ سلامت" },
            { key: "happiness", value: 15, label: "😊 +۱۵ خوشحالی" },
            { key: "stars", value: 3, label: "⭐ +۳ ستاره" },
          ],
          risk: {
            chance: 0.03,
            effect: "injury",
            label: "آسیب‌دیدگی! 🤕",
            penalty: { key: "energy", value: -30 },
          },
        },
      },
    ],
  },

  // ─── Library (کتابخانه) ──────────────────
  {
    id: "library",
    name: "کتابخانه",
    emoji: "📖",
    description: "مطالعه کتاب‌های داستانی و مهارتی",
    options: [
      {
        id: "story_book",
        name: "کتاب داستان",
        emoji: "📕",
        costs: { energy: 8, money: 500_000, time: 30 },
        effects: [
          { key: "happiness", value: 12, label: "😊 +۱۲ خوشحالی" },
          { key: "xp", value: 3, label: "✨ +۳ تجربه" },
        ],
        sponsoredVariant: {
          brandName: "نشر چشمه",
          brandEmoji: "📕",
          displayName: "داستان نشر چشمه",
          costs: { energy: 8, money: 1_500_000, time: 30 },
          effects: [
            { key: "happiness", value: 20, label: "😊 +۲۰ خوشحالی" },
            { key: "xp", value: 6, label: "✨ +۶ تجربه" },
            { key: "stars", value: 1, label: "⭐ +۱ ستاره" },
          ],
        },
      },
      {
        id: "softskill_book",
        name: "کتاب مهارت نرم",
        emoji: "🧠",
        costs: { energy: 15, money: 1_500_000, time: 45 },
        effects: [
          { key: "xp", value: 10, label: "✨ +۱۰ تجربه" },
          { key: "happiness", value: 5, label: "😊 +۵ خوشحالی" },
        ],
        sponsoredVariant: {
          brandName: "آمازون کیندل",
          brandEmoji: "📱",
          displayName: "کتاب مهارتی کیندل",
          costs: { energy: 12, money: 3_500_000, time: 45 },
          effects: [
            { key: "xp", value: 20, label: "✨ +۲۰ تجربه" },
            { key: "happiness", value: 10, label: "😊 +۱۰ خوشحالی" },
            { key: "stars", value: 1, label: "⭐ +۱ ستاره" },
          ],
        },
      },
      {
        id: "psychology_book",
        name: "کتاب روانشناسی",
        emoji: "💡",
        costs: { energy: 20, money: 2_000_000, time: 60 },
        effects: [
          { key: "happiness", value: 15, label: "😊 +۱۵ خوشحالی" },
          { key: "xp", value: 8, label: "✨ +۸ تجربه" },
          { key: "health", value: 5, label: "❤️ +۵ سلامت" },
        ],
        risk: {
          chance: 0.05,
          effect: "overthink",
          label: "فکر بیش از حد! 🤯",
          penalty: { key: "energy", value: -10 },
        },
        sponsoredVariant: {
          brandName: "نشر نی",
          brandEmoji: "💡",
          displayName: "روانشناسی نشر نی",
          costs: { energy: 18, money: 4_000_000, time: 60 },
          effects: [
            { key: "happiness", value: 25, label: "😊 +۲۵ خوشحالی" },
            { key: "xp", value: 15, label: "✨ +۱۵ تجربه" },
            { key: "health", value: 10, label: "❤️ +۱۰ سلامت" },
            { key: "stars", value: 1, label: "⭐ +۱ ستاره" },
          ],
        },
      },
    ],
  },


  // ─── Study ───────────────────────────
  {
    id: "study",
    name: "مطالعه",
    emoji: "📚",
    description: "یادگیری و ارتقاء مهارت",
    options: [
      {
        id: "quick_review",
        name: "مرور سریع",
        emoji: "📖",
        costs: { energy: 10, time: 15 },
        effects: [
          { key: "xp", value: 5, label: "✨ +۵ تجربه" },
        ],
        sponsoredVariant: {
          brandName: "کیندل",
          brandEmoji: "📱",
          displayName: "مرور با کیندل",
          costs: { energy: 10, money: 1_000_000, time: 15 },
          effects: [
            { key: "xp", value: 12, label: "✨ +۱۲ تجربه" },
          ],
        },
      },
      {
        id: "study_session",
        name: "جلسه مطالعه",
        emoji: "📚",
        costs: { energy: 20, time: 45 },
        effects: [
          { key: "xp", value: 15, label: "✨ +۱۵ تجربه" },
          { key: "stars", value: 1, label: "⭐ +۱ ستاره" },
        ],
        sponsoredVariant: {
          brandName: "کورسرا",
          brandEmoji: "🎓",
          displayName: "دوره کورسرا",
          costs: { energy: 20, money: 3_000_000, time: 45 },
          effects: [
            { key: "xp", value: 30, label: "✨ +۳۰ تجربه" },
            { key: "stars", value: 2, label: "⭐ +۲ ستاره" },
          ],
        },
      },
      {
        id: "study_marathon",
        name: "ماراتن مطالعه",
        emoji: "🧠",
        costs: { energy: 40, time: 120 },
        effects: [
          { key: "xp", value: 30, label: "✨ +۳۰ تجربه" },
          { key: "stars", value: 2, label: "⭐ +۲ ستاره" },
        ],
        risk: {
          chance: 0.08,
          effect: "fatigue",
          label: "خستگی ذهنی! 🤯",
          penalty: { key: "happiness", value: -10 },
        },
        sponsoredVariant: {
          brandName: "یودمی",
          brandEmoji: "🧠",
          displayName: "بوت‌کمپ یودمی",
          costs: { energy: 40, money: 6_000_000, time: 120 },
          effects: [
            { key: "xp", value: 55, label: "✨ +۵۵ تجربه" },
            { key: "stars", value: 4, label: "⭐ +۴ ستاره" },
          ],
          risk: {
            chance: 0.05,
            effect: "fatigue",
            label: "خستگی ذهنی! 🤯",
            penalty: { key: "happiness", value: -10 },
          },
        },
      },
    ],
  },

  // ─── Work ────────────────────────────
  {
    id: "work",
    name: "کار",
    emoji: "💼",
    description: "کار و درآمد",
    options: [
      {
        id: "part_time",
        name: "شیفت نیمه‌وقت",
        emoji: "⏰",
        costs: { energy: 15, time: 240 },
        effects: [
          { key: "money", value: WORK_INCOME_BASE.part_time, label: "💰 +۱.۵M تومن" },
          { key: "xp", value: 3, label: "✨ +۳ تجربه" },
        ],
      },
      {
        id: "full_shift",
        name: "شیفت کامل",
        emoji: "💼",
        costs: { energy: 30, time: 480 },
        effects: [
          { key: "money", value: WORK_INCOME_BASE.full_shift, label: "💰 +۳M تومن" },
          { key: "xp", value: 5, label: "✨ +۵ تجربه" },
          { key: "stars", value: 1, label: "⭐ +۱ ستاره" },
        ],
      },
      {
        id: "overtime",
        name: "اضافه‌کاری",
        emoji: "🔥",
        costs: { energy: 50, time: 600 },
        effects: [
          { key: "money", value: WORK_INCOME_BASE.overtime, label: "💰 +۵M تومن" },
          { key: "xp", value: 8, label: "✨ +۸ تجربه" },
          { key: "stars", value: 2, label: "⭐ +۲ ستاره" },
        ],
        risk: {
          chance: 0.08,
          effect: "burnout",
          label: "فرسودگی شغلی! 😵",
          penalty: { key: "happiness", value: -15 },
        },
      },
    ],
  },

  // ─── Rest (استراحت) ─ merged sleep + leisure ──
  {
    id: "rest",
    name: "استراحت",
    emoji: "🛋️",
    description: "استراحت، خواب و تفریح",
    options: [
      {
        id: "nap",
        name: "چرت و چای",
        emoji: "☕",
        costs: { energy: 5, time: 30 },
        effects: [
          { key: "energy", value: 20, label: "⚡ +۲۰ انرژی" },
          { key: "happiness", value: 8, label: "😊 +۸ خوشحالی" },
        ],
        sponsoredVariant: {
          brandName: "چای احمد",
          brandEmoji: "☕",
          displayName: "چرت با چای احمد",
          costs: { energy: 5, money: 500_000, time: 30 },
          effects: [
            { key: "energy", value: 30, label: "⚡ +۳۰ انرژی" },
            { key: "happiness", value: 15, label: "😊 +۱۵ خوشحالی" },
          ],
        },
      },
      {
        id: "movie",
        name: "فیلم و استراحت",
        emoji: "🎬",
        costs: { energy: 10, time: 120 },
        effects: [
          { key: "energy", value: 25, label: "⚡ +۲۵ انرژی" },
          { key: "happiness", value: 15, label: "😊 +۱۵ خوشحالی" },
        ],
        sponsoredVariant: {
          brandName: "نتفلیکس",
          brandEmoji: "🎬",
          displayName: "فیلم نتفلیکس",
          costs: { energy: 8, money: 2_000_000, time: 120 },
          effects: [
            { key: "energy", value: 35, label: "⚡ +۳۵ انرژی" },
            { key: "happiness", value: 25, label: "😊 +۲۵ خوشحالی" },
            { key: "stars", value: 1, label: "⭐ +۱ ستاره" },
          ],
        },
      },
      {
        id: "full_sleep",
        name: "خواب کامل",
        emoji: "🛏️",
        costs: { energy: 15, time: 480 },
        effects: [
          { key: "energy", value: 55, label: "⚡ +۵۵ انرژی" },
          { key: "happiness", value: 12, label: "😊 +۱۲ خوشحالی" },
          { key: "health", value: 8, label: "❤️ +۸ سلامت" },
        ],
        sponsoredVariant: {
          brandName: "تمپور",
          brandEmoji: "🛏️",
          displayName: "خواب با تشک تمپور",
          costs: { energy: 10, money: 5_000_000, time: 480 },
          effects: [
            { key: "energy", value: 80, label: "⚡ +۸۰ انرژی" },
            { key: "happiness", value: 22, label: "😊 +۲۲ خوشحالی" },
            { key: "health", value: 15, label: "❤️ +۱۵ سلامت" },
            { key: "stars", value: 1, label: "⭐ +۱ ستاره" },
          ],
        },
      },
    ],
  },

  // ─── Invest ──────────────────────────
  {
    id: "invest",
    name: "سرمایه‌گذاری",
    emoji: "📈",
    description: "سرمایه‌گذاری و رشد مالی",
    options: [
      {
        id: "small_invest",
        name: "سرمایه‌گذاری کم",
        emoji: "🪙",
        costs: { money: 5_000_000, time: 15 },
        effects: [
          { key: "money", value: QUICK_INVEST.small.grossReturn, label: "💰 +۷M بازده" },
          { key: "xp", value: 2, label: "✨ +۲ تجربه" },
        ],
        risk: {
          chance: QUICK_INVEST.small.riskChance,
          effect: "loss",
          label: "ضرر کردی! 📉",
          penalty: { key: "money", value: QUICK_INVEST.small.riskPenalty },
        },
        sponsoredVariant: {
          brandName: "نوبیتکس",
          brandEmoji: "🪙",
          displayName: "سرمایه‌گذاری نوبیتکس",
          costs: { money: 10_000_000, time: 15 },
          effects: [
            { key: "money", value: 5_000_000, label: "💰 +۵M سود" },
            { key: "xp", value: 5, label: "✨ +۵ تجربه" },
          ],
          risk: {
            chance: 0.3,
            effect: "loss",
            label: "ضرر کردی! 📉",
            penalty: { key: "money", value: -5_000_000 },
          },
        },
      },
      {
        id: "medium_invest",
        name: "سرمایه‌گذاری متوسط",
        emoji: "💹",
        costs: { money: 15_000_000, time: 30 },
        effects: [
          { key: "money", value: QUICK_INVEST.medium.grossReturn, label: "💰 +۲۱M بازده" },
          { key: "xp", value: 5, label: "✨ +۵ تجربه" },
        ],
        risk: {
          chance: QUICK_INVEST.medium.riskChance,
          effect: "loss",
          label: "ضرر کردی! 📉",
          penalty: { key: "money", value: QUICK_INVEST.medium.riskPenalty },
        },
        sponsoredVariant: {
          brandName: "سهام‌یاب",
          brandEmoji: "💹",
          displayName: "پلتفرم سهام‌یاب",
          costs: { money: 25_000_000, time: 30 },
          effects: [
            { key: "money", value: 18_000_000, label: "💰 +۱۸M سود" },
            { key: "xp", value: 8, label: "✨ +۸ تجربه" },
          ],
          risk: {
            chance: 0.4,
            effect: "loss",
            label: "ضرر کردی! 📉",
            penalty: { key: "money", value: -15_000_000 },
          },
        },
      },
      {
        id: "big_invest",
        name: "سرمایه‌گذاری بزرگ",
        emoji: "🏦",
        costs: { money: 30_000_000, time: 60 },
        effects: [
          { key: "money", value: QUICK_INVEST.big.grossReturn, label: "💰 +۴۵M بازده" },
          { key: "xp", value: 10, label: "✨ +۱۰ تجربه" },
          { key: "stars", value: 2, label: "⭐ +۲ ستاره" },
        ],
        risk: {
          chance: QUICK_INVEST.big.riskChance,
          effect: "loss",
          label: "ضرر سنگین! 📉📉",
          penalty: { key: "money", value: QUICK_INVEST.big.riskPenalty },
        },
        sponsoredVariant: {
          brandName: "گلدمن",
          brandEmoji: "🏦",
          displayName: "صندوق گلدمن",
          costs: { money: 50_000_000, time: 60 },
          effects: [
            { key: "money", value: 40_000_000, label: "💰 +۴۰M سود" },
            { key: "xp", value: 15, label: "✨ +۱۵ تجربه" },
            { key: "stars", value: 3, label: "⭐ +۳ ستاره" },
          ],
          risk: {
            chance: 0.5,
            effect: "loss",
            label: "ضرر سنگین! 📉📉",
            penalty: { key: "money", value: -35_000_000 },
          },
        },
      },
    ],
  },
];
