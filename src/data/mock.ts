export const player = {
  name: "علی رضایی",
  level: 4,
  city: "تهران",
  avatar: "👨‍💻",
  energy: 68,
  happiness: 72,
  security: 58,
  money: 12_500_000,
  savings: 50_000_000,
  xp: 1240,
  xpNext: 2000,
  scenario: "فارغ‌التحصیل",
  dayInGame: 47,
};

export const housing = {
  type: "آپارتمان معمولی",
  isOwned: false,
  monthlyRent: 12_000_000,
  nextRentDue: 8,
  happinessBonus: 20,
  energyBonus: 60,
};

export const job = {
  title: "توسعه‌دهنده فرانت‌اند",
  company: "استارتاپ دیجی‌کد",
  type: "استارتاپ" as const,
  salary: 45_000_000,
  industryXp: "IT",
  daysWorked: 32,
};

export const bank = {
  name: "بانک ملت",
  checking: 12_500_000,
  savings: 50_000_000,
  savingsRate: 2.5,
  loans: [
    { type: "وام شخصی", amount: 30_000_000, monthlyPayment: 1_200_000, remaining: 22 },
  ],
};

export const fridgeItems = [
  { id: 1, name: "تخم‌مرغ محلی", emoji: "🍳", energy: 50, happiness: 5, study: 10, price: 6_000, quantity: 4, sponsor: false },
  { id: 2, name: "شیر رامک", emoji: "🥛", energy: 35, happiness: 5, study: 0, price: 8_000, quantity: 2, sponsor: true, brand: "رامک" },
  { id: 3, name: "پنیر کاله", emoji: "🧀", energy: 45, happiness: 8, study: 0, price: 15_000, quantity: 1, sponsor: true, brand: "کاله" },
  { id: 4, name: "سالاد آماده", emoji: "🥗", energy: 30, happiness: 6, study: 5, price: 12_000, quantity: 2, sponsor: false },
];

export const supermarketItems = [
  { id: 10, name: "نان سنگک", emoji: "🍞", energy: 25, happiness: 3, study: 0, price: 4_000, sponsor: false },
  { id: 11, name: "ماست کاله", emoji: "🫙", energy: 20, happiness: 4, study: 0, price: 7_000, sponsor: true, brand: "کاله" },
  { id: 12, name: "مرغ", emoji: "🍗", energy: 65, happiness: 10, study: 0, price: 25_000, sponsor: false },
  { id: 13, name: "آب میوه پاک", emoji: "🧃", energy: 20, happiness: 7, study: 5, price: 9_000, sponsor: true, brand: "پاک" },
];

export const skills = {
  hard: [
    { name: "برنامه‌نویسی", emoji: "💻", level: 8, xp: 820, maxXp: 1000 },
    { name: "بازاریابی", emoji: "📣", level: 3, xp: 280, maxXp: 500 },
    { name: "حسابداری", emoji: "📊", level: 1, xp: 80, maxXp: 200 },
    { name: "طراحی", emoji: "🎨", level: 2, xp: 150, maxXp: 200 },
  ],
  soft: [
    { name: "مذاکره", emoji: "🤝", level: 4, xp: 380, maxXp: 1000 },
    { name: "مدیریت زمان", emoji: "⏰", level: 6, xp: 620, maxXp: 1000 },
    { name: "ارتباطات", emoji: "💬", level: 3, xp: 310, maxXp: 500 },
    { name: "رهبری", emoji: "🎯", level: 1, xp: 40, maxXp: 200 },
  ],
};

export const activeCourse = {
  name: "برنامه‌نویسی پایتون",
  emoji: "🐍",
  totalDays: 7,
  currentDay: 4,
  sessionsPerDay: 3,
  completedToday: 1,
  nextSessionIn: 105, // minutes
  xpReward: 50,
};

export const jobListings = [
  {
    id: 1,
    title: "توسعه‌دهنده پایتون",
    company: "استارتاپ نوآوران",
    type: "استارتاپ" as const,
    salaryMin: 45_000_000,
    salaryMax: 60_000_000,
    isRemote: true,
    requirements: [{ skill: "برنامه‌نویسی", level: 6 }],
    suitable: true,
    postedAgo: 2,
  },
  {
    id: 2,
    title: "مدرس آنلاین پایتون",
    company: "آموزشگاه فناوری",
    type: "شرکت" as const,
    salaryMin: 30_000_000,
    salaryMax: 30_000_000,
    commission: true,
    isRemote: true,
    requirements: [
      { skill: "برنامه‌نویسی", level: 5 },
      { skill: "ارتباطات", level: 4 },
    ],
    suitable: false,
    missing: "ارتباطات Lv.4",
    postedAgo: 1,
  },
  {
    id: 3,
    title: "فرانت‌اند React",
    company: "شرکت پیشرو",
    type: "شرکت" as const,
    salaryMin: 55_000_000,
    salaryMax: 70_000_000,
    isRemote: false,
    requirements: [{ skill: "برنامه‌نویسی", level: 7 }],
    suitable: true,
    postedAgo: 3,
  },
  {
    id: 4,
    title: "کارشناس IT",
    company: "سازمان دولتی",
    type: "دولتی" as const,
    salaryMin: 18_000_000,
    salaryMax: 22_000_000,
    isRemote: false,
    requirements: [{ skill: "برنامه‌نویسی", level: 3 }],
    suitable: true,
    postedAgo: 0,
  },
];

export const cityEvents = [
  { id: 1, type: "economic", emoji: "💵", title: "دلار ۵٪ بالا رفت", desc: "کالاهای وارداتی گرون‌تر شد", time: "۲ ساعت پیش" },
  { id: 2, type: "opportunity", emoji: "🔥", title: "فصل کنکور شروع شد", desc: "تقاضا برای تدریس ۳ برابر شد", time: "امروز" },
];

export const cityPlayers = [
  { rank: 1, name: "سارا محمدی", netWorth: 850_000_000, title: "کارآفرین", badge: "👑" },
  { rank: 2, name: "رضا احمدی", netWorth: 620_000_000, title: "مدیر شرکت", badge: "🏆" },
  { rank: 3, name: "نیلوفر کریمی", netWorth: 410_000_000, title: "فریلنسر ارشد", badge: "⭐" },
  { rank: 47, name: "علی رضایی", netWorth: 62_500_000, title: "توسعه‌دهنده", badge: "💼", isMe: true },
];

export const badges = [
  { id: 1, emoji: "🏠", name: "اولین اجاره", desc: "اولین خونه‌ات رو اجاره کردی", earned: true },
  { id: 2, emoji: "💼", name: "اولین شغل", desc: "اولین قراردادت رو امضا کردی", earned: true },
  { id: 3, emoji: "📈", name: "۱۰ میلیونی", desc: "۱۰ میلیون تومن جمع کردی", earned: true },
  { id: 4, emoji: "🎓", name: "دانشجو", desc: "اولین دوره رو تموم کردی", earned: true },
  { id: 5, emoji: "❌", name: "ورشکسته", desc: "اولین شکست رو تجربه کردی", earned: false },
  { id: 6, emoji: "🏢", name: "کارفرما", desc: "اولین کارمندت رو استخدام کن", earned: false },
];

export const dailySummary = {
  date: "دوشنبه، ۱۵ فروردین ۱۴۰۴",
  income: 4_500_000,
  expenses: 1_200_000,
  netWorth: 62_500_000,
  highlights: [
    { emoji: "✅", text: "session سوم پایتون تموم شد" },
    { emoji: "💰", text: "۴.۵M درآمد کاری" },
    { emoji: "📉", text: "۱.۲M اجاره پرداخت شد" },
  ],
  cityNews: [
    { emoji: "💵", text: "دلار ۵٪ بالا رفت" },
    { emoji: "📈", text: "فصل کنکور شروع شد - فرصت تدریس" },
  ],
};

// Helpers
export function formatMoney(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toLocaleString("fa-IR");
}

export function getEnergyColor(val: number): string {
  if (val >= 70) return "#22c55e";
  if (val >= 40) return "#f97316";
  return "#ef4444";
}

export function getJobTypeColor(type: string): { bg: string; text: string } {
  switch (type) {
    case "استارتاپ": return { bg: "#fef3c7", text: "#92400e" };
    case "دولتی": return { bg: "#dbeafe", text: "#1e40af" };
    case "شرکت": return { bg: "#f0fdf4", text: "#166534" };
    default: return { bg: "#f1f5f9", text: "#475569" };
  }
}
