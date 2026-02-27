export const player = {
  name: "علی رضایی",
  level: 4,
  city: "تهران",
  avatar: "👨‍💻",
  energy: 68,
  hunger: 55,
  happiness: 72,
  security: 58,
  money: 12_500_000,
  savings: 50_000_000,
  xp: 1240,
  xpNext: 2000,
  stars: 18,
  scenario: "فارغ‌التحصیل",
  dayInGame: 47,
};

export type MissionStatus = "pending" | "in_progress" | "done" | "claimable";
export type JobDifficulty = "آسان" | "متوسط" | "سخت";
export type GrowthPotential = "پایین" | "متوسط" | "بالا";

export interface JobListing {
  id: number;
  title: string;
  company: string;
  type: "استارتاپ" | "شرکت" | "دولتی";
  salaryMin: number;
  salaryMax: number;
  commission?: boolean;
  isRemote: boolean;
  requirements: { skill: string; level: number }[];
  suitable: boolean;
  missing?: string;
  postedAgo: number;
  acceptanceChance: number;
  difficulty: JobDifficulty;
  growthPotential: GrowthPotential;
  energyCost: number;
  isPremium: boolean;
  isHot: boolean;
}

export const professionalStatus = {
  resumeSkill: "برنامه‌نویسی",
  resumeLevel: 6,
  reputation: 42,
  baseAcceptanceChance: 62,
  experienceYears: 2,
};

export const goldenMembership = {
  active: false,
  remainingDays: 0,
  price: 5_000_000,
  durationDays: 30,
  benefits: [
    "شانس پذیرش +۱۰٪",
    "دسترسی به آگهی‌های ویژه",
    "نشان طلایی روی رزومه",
    "دعوت مستقیم شرکت‌ها",
  ],
};

export const storyArc = {
  id: "sa1",
  title: "یه چیزی برای آینده بذار کنار",
  character: "👴",
  characterName: "بابا",
  dialogue: "پسرم، یاد بگیر پس‌انداز کنی. آینده‌ات بهش بستگی داره.",
  progress: 6_200_000,
  target: 10_000_000,
  unit: "تومان" as const,
  reward: { xp: 120, stars: 1, money: 2_000_000 },
  status: "in_progress" as MissionStatus,
  episode: 1,
  totalEpisodes: 5,
};

export const dailyMissions = [
  {
    id: "d1",
    title: "صبحانه بخور",
    emoji: "🍳",
    duration: "۵ دقیقه",
    reward: { xp: 20, stars: 0, money: 0 },
    status: "claimable" as MissionStatus,
  },
  {
    id: "d2",
    title: "یک شیفت کار کن",
    emoji: "💼",
    duration: "۸ ساعت",
    reward: { xp: 50, stars: 1, money: 1_000_000 },
    status: "pending" as MissionStatus,
  },
  {
    id: "d3",
    title: "یک جلسه مطالعه کن",
    emoji: "📚",
    duration: "۱۵ دقیقه",
    reward: { xp: 30, stars: 0, money: 0 },
    status: "pending" as MissionStatus,
  },
];

export const weeklyMissions = [
  {
    id: "w1",
    title: "۵ روز پشت سر هم کار کن",
    emoji: "📈",
    progress: 3,
    target: 5,
    reward: { xp: 200, stars: 2, money: 0 },
    status: "in_progress" as MissionStatus,
  },
  {
    id: "w2",
    title: "۳ بار ورزش کن",
    emoji: "🏋️",
    progress: 1,
    target: 3,
    reward: { xp: 100, stars: 1, money: 0 },
    status: "in_progress" as MissionStatus,
  },
];

export const milestones = [
  {
    id: "ms1",
    title: "اولین ۵۰ میلیون",
    emoji: "💰",
    progress: 40_000_000,
    target: 50_000_000,
    unit: "تومان" as const,
    reward: { xp: 500, stars: 10, money: 0 },
    badge: "سرمایه‌گذار جوان",
    badgeEmoji: "💎",
  },
  {
    id: "ms2",
    title: "مدرک حرفه‌ای",
    emoji: "🎓",
    progress: 2,
    target: 5,
    unit: "دوره" as const,
    reward: { xp: 300, stars: 5, money: 0 },
    badge: "استاد",
    badgeEmoji: "🎓",
  },
  {
    id: "ms3",
    title: "کارمند قابل‌اعتماد",
    emoji: "💼",
    progress: 32,
    target: 90,
    unit: "روز" as const,
    reward: { xp: 400, stars: 8, money: 5_000_000 },
    badge: "حرفه‌ای",
    badgeEmoji: "🏅",
  },
];

export function getMissionStats() {
  const activeCount =
    (storyArc.status === "in_progress" ? 1 : 0) +
    dailyMissions.filter((m) => m.status === "pending" || m.status === "in_progress").length +
    weeklyMissions.filter((m) => m.status === "in_progress").length;
  const claimableCount =
    (storyArc.status === "claimable" ? 1 : 0) +
    dailyMissions.filter((m) => m.status === "claimable").length;
  return { activeCount, claimableCount };
}

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

export const jobListings: JobListing[] = [
  {
    id: 1,
    title: "توسعه‌دهنده پایتون",
    company: "استارتاپ نوآوران",
    type: "استارتاپ",
    salaryMin: 45_000_000,
    salaryMax: 60_000_000,
    isRemote: true,
    requirements: [{ skill: "برنامه‌نویسی", level: 6 }],
    suitable: true,
    postedAgo: 2,
    acceptanceChance: 72,
    difficulty: "متوسط",
    growthPotential: "بالا",
    energyCost: 25,
    isPremium: false,
    isHot: false,
  },
  {
    id: 2,
    title: "مدرس آنلاین پایتون",
    company: "آموزشگاه فناوری",
    type: "شرکت",
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
    acceptanceChance: 35,
    difficulty: "آسان",
    growthPotential: "متوسط",
    energyCost: 15,
    isPremium: false,
    isHot: true,
  },
  {
    id: 3,
    title: "فرانت‌اند React",
    company: "شرکت پیشرو",
    type: "شرکت",
    salaryMin: 55_000_000,
    salaryMax: 70_000_000,
    isRemote: false,
    requirements: [{ skill: "برنامه‌نویسی", level: 7 }],
    suitable: true,
    postedAgo: 3,
    acceptanceChance: 65,
    difficulty: "سخت",
    growthPotential: "بالا",
    energyCost: 30,
    isPremium: true,
    isHot: false,
  },
  {
    id: 4,
    title: "کارشناس IT",
    company: "سازمان دولتی",
    type: "دولتی",
    salaryMin: 18_000_000,
    salaryMax: 22_000_000,
    isRemote: false,
    requirements: [{ skill: "برنامه‌نویسی", level: 3 }],
    suitable: true,
    postedAgo: 0,
    acceptanceChance: 88,
    difficulty: "آسان",
    growthPotential: "پایین",
    energyCost: 20,
    isPremium: false,
    isHot: false,
  },
  {
    id: 5,
    title: "مدیر فنی CTO",
    company: "تک‌استار ونچرز",
    type: "استارتاپ",
    salaryMin: 120_000_000,
    salaryMax: 150_000_000,
    isRemote: false,
    requirements: [
      { skill: "برنامه‌نویسی", level: 8 },
      { skill: "رهبری", level: 3 },
    ],
    suitable: false,
    missing: "رهبری Lv.3",
    postedAgo: 0,
    acceptanceChance: 25,
    difficulty: "سخت",
    growthPotential: "بالا",
    energyCost: 35,
    isPremium: true,
    isHot: true,
  },
  {
    id: 6,
    title: "تحلیلگر داده",
    company: "دیجی‌کالا",
    type: "شرکت",
    salaryMin: 55_000_000,
    salaryMax: 65_000_000,
    isRemote: true,
    requirements: [{ skill: "برنامه‌نویسی", level: 5 }],
    suitable: true,
    postedAgo: 1,
    acceptanceChance: 60,
    difficulty: "متوسط",
    growthPotential: "متوسط",
    energyCost: 20,
    isPremium: true,
    isHot: false,
  },
];

export const cityEconomy = {
  status: "پرنوسان" as "پایدار" | "پرنوسان" | "رکود" | "رونق",
  inflationRate: 3.2,
  activePlayers: 748,
  totalPlayers: 1000,
  economyHealth: 62,
};

export const economicWave = {
  name: "موج استارتاپ",
  emoji: "🚀",
  description: "حقوق IT بالاست. استارتاپ‌ها استخدام می‌کنن.",
  effects: [
    { text: "حقوق IT +۲۰٪", positive: true },
    { text: "رقابت استخدام بالا", positive: false },
    { text: "فرصت سرمایه‌گذاری", positive: true },
  ],
  remainingDays: 5,
  totalDays: 14,
};

export type EventSeverity = "normal" | "important" | "critical" | "golden";

export const cityEvents = [
  {
    id: 1, type: "economic", emoji: "💵", severity: "critical" as EventSeverity,
    title: "دلار ۵٪ بالا رفت", desc: "کالاهای وارداتی گرون‌تر شد",
    impacts: [
      { text: "واردات گران‌تر", positive: false },
      { text: "سرمایه‌گذاری دلاری سودده‌تر", positive: true },
      { text: "خرید آیفون پرریسک‌تر", positive: false },
    ],
    remainingHours: 48, affectedPlayers: 234,
  },
  {
    id: 2, type: "opportunity", emoji: "🔥", severity: "golden" as EventSeverity,
    title: "فصل کنکور شروع شد", desc: "تقاضا برای تدریس ۳ برابر شد",
    impacts: [
      { text: "درآمد تدریس ×۳", positive: true },
      { text: "رقابت بالا بین معلم‌ها", positive: false },
    ],
    remainingHours: 168, affectedPlayers: 89,
  },
  {
    id: 3, type: "market", emoji: "📉", severity: "important" as EventSeverity,
    title: "رکود در صنعت IT", desc: "۳ شرکت نیروی خود را کاهش دادند",
    impacts: [
      { text: "حقوق IT -۱۰٪", positive: false },
      { text: "فرصت فریلنسری بالا", positive: true },
    ],
    remainingHours: 72, affectedPlayers: 156,
  },
];

export const cityOpportunities = [
  { id: 1, emoji: "👔", title: "کارمند می‌خوام", sub: "شرکت دیجی‌کد | Lv.6+ | ۵۵M", btn: "درخواست", totalSpots: 3, remainingSpots: 1, competitors: 27 },
  { id: 2, emoji: "🤝", title: "شریک تجاری", sub: "سرمایه ۲۰۰M | فروشگاه آنلاین", btn: "جزئیات", totalSpots: 1, remainingSpots: 1, competitors: 8 },
  { id: 3, emoji: "📦", title: "خرید عمده آیفون", sub: "بازرگانی نوری | ۱۵ دستگاه", btn: "مذاکره", totalSpots: 5, remainingSpots: 2, competitors: 14 },
];

export const marketInsight = {
  text: "نشانه‌های رشد صنعت غذا دیده می‌شود. ورود در ۷ روز آینده سودآور خواهد بود.",
  confidence: 75,
};

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

export const finance = {
  monthlyIncome: 45_000_000,
  monthlyExpenses: 13_200_000,
  cashflow: 31_800_000,
  rank: 47,
  totalPlayers: 748,
};

export const company = {
  hasCompany: false,
  employees: 0,
  productivity: 0,
  revenue: 0,
};

export const vitals = [
  {
    id: "happiness",
    label: "خوشحالی",
    emoji: "😊",
    value: 72,
    level: 3,
    unit: "٪",
    colorFrom: "#a855f7",
    colorTo: "#c084fc",
    effects: ["بهره‌وری کاری بیشتر", "روابط قوی‌تر", "سلامت روانی"],
    boosts: ["تفریح و سرگرمی", "ارتباط اجتماعی", "موفقیت مالی"],
    risks: ["استرس زیاد", "انزوای اجتماعی", "شکست‌های پی‌در‌پی"],
  },
  {
    id: "health",
    label: "سلامت",
    emoji: "❤️",
    value: 84,
    level: 4,
    unit: "٪",
    colorFrom: "#22c55e",
    colorTo: "#4ade80",
    effects: ["انرژی بیشتر", "تمرکز بهتر", "کارایی بالاتر"],
    boosts: ["غذای سالم", "ورزش منظم", "خواب کافی"],
    risks: ["فست فود زیاد", "بی‌خوابی", "استرس مزمن"],
  },
  {
    id: "intelligence",
    label: "هوش",
    emoji: "🧠",
    value: 63,
    level: 2,
    unit: "٪",
    colorFrom: "#3b82f6",
    colorTo: "#60a5fa",
    effects: ["فرصت‌های شغلی بهتر", "درک مسائل پیچیده", "سرمایه‌گذاری هوشمند"],
    boosts: ["مطالعه روزانه", "دوره‌های آموزشی", "حل مسئله"],
    risks: ["کم‌خوابی مزمن", "اطلاعات بیش از حد", "استرس"],
  },
  {
    id: "workXp",
    label: "تجربه کاری",
    emoji: "💼",
    value: 41,
    level: 1,
    unit: "٪",
    colorFrom: "#f97316",
    colorTo: "#fb923c",
    effects: ["حقوق بالاتر", "پیشرفت سریع‌تر", "اعتبار بیشتر"],
    boosts: ["کار روزانه", "پروژه‌های جانبی", "مشاوره با متخصص"],
    risks: ["غیبت از کار", "شکست پروژه‌ها", "تغییر ناگهانی حوزه"],
  },
  {
    id: "fitness",
    label: "تناسب اندام",
    emoji: "⚖️",
    value: 65,
    level: 2,
    unit: "٪",
    colorFrom: "#64748b",
    colorTo: "#94a3b8",
    effects: ["سلامت بهتر", "اعتماد به نفس", "انرژی بیشتر"],
    boosts: ["ورزش منظم", "تغذیه متعادل", "آب کافی"],
    risks: ["کم‌تحرکی", "فست فود زیاد", "پرخوری"],
  },
  {
    id: "wealth",
    label: "ثروت",
    emoji: "💰",
    value: 31,
    level: 1,
    unit: "٪",
    colorFrom: "#D4A843",
    colorTo: "#F0C966",
    effects: ["آزادی مالی", "مسکن بهتر", "فرصت سرمایه‌گذاری"],
    boosts: ["کار بیشتر", "سرمایه‌گذاری هوشمند", "پس‌انداز"],
    risks: ["هزینه‌های اضافه", "وام بیش از حد", "تورم"],
  },
];

export const actionCards = [
  {
    id: "work", emoji: "💼", label: "کار", sublabel: "دیجی‌کد", href: "/jobs",
    color: "#f97316", bgColor: "#fff7ed", borderColor: "#fed7aa",
    effects: [
      { label: "تجربه", delta: "+3", positive: true },
      { label: "ثروت", delta: "+2", positive: true },
      { label: "انرژی", delta: "-2", positive: false },
    ],
  },
  {
    id: "study", emoji: "📚", label: "مطالعه", sublabel: "پایتون", href: "/skills",
    color: "#3b82f6", bgColor: "#eff6ff", borderColor: "#bfdbfe",
    effects: [
      { label: "هوش", delta: "+3", positive: true },
      { label: "تجربه", delta: "+1", positive: true },
      { label: "انرژی", delta: "-2", positive: false },
    ],
  },
  {
    id: "exercise", emoji: "🏋️", label: "ورزش", sublabel: "باشگاه", href: "#",
    color: "#22c55e", bgColor: "#f0fdf4", borderColor: "#bbf7d0",
    effects: [
      { label: "سلامت", delta: "+4", positive: true },
      { label: "تناسب", delta: "+3", positive: true },
      { label: "انرژی", delta: "-3", positive: false },
    ],
  },
  {
    id: "rest", emoji: "😴", label: "استراحت", sublabel: "بازیابی", href: "#",
    color: "#8b5cf6", bgColor: "#f5f3ff", borderColor: "#ddd6fe",
    effects: [
      { label: "انرژی", delta: "+5", positive: true },
      { label: "خوشحالی", delta: "+2", positive: true },
      { label: "وقت", delta: "-3", positive: false },
    ],
  },
  {
    id: "invest", emoji: "📈", label: "سرمایه‌گذاری", sublabel: "بورس", href: "/bank",
    color: "#D4A843", bgColor: "#fffbeb", borderColor: "#fde68a",
    effects: [
      { label: "ثروت", delta: "+؟", positive: true },
      { label: "هوش", delta: "+1", positive: true },
      { label: "استرس", delta: "+2", positive: false },
    ],
  },
  {
    id: "social", emoji: "🤝", label: "شبکه‌سازی", sublabel: "رویدادها", href: "/city",
    color: "#ec4899", bgColor: "#fdf2f8", borderColor: "#fbcfe8",
    effects: [
      { label: "خوشحالی", delta: "+3", positive: true },
      { label: "فرصت‌ها", delta: "+2", positive: true },
      { label: "زمان", delta: "-2", positive: false },
    ],
  },
];

export const homeActivities = [
  {
    id: "study",
    emoji: "📚",
    label: "مطالعه پایتون",
    sublabel: "دوره ۷ روزه · روز ۴ از ۷",
    iconBg: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    iconGlow: "rgba(59,130,246,0.35)",
    href: "/skills",
    costs: [
      { icon: "⏱️", label: "۱۵ دقیقه" },
      { icon: "⚡", label: "-۲۰ انرژی" },
    ],
    rewards: [
      { icon: "🧠", label: "+۱۵ هوش" },
      { icon: "⭐", label: "+۵ XP" },
    ],
    available: true,
  },
  {
    id: "eat",
    emoji: "🍳",
    label: "غذا بخور",
    sublabel: "یخچال: ۴ آیتم آماده",
    iconBg: "linear-gradient(135deg, #c2410c, #f97316)",
    iconGlow: "rgba(249,115,22,0.35)",
    href: "/fridge",
    costs: [
      { icon: "⏱️", label: "۵ دقیقه" },
    ],
    rewards: [
      { icon: "🍔", label: "+۴۰ سیری" },
      { icon: "⚡", label: "+۵۰ انرژی" },
    ],
    available: true,
  },
  {
    id: "sleep",
    emoji: "😴",
    label: "بخواب",
    sublabel: "ریکاوری کامل انرژی",
    iconBg: "linear-gradient(135deg, #6d28d9, #8b5cf6)",
    iconGlow: "rgba(139,92,246,0.35)",
    href: "#",
    costs: [
      { icon: "⏱️", label: "۸ ساعت" },
    ],
    rewards: [
      { icon: "⚡", label: "+۶۰ انرژی" },
      { icon: "😊", label: "+۱۰ خوشحالی" },
    ],
    available: true,
  },
  {
    id: "exercise",
    emoji: "🏋️",
    label: "ورزش کن",
    sublabel: "باشگاه · ارتقاء سلامت",
    iconBg: "linear-gradient(135deg, #15803d, #22c55e)",
    iconGlow: "rgba(34,197,94,0.35)",
    href: "#",
    costs: [
      { icon: "⏱️", label: "۱ ساعت" },
      { icon: "⚡", label: "-۳۰ انرژی" },
      { icon: "💰", label: "-۱۰۰K" },
    ],
    rewards: [
      { icon: "❤️", label: "+۲۰ سلامت" },
      { icon: "⚖️", label: "+۵ تناسب" },
    ],
    available: true,
  },
  {
    id: "rest",
    emoji: "☕",
    label: "استراحت کن",
    sublabel: "مبل · آرامش کوتاه",
    iconBg: "linear-gradient(135deg, #7c3aed, #a855f7)",
    iconGlow: "rgba(168,85,247,0.35)",
    href: "#",
    costs: [
      { icon: "⏱️", label: "۳۰ دقیقه" },
    ],
    rewards: [
      { icon: "⚡", label: "+۱۵ انرژی" },
      { icon: "😊", label: "+۵ خوشحالی" },
    ],
    available: true,
  },
  {
    id: "work",
    emoji: "💻",
    label: "کار کن",
    sublabel: "دیجی‌کد · ۸ ساعت",
    iconBg: "linear-gradient(135deg, #b45309, #D4A843)",
    iconGlow: "rgba(212,168,67,0.35)",
    href: "/jobs",
    costs: [
      { icon: "⏱️", label: "۸ ساعت" },
      { icon: "⚡", label: "-۴۰ انرژی" },
    ],
    rewards: [
      { icon: "💰", label: "+۴۵M" },
      { icon: "💼", label: "+۳ تجربه" },
    ],
    available: true,
  },
  {
    id: "invest",
    emoji: "📈",
    label: "سرمایه‌گذاری",
    sublabel: "بورس · ریسک متوسط",
    iconBg: "linear-gradient(135deg, #0f766e, #14b8a6)",
    iconGlow: "rgba(20,184,166,0.35)",
    href: "/bank",
    costs: [
      { icon: "💰", label: "-۵M تومن" },
      { icon: "⏱️", label: "۱۵ دقیقه" },
    ],
    rewards: [
      { icon: "💰", label: "+۱-۳M" },
      { icon: "🧠", label: "+۲ هوش" },
    ],
    available: true,
  },
];

// Helpers

/** Convert Latin digits to Persian */
export function toPersian(input: string | number): string {
  return String(input).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
}

export function formatMoney(n: number): string {
  if (n >= 1_000_000_000) return toPersian((n / 1_000_000_000).toFixed(1)) + "B";
  if (n >= 1_000_000) return toPersian((n / 1_000_000).toFixed(1)) + "M";
  if (n >= 1_000) return toPersian((n / 1_000).toFixed(0)) + "K";
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

export function getDifficultyColor(d: string): { color: string; bg: string } {
  switch (d) {
    case "آسان": return { color: "#166534", bg: "rgba(74,222,128,0.15)" };
    case "متوسط": return { color: "#854d0e", bg: "rgba(250,204,21,0.15)" };
    case "سخت": return { color: "#991b1b", bg: "rgba(239,68,68,0.15)" };
    default: return { color: "#475569", bg: "rgba(255,255,255,0.1)" };
  }
}

export function getGrowthColor(g: string): { color: string; bg: string } {
  switch (g) {
    case "بالا": return { color: "#1e40af", bg: "rgba(96,165,250,0.15)" };
    case "متوسط": return { color: "#854d0e", bg: "rgba(250,204,21,0.15)" };
    case "پایین": return { color: "#475569", bg: "rgba(255,255,255,0.1)" };
    default: return { color: "#475569", bg: "rgba(255,255,255,0.1)" };
  }
}
