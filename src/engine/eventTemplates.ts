import type { EventTemplate } from "./types";

export const EVENT_TEMPLATES: EventTemplate[] = [
  // ===== ECONOMIC EVENTS =====
  {
    id: "dollar_spike",
    emoji: "💵",
    severity: "critical",
    category: "economic",
    title: "دلار جهش کرد!",
    description: "نرخ ارز ناگهان بالا رفت. کالاهای وارداتی گرون‌تر شدن.",
    triggerConditions: [
      { source: "indicator", key: "Import_Pressure", operator: ">", value: 65 },
      { source: "indicator", key: "Inflation_Index", operator: ">", value: 50 },
    ],
    baseWeight: 0.7,
    durationTicks: 30,
    impacts: [
      { target: "indicator", key: "Inflation_Index", delta: 8, text: "تورم افزایش یافت", positive: false },
      { target: "indicator", key: "Import_Pressure", delta: 10, text: "فشار واردات بیشتر شد", positive: false },
    ],
    displayImpacts: [
      { text: "واردات گران‌تر شد", positive: false },
      { text: "سرمایه‌گذاری دلاری سودده‌تر", positive: true },
      { text: "خرید کالای خارجی پرریسک‌تر", positive: false },
    ],
    cooldownTicks: 60,
    allowedWavePhases: ["saturation", "mini_recession"],
  },

  {
    id: "inflation_wave",
    emoji: "📈",
    severity: "important",
    category: "economic",
    title: "موج تورمی",
    description: "قیمت‌ها در سطح شهر بالا رفت. هزینه زندگی افزایش یافت.",
    triggerConditions: [
      { source: "indicator", key: "Inflation_Index", operator: ">", value: 70 },
    ],
    baseWeight: 0.6,
    durationTicks: 40,
    impacts: [
      { target: "player", key: "money", delta: -500_000, text: "هزینه‌ها بالا رفت", positive: false },
      { target: "indicator", key: "Unemployment_Rate", delta: 3, text: "بیکاری بیشتر", positive: false },
    ],
    displayImpacts: [
      { text: "هزینه زندگی +۱۵٪", positive: false },
      { text: "حقوق واقعی کاهش یافت", positive: false },
      { text: "پس‌انداز ارزشش کم شد", positive: false },
    ],
    cooldownTicks: 80,
  },

  {
    id: "rent_spike",
    emoji: "🏠",
    severity: "important",
    category: "economic",
    title: "اجاره‌ها جهش کرد",
    description: "بازار مسکن داغ شد. اجاره‌بها ۲۰ درصد افزایش یافت.",
    triggerConditions: [
      { source: "indicator", key: "Inflation_Index", operator: ">", value: 55 },
    ],
    baseWeight: 0.5,
    durationTicks: 50,
    impacts: [
      { target: "player", key: "money", delta: -2_000_000, text: "اجاره گرون‌تر شد", positive: false },
    ],
    displayImpacts: [
      { text: "اجاره‌بها +۲۰٪", positive: false },
      { text: "فشار بر مستاجران", positive: false },
      { text: "سرمایه‌گذاری مسکن سودده", positive: true },
    ],
    cooldownTicks: 100,
  },

  {
    id: "recession_end",
    emoji: "🌱",
    severity: "golden",
    category: "economic",
    title: "نشانه‌های بهبود اقتصادی",
    description: "شاخص‌ها نشون‌دهنده خروج از رکوده. فرصت سرمایه‌گذاری.",
    triggerConditions: [
      { source: "indicator", key: "Unemployment_Rate", operator: "<", value: 35 },
      { source: "indicator", key: "Startup_Growth", operator: ">", value: 45 },
    ],
    baseWeight: 0.5,
    durationTicks: 35,
    impacts: [
      { target: "indicator", key: "Startup_Growth", delta: 8, text: "رشد استارتاپ", positive: true },
      { target: "indicator", key: "Unemployment_Rate", delta: -5, text: "بیکاری کمتر", positive: true },
    ],
    displayImpacts: [
      { text: "بازار رو به بهبود", positive: true },
      { text: "فرصت سرمایه‌گذاری", positive: true },
      { text: "افزایش اعتماد عمومی", positive: true },
    ],
    cooldownTicks: 90,
    allowedWavePhases: ["recovery", "startup_wave"],
  },

  // ===== MARKET EVENTS =====
  {
    id: "it_saturation",
    emoji: "💻",
    severity: "important",
    category: "market",
    title: "بازار IT اشباع شد",
    description: "تعداد برنامه‌نویس‌ها از نیاز بازار بیشتر شد. رقابت شدید است.",
    triggerConditions: [
      { source: "behavior", key: "itJobsTakenPct", operator: ">", value: 60 },
      { source: "behavior", key: "avgITSkillLevel", operator: ">", value: 6 },
    ],
    baseWeight: 0.65,
    durationTicks: 50,
    impacts: [
      { target: "indicator", key: "IT_Demand", delta: -10, text: "تقاضای IT کاهش", positive: false },
      { target: "indicator", key: "Unemployment_Rate", delta: 5, text: "بیکاری IT بالا", positive: false },
    ],
    displayImpacts: [
      { text: "حقوق IT -۱۵٪", positive: false },
      { text: "رقابت استخدام شدید", positive: false },
      { text: "فرصت فریلنسری بالا", positive: true },
    ],
    cooldownTicks: 100,
    allowedWavePhases: ["saturation", "mini_recession"],
  },

  // ===== OPPORTUNITY EVENTS =====
  {
    id: "startup_boom",
    emoji: "🚀",
    severity: "golden",
    category: "opportunity",
    title: "انفجار استارتاپ‌ها",
    description: "سرمایه‌گذاری خارجی وارد شد. استارتاپ‌ها بودجه دارن.",
    triggerConditions: [
      { source: "indicator", key: "Startup_Growth", operator: ">", value: 70 },
      { source: "indicator", key: "IT_Demand", operator: ">", value: 50 },
    ],
    baseWeight: 0.5,
    durationTicks: 45,
    impacts: [
      { target: "indicator", key: "IT_Demand", delta: 10, text: "تقاضای IT بالا رفت", positive: true },
      { target: "indicator", key: "Unemployment_Rate", delta: -5, text: "بیکاری کمتر", positive: true },
    ],
    displayImpacts: [
      { text: "حقوق IT +۲۰٪", positive: true },
      { text: "فرصت‌های شغلی جدید", positive: true },
      { text: "رقابت استخدام بالا", positive: false },
    ],
    cooldownTicks: 80,
    allowedWavePhases: ["startup_wave", "it_growth"],
  },

  {
    id: "konkur_season",
    emoji: "🎓",
    severity: "golden",
    category: "opportunity",
    title: "فصل کنکور شروع شد",
    description: "تقاضا برای تدریس خصوصی ۳ برابر شد.",
    triggerConditions: [
      { source: "indicator", key: "Education_Boom", operator: ">", value: 60 },
    ],
    baseWeight: 0.55,
    durationTicks: 60,
    impacts: [
      { target: "indicator", key: "Education_Boom", delta: 10, text: "رونق آموزش", positive: true },
    ],
    displayImpacts: [
      { text: "درآمد تدریس ×۳", positive: true },
      { text: "رقابت بین معلم‌ها", positive: false },
      { text: "فرصت کلاس آنلاین", positive: true },
    ],
    cooldownTicks: 120,
  },

  {
    id: "freelance_boom",
    emoji: "🌐",
    severity: "golden",
    category: "opportunity",
    title: "رونق فریلنسری",
    description: "پروژه‌های آنلاین بین‌المللی زیاد شدن. فرصت درآمد دلاری.",
    triggerConditions: [
      { source: "indicator", key: "IT_Demand", operator: ">", value: 60 },
      { source: "indicator", key: "Import_Pressure", operator: ">", value: 40 },
    ],
    baseWeight: 0.45,
    durationTicks: 40,
    impacts: [
      { target: "indicator", key: "IT_Demand", delta: 5, text: "تقاضا بیشتر", positive: true },
    ],
    displayImpacts: [
      { text: "درآمد فریلنسری +۳۰٪", positive: true },
      { text: "نیاز به مهارت زبان", positive: false },
      { text: "کار از خونه ممکن", positive: true },
    ],
    cooldownTicks: 70,
  },

  {
    id: "food_industry_opportunity",
    emoji: "🍔",
    severity: "normal",
    category: "opportunity",
    title: "فرصت صنعت غذا",
    description: "بازار رستوران و غذای آنلاین خالی‌ه. فرصت برای تازه‌واردها.",
    triggerConditions: [
      { source: "behavior", key: "itJobsTakenPct", operator: ">", value: 50 },
      { source: "indicator", key: "Unemployment_Rate", operator: "<", value: 40 },
    ],
    baseWeight: 0.35,
    durationTicks: 55,
    impacts: [],
    displayImpacts: [
      { text: "سود رستوران +۲۵٪", positive: true },
      { text: "رقابت کم در صنعت غذا", positive: true },
    ],
    cooldownTicks: 80,
  },

  // ===== CRISIS EVENTS =====
  {
    id: "mass_layoffs",
    emoji: "📉",
    severity: "critical",
    category: "crisis",
    title: "موج اخراج‌ها",
    description: "چندین شرکت بزرگ نیرو کم کردند.",
    triggerConditions: [
      { source: "indicator", key: "Unemployment_Rate", operator: ">", value: 60 },
      { source: "indicator", key: "Startup_Growth", operator: "<", value: 30 },
    ],
    baseWeight: 0.75,
    durationTicks: 40,
    impacts: [
      { target: "indicator", key: "Unemployment_Rate", delta: 10, text: "بیکاری شدید", positive: false },
      { target: "indicator", key: "IT_Demand", delta: -8, text: "تقاضا کاهش", positive: false },
      { target: "player", key: "happiness", delta: -5, text: "فضای منفی شهر", positive: false },
    ],
    displayImpacts: [
      { text: "بیکاری +۱۵٪", positive: false },
      { text: "حقوق‌ها کاهش یافت", positive: false },
      { text: "فرصت خرید سهام ارزان", positive: true },
    ],
    cooldownTicks: 90,
    allowedWavePhases: ["mini_recession"],
  },

  {
    id: "government_inspection",
    emoji: "🏢",
    severity: "normal",
    category: "crisis",
    title: "بازرسی اداره مالیات",
    description: "سازمان مالیاتی بازرسی سراسری شروع کرد.",
    triggerConditions: [
      { source: "indicator", key: "Inflation_Index", operator: ">", value: 45 },
      { source: "behavior", key: "startupFoundersPct", operator: ">", value: 30 },
    ],
    baseWeight: 0.35,
    durationTicks: 25,
    impacts: [
      { target: "player", key: "money", delta: -1_000_000, text: "جریمه مالیاتی", positive: false },
    ],
    displayImpacts: [
      { text: "جریمه مالیاتی احتمالی", positive: false },
      { text: "شرکت‌های غیرقانونی تعطیل", positive: true },
    ],
    cooldownTicks: 60,
  },

  // ===== SOCIAL EVENTS =====
  {
    id: "education_reform",
    emoji: "📚",
    severity: "normal",
    category: "social",
    title: "اصلاحات آموزشی",
    description: "دوره‌های آموزشی جدید با کیفیت بالا عرضه شد.",
    triggerConditions: [
      { source: "indicator", key: "Education_Boom", operator: ">", value: 55 },
      { source: "behavior", key: "studyingPct", operator: ">", value: 40 },
    ],
    baseWeight: 0.4,
    durationTicks: 35,
    impacts: [
      { target: "indicator", key: "Education_Boom", delta: 8, text: "کیفیت آموزش بالا رفت", positive: true },
    ],
    displayImpacts: [
      { text: "دوره‌های ارزان‌تر", positive: true },
      { text: "XP مهارت +۲۰٪", positive: true },
    ],
    cooldownTicks: 70,
  },

  {
    id: "social_trend",
    emoji: "📱",
    severity: "normal",
    category: "social",
    title: "ترند شبکه اجتماعی",
    description: "یک محصول ناگهان وایرال شد. فرصت تبلیغات و فروش.",
    triggerConditions: [
      { source: "indicator", key: "Startup_Growth", operator: ">", value: 40 },
    ],
    baseWeight: 0.3,
    durationTicks: 20,
    impacts: [],
    displayImpacts: [
      { text: "فروش محصولات مرتبط +۵۰٪", positive: true },
      { text: "فرصت تبلیغاتی", positive: true },
    ],
    cooldownTicks: 40,
  },

  {
    id: "tech_conference",
    emoji: "🎤",
    severity: "normal",
    category: "social",
    title: "کنفرانس فناوری تهران",
    description: "رویداد بزرگ فناوری در تهران. فرصت شبکه‌سازی و یادگیری.",
    triggerConditions: [
      { source: "indicator", key: "IT_Demand", operator: ">", value: 45 },
      { source: "indicator", key: "Education_Boom", operator: ">", value: 40 },
    ],
    baseWeight: 0.3,
    durationTicks: 15,
    impacts: [
      { target: "indicator", key: "Education_Boom", delta: 5, text: "رونق آموزش", positive: true },
    ],
    displayImpacts: [
      { text: "فرصت شبکه‌سازی", positive: true },
      { text: "+XP مهارت فنی", positive: true },
    ],
    cooldownTicks: 50,
  },

  {
    id: "traffic_crisis",
    emoji: "🚗",
    severity: "normal",
    category: "social",
    title: "بحران ترافیک تهران",
    description: "ترافیک سنگین. انرژی کمتر برای کار حضوری.",
    triggerConditions: [
      { source: "indicator", key: "IT_Demand", operator: "<", value: 50 },
    ],
    baseWeight: 0.25,
    durationTicks: 20,
    impacts: [
      { target: "player", key: "energy", delta: -5, text: "انرژی کمتر", positive: false },
    ],
    displayImpacts: [
      { text: "انرژی روزانه -۱۰", positive: false },
      { text: "دورکاری ارزشمندتر", positive: true },
    ],
    cooldownTicks: 40,
  },
];
