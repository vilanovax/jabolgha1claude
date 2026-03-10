# Jabolgha — ممیزی کامل و مستندات بازی

> نسخه: ۱.۰ | تاریخ: ۱۴۰۴
> پلتفرم: Next.js 16.1.6 + React 19 + TypeScript + Zustand 5
> زبان: فارسی (RTL) | موبایل‌اول (PWA، maxWidth: 430px)

---

## بخش ۱ — نمای کلی بازی

### چیست؟
Jabolgha (شهر من) یک بازی شبیه‌سازی زندگی فارسی‌زبان است. بازیکن نقش یک فارغ‌التحصیل جوان را در تهران بازی می‌کند و باید با مدیریت انرژی، پول، مهارت‌ها و روابط، مسیر شغلی و زندگی خود را بسازد.

### ژانر
Life Simulation RPG — مشابه The Sims + BitLife + Kairosoft

### حلقه اصلی بازی
```
هر روز بازیکن:
  ① اکشن‌های روزانه انجام می‌دهد (کار، مطالعه، ورزش، ...)
  ② XP، پول، و آمارهای حیاتی تغییر می‌کنند
  ③ ماموریت‌های روزانه/هفتگی پیش می‌روند
  ④ شهر تغییر می‌کند (موج اقتصادی، رویداد)
  ⑤ فرصت‌های جدید ظاهر می‌شوند
  ⑥ روز بعدی شروع می‌شود
```

### وضعیت فعلی توسعه
بازی در مرحله Alpha کامل است — همه سیستم‌های اصلی پیاده‌سازی شده‌اند.

---

## بخش ۲ — معماری پروژه

### ساختار پوشه‌ها
```
src/
├── app/          (13 صفحه) — Next.js App Router
├── components/   (79 فایل) — کامپوننت‌های React
├── data/         (9 فایل)  — کاتالوگ داده و کانفیگ اقتصادی
├── engine/       (7 فایل)  — موتور اقتصادی نسل اول (legacy)
├── game/         (54 فایل) — سیستم‌های اصلی بازی
├── hooks/        (1 فایل)  — React Hooks سفارشی
├── stores/       (1 فایل)  — Zustand Store مرکزی
└── theme/        (1 فایل)  — توکن‌های طراحی
```

### Storeهای Zustand (7 store مجزا)
| Store | Persist Key | مسئولیت |
|-------|-------------|---------|
| `useGameStore` | shahre-man-game | حالت اصلی — player، bank، job، skills |
| `useMissionStore` | shahre-man-missions | ماموریت‌ها، دستاوردها، آرک داستانی |
| `useCityStore` | shahre-man-city | شبیه‌سازی شهر — موج‌ها، رویدادها، بخش‌ها |
| `useCareerStore` | shahre-man-career | مسیر شغلی — سطح، XP شغلی، ارتقا |
| `useOpportunityStore` | shahre-man-opportunities | فرصت‌های پویا |
| `useMarketStore` | shahre-man-market | بازار سهام و طلا |
| `useIdentityStore` | shahre-man-identity | هویت — آرکتایپ، عنوان، شهرت |

---

## بخش ۳ — موجودی سیستم‌های بازی

### ۳.۱ سیستم اکشن (Action Engine)
**وضعیت: ✅ کامل**

**فایل‌های اصلی:**
- `src/data/actionTemplates.ts` — تعریف اکشن‌ها
- `src/stores/gameStore.ts` — `executeAction()`
- `src/components/home/ActionBottomSheet.tsx` — رابط کاربری

**۷ دسته‌بندی اکشن:**

| دسته | ID | گزینه‌ها | هزینه | اثر |
|------|----|---------|------|-----|
| ورزش | exercise | پیاده‌روی، باشگاه، تمرین سنگین | energy: 10-50 | health: 5-40 |
| مطالعه | study | مرور سریع، جلسه مطالعه، ماراتن | energy: 10-40 | xp: 5-30 |
| کار | work | پاره‌وقت، شیفت کامل، اضافه‌کاری | energy: 15-50 | money: 1.5M-5M |
| استراحت | rest | چرت، فیلم، خواب کامل | — | energy: 20-80 |
| سرمایه‌گذاری | invest | کوچک، متوسط، بزرگ | money: 5M-30M | money: 7M-45M |
| کتابخانه | library | رمان، مهارت، روانشناسی | energy: 8-20 | happiness: 5-25 |
| خوردن | eat | از یخچال اتفاق می‌افتد، در فریج‌پیج |  — |  — |

**Sponsored Variants:**
هر گزینه می‌تواند نسخه اسپانسری داشته باشد (Nike، Coursera، Nobitex، ...) — هزینه ۱.۵-۲× ولی اثر ۲-۳× بهتر.

**Wave Modifiers:**
| فاز موج | اثر روی اکشن |
|--------|--------------|
| startup_wave | کار +20%، سرمایه‌گذاری +20% |
| it_growth | مطالعه +30%، کار +10% |
| saturation | کار -20%، استراحت +20% |
| mini_recession | کار -30%، سرمایه‌گذاری -40% |
| recovery | همه اکشن‌های مولد +10% |

---

### ۳.۲ سیستم زمان (Time System)
**وضعیت: ⚠️ جزئی — UI هست، منطق کامل نیست**

**پیاده‌سازی فعلی:**
- هر اکشن `time` مصرف می‌کند (دقیقه)
- روز = ۹۶۰ دقیقه (۱۶ ساعت بیداری)
- فازهای روز: صبح / ظهر / شب / عصر
- `startNextDay()` روز را پیش می‌برد

**آنچه پیاده‌سازی نشده:**
- نمایش ساعت فعلی در HUD
- محدودیت تعداد اکشن در روز بر اساس زمان مصرف‌شده
- فازبندی روز (برخی اکشن‌ها فقط در فاز خاص)

---

### ۳.۳ موتور ماموریت (Mission Engine)
**وضعیت: ✅ کامل**

**فایل‌های اصلی:**
```
src/game/missions/
  types.ts         — Mission، MissionCategory، MissionObjective
  store.ts         — useMissionStore
  analyzer.ts      — analyzePlayerForMissions()
  progress.ts      — updateMissionProgress()
  rewards.ts       — scaleMissionRewards()
  selector.ts      — generateMissionsForNewDay()
  story-arcs.ts    — داستان‌های چند اپیزودی
  achievements.ts  — دستاوردها
  templates.ts     — قالب‌های روزانه/هفتگی/رویداد/نجات
  helpers.ts       — getRecommendedMission()
```

**انواع ماموریت:**
| نوع | تعداد قالب | اثر |
|----|-----------|-----|
| روزانه (daily) | 7 | هر روز تازه می‌شود |
| هفتگی (weekly) | 5 | هر هفت روز |
| داستانی (story) | چند آرک | روایت اصلی |
| رویداد (event) | 3 | از موج شهری trigger می‌شود |
| نجات (rescue) | 3 | وقتی حال بازیکن بد است |
| دستاورد (achievement) | catalog | یک‌بار — عنوان می‌دهد |

**قالب‌های روزانه:**
- `daily_eat_breakfast` — صبحانه بخور
- `daily_exercise` — ورزش کن
- `daily_rest` — استراحت کن
- `daily_work_shift` — یک شیفت کار کن
- `daily_study` — مطالعه کن
- `daily_earn_money` — X تومان درآمد داشته باش
- `daily_invest_small` — سرمایه‌گذاری کوچک

**ادغام:**
```
executeAction() → dispatchGameplayEvent() → processGameplayEvent() → updateMissionProgress()
startNextDay() → initMissionsForNewDay() + refreshAchievements()
```

---

### ۳.۴ موتور شهر (City Engine)
**وضعیت: ✅ کامل**

**فایل‌های اصلی:**
```
src/game/city/
  city-store.ts       — useCityStore
  city-simulation.ts  — runDailySimulation()
  seed-waves.ts       — 7 آرکتایپ موج
  seed-events.ts      — 12 قالب رویداد
  wave-engine.ts      — انتقال فاز
  event-generator.ts  — تولید رویداد
  city-helpers.ts     — getEconomyHealthLabelFa()
```

**۶ بخش اقتصادی شهر:**
- فناوری (tech) · ساختمان (construction) · خدمات (services)
- تولید (manufacturing) · آموزش (education) · تجارت (retail)

**۷ موج اقتصادی (چرخه‌ای):**
| موج | نام | تأثیر اصلی |
|-----|-----|-----------|
| stability | ثبات اقتصادی | baseline |
| tech_boom | رونق تکنولوژی | tech +2.5 حقوق، investment ×1.3 |
| recession | رکود اقتصادی | همه بخش‌ها -1 تا -5 شغل، inflation +1% |
| construction_surge | ساخت‌وساز داغ | construction +3 حقوق |
| finance_bull | بازار گاوی | finance +3 حقوق، investment ×1.5 |
| retail_holiday | فصل خرید | retail +3.5 حقوق، inflation +1.2% |
| manufacturing_revival | احیای صنعت | manufacturing +3 حقوق |

**چرخه موج:**
stability → tech_boom → construction_surge → stability → finance_bull → retail_holiday → stability → recession → manufacturing_revival → (تکرار)

---

### ۳.۵ بازار کار (Job Market)
**وضعیت: ✅ کامل (V2)**

**فایل‌های اصلی:**
```
src/app/jobs/page.tsx
src/components/jobs/
  JobCardV2.tsx       — کارت شغل با Match Score
  InterviewModal.tsx  — مصاحبه سه‌مرحله‌ای
  CityEconomyBanner.tsx
  CityJobModifiers.tsx
  SmartFilters.tsx
src/game/career/job-career-bridge.ts — calculateHiringChance()
src/game/integration/job-city-bridge.ts — enrichJobListingsWithCity()
```

**Match Score Algorithm:**
```
Match Score = XP (40%) + مهارت‌ها (30%) + دوره‌ها (15%) + تقاضای شهر (15%)
```

**سطوح ارشدیت:** junior · mid · senior (هر شغل سه تایر حقوقی دارد)

**فرایند مصاحبه:**
1. loading (1.5s) — درخواست ارسال شد
2. سوال کوتاه (2s) — رویداد mini-event
3. نتیجه — قبول / رد (بر اساس match score + city + career)

---

### ۳.۶ سیستم اقتصاد و بانک
**وضعیت: ✅ کامل**

**منابع درآمد:**

| منبع | مقدار | شرط |
|------|-------|-----|
| پاره‌وقت (بدون شغل) | 1.5M/شیفت | — |
| شیفت کامل (بدون شغل) | 3M/شیفت | — |
| اضافه‌کاری (بدون شغل) | 5M/شیفت | — |
| درآمد شغلی | salary ÷ 22 × shiftMul | با شغل فعال |
| سرمایه‌گذاری کوچک | EV: +1.3M | 5M سرمایه |
| سرمایه‌گذاری متوسط | EV: +2.4M | 15M سرمایه |
| سرمایه‌گذاری بزرگ | EV: +6M | 30M سرمایه |
| بهره پس‌انداز | 0.08% روزانه (~29% سالانه) | پس‌انداز |
| فرصت‌ها | متغیر (6M تا 80M) | شرایط خاص |
| بازار سهام | متغیر | خرید سهام |

**هزینه‌ها:**

| هزینه | مقدار |
|-------|-------|
| اجاره استودیو | 8M/ماه |
| اجاره آپارتمان معمولی | 15M/ماه |
| اجاره آپارتمان نوساز | 25M/ماه |
| پنت‌هاوس | 50M/ماه |
| قبوض هفتگی (استودیو) | 780K/هفته |
| قبوض هفتگی (آپارتمان) | 1.37M/هفته |
| اقساط وام اضطراری | از 10M با بهره 3% |
| هزینه دوره‌ها | 500K تا 2M |
| غذا | متغیر |

**وام‌ها:**
| نوع | سقف | بهره | مدت | شرط |
|-----|-----|-----|-----|-----|
| اضطراری | 10M | 3% | 6 ماه | سطح 1 |
| شخصی | 30M | 2% | 12 ماه | سطح 2 |
| تجاری | 100M | 1.8% | 18 ماه | سطح 3 + 20M پس‌انداز |
| مسکن | 200M | 1.5% | 24 ماه | سطح 5 + 50M پس‌انداز |

**ارزیابی تعادل اقتصادی:**
- نسبت درآمد/هزینه: ~۳-۵× (سالم)
- بازگشت سرمایه‌گذاری بزرگ EV مثبت ولی ریسک ۵۰٪ — چالش‌برانگیز
- پس‌انداز با بهره ۲۹% سالانه — تشویق به پس‌انداز بلندمدت
- بهره وام ۱.۵-۳% ماهانه — بار سنگین اگر وام بزرگ بگیری

---

### ۳.۷ سیستم مسکن و زندگی
**وضعیت: ✅ کامل**

**تایرهای مسکن:**
| ID | نام | اجاره/ماه | قیمت خرید | شرط |
|----|-----|----------|-----------|-----|
| studio | سوئیت کوچک | 8M | — | سطح 1 |
| apartment_basic | آپارتمان معمولی | 15M | 3B | سطح 3 |
| apartment_mid | آپارتمان نوساز | 25M | 6B | سطح 5 |
| penthouse | پنت‌هاوس | 50M | 15B | سطح 8 |
| villa | ویلا | — | 30B | سطح 10 |

**وسایل نقلیه:** 5 تایر (بدون خودرو → پراید → پژو → سمند → SUV → لوکس)

**پلن‌های موبایل:** 3 تایر (پایه 50K → متوسط 200K → پریمیوم 500K هفتگی)

**City Inflation روی قبوض:**
- BillInflationMultipliers: `{ rent, utilities, transport }` از CityState
- در `startNextDay()` محاسبه و اعمال می‌شود

---

### ۳.۸ سیستم یخچال و غذا
**وضعیت: ✅ کامل**

**فایل‌های اصلی:**
- `src/data/fridgeData.ts` — FOOD_CATALOG، FRIDGE_TIERS
- `src/app/fridge/page.tsx`

**تایرهای یخچال:** basic → mid → branded

**مکانیزم:**
- غذا می‌خری → در یخچال ذخیره می‌شود (با تاریخ انقضا)
- `eatFood()` → energy + happiness + health تغییر می‌کند
- غذای منقضی → happiness کم می‌شود
- `foodPriceMultiplier` از شهر روی قیمت غذا اثر دارد

---

### ۳.۹ سیستم مهارت و دوره
**وضعیت: ✅ کامل**

**مهارت‌های بازیکن:**
```
Hard Skills: Programming (8)، Marketing (3)، Accounting (1)، Design (2)
Soft Skills: Negotiation (4)، Time Mgmt (6)، Communication (3)، Leadership (1)
```

**۱۰ دوره در کاتالوگ:**
- Python Basics، Advanced Python، Marketing Fundamentals، Digital Marketing
- Accounting Basics، Financial Modeling، UI/UX Design، Graphic Design
- Project Management، Team Leadership

**دوره‌های اسپانسری:** Coursera، Udemy، DataCamp، HubSpot، Semrush، Bloomberg، Figma، PMP

**ساختار دوره:**
```
EnrollCourse → CompleteSession (N بار در روز) → CourseCompleted → completedCourses.push(id)
```

---

### ۳.۱۰ موتور فرصت (Opportunity Engine)
**وضعیت: ✅ کامل**

**فایل‌های اصلی:**
```
src/game/opportunities/
  types.ts           — OpportunityType (6)، OpportunityRarity
  store.ts           — useOpportunityStore
  generator.ts       — تولید (max 2 فعال، 30% skip)
  resolver.ts        — رول احتمال نتایج
  analyzer.ts        — analyzePlayerOpportunities()
  seed-opportunities.ts — 12 قالب
  helpers.ts         — countdown فارسی
```

**۱۲ قالب فرصت:**
| ID | نوع | نادری | سود احتمالی |
|----|-----|-------|------------|
| freelance_emergency | career | common | +12M (60%) |
| cheap_bulk_buy | economic | common | +35M (65%) |
| startup_angel | economic | rare | +50M (40%) |
| distressed_real_estate | lifestyle | epic | +80M (70%) |
| teaching_burst | career | common | +8M (80%) |
| crypto_tip | economic | rare | +22M (50%) |
| city_contract | city | rare | +60M (70%) |
| network_intro | network | common | +15 شهرت (70%) |
| gold_hedge | city | rare | +40M (65%) |
| skill_workshop | skill | common | +20 XP (90%) |
| insider_project | career | epic | +40M (55%) |
| discounted_work_tool | lifestyle | common | +15 XP (80%) |

**توزیع نادری:** 70% common · 25% rare · 5% epic

---

### ۳.۱۱ سیستم مسیر شغلی (Career)
**وضعیت: ✅ کامل**

**فایل‌های اصلی:**
```
src/game/career/
  types.ts           — CareerTrack (8)، CareerLevel (7)
  career-config.ts   — CAREER_LADDER، SALARY_MULTIPLIERS، CAREER_TITLE_MAP
  career-helpers.ts  — onJobAccepted()، onWorkShiftCompleted()
  promotion-engine.ts — checkCareerPromotionEligibility()
  job-career-bridge.ts — calculateJobSalary()، calculateHiringChance()
  career-store.ts    — useCareerStore
```

**۷ سطح شغلی:**
| سطح | min CareerXP | min Reputation | min Shifts | ضریب حقوق |
|-----|-------------|----------------|-----------|-----------|
| intern | 0 | 0 | 0 | 0.6× |
| junior | 100 | 5 | 5 | 1.0× |
| mid | 300 | 15 | 20 | 1.25× |
| senior | 700 | 30 | 60 | 1.6× |
| lead | 1200 | 45 | 120 | 2.0× |
| manager | 1800 | 60 | 200 | 2.3× |
| executive | 3000 | 80 | 350 | 3.0× |

**۸ مسیر شغلی:**
tech · data · design · education · marketing · finance · operations · management

**CareerXP به ازای رویداد:**
- شیفت کامل: +10 XP
- قبول شغل: +30 XP
- موفقیت در مصاحبه: +20 XP
- ماموریت شغلی: +40 XP
- پروژه کامل: +50 XP

---

### ۳.۱۲ بازار سهام (Stock Market)
**وضعیت: ✅ کامل**

**فایل‌های اصلی:**
```
src/game/market/
  types.ts           — Stock، StockHolding، TradeRecord
  market-config.ts   — 6 سهام + طلا
  market-simulation.ts — simulateDailyPrices()
  market-store.ts    — useMarketStore
src/app/stocks/page.tsx — رابط کاربری
```

**۶ سهام ایرانی:**
| نماد | بخش | قیمت اولیه | نوسان |
|------|-----|-----------|-------|
| IKCO | manufacturing | 3,200 | 12% |
| FOLD | manufacturing | 8,500 | 4% سود |
| PRSI | finance | 2,100 | 6% سود |
| HMRH | tech | 11,000 | 5% سود |
| SPHN | services | 4,800 | 3% سود |
| SHZD | construction | 6,200 | 2% سود |

**طلا:** 4,200,000 ت/گرم | کمیسیون: 0.2% (سهام: 0.5%)

**اثر موج روی سهام:**
- tech_boom → tech sector +5%
- recession → همه -4%، طلا +1.5%
- finance_bull → finance +6%
- construction_surge → construction +5%

---

### ۳.۱۳ سیستم هویت بازیکن (Identity)
**وضعیت: ✅ کامل (جدید)**

**فایل‌های اصلی:**
```
src/game/identity/
  types.ts           — PlayerArchetype، PlayerTitle، PlayerReputation، LifePathStep
  archetypes.ts      — 6 آرکتایپ + analyzeArchetype()
  titles.ts          — 16+ عنوان + pickBestTitle()
  reputation.ts      — tier logic + applyReputationEvent()
  lifePath.ts        — مسیر روایی per career track
  identityAnalyzer.ts — analyzeIdentity()
  identityStore.ts   — useIdentityStore
```

**۶ آرکتایپ (از رفتار بازیکن):**
| آرکتایپ | نشانه رفتاری | اثر |
|---------|-------------|-----|
| 🚀 کارآفرین | ریسک بالا، سرمایه‌گذاری زیاد | فرصت ×1.4 |
| 🎓 متخصص | مطالعه زیاد، مهارت بالا | استخدام ×1.3 |
| 💼 کارمند حرفه‌ای | شیفت منظم، شغل ثابت | استخدام ×1.2 |
| 📈 سرمایه‌گذار | پس‌انداز بالا، سرمایه‌گذاری | بازده ×1.2 |
| 🛡️ برنامه‌ریز محافظه‌کار | بدون وام، ریسک کم | — |
| 🌱 در حال کشف | داده کافی نیست | baseline |

**سیستم شهرت (Reputation 0-100):**
| تایر | بازه | رویدادهای مثبت |
|------|------|----------------|
| ناشناس | 0-19 | — |
| قابل اعتماد | 20-39 | شیفت کار: +1 |
| حرفه‌ای | 40-59 | ماموریت: +2 |
| شناخته‌شده | 60-79 | فرصت: +3 |
| ستاره شهر | 80+ | پذیرش شغل: +3 |

**رویدادهای منفی شهرت:** کمبود قسط: -8 | قبض پرداخت نشده: -4 | فرصت شکست‌خورده: -3

**۱۶+ عنوان قابل کسب:**
تازه‌کار → فارغ‌التحصیل → کارمند جوان → برنامه‌نویس مبتدی → توسعه‌دهنده جوان → سرمایه‌گذار تازه‌کار → ریسک‌پذیر → کارآفرین نوپا → شناخته‌شده شهر → ستاره شهر ...

---

### ۳.۱۴ لایه یکپارچه‌سازی (Integration Layer)
**وضعیت: ✅ کامل**

```
src/game/integration/
  daily-integration-pipeline.ts  — خط لوله اصلی
  city-impact-resolver.ts        — CityState → CityGameplayModifiers
  job-city-bridge.ts             — شغل + شهر
  investment-city-bridge.ts      — سرمایه‌گذاری + شهر
  mission-city-bridge.ts         — ماموریت + شهر
  opportunity-generator.ts       — فرصت + شهر
```

**CityGameplayModifiers:**
```typescript
{
  salary:     { multiplierBySector: Record<SectorId, number> }
  hiring:     { hiringChanceModifierBySector, averageHiringBoost }
  investment: { returnModifierByAsset: Record<AssetType, number> }
  economy:    { rentMultiplier, foodPriceMultiplier, transportMultiplier, costOfLivingMultiplier }
}
```

---

### ۳.۱۵ سیستم کارت روزانه
**وضعیت: ✅ کامل**

**فایل:** `src/data/dailyCards.ts`
- ۱۵ کارت رویداد تصادفی (مثبت و منفی)
- `drawRandomCard()` در ابتدای هر روز
- savingsShield: پس‌انداز بالا اثر کارت‌های منفی را کاهش می‌دهد

---

### ۳.۱۶ بازارچه (Marketplace)
**وضعیت: ✅ کامل**

**فایل:** `src/data/marketplaceData.ts`
- MARKET_ITEMS با passive bonuses
- `generateNpcListings()` — لیستینگ‌های NPC هر روز تازه می‌شود
- `buyFromMarket()` / `sellToSystem()` / `buyFromListing()`

---

## بخش ۴ — وضعیت پیاده‌سازی

### ماتریس کامل سیستم‌ها

| سیستم | وضعیت | سطح کامل‌بودن | توضیح |
|-------|--------|--------------|-------|
| Action Engine | ✅ کامل | 95% | sponsored variants، wave modifiers، work salary |
| Mission Engine | ✅ کامل | 90% | story arcs، daily/weekly، achievements، rescue |
| City Engine | ✅ کامل | 90% | 6 sector، 7 wave، 12 events، daily simulation |
| Career System | ✅ کامل | 90% | 8 tracks، 7 levels، promotion engine |
| Job Market V2 | ✅ کامل | 85% | match score، interview، city integration |
| Economy/Banking | ✅ کامل | 90% | loans، savings، interest، bills |
| Opportunity Engine | ✅ کامل | 85% | 12 templates، resolver، city integration |
| Stock Market | ✅ کامل | 80% | 6 stocks، gold، sparklines، wave effects |
| Identity System | ✅ کامل | 85% | archetype، title، reputation، life path |
| Integration Layer | ✅ کامل | 85% | city → jobs/missions/opportunities |
| Fridge/Food | ✅ کامل | 85% | expiry، tiers، city price multiplier |
| Housing/Living | ✅ کامل | 85% | 5 tiers، vehicles، mobile plans |
| Skills/Courses | ✅ کامل | 80% | 10 courses، sponsored variants |
| Daily Cards | ✅ کامل | 80% | 15 cards، savings shield |
| Marketplace | ✅ کامل | 75% | NPC listings، passive bonuses |
| **Time System** | ⚠️ جزئی | 40% | logic هست، UI و محدودیت کامل نیست |
| **Room System** | ⚠️ UI-only | 50% | نمایش هست، ارتقا واقعی نیست |
| **Notifications** | ⚠️ جزئی | 30% | Toast هست، push notification نیست |
| **Multiplayer/Rankings** | ❌ نیست | 0% | UI داریم، backend نداریم |
| **Achievements UI** | ⚠️ جزئی | 60% | preview هست، صفحه کامل نیست |
| **Settings Page** | ❌ نیست | 0% | — |

---

## بخش ۵ — تحلیل حلقه بازی

### حلقه اصلی (Core Loop)
```
ورود بازیکن (هر روز)
    │
    ├─ بررسی وضعیت: energy، hunger، money، ماموریت‌ها
    │
    ├─ انتخاب اکشن روزانه:
    │     ├─ کار (درآمد + XP)
    │     ├─ مطالعه (XP + مهارت)
    │     ├─ ورزش (health + happiness)
    │     ├─ استراحت (energy recovery)
    │     └─ سرمایه‌گذاری (پول + ریسک)
    │
    ├─ بررسی ماموریت‌ها → دریافت جایزه
    │
    ├─ بررسی فرصت‌ها → تصمیم‌گیری
    │
    └─ پایان روز → startNextDay()
           ├─ پیشرفت روایت شهر
           ├─ فرصت‌های جدید
           └─ کارت روزانه
```

### حلقه پیشرفت (Progression Loop)
```
XP → Level up
Career XP + Reputation → Promotion → حقوق بیشتر
Skills + Courses → Job Match Score بالاتر
پول → مسکن بهتر → happiness بیشتر → بهره‌وری بیشتر
Reputation → فرصت‌های بهتر
Archetype → عنوان بهتر
```

### نقاط ضعف حلقه بازی

**۱. زمان غیرفعال:**
محدودیت زمانی واقعی روی اکشن‌ها اعمال نمی‌شود — بازیکن می‌تواند هر تعداد اکشن در یک روز انجام دهد.

**۲. بازخورد فوری کم:**
وقتی اکشن موفق می‌شود، نمایش تغییرات مشهود است ولی داستان‌پردازی بصری ضعیف است.

**۳. ماموریت‌های داستانی:**
Story arcs تعریف شده‌اند ولی روایت نمایش داده شده در UI کم‌عمق است.

**۴. اهداف بلند‌مدت:**
بازیکن همیشه می‌داند برای چه هدف می‌کند — کمبود surprises بلندمدت.

**۵. تعامل اجتماعی:**
سیستم شبکه‌سازی (network_intro فرصت) هست ولی NPC interactions کامل نیست.

---

## بخش ۶ — تحلیل سیستم زمان

### پیاده‌سازی فعلی

**روز بازی:**
- هر روز = ۹۶۰ دقیقه (۱۶ ساعت)
- `player.dayInGame` شمارنده روز است
- `startNextDay()` روز را پیش می‌برد (دستی — بازیکن دکمه می‌زند)

**مصرف زمان اکشن‌ها:**
| اکشن | زمان |
|------|------|
| پیاده‌روی | 30 دقیقه |
| باشگاه | 90 دقیقه |
| مرور سریع | 15 دقیقه |
| جلسه مطالعه | 60 دقیقه |
| پاره‌وقت | 240 دقیقه |
| شیفت کامل | 480 دقیقه |
| اضافه‌کاری | 600 دقیقه |
| چرت | 30 دقیقه |
| خواب کامل | 480 دقیقه |

**آنچه کامل نشده:**
- نمایش دقیقه‌های مصرف‌شده در HUD
- بلاک کردن اکشن‌های ناممکن بر اساس زمان باقی‌مانده
- فازبندی روز (صبح/ظهر/شب)

---

## بخش ۷ — یکپارچگی سیستم‌ها

### جریان `startNextDay()` (ترتیب دقیق)
```
1. player.dayInGame += 1
2. overnight energy recovery (+30% missing)
3. savings interest (0.08% daily)
4. auto loan payments (if due)
5. random card draw + effects
6. weekly bills (با city inflation multipliers)
7. course day advance + session reset
8. inventory passive bonuses
9. fridge expiry check
10. useCityStore.advanceDay()              [شهر پیش می‌رود]
11. runDailyIntegrationPipeline()          [اتصال شهر به همه سیستم‌ها]
12. opportunity: expireStale + generateNew [فرصت‌های جدید]
13. market: advanceMarketDay()             [بازار سهام]
14. mission: initMissionsForNewDay()       [ماموریت‌های جدید]
15. mission: refreshAchievements()         [دستاوردها]
16. identity: recalculate()               [هویت بازیکن]
```

### جریان `executeAction()`
```
1. یافتن category + option
2. resolve sponsored variant یا base option
3. check: energy کافی؟ money کافی؟
4. get wave modifier (effectMult × costMult)
5. work salary override: job.salary ÷ 22 × shiftMul
6. apply costs (energy، money)
7. apply effects با wave multiplier
8. roll risk → اگر triggered، penalty
9. track actionsCompletedToday
10. dispatchGameplayEvent() → missions
11. handleWorkShiftCompleted() → career (if work)
12. applyReputationEvent() → identity (if work)
```

### ماتریس یکپارچگی سیستم‌ها

| سیستم A | → | سیستم B | وضعیت |
|---------|---|---------|--------|
| Action Engine | → | Economy | ✅ کامل |
| Action Engine | → | Mission Engine | ✅ کامل |
| Action Engine | → | Career System | ✅ کامل |
| Action Engine | → | Identity System | ✅ کامل |
| City Engine | → | Job Market | ✅ کامل |
| City Engine | → | Opportunity Engine | ✅ کامل |
| City Engine | → | Economy (bills) | ✅ کامل |
| City Engine | → | Stock Market | ✅ کامل |
| City Engine | → | Mission Engine (events) | ✅ کامل |
| Career System | → | Job Market | ✅ کامل |
| Career System | → | Identity System | ✅ کامل |
| Mission Engine | → | Achievements | ✅ کامل |
| Opportunity Engine | → | Economy | ✅ کامل |
| Opportunity Engine | → | Identity (reputation) | ⚠️ جزئی |
| Stock Market | → | Economy | ✅ کامل |
| Time System | → | Action Engine | ⚠️ جزئی |
| Room System | → | Player Stats | ⚠️ جزئی |

---

## بخش ۸ — مدل‌های داده اصلی

### PlayerState
```typescript
{
  name: string             // "علی رضایی"
  level: number            // سطح بازیکن (1-10+)
  city: string             // "تهران"
  avatar: string           // emoji
  energy: number           // 0-100
  hunger: number           // 0-100
  happiness: number        // 0-100
  health: number           // 0-100
  security: number         // 0-100
  money: number            // موجودی جاری (تومان)
  savings: number          // پس‌انداز
  xp: number               // XP کلی
  xpNext: number           // XP مورد نیاز برای سطح بعد
  stars: number            // ستاره‌های کسب‌شده
  scenario: string         // "فارغ‌التحصیل"
  dayInGame: number        // روز بازی (از 1)
}
```

### BankState
```typescript
{
  checking: number         // حساب جاری
  savings: number          // پس‌انداز
  savingsInterestRate: number  // 0.08%
  loans: ActiveLoan[]
  totalInterestEarned: number
}
```

### ActiveLoan
```typescript
{
  id: string
  loanTypeId: string       // emergency | personal | business | housing
  amount: number           // مبلغ اصلی
  monthlyPayment: number   // قسط ماهانه
  interestRate: number
  remainingInstallments: number
  remainingPrincipal: number
  nextPaymentDay: number
}
```

### Mission
```typescript
{
  id: string
  category: "story" | "daily" | "weekly" | "achievement" | "event" | "rescue"
  status: "locked" | "available" | "active" | "completed" | "claimed" | "archived"
  titleFa: string
  emoji: string
  objectives: MissionObjective[]
  progress: Record<string, number>   // "obj_0": 3
  rewards: { xp?, money?, stars?, energy?, happiness?, titles?, badges? }
  createdAtDay: number
  expiresAtDay?: number
}
```

### Opportunity
```typescript
{
  id: string
  templateId: string
  type: "career" | "economic" | "skill" | "lifestyle" | "city" | "network"
  rarity: "common" | "rare" | "epic"
  status: "active" | "taken" | "expired" | "declined"
  titleFa: string
  costs: { money?, energy?, time? }
  outcomes: { probability, effects }[]
  expiresAtDay: number
}
```

### CityWave
```typescript
{
  id: string                  // tech_boom | recession | ...
  nameFa: string
  emoji: string
  durationDays: number        // 4-10 روز
  globalInflation: number
  investmentBonus: number
  sectorImpacts: Record<SectorId, { salaryDelta, jobsDelta, healthDelta }>
}
```

### CareerProgress
```typescript
{
  track: CareerTrack          // tech | finance | design | ...
  level: CareerLevel          // intern | junior | mid | senior | lead | manager | executive
  careerXp: number
  reputation: number          // 0-100
  yearsOfExperience: number   // بر اساس dayInGame
  totalWorkShifts: number
  totalJobsAccepted: number
  readinessPercent: number    // آمادگی ارتقا
}
```

### PlayerIdentity
```typescript
{
  archetype: PlayerArchetype  // entrepreneur | specialist | professional | investor | safe_planner
  activeTitle: PlayerTitle    // عنوان فعال
  unlockedTitleIds: string[]
  reputation: PlayerReputation  // { value: 0-100, tier }
  lifePath: LifePathStep[]
}
```

### ActionCategory
```typescript
{
  id: string                  // "work" | "study" | "exercise" | ...
  nameFa: string
  emoji: string
  options: ActionOption[]
}

ActionOption = {
  id: string
  nameFa: string
  costs: { energy?, money?, time }
  effects: { key: string, value: number }[]
  risk?: { chance: number, label: string, penalty: { key, value } }
  sponsoredVariant?: SponsoredVariant
}
```

---

## بخش ۹ — صفحات UI

| صفحه | مسیر | اجزا | وضعیت |
|------|------|------|--------|
| خانه | `/` | GameHUD، ActionBottomSheet، RoomObjects، StoryBubble، CityEventBanner، HomeOpportunityWidget | ✅ کامل |
| بازار کار | `/jobs` | JobCardV2، InterviewModal، SmartFilters، CityJobModifiers | ✅ کامل |
| بانک | `/bank` | موجودی، پس‌انداز، وام، تاریخچه | ✅ کامل |
| شهر | `/city` | SectorGrid، CityEventsList، EconomicWave، CityOpportunities | ✅ کامل |
| یخچال | `/fridge` | FOOD_CATALOG، FridgeSlots، expiry | ✅ کامل |
| بازار | `/market` | ItemCard، NPC Listings | ✅ کامل |
| ماموریت‌ها | `/missions` | StoryMissionHero، DailyMissionCard، WeeklyMissionCard، RewardPopup | ✅ کامل |
| فرصت‌ها | `/opportunities` | FeaturedCard، OpportunityCard، DetailsSheet، MarketAlertBanner | ✅ کامل |
| پروفایل | `/profile` | PlayerHeroCard، PlayerFocusCard، ActiveMissionCard، RoomPreviewCard، AchievementsPreviewCard | ✅ بازطراحی شده |
| مهارت‌ها | `/skills` | CourseCard، SkillTree | ✅ کامل |
| زندگی | `/living` | HousingTiers، VehicleTiers، MobilePlans | ✅ کامل |
| سهام | `/stocks` | StockCard، SparklineSVG، TradePanel، GoldSection | ✅ کامل |

### پروفایل — ساختار جدید (۵ بخش):
1. `PlayerHeroCard` — آواتار، نام، Title، Archetype pill، Reputation pill، XP bar، ۳ stat
2. `PlayerFocusCard` — مسیر شغلی + Life Path + آمادگی ارتقا
3. `ActiveMissionCard` — ماموریت فعال با progress bar
4. `RoomPreviewCard` — ۴ آیتم اتاق (۲×۲)
5. `AchievementsPreviewCard` — count badge + ۳ badge برجسته

---

## بخش ۱۰ — کانفیگ اقتصادی کامل

**فایل مرجع: `src/data/economyConfig.ts`**

```typescript
// درآمد کار (بدون شغل)
WORK_INCOME_BASE = {
  part_time:  1_500_000,   // 1.5M
  full_shift: 3_000_000,   // 3M
  overtime:   5_000_000,   // 5M
}

// محاسبه درآمد با شغل:
// income = job.salary / WORK_DAYS_PER_MONTH × shiftMul
// shiftMul: part_time=0.5, full_shift=1.0, overtime=1.6
WORK_DAYS_PER_MONTH = 22

// سرمایه‌گذاری سریع
QUICK_INVEST = {
  small:  { cost: 5_000_000,  grossReturn: 7_000_000,  risk: { chance: 0.35, penalty: -2_000_000 } },
  medium: { cost: 15_000_000, grossReturn: 21_000_000, risk: { chance: 0.45, penalty: -8_000_000 } },
  big:    { cost: 30_000_000, grossReturn: 45_000_000, risk: { chance: 0.50, penalty: -18_000_000 } },
}
// EV: small ≈ +1.3M | medium ≈ +2.4M | big ≈ +6M

// بانک
BANK_SAVINGS_DAILY_RATE = 0.0008   // 0.08% روزانه ≈ 29% سالانه

// تورم
CITY_INFLATION_BOUNDS = { min: 0.8, max: 1.6 }
```

---

## بخش ۱۱ — الگوهای برنامه‌نویسی

### قانون React Hooks
```typescript
// ✅ درست — همه hooks قبل از هر return
export default function MyComponent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const data = useMyStore((s) => s.data);  // ← قبل از mount guard
  if (!mounted) return null;               // ← mount guard بعد از hooks
  // ...
}
```

### جلوگیری از re-render بی‌نهایت
```typescript
// ✅ useShallow برای array/object selectors
const sectors = useCityStore(useShallow((s) => Object.values(s.sectors)));
```

### جلوگیری از Circular Dependency
```typescript
// ✅ lazy require در اکشن‌های store
const { useCityStore } = require("@/game/city/city-store");
const mods = getCityGameplayModifiers(useCityStore.getState());
```

### طراحی بصری
```typescript
// رنگ‌های ثابت
Gold:    "#D4A843" (light: "#F0C966")  — premium/sponsored
Scene:   "#0a0e27"                    — پس‌زمینه تاریک
Card:    "rgba(255,255,255,0.04)"     — کارت شیشه‌ای

// همیشه از tokens.ts استفاده کن
import { colors, sp, radius, font } from "@/theme/tokens";
```

---

## بخش ۱۲ — نقشه راه و قدم‌های بعدی

### آنچه کامل است ✅
- [x] Action Engine با Sponsored Variants
- [x] Mission Engine (daily/weekly/story/achievement)
- [x] City Simulation (6 sector، 7 wave)
- [x] Job Market V2 با Interview
- [x] Career Progression (8 tracks × 7 levels)
- [x] Opportunity Engine (12 templates)
- [x] Stock Market (6 سهام + طلا)
- [x] Game Identity System (archetype/title/reputation/lifePath)
- [x] Banking + Loans + Savings
- [x] Housing + Living Costs
- [x] Integration Pipeline (city → همه سیستم‌ها)

### آنچه نیاز به تکمیل دارد ⚠️
- [ ] Time System UI — نمایش ساعت و محدودیت روزانه
- [ ] Room System — ارتقای واقعی آیتم‌های اتاق با اثر
- [ ] Achievements Page — صفحه کامل دستاوردها
- [ ] Notification System — push notifications
- [ ] Story Arcs UI — نمایش بهتر روایت داستانی
- [ ] Settings Page — تنظیمات بازی

### آنچه نیست ❌
- [ ] Multiplayer / Rankings — backend نیاز دارد
- [ ] Save/Load slots — فعلاً یک ذخیره خودکار
- [ ] Social Features — اشتراک‌گذاری، دوستان
- [ ] Analytics — data collection برای balancing

---

## بخش ۱۳ — راهنمای سریع برای توسعه‌دهنده جدید

### ۵ فایل که باید اول بخوانی
1. `src/stores/gameStore.ts` — همه state و اکشن‌های اصلی
2. `src/data/economyConfig.ts` — همه اعداد مالی
3. `src/data/actionTemplates.ts` — تعریف اکشن‌ها
4. `src/theme/tokens.ts` — سیستم طراحی
5. `src/game/integration/daily-integration-pipeline.ts` — اتصال سیستم‌ها

### فرمول‌های اصلی
```
درآمد شغلی/شیفت = job.salary / 22 × shiftMul (0.5 / 1.0 / 1.6)
اثر اکشن نهایی = effect.value × waveMult
ضریب حقوق با ترفیع = salary × SALARY_MULTIPLIERS[level]
Match Score = XP×0.4 + skills×0.3 + courses×0.15 + cityDemand×0.15
Reputation Change = applyReputationEvent("work_shift_completed") → +1
```

### الگوی صفحه جدید
```typescript
"use client";
import { useGameStore } from "@/stores/gameStore";
import { PageShell } from "@/components/ui";

export default function MyPage() {
  const player = useGameStore((s) => s.player);
  return (
    <PageShell title="عنوان">
      {/* محتوا */}
    </PageShell>
  );
}
```

### الگوی Store جدید
```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MyStoreState {
  data: string;
  setData: (v: string) => void;
}

export const useMyStore = create<MyStoreState>()(
  persist(
    (set) => ({
      data: "initial",
      setData: (v) => set({ data: v }),
    }),
    { name: "shahre-man-my-system" },
  ),
);
```

---

> **مستندات مرتبط:**
> - `docs/ARCHITECTURE.md` — نقشه معماری کامل
> - `docs/ECONOMY_AUDIT.md` — تاریخچه تغییرات اقتصادی
> - `docs/GAME_DESIGN.md` — طراحی بازی
> - `src/data/economyConfig.ts` — مرجع اعداد
