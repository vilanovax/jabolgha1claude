import type { WavePhase } from "@/engine/types";

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
      eat: { costMult: 1.3 },
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
      },
    ],
  },

  // ─── Eat ─────────────────────────────
  {
    id: "eat",
    name: "صبحانه",
    emoji: "🍳",
    description: "تغذیه برای انرژی و سلامت",
    options: [
      {
        id: "simple_breakfast",
        name: "نون و پنیر",
        emoji: "🧀",
        costs: { money: 500_000, time: 10 },
        effects: [
          { key: "energy", value: 15, label: "⚡ +۱۵ انرژی" },
          { key: "hunger", value: 20, label: "🍔 +۲۰ سیری" },
        ],
      },
      {
        id: "full_breakfast",
        name: "صبحانه کامل",
        emoji: "🍽️",
        costs: { money: 2_000_000, time: 20 },
        effects: [
          { key: "energy", value: 30, label: "⚡ +۳۰ انرژی" },
          { key: "hunger", value: 40, label: "🍔 +۴۰ سیری" },
          { key: "happiness", value: 5, label: "😊 +۵ خوشحالی" },
        ],
      },
      {
        id: "brand_breakfast",
        name: "صبحانه برند خاص",
        emoji: "✨",
        costs: { money: 3_000_000, time: 25 },
        effects: [
          { key: "energy", value: 40, label: "⚡ +۴۰ انرژی" },
          { key: "hunger", value: 50, label: "🍔 +۵۰ سیری" },
          { key: "happiness", value: 8, label: "😊 +۸ خوشحالی" },
          { key: "stars", value: 1, label: "⭐ +۱ ستاره" },
        ],
      },
    ],
  },

  // ─── Sleep ───────────────────────────
  {
    id: "sleep",
    name: "خواب",
    emoji: "😴",
    description: "استراحت برای بازیابی انرژی",
    options: [
      {
        id: "nap",
        name: "چرت ۳۰ دقیقه",
        emoji: "💤",
        costs: { time: 30 },
        effects: [
          { key: "energy", value: 20, label: "⚡ +۲۰ انرژی" },
          { key: "happiness", value: 3, label: "😊 +۳ خوشحالی" },
        ],
      },
      {
        id: "full_sleep",
        name: "خواب کامل",
        emoji: "🛏️",
        costs: { time: 480 },
        effects: [
          { key: "energy", value: 50, label: "⚡ +۵۰ انرژی" },
          { key: "happiness", value: 10, label: "😊 +۱۰ خوشحالی" },
          { key: "health", value: 5, label: "❤️ +۵ سلامت" },
        ],
      },
      {
        id: "golden_sleep",
        name: "خواب طلایی",
        emoji: "👑",
        costs: { time: 600 },
        effects: [
          { key: "energy", value: 60, label: "⚡ +۶۰ انرژی" },
          { key: "happiness", value: 15, label: "😊 +۱۵ خوشحالی" },
          { key: "health", value: 10, label: "❤️ +۱۰ سلامت" },
        ],
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
          { key: "money", value: 20_000_000, label: "💰 +۲۰M تومن" },
          { key: "xp", value: 3, label: "✨ +۳ تجربه" },
        ],
      },
      {
        id: "full_shift",
        name: "شیفت کامل",
        emoji: "💼",
        costs: { energy: 30, time: 480 },
        effects: [
          { key: "money", value: 45_000_000, label: "💰 +۴۵M تومن" },
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
          { key: "money", value: 70_000_000, label: "💰 +۷۰M تومن" },
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

  // ─── Rest ────────────────────────────
  {
    id: "rest",
    name: "استراحت",
    emoji: "☕",
    description: "آرامش و تفریح",
    options: [
      {
        id: "tea",
        name: "چای و آرامش",
        emoji: "☕",
        costs: { time: 15 },
        effects: [
          { key: "energy", value: 10, label: "⚡ +۱۰ انرژی" },
          { key: "happiness", value: 5, label: "😊 +۵ خوشحالی" },
        ],
      },
      {
        id: "movie",
        name: "تماشای فیلم",
        emoji: "🎬",
        costs: { time: 120 },
        effects: [
          { key: "energy", value: 15, label: "⚡ +۱۵ انرژی" },
          { key: "happiness", value: 10, label: "😊 +۱۰ خوشحالی" },
        ],
      },
      {
        id: "hangout",
        name: "خروج با دوستان",
        emoji: "🎉",
        costs: { money: 5_000_000, energy: 10, time: 180 },
        effects: [
          { key: "happiness", value: 20, label: "😊 +۲۰ خوشحالی" },
          { key: "stars", value: 1, label: "⭐ +۱ ستاره" },
        ],
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
          { key: "money", value: 2_000_000, label: "💰 +۲M سود" },
          { key: "xp", value: 2, label: "✨ +۲ تجربه" },
        ],
        risk: {
          chance: 0.4,
          effect: "loss",
          label: "ضرر کردی! 📉",
          penalty: { key: "money", value: -3_000_000 },
        },
      },
      {
        id: "medium_invest",
        name: "سرمایه‌گذاری متوسط",
        emoji: "💹",
        costs: { money: 15_000_000, time: 30 },
        effects: [
          { key: "money", value: 8_000_000, label: "💰 +۸M سود" },
          { key: "xp", value: 5, label: "✨ +۵ تجربه" },
        ],
        risk: {
          chance: 0.5,
          effect: "loss",
          label: "ضرر کردی! 📉",
          penalty: { key: "money", value: -10_000_000 },
        },
      },
      {
        id: "big_invest",
        name: "سرمایه‌گذاری بزرگ",
        emoji: "🏦",
        costs: { money: 30_000_000, time: 60 },
        effects: [
          { key: "money", value: 20_000_000, label: "💰 +۲۰M سود" },
          { key: "xp", value: 10, label: "✨ +۱۰ تجربه" },
          { key: "stars", value: 2, label: "⭐ +۲ ستاره" },
        ],
        risk: {
          chance: 0.6,
          effect: "loss",
          label: "ضرر سنگین! 📉📉",
          penalty: { key: "money", value: -25_000_000 },
        },
      },
    ],
  },
];
