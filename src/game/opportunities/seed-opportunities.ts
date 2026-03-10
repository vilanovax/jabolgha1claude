import type { OpportunityTemplate } from "./types";

// ─── Standard Templates ───────────────────────────────────────────────────────
// Chain entry-points are marked with chainId/chainStep
// Pure chain steps have isChainStep: true (excluded from daily generation)

export const OPPORTUNITY_TEMPLATES: OpportunityTemplate[] = [

  // ─── 1. Freelance Emergency ── Chain: freelance_ladder step 1 ──────────────
  {
    id: "freelance_emergency",
    type: "career",
    titleFa: "پروژه اضطراری فریلنس",
    descriptionFa: "یک کلاینت فوری به کمک نیاز دارد. تحویل به‌موقع می‌تواند درِ فرصت‌های بزرگ‌تر را باز کند.",
    source: "player_behavior",
    rarity: "common",
    durationDays: 2,
    cost: { energy: 20, timeMinutes: 180 },
    requirements: { minLevel: 2, requiredTrack: "tech" },
    chainId: "freelance_ladder",
    chainStep: 1,
    outcomes: [
      {
        tier: "big_win",
        labelFa: "موفقیت کامل",
        probability: 0.6,
        effects: { money: 12_000_000, xp: 8, reputation: 5, careerXp: 10 },
        narrativeTextFa: "پروژه را با کیفیت عالی تحویل دادی. کلاینت خوشحال بود و درِ یک قرارداد بزرگ‌تر را باز کرد.",
      },
      {
        tier: "small_win",
        labelFa: "تحویل نسبی",
        probability: 0.3,
        effects: { money: 6_000_000 },
        narrativeTextFa: "پروژه تحویل داده شد اما کیفیت کامل نبود.",
      },
      {
        tier: "neutral",
        labelFa: "یادگیری از تجربه",
        probability: 0.1,
        effects: { xp: 3 },
        narrativeTextFa: "پروژه با مشکل مواجه شد، اما تجربه خوبی به دست آوردی.",
      },
    ],
  },

  // ─── 2. Cheap Bulk Buy ── Chain: bulk_trade step 1 ────────────────────────
  {
    id: "cheap_bulk_buy",
    type: "economic",
    titleFa: "خرید عمده ارزان",
    descriptionFa: "فرصت خرید یک محموله کالا با قیمت زیر بازار. فروش سریع می‌تواند یک کانال تجاری بسازد.",
    source: "market",
    rarity: "common",
    durationDays: 3,
    cost: { money: 20_000_000 },
    requirements: {},
    chainId: "bulk_trade",
    chainStep: 1,
    outcomes: [
      {
        tier: "big_win",
        labelFa: "فروش موفق",
        probability: 0.65,
        effects: { money: 35_000_000 },
        narrativeTextFa: "کالا را با سود خوبی فروختی. خریدار راضی بود و پیشنهاد خرید بعدی داد.",
      },
      {
        tier: "small_win",
        labelFa: "سود کم",
        probability: 0.35,
        effects: { money: 12_000_000 },
        narrativeTextFa: "بازار کند بود و سود کمتری از انتظار به دست آمد.",
      },
    ],
  },

  // ─── 3. Startup Angel ── Chain: startup_path step 1 ───────────────────────
  {
    id: "startup_angel",
    type: "economic",
    titleFa: "سرمایه‌گذاری در استارتاپ",
    descriptionFa: "یک استارتاپ نوپا به دنبال سرمایه‌گذار فرشته است. موفقیت می‌تواند به دور بعدی منجر شود.",
    source: "network",
    rarity: "rare",
    durationDays: 4,
    cost: { money: 15_000_000 },
    requirements: {},
    chainId: "startup_path",
    chainStep: 1,
    outcomes: [
      {
        tier: "big_win",
        labelFa: "موفقیت بزرگ",
        probability: 0.4,
        effects: { money: 50_000_000, stars: 2, reputation: 10 },
        narrativeTextFa: "استارتاپ رشد کرد! سرمایه‌گذاری چند برابر شد و دور بعدی در راه است.",
      },
      {
        tier: "small_win",
        labelFa: "بازگشت معقول",
        probability: 0.4,
        effects: { money: 20_000_000 },
        narrativeTextFa: "استارتاپ رشد آرامی داشت. فرصت سرمایه‌گذاری بیشتر وجود دارد.",
      },
      {
        tier: "setback",
        labelFa: "زیان",
        probability: 0.2,
        effects: { money: 0, happiness: -5 },
        narrativeTextFa: "استارتاپ موفق نشد و سرمایه از دست رفت.",
      },
    ],
  },

  // ─── 4. Discounted Work Tool ───────────────────────────────────────────────
  {
    id: "discounted_work_tool",
    type: "lifestyle",
    titleFa: "خرید ابزار کار با تخفیف",
    descriptionFa: "ابزار حرفه‌ای با تخفیف ویژه در دسترس است. می‌تواند بهره‌وری کارت را افزایش دهد.",
    source: "market",
    rarity: "common",
    durationDays: 2,
    cost: { money: 5_000_000 },
    requirements: {},
    outcomes: [
      {
        tier: "small_win",
        labelFa: "ارتقای مهارت",
        probability: 0.8,
        effects: { xp: 15, stars: 1 },
        narrativeTextFa: "ابزار جدید به بهبود کارت کمک کرد و مهارت‌هایت تقویت شد.",
      },
      {
        tier: "neutral",
        labelFa: "بهره کم",
        probability: 0.2,
        effects: { xp: 5 },
        narrativeTextFa: "ابزار مفید بود ولی تأثیر زیادی نداشت.",
      },
    ],
  },

  // ─── 5. Distressed Real Estate ────────────────────────────────────────────
  {
    id: "distressed_real_estate",
    type: "lifestyle",
    titleFa: "معامله ملک اضطراری",
    descriptionFa: "فروشنده مضطر یک ملک را زیر قیمت بازار عرضه کرده. فرصت استثنایی با ریسک حقوقی.",
    source: "market",
    rarity: "epic",
    durationDays: 5,
    cost: { money: 200_000_000 },
    requirements: { minMoney: 250_000_000 },
    outcomes: [
      {
        tier: "big_win",
        labelFa: "معامله موفق",
        probability: 0.7,
        effects: { money: 80_000_000, stars: 3, reputation: 15 },
        narrativeTextFa: "ملک را با سود عالی فروختی و اعتبارت در بازار بالا رفت.",
      },
      {
        tier: "setback",
        labelFa: "مشکل حقوقی",
        probability: 0.3,
        effects: { money: -20_000_000, happiness: -10 },
        narrativeTextFa: "معامله با مشکل حقوقی مواجه شد و بخشی از سرمایه صرف هزینه‌های قانونی شد.",
      },
    ],
  },

  // ─── 6. Teaching Burst ────────────────────────────────────────────────────
  {
    id: "teaching_burst",
    type: "career",
    titleFa: "کلاس اضطراری تدریس",
    descriptionFa: "یک مؤسسه آموزشی برای تدریس فوری به مدرس نیاز دارد. درآمد خوب با زمان کم.",
    source: "player_behavior",
    rarity: "common",
    durationDays: 2,
    cost: { energy: 15, timeMinutes: 90 },
    requirements: { requiredTrack: "education" },
    outcomes: [
      {
        tier: "small_win",
        labelFa: "تدریس موفق",
        probability: 0.8,
        effects: { money: 8_000_000, reputation: 5, careerXp: 8 },
        narrativeTextFa: "دانش‌آموزان از تدریست راضی بودند و اعتبارت بالا رفت.",
      },
      {
        tier: "neutral",
        labelFa: "تجربه آموزشی",
        probability: 0.2,
        effects: { xp: 10 },
        narrativeTextFa: "کلاس چندان موفق نبود اما تجربه خوبی کسب کردی.",
      },
    ],
  },

  // ─── 7. Crypto Tip ────────────────────────────────────────────────────────
  {
    id: "crypto_tip",
    type: "economic",
    titleFa: "سیگنال ارز دیجیتال",
    descriptionFa: "یک منبع موثق سیگنال خرید یک ارز دیجیتال داده. فرصت سود سریع با ریسک متوسط.",
    source: "network",
    rarity: "rare",
    durationDays: 2,
    cost: { money: 10_000_000 },
    requirements: {},
    outcomes: [
      {
        tier: "big_win",
        labelFa: "سود بزرگ",
        probability: 0.5,
        effects: { money: 22_000_000 },
        narrativeTextFa: "سیگنال درست بود و سود خوبی نصیبت شد!",
      },
      {
        tier: "small_win",
        labelFa: "سود کم",
        probability: 0.3,
        effects: { money: 12_000_000 },
        narrativeTextFa: "بازار کمی حرکت کرد و سود معقولی به دست آمد.",
      },
      {
        tier: "setback",
        labelFa: "زیان",
        probability: 0.2,
        effects: { money: 3_000_000 },
        narrativeTextFa: "بازار برعکس پیش‌بینی رفت و بخش زیادی از سرمایه از دست رفت.",
      },
    ],
  },

  // ─── 8. City Contract ─────────────────────────────────────────────────────
  {
    id: "city_contract",
    type: "city",
    titleFa: "قرارداد زیرساخت شهری",
    descriptionFa: "شهرداری در موج استارتاپی به دنبال پیمانکار برای یک پروژه زیرساختی است.",
    source: "city_wave",
    rarity: "rare",
    durationDays: 4,
    cost: { money: 30_000_000, energy: 25 },
    requirements: { requiredWaveType: "startup_wave", minReputation: 30 },
    outcomes: [
      {
        tier: "big_win",
        labelFa: "اجرای موفق",
        probability: 0.7,
        effects: { money: 60_000_000, reputation: 10 },
        narrativeTextFa: "پروژه با موفقیت اجرا شد و شهرداری از کارت راضی بود.",
      },
      {
        tier: "small_win",
        labelFa: "تکمیل با تأخیر",
        probability: 0.3,
        effects: { money: 20_000_000 },
        narrativeTextFa: "پروژه با تأخیر تمام شد و جریمه‌ای از هزینه کسر شد.",
      },
    ],
  },

  // ─── 9. Network Introduction ──────────────────────────────────────────────
  {
    id: "network_intro",
    type: "network",
    titleFa: "معرفی در شبکه حرفه‌ای",
    descriptionFa: "یک دوست قدیمی می‌تواند تو را به افراد مهم در صنعت معرفی کند.",
    source: "network",
    rarity: "common",
    durationDays: 3,
    cost: { energy: 10, timeMinutes: 60 },
    requirements: {},
    outcomes: [
      {
        tier: "small_win",
        labelFa: "ارتباط موفق",
        probability: 0.7,
        effects: { reputation: 15, xp: 5 },
        narrativeTextFa: "با افراد مفیدی آشنا شدی و شبکه حرفه‌ایت گسترش یافت.",
      },
      {
        tier: "neutral",
        labelFa: "ارتباط ضعیف",
        probability: 0.3,
        effects: { reputation: 5 },
        narrativeTextFa: "معرفی انجام شد اما ارتباط‌ها چندان عمیق نشد.",
      },
    ],
  },

  // ─── 10. Gold Hedge ───────────────────────────────────────────────────────
  {
    id: "gold_hedge",
    type: "city",
    titleFa: "خرید طلا به عنوان پوشش ریسک",
    descriptionFa: "در شرایط رکود اقتصادی، طلا امن‌ترین سرمایه‌گذاری است. قیمت‌ها در حال افزایش است.",
    source: "city_wave",
    rarity: "rare",
    durationDays: 5,
    cost: { money: 25_000_000 },
    requirements: { requiredWaveType: "mini_recession" },
    outcomes: [
      {
        tier: "small_win",
        labelFa: "سود از رکود",
        probability: 0.65,
        effects: { money: 40_000_000 },
        narrativeTextFa: "طلا در دوران رکود ارزش خود را حفظ کرد و سود خوبی به دست آمد.",
      },
      {
        tier: "neutral",
        labelFa: "بازگشت محافظه‌کارانه",
        probability: 0.35,
        effects: { money: 22_000_000 },
        narrativeTextFa: "رکود زودتر از انتظار تمام شد اما سرمایه حفظ شد.",
      },
    ],
  },

  // ─── 11. Skill Workshop ───────────────────────────────────────────────────
  {
    id: "skill_workshop",
    type: "skill",
    titleFa: "کارگاه مهارتی فشرده",
    descriptionFa: "یک کارگاه آموزشی تخصصی با مدرس بین‌المللی برگزار می‌شود. فرصت یادگیری عمیق.",
    source: "random",
    rarity: "common",
    durationDays: 3,
    cost: { money: 3_000_000, energy: 20, timeMinutes: 120 },
    requirements: {},
    outcomes: [
      {
        tier: "small_win",
        labelFa: "یادگیری عمیق",
        probability: 0.9,
        effects: { xp: 20, stars: 1 },
        narrativeTextFa: "کارگاه فوق‌العاده بود و مهارت‌هایت به شکل قابل توجهی ارتقا یافت.",
      },
      {
        tier: "neutral",
        labelFa: "یادگیری محدود",
        probability: 0.1,
        effects: { xp: 8 },
        narrativeTextFa: "محتوای کارگاه با انتظاراتت همخوانی نداشت.",
      },
    ],
  },

  // ─── 12. Insider Project ──────────────────────────────────────────────────
  {
    id: "insider_project",
    type: "career",
    titleFa: "رهبری پروژه داخلی ویژه",
    descriptionFa: "یک پروژه محرمانه و پرسود در داخل سازمان به رهبر نیاز دارد. موقعیت نادر.",
    source: "mission_chain",
    rarity: "epic",
    durationDays: 5,
    cost: { energy: 30, timeMinutes: 240 },
    requirements: { minReputation: 50 },
    outcomes: [
      {
        tier: "big_win",
        labelFa: "موفقیت درخشان",
        probability: 0.55,
        effects: { money: 40_000_000, reputation: 20, xp: 15, careerXp: 25 },
        narrativeTextFa: "پروژه را با موفقیت رهبری کردی و جایگاهت در سازمان تثبیت شد.",
      },
      {
        tier: "small_win",
        labelFa: "تکمیل معقول",
        probability: 0.3,
        effects: { money: 15_000_000, xp: 8, careerXp: 10 },
        narrativeTextFa: "پروژه تمام شد اما برخی اهداف محقق نشد.",
      },
      {
        tier: "neutral",
        labelFa: "تجربه ارزشمند",
        probability: 0.15,
        effects: { xp: 5 },
        narrativeTextFa: "پروژه با چالش‌های زیادی مواجه شد اما تجربه‌ای ارزشمند کسب کردی.",
      },
    ],
  },

  // ─── 13. Expert Consulting ── identity-based: specialist/professional ──────
  {
    id: "expert_consulting",
    type: "career",
    titleFa: "پروژه مشاوره تخصصی",
    descriptionFa: "یک شرکت به متخصص نیاز دارد. اگر سابقه‌ای داری، این معامله می‌ارزد.",
    source: "network",
    rarity: "rare",
    durationDays: 3,
    cost: { energy: 15 },
    requirements: { minReputation: 30, minLevel: 3 },
    outcomes: [
      {
        tier: "big_win",
        labelFa: "مشاوره موفق",
        probability: 0.6,
        effects: { money: 18_000_000, reputation: 12, careerXp: 20 },
        narrativeTextFa: "تخصصت ارزش‌آفرین بود. شرکت درخواست قرارداد بلندمدت داد.",
      },
      {
        tier: "small_win",
        labelFa: "تأثیر معقول",
        probability: 0.3,
        effects: { money: 8_000_000, reputation: 5 },
        narrativeTextFa: "مشاوره مثبت بود، اما انتظارات کامل برآورده نشد.",
      },
      {
        tier: "neutral",
        labelFa: "تجربه مفید",
        probability: 0.1,
        effects: { xp: 8 },
        narrativeTextFa: "پروژه با نتیجه محدود تمام شد.",
      },
    ],
  },

  // ─── 14. Education Surge Workshop ── city_driven ──────────────────────────
  {
    id: "education_surge_workshop",
    type: "skill",
    titleFa: "موج آموزشی شهر",
    descriptionFa: "در این فضای رونق آموزش، مؤسسه‌ها بورس‌های ویژه می‌دهند. استفاده کن.",
    source: "city_wave",
    rarity: "common",
    durationDays: 4,
    cost: { money: 1_500_000, energy: 10 },
    requirements: { requiredWaveType: "education_surge" },
    outcomes: [
      {
        tier: "small_win",
        labelFa: "رشد چشمگیر",
        probability: 0.85,
        effects: { xp: 25, stars: 1 },
        narrativeTextFa: "بورسیه را گرفتی و دوره را با موفقیت گذروندی.",
      },
      {
        tier: "neutral",
        labelFa: "پیشرفت کم",
        probability: 0.15,
        effects: { xp: 10 },
        narrativeTextFa: "دوره مفید بود اما به تعهد بیشتری نیاز داشت.",
      },
    ],
  },

  // ─── 15. Market Dip Opportunity ── economic ────────────────────────────────
  {
    id: "market_dip_buy",
    type: "economic",
    titleFa: "فرصت خرید در کف قیمت",
    descriptionFa: "یک سهم ارزنده بیش از حد افت کرده. پنجره کوچکی برای خرید در کف.",
    source: "market",
    rarity: "rare",
    durationDays: 2,
    cost: { money: 12_000_000 },
    requirements: {},
    outcomes: [
      {
        tier: "big_win",
        labelFa: "بازگشت قیمت",
        probability: 0.55,
        effects: { money: 22_000_000, stars: 1 },
        narrativeTextFa: "قیمت برگشت و سودی خوب به دست آمد!",
      },
      {
        tier: "small_win",
        labelFa: "رشد آرام",
        probability: 0.3,
        effects: { money: 15_000_000 },
        narrativeTextFa: "بازار آرام بالا رفت و سود معقولی داشت.",
      },
      {
        tier: "setback",
        labelFa: "ادامه افت",
        probability: 0.15,
        effects: { money: 6_000_000, happiness: -5 },
        narrativeTextFa: "بازار بیشتر افت کرد. صبور باش.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAIN STEP TEMPLATES (isChainStep: true — not in normal daily generation)
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Chain: freelance_ladder — Step 2 ─────────────────────────────────────
  {
    id: "chain_freelance_contract",
    type: "career",
    titleFa: "قرارداد فریلنس رسمی",
    descriptionFa: "کلاینتی که قبلاً راضی کردی، حالا می‌خواهد یک پروژه بزرگ‌تر بده. قدم بعدی در نردبان فریلنس.",
    source: "chain",
    rarity: "rare",
    durationDays: 3,
    cost: { energy: 25, timeMinutes: 240 },
    requirements: { minLevel: 2 },
    isChainStep: true,
    chainId: "freelance_ladder",
    chainStep: 2,
    outcomes: [
      {
        tier: "big_win",
        labelFa: "تحویل درخشان",
        probability: 0.55,
        effects: { money: 28_000_000, xp: 12, reputation: 10, careerXp: 15 },
        narrativeTextFa: "قرارداد را با موفقیت تحویل دادی. کلاینت به یک رابطه بلندمدت فکر می‌کند.",
      },
      {
        tier: "small_win",
        labelFa: "تحویل قابل قبول",
        probability: 0.35,
        effects: { money: 15_000_000, xp: 6 },
        narrativeTextFa: "کار تمام شد و کلاینت راضی بود.",
      },
      {
        tier: "neutral",
        labelFa: "پروژه پیچیده",
        probability: 0.1,
        effects: { xp: 8, happiness: -5 },
        narrativeTextFa: "پروژه سخت‌تر از انتظار بود. ارتباط ادامه دارد.",
      },
    ],
  },

  // ─── Chain: freelance_ladder — Step 3 ─────────────────────────────────────
  {
    id: "chain_long_term_client",
    type: "career",
    titleFa: "مشتری دائمی پیدا کردی",
    descriptionFa: "کلاینت می‌خواهد با تو قرارداد بلندمدت ببندد. یک منبع درآمد پایدار.",
    source: "chain",
    rarity: "epic",
    durationDays: 5,
    cost: { energy: 15 },
    requirements: {},
    isChainStep: true,
    chainId: "freelance_ladder",
    chainStep: 3,
    outcomes: [
      {
        tier: "big_win",
        labelFa: "قرارداد امضا شد",
        probability: 0.7,
        effects: { money: 45_000_000, reputation: 20, xp: 18, stars: 2, careerXp: 30 },
        narrativeTextFa: "قرارداد بلندمدت امضا شد! درآمد ماهانه پایدار داری و اعتبارت در بازار تثبیت شد.",
      },
      {
        tier: "small_win",
        labelFa: "همکاری محدود",
        probability: 0.3,
        effects: { money: 20_000_000, reputation: 10 },
        narrativeTextFa: "قرارداد کوتاه‌تری امضا شد اما رابطه خوبی برقرار شد.",
      },
    ],
  },

  // ─── Chain: startup_path — Step 2 ─────────────────────────────────────────
  {
    id: "chain_startup_followup",
    type: "economic",
    titleFa: "استارتاپ آپدیت داد",
    descriptionFa: "استارتاپی که در آن سرمایه‌گذاری کردی، آپدیت رشد فرستاده. آیا بیشتر سرمایه‌گذاری می‌کنی؟",
    source: "chain",
    rarity: "rare",
    durationDays: 3,
    cost: { money: 10_000_000 },
    requirements: {},
    isChainStep: true,
    chainId: "startup_path",
    chainStep: 2,
    outcomes: [
      {
        tier: "big_win",
        labelFa: "رشد سریع",
        probability: 0.45,
        effects: { money: 30_000_000, stars: 1, reputation: 8 },
        narrativeTextFa: "استارتاپ موج رشد گرفت! سرمایه‌گذاری اضافی‌ات بازده خوبی داد.",
      },
      {
        tier: "small_win",
        labelFa: "رشد پایدار",
        probability: 0.35,
        effects: { money: 17_000_000 },
        narrativeTextFa: "استارتاپ به آرامی رشد می‌کند. وضعیت پایدار است.",
      },
      {
        tier: "setback",
        labelFa: "مشکل داخلی",
        probability: 0.2,
        effects: { money: 3_000_000, happiness: -8 },
        narrativeTextFa: "استارتاپ با مشکلات داخلی روبرو شد. بخشی از سرمایه در خطر است.",
      },
    ],
  },

  // ─── Chain: startup_path — Step 3 ─────────────────────────────────────────
  {
    id: "chain_startup_exit",
    type: "economic",
    titleFa: "خروج از استارتاپ",
    descriptionFa: "شرکت بزرگ‌تری پیشنهاد خرید داده. لحظه exit فرا رسیده.",
    source: "chain",
    rarity: "epic",
    durationDays: 4,
    cost: {},
    requirements: {},
    isChainStep: true,
    chainId: "startup_path",
    chainStep: 3,
    outcomes: [
      {
        tier: "big_win",
        labelFa: "خروج پرسود",
        probability: 0.5,
        effects: { money: 80_000_000, stars: 3, reputation: 25 },
        narrativeTextFa: "خروج موفق! سرمایه‌گذاری چندین برابر شد و اعتبارت به عنوان سرمایه‌گذار تثبیت شد.",
      },
      {
        tier: "small_win",
        labelFa: "خروج معقول",
        probability: 0.35,
        effects: { money: 35_000_000, reputation: 10 },
        narrativeTextFa: "خروج با سود قابل قبول. معامله خوبی بود.",
      },
      {
        tier: "neutral",
        labelFa: "خروج به‌موقع",
        probability: 0.15,
        effects: { money: 18_000_000 },
        narrativeTextFa: "سرمایه را پس گرفتی. خطر بیشتری نبود.",
      },
    ],
  },

  // ─── Chain: bulk_trade — Step 2 ───────────────────────────────────────────
  {
    id: "chain_bulk_resale",
    type: "economic",
    titleFa: "فروش عمده با مشتری جدید",
    descriptionFa: "خریداری که محموله قبلی را دیده، حالا دنبال معامله بزرگ‌تر است. کانال تجاری در حال شکل گرفتن است.",
    source: "chain",
    rarity: "rare",
    durationDays: 3,
    cost: { money: 35_000_000 },
    requirements: {},
    isChainStep: true,
    chainId: "bulk_trade",
    chainStep: 2,
    outcomes: [
      {
        tier: "big_win",
        labelFa: "معامله بزرگ",
        probability: 0.6,
        effects: { money: 65_000_000, stars: 1, reputation: 8 },
        narrativeTextFa: "معامله بزرگ بسته شد! یک کانال تجاری پایدار ساختی.",
      },
      {
        tier: "small_win",
        labelFa: "معامله خوب",
        probability: 0.3,
        effects: { money: 48_000_000 },
        narrativeTextFa: "فروش با سود معقول انجام شد.",
      },
      {
        tier: "setback",
        labelFa: "لغو معامله",
        probability: 0.1,
        effects: { money: 20_000_000, happiness: -8 },
        narrativeTextFa: "مشتری در آخرین لحظه لغو کرد. بخشی از کالا را به قیمت پایین‌تر فروختی.",
      },
    ],
  },
];
