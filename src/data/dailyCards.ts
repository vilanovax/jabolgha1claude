export type CardType = "positive" | "negative" | "neutral";

export interface CardEffect {
  target: "checking" | "energy" | "happiness" | "xp" | "stars";
  value: number;
  label: string;
}

export interface DailyCard {
  id: string;
  name: string;
  emoji: string;
  type: CardType;
  description: string;
  weight: number;            // relative probability (higher = more likely)
  effects: CardEffect[];
  checkingOnly?: boolean;    // only touches checking, never savings
  savingsShield?: boolean;   // savings reduces monetary loss by 70%
}

export const DAILY_CARDS: DailyCard[] = [
  // ─── Positive Cards ────────────────────
  {
    id: "bonus_salary",
    name: "پاداش حقوقی",
    emoji: "🎉",
    type: "positive",
    description: "شرکت بابت عملکرد خوبت بهت پاداش داد!",
    weight: 8,
    effects: [
      { target: "checking", value: 5_000_000, label: "💰 +۵M تومن" },
    ],
  },
  {
    id: "family_gift",
    name: "هدیه خانواده",
    emoji: "🎁",
    type: "positive",
    description: "خانواده‌ات برات یه هدیه فرستادن!",
    weight: 7,
    effects: [
      { target: "checking", value: 3_000_000, label: "💰 +۳M تومن" },
      { target: "happiness", value: 10, label: "😊 +۱۰ خوشحالی" },
    ],
  },
  {
    id: "lottery_win",
    name: "بلیت بخت‌آزمایی",
    emoji: "🍀",
    type: "positive",
    description: "بلیت بخت‌آزمایی‌ات برنده شد!",
    weight: 2,
    effects: [
      { target: "checking", value: 15_000_000, label: "💰 +۱۵M تومن" },
      { target: "happiness", value: 20, label: "😊 +۲۰ خوشحالی" },
    ],
  },
  {
    id: "tax_refund",
    name: "بازگشت مالیات",
    emoji: "🏛️",
    type: "positive",
    description: "مالیات اضافی پرداختی بهت برگشت!",
    weight: 6,
    effects: [
      { target: "checking", value: 2_000_000, label: "💰 +۲M تومن" },
    ],
  },
  {
    id: "found_money",
    name: "پول پیدا کردی!",
    emoji: "💵",
    type: "positive",
    description: "یه کیف پول پیدا کردی و صاحبش بهت جایزه داد!",
    weight: 5,
    effects: [
      { target: "checking", value: 1_000_000, label: "💰 +۱M تومن" },
      { target: "happiness", value: 5, label: "😊 +۵ خوشحالی" },
    ],
  },

  // ─── Negative Cards ────────────────────
  {
    id: "robbery",
    name: "دزدی!",
    emoji: "🦹",
    type: "negative",
    description: "یه دزد سعی کرد ازت پول بدزده!",
    weight: 5,
    effects: [
      { target: "checking", value: -8_000_000, label: "💰 -۸M تومن" },
      { target: "happiness", value: -15, label: "😊 -۱۵ خوشحالی" },
    ],
    checkingOnly: true,
    savingsShield: true,
  },
  {
    id: "phone_broken",
    name: "گوشیت خراب شد",
    emoji: "📱",
    type: "negative",
    description: "گوشیت افتاد و صفحه‌اش شکست!",
    weight: 6,
    effects: [
      { target: "checking", value: -3_000_000, label: "💰 -۳M تومن" },
      { target: "happiness", value: -10, label: "😊 -۱۰ خوشحالی" },
    ],
  },
  {
    id: "tax_penalty",
    name: "جریمه مالیاتی",
    emoji: "📋",
    type: "negative",
    description: "بابت تاخیر مالیاتی جریمه شدی!",
    weight: 5,
    effects: [
      { target: "checking", value: -5_000_000, label: "💰 -۵M تومن" },
    ],
  },
  {
    id: "car_accident",
    name: "تصادف جزئی",
    emoji: "🚗",
    type: "negative",
    description: "تصادف کوچیکی کردی و باید خسارت بدی!",
    weight: 4,
    effects: [
      { target: "checking", value: -4_000_000, label: "💰 -۴M تومن" },
      { target: "energy", value: -15, label: "⚡ -۱۵ انرژی" },
    ],
  },
  {
    id: "pickpocket",
    name: "جیب‌بری!",
    emoji: "🤏",
    type: "negative",
    description: "تو مترو جیبت رو زدن!",
    weight: 6,
    effects: [
      { target: "checking", value: -2_000_000, label: "💰 -۲M تومن" },
    ],
    checkingOnly: true,
    savingsShield: true,
  },

  // ─── Neutral Cards ────────────────────
  {
    id: "mentor_advice",
    name: "نصیحت استاد",
    emoji: "🧓",
    type: "neutral",
    description: "استادت یه نصیحت خوب بهت کرد!",
    weight: 6,
    effects: [
      { target: "xp", value: 15, label: "✨ +۱۵ تجربه" },
    ],
  },
  {
    id: "motivation_burst",
    name: "انگیزه ناگهانی",
    emoji: "🔥",
    type: "neutral",
    description: "یه ویدیوی انگیزشی دیدی و پر انرژی شدی!",
    weight: 7,
    effects: [
      { target: "energy", value: 20, label: "⚡ +۲۰ انرژی" },
      { target: "happiness", value: 10, label: "😊 +۱۰ خوشحالی" },
    ],
  },
  {
    id: "boring_day",
    name: "روز خسته‌کننده",
    emoji: "😐",
    type: "neutral",
    description: "امروز هیچ اتفاق خاصی نیفتاد...",
    weight: 8,
    effects: [
      { target: "happiness", value: -5, label: "😊 -۵ خوشحالی" },
    ],
  },
  {
    id: "social_invite",
    name: "دعوت دوستانه",
    emoji: "🎊",
    type: "neutral",
    description: "دوستت دعوتت کرد بیرون!",
    weight: 5,
    effects: [
      { target: "happiness", value: 15, label: "😊 +۱۵ خوشحالی" },
      { target: "checking", value: -1_000_000, label: "💰 -۱M تومن" },
    ],
  },
];

export function drawRandomCard(): DailyCard {
  const totalWeight = DAILY_CARDS.reduce((sum, c) => sum + c.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const card of DAILY_CARDS) {
    roll -= card.weight;
    if (roll <= 0) return card;
  }
  return DAILY_CARDS[DAILY_CARDS.length - 1];
}
