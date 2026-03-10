# Game Economy Audit — Jabolgha
**تاریخ آدیت:** روز ۹۷ توسعه | **آخرین آپدیت:** پس از پیاده‌سازی Career System

---

## وضعیت خلاصه

| بُعد | وضعیت | اولویت رفع |
|------|-------|-----------|
| نسبت درآمد/هزینه | 🔴 شکسته (90:1) | فوری |
| سرمایه‌گذاری | 🔴 EV منفی | فوری |
| اتصال شغل→درآمد | 🔴 جدا هستند | فوری |
| بهره بانکی | 🟡 نادیده‌گرفتنی | میان‌مدت |
| تورم شهری | 🟡 موجود اما بی‌اثر | میان‌مدت |
| اهداف مالی | 🟡 ضعیف | میان‌مدت |
| امتیاز اعتباری | 🟢 وجود ندارد | بلندمدت |
| درآمد غیرفعال | 🟢 وجود ندارد | بلندمدت |

---

## STEP 1 — منابع درآمدی فعلی

### کار (Work Actions) — `src/data/actionTemplates.ts`
| اکشن | درآمد | زمان | یادداشت |
|------|-------|------|---------|
| شیفت پاره‌وقت | +20,000,000 | 240 دقیقه | کم‌ریسک |
| شیفت کامل | +45,000,000 | 480 دقیقه | اصلی‌ترین درآمد |
| اضافه‌کاری | +70,000,000 | 600 دقیقه | ریسک آسیب سلامت |
| **بیشینه روزانه واقعی** | **~45–70M** | یک اکشن/روز | |

> **مشکل:** درآمد کار ثابت است و به شغل/موقعیت بازیکن وابسته نیست.

### سرمایه‌گذاری — **🚨 شکسته**
| اکشن | هزینه | بازگشت | ریسک | EV واقعی |
|------|-------|--------|------|---------|
| کوچک | -5M | +2M | 40% → -3M | **-4.2M** |
| کوچک (Nobitex) | -10M | +5M | 30% → -5M | **-6.5M** |
| متوسط | -15M | +8M | 50% → -10M | **-12M** |
| متوسط (بورس) | -25M | +18M | 40% → -15M | **-13M** |
| بزرگ | -30M | +20M | 60% → -25M | **-25M** |
| بزرگ (Goldman) | -50M | +40M | 50% → -35M | **-27.5M** |

> **علت باگ:** در `executeAction`، `costs.money` کسر می‌شود و سپس `effect.money` اضافه می‌شود.
> سرمایه‌گذار 5M خرج می‌کند و 2M برمی‌گرداند → خالص -3M حتی بدون ریسک.
> **راه‌حل:** بازگشت سرمایه اولیه + سود جداگانه باید حساب شود.

### بهره بانکی — `src/data/mock.ts:353`
```
savingsInterestRate: 0.08  // درصد روزانه
```
- روی 50M پس‌انداز: 40,000/روز = 1.2M/ماه
- در مقابل درآمد کار 45M/روز: **نسبت 0.09٪**
- عملاً نادیده‌گرفتنی

### پاداش ماموریت‌ها
- عمدتاً XP، نه پول مستقیم
- رویدادهای شهری: تا 500K × level — کم است

### فروش آیتم
- فروش به سیستم: 35–50٪ کمتر از قیمت خرید
- بازار ثانویه: وجود دارد اما منفعل است

---

## STEP 2 — سینک‌های پولی فعلی

### مسکن — `src/data/livingCosts.ts`
| نوع | اجاره/ماه | خرید | نسبت به درآمد کار |
|-----|----------|------|-----------------|
| استودیو | 8M | — | **0.5 روز کار** |
| آپارتمان ساده | 15M | 3B | **1 روز کار** |
| آپارتمان میانه | 25M | 6B | **1.7 روز کار** |
| پنت‌هاوس | 50M | 15B | **3.3 روز کار** |
| ویلا | — | 30B | خرید تنها |

### هزینه‌های جاری هفتگی
| دسته | بازه هفتگی | ماهانه |
|------|-----------|--------|
| قبض‌ها (برق+گاز+آب+اینترنت) | 780K–1.2M | 3.1–4.8M |
| خودرو (سوخت+بیمه) | 450K–1.8M | 1.8–7.2M |
| اینترنت موبایل | 50K–500K | 200K–2M |
| **مجموع** | **~1.3–3.5M/هفته** | **~5–14M/ماه** |

> **مشکل:** مجموع هزینه‌های ماهانه ≈ 5–14M در مقابل درآمد ماهانه ≈ 990M (22 روز × 45M)
> **نسبت هزینه به درآمد: کمتر از 2٪** — هیچ فشار مالی‌ای ایجاد نمی‌کند.

### آموزش — یک‌باره
| دوره | هزینه | مدت |
|------|-------|-----|
| پایتون مقدماتی | 2M | 7 روز |
| React پیشرفته | 5M | 10 روز |
| علم داده | 8M | 14 روز |
| مدیریت پروژه | 6M | 10 روز |
| Coursera/Udemy (sponsored) | 2–3× عادی | همان |

### مارکت‌پلیس — یک‌باره
| دسته | بازه قیمت |
|------|----------|
| گوشی | 3–60M |
| لپ‌تاپ | 15–80M |
| مبلمان | 3–45M |
| یخچال | 5–65M |
| PS5 | 25M |

### غذا — جاری ولی ناچیز
| دسته | بازه روزانه |
|------|-----------|
| نان و لبنیات | 35–150K |
| پروتئین | 250–450K |
| میوه و سبزیجات | 50–120K |
| **میانگین روزانه** | **~200–500K** |

---

## STEP 3 — جریان پول واقعی

### اوایل بازی (روز 1–15)
```
درآمد روزانه کار:    20–45M
هزینه جاری روزانه:  ~850K
اجاره روزانه:        ~500K (15M/ماه)
─────────────────────────────
خالص روزانه:         ~18–43M  ✅ خیلی زیاد
```

### میانه بازی (روز 15–45)
```
درآمد روزانه کار:    45M
هزینه روزانه:        ~1.5M
اجاره ماهانه:        25M (≈ 833K/روز)
دوره آموزشی:         5–8M یکبار
─────────────────────────────
خالص روزانه:         ~42M  ✅ خیلی زیاد، هیچ فشاری
```

### اواخر بازی (روز 45+)
```
درآمد روزانه:        70M (اضافه‌کاری)
هزینه روزانه:        ~2M
بهره پس‌انداز:       ~400K (روی 500M)
─────────────────────────────
خالص روزانه:         ~68M  🔴 اقتصاد کاملاً شکسته
```

---

## STEP 4 — مشکلات شناسایی‌شده

### 🔴 حیاتی

#### ۱. نسبت درآمد/هزینه = 90:1
- یک شیفت کامل: 45M
- کل هزینه روزانه: ~500K
- نتیجه: پول بی‌معنی انباشته می‌شود

**هدف سالم:** نسبت 3:1 تا 5:1 (30–40٪ درآمد صرف هزینه‌ها)

#### ۲. سرمایه‌گذاری EV منفی — `src/data/actionTemplates.ts`
- تمام سرمایه‌گذاری‌ها پول از دست می‌دهند
- بازیکن عاقل هیچ‌وقت سرمایه‌گذاری نمی‌کند
- سیستم عملاً بلااستفاده است

#### ۳. شغل و درآمد کار جدا هستند
- `jobListings[].salary`: حقوق پیش‌بینی‌شده شغل
- `actionTemplates work.effects.money`: درآمد واقعی از Work Action
- این دو به هم وصل نیستند — شغل هیچ تأثیری روی درآمد واقعی ندارد
- فایل ارتباط: `src/stores/gameStore.ts → executeAction("work")`

### 🟡 متوسط

#### ۴. تورم City Engine به قیمت‌های بازی متصل نیست
- `getCityGameplayModifiers()` → `economy.foodPriceMultiplier` محاسبه می‌شود
- اما در `fridgeData.ts` و `livingCosts.ts` هیچ‌وقت اعمال نمی‌شود
- فایل‌های مرتبط: `src/game/integration/city-impact-resolver.ts`, `src/stores/gameStore.ts`

#### ۵. بهره بانکی نادیده‌گرفتنی است
- نرخ 0.08٪/روز (≈ 29٪ سالانه) برای ایران منطقی است
- اما در مقابل درآمد کار، بی‌معنی است
- پس از تعادل‌بخشی کار، بهره اهمیت بیشتری پیدا می‌کند

#### ۶. اهداف مالی بلندمدت مشخص نیستند
- بازیکن چرا باید ثروتمند شود؟
- خرید خانه: مکانیک ساده buy/rent
- هیچ هدف بزرگ تعریف‌شده‌ای وجود ندارد

### 🟢 کوچک

#### ۷. غذا انگیزه ارتقا ندارد
- ارزان‌ترین غذا کافی است
- هیچ بونوس معناداری برای غذای بهتر وجود ندارد

#### ۸. امتیاز اعتباری وجود ندارد
- وام‌ها بدون ارزیابی ریسک داده می‌شوند
- تأخیر پرداخت فقط -10 happiness دارد

---

## STEP 5 — وضعیت سیستم بانکی

| قابلیت | فایل | وضعیت |
|--------|------|-------|
| حساب جاری | `gameStore.bank.checking` | ✅ کار می‌کند |
| حساب پس‌انداز | `gameStore.bank.savings` | ✅ کار می‌کند |
| بهره روزانه | `startNextDay()` | ✅ اما نادیده‌گرفتنی |
| وام اضطراری 10M/3% | `loanTypes.ts` | ✅ |
| وام شخصی 30M/2% | `loanTypes.ts` | ✅ |
| وام تجاری 100M/1.8% | `loanTypes.ts` | ✅ |
| وام مسکن 200M/1.5% | `loanTypes.ts` | ✅ |
| پرداخت خودکار اقساط | `startNextDay()` | ✅ |
| سرمایه‌گذاری | `actionTemplates.ts` | 🔴 شکسته |
| امتیاز اعتباری | — | ❌ وجود ندارد |
| بیمه | — | ❌ وجود ندارد |
| پرتفوی سهام | — | ❌ وجود ندارد |

---

## STEP 6 — اهداف طراحی

| معیار | وضعیت فعلی | هدف مطلوب |
|-------|-----------|-----------|
| فشار مالی | ~0٪ | 30–40٪ |
| تصمیمات مالی در روز | 0–1 | 2–3 |
| لایه‌های درآمدی | 2 (کار+بهره) | 5+ |
| هزینه‌ها به‌عنوان ٪ درآمد | <2٪ | 30–40٪ |
| ریسک واقعی | تقریباً صفر | متوسط |

---

## STEP 7 — نقشه راه بهینه‌سازی

### فاز ۱ — MVP Rebalance (اولین قدم)

**الف. کالیبراسیون Work Action**
```typescript
// فعلی:
{ key: "money", value: 20_000_000 }  // part-time
{ key: "money", value: 45_000_000 }  // full shift

// پیشنهاد:
{ key: "money", value: 2_000_000 }   // part-time
{ key: "money", value: 4_500_000 }   // full shift
// یا: درآمد از currentJob.salary گرفته شود
```

**ب. اصلاح سرمایه‌گذاری**
```typescript
// مدل درست: سرمایه برمی‌گردد + سود/ضرر جداست
// کوچک: invest 5M → برمی‌گردد 5M + سود 1.5M (یا ضرر -2M)
// EV مثبت با ریسک واقعی
```

**ج. اتصال شغل به درآمد کار**
```typescript
// در gameStore.ts:
// وقتی کاربر شغل می‌گیرد → currentJob.dailyRate = salary / 22
// work action → درآمد = currentJob.dailyRate (نه ثابت)
// بدون شغل → درآمد پایین (2–3M/روز)
```

### فاز ۲ — Economy Depth

- **تورم پویا:** `foodPriceMultiplier` از City Engine → اعمال در خرید غذا و مسکن
- **Credit Score:** بر اساس نسبت بدهی + تأخیر پرداخت → اثر روی نرخ وام
- **اهداف مالی بزرگ:** خانه اول، خودرو، پس‌انداز بازنشستگی

### فاز ۳ — Strategic Layer

- **بازار سهام پویا:** قیمت متصل به City Waves
- **درآمد غیرفعال:** اجاره ملک دوم، سود سهام
- **کسب‌وکار:** شروع استارتاپ در اواخر بازی

---

## فایل‌های کلیدی برای بهینه‌سازی

| فایل | مشکل مرتبط |
|------|-----------|
| `src/data/actionTemplates.ts` | مقادیر Work income + Investment formula |
| `src/stores/gameStore.ts → executeAction` | اتصال work به currentJob.salary |
| `src/stores/gameStore.ts → startNextDay` | اعمال تورم به هزینه‌ها |
| `src/game/integration/city-impact-resolver.ts` | foodPriceMultiplier محاسبه می‌شه |
| `src/data/fridgeData.ts` | قیمت‌ها باید از multiplier استفاده کنند |
| `src/data/livingCosts.ts` | rentMultiplier باید اعمال شود |
| `src/data/mock.ts → bank.savingsInterestRate` | نرخ بهره (پس از rebalance اهمیت پیدا می‌کند) |

---

## وضعیت سیستم‌های موجود

### سیستم‌هایی که کامل هستند ✅
- City Simulation Engine (6 sector + waves + events)
- Career Progression System (8 track × 7 level)
- Mission Engine (story/daily/weekly/event/achievement)
- Job Market V2 (dark theme, match score, interview modal)
- Banking (checking/savings/loans/interest)
- Fridge & Food System
- Marketplace
- Living Costs

### سیستم‌هایی که نیاز به Rebalance دارند 🔧
- Work Action Income (عدد مستقیم باید به job salary وصل شود)
- Investment Returns (فرمول باید اصلاح شود)
- City Inflation → Actual Prices (اتصال باید برقرار شود)

### سیستم‌هایی که نیاز به پیاده‌سازی دارند 🔲
- Credit Score
- Dynamic Stock Market
- Passive Income (property rental, dividends)
- Insurance System
- Business/Startup Track

---

---

## آپدیت ۱ — Economy Rebalance اجرا شد ✅

**تاریخ اجرا:** جلسه توسعه ۲ | کامیت اخیر

### تغییرات اجراشده

#### ۱. `src/data/economyConfig.ts` — ایجاد شد (Single Source of Truth)
```typescript
WORK_INCOME_BASE = { part_time: 1_500_000, full_shift: 3_000_000, overtime: 5_000_000 }
WORK_DAYS_PER_MONTH = 22
QUICK_INVEST = {
  small:  { cost: 5M, grossReturn: 7M,  riskChance: 0.35, riskPenalty: -2M }  // EV ≈ +1.3M
  medium: { cost: 15M, grossReturn: 21M, riskChance: 0.45, riskPenalty: -8M } // EV ≈ +2.4M
  big:    { cost: 30M, grossReturn: 45M, riskChance: 0.50, riskPenalty: -18M }// EV ≈ +6M
}
STARTUP_SUCCESS_RETURN = 2.5×  |  STARTUP_FAILURE_RETURN = 0.2×
BANK_SAVINGS_DAILY_RATE = 0.08%
```

#### ۲. `src/data/actionTemplates.ts` — درآمد کار و سرمایه‌گذاری اصلاح شد

| اکشن | قبل | بعد |
|------|-----|-----|
| شیفت نیمه‌وقت | +20M | +1.5M |
| شیفت کامل | +45M | +3M |
| اضافه‌کاری | +70M | +5M |

سرمایه‌گذاری‌ها: `effect.money = grossReturn` (اصل + سود برمی‌گردد). EV حالا مثبت است.

#### ۳. `src/stores/gameStore.ts` — اتصال شغل به درآمد کار
```typescript
// وقتی بازیکن شغل دارد:
incomePerShift = job.salary / WORK_DAYS_PER_MONTH × shiftMultiplier
// part_time: 0.5×  |  full_shift: 1.0×  |  overtime: 1.6×
```
شیفت بدون شغل → درآمد پایه از `WORK_INCOME_BASE`

### وضعیت بعد از Rebalance

| بُعد | قبل | بعد |
|------|-----|-----|
| درآمد روزانه پایه | 45M/شیفت | 3M/شیفت |
| درآمد با شغل میانه (حقوق 30M/ماه) | — | ~1.36M/شیفت |
| EV سرمایه‌گذاری کوچک | -4.2M | +1.3M |
| نسبت درآمد/هزینه | 90:1 | ~3:1 (هدف) |
| اتصال شغل→درآمد | ❌ جدا | ✅ متصل |

---

## آپدیت ۲ — Opportunity Engine پیاده‌سازی شد ✅

**تاریخ اجرا:** همان جلسه

### معماری

```
src/game/opportunities/
  types.ts           — OpportunityType, OpportunityStatus, OpportunityRarity, Opportunity, OpportunityTemplate
  seed-opportunities.ts — 12 قالب فرصت (اقتصادی/شغلی/مهارتی/شهری/شبکه/سبک زندگی)
  analyzer.ts        — analyzePlayerOpportunities() → 7 flag boolean
  generator.ts       — generateOpportunitiesForDay() با scoring + رتبه‌بندی
  resolver.ts        — resolveOpportunity() → random roll روی توزیع احتمال
  helpers.ts         — UI helpers فارسی (countdown، ریسک، پیش‌نمایش)
  store.ts           — useOpportunityStore (persist "shahre-man-opportunities")
```

### قالب‌های فرصت (12 عدد)

| شناسه | نوع | سختی | هزینه | EV |
|-------|-----|------|-------|-----|
| `freelance_emergency` | career | common | انرژی+زمان | +12M 60٪ احتمال |
| `cheap_bulk_buy` | economic | common | 20M | +35M/+12M |
| `startup_angel` | economic | rare | 15M | +50M/+20M/0 |
| `discounted_work_tool` | lifestyle | common | 5M | +XP+stars |
| `distressed_real_estate` | lifestyle | epic | 200M | +80M/−20M |
| `teaching_burst` | career | common | انرژی | +8M+reputation |
| `crypto_tip` | economic | rare | 10M | +22M/+12M/+3M |
| `city_contract` | city | rare | 30M | +60M/+20M |
| `network_intro` | network | common | انرژی | +reputation |
| `gold_hedge` | city | rare | 25M | +40M/+22M (recession) |
| `skill_workshop` | skill | common | 3M+زمان | +XP+stars |
| `insider_project` | career | epic | انرژی | +40M+rep+XP |

### قوانین تولید
- حداکثر ۲ فرصت فعال همزمان
- هر روز ۳۰٪ احتمال عدم تولید
- توزیع: ۷۰٪ common / ۲۵٪ rare / ۵٪ epic
- فیلتر بر اساس: پول بازیکن، سطح، اعتبار، موج شهری، مسیر شغلی
- امتیازدهی: Affordability+30، CityAlignment+25، CareerFit+20، Novelty+15، Rarity+10/5

### ادغام با startNextDay
```typescript
oppStore.expireStaleOpportunities(currentDay);
oppStore.generateOpportunitiesForNewDay(currentDay, playerInput);
```

---

## آپدیت ۳ — Opportunity UI پیاده‌سازی شد ✅

### صفحه جدید: `/opportunities`

**تم:** dark scene-bg + ذرات شناور (طلایی/آبی) مثل home و missions

**کامپوننت‌ها:**

| فایل | توضیح |
|------|-------|
| `MarketAlertBanner` | بنر هوشمند بر اساس موج شهری — دلیل حضور فرصت‌ها را توضیح می‌دهد |
| `FeaturedOpportunityCard` | کارت hero با glow بر اساس rarity (طلایی/آبی/خاکستری) |
| `OpportunityCard` | کارت compact با رنگ border بر اساس نوع (سبز/آبی/بنفش/نارنجی/فیروزه/صورتی) |
| `OpportunityDetailsSheet` | باتم‌شیت با probability bar برای هر نتیجه |
| `ExpiringOpportunities` | فرصت‌های در آستانه انقضا (≤۱ روز) |
| `OpportunityHistoryList` | تاریخچه ۵ فرصت اخیر با ✅/❌ |
| `HomeOpportunityWidget` | ویجت کوچک در صفحه خانه با gold border |

**BottomNav:** تب «فرصت‌ها» (💡 Lightbulb) جایگزین تب Jobs شد. Jobs از طریق خانه قابل دسترس است.

---

---

## آپدیت ۴ — City Inflation اتصال پیدا کرد ✅

### تغییرات

#### `src/data/livingCosts.ts`
- `calculateWeeklyBills` پارامتر جدید `BillInflationMultipliers` گرفت:
  ```typescript
  { rent: number; utilities: number; transport: number }
  ```
- اجاره × `rentMultiplier`، قبوض × `costOfLivingMultiplier`، حمل‌ونقل × `transportMultiplier`
- پلن موبایل تغییر نمی‌کند (قرارداد ثابت)

#### `src/stores/gameStore.ts → startNextDay`
- قبل از محاسبه قبض هفتگی، modifiers از City store خوانده می‌شوند (lazy require)
- اگر city store initialize نشده باشد → fallback `{ rent: 1, utilities: 1, transport: 1 }`

#### `src/stores/gameStore.ts → buyFood`
- قیمت غذا با `foodPriceMultiplier` ضرب می‌شود قبل از کسر از حساب

#### جدول تأثیر تورم
| موج شهری | تأثیر تورمی |
|---------|------------|
| `mini_recession` | اجاره +۱۰٪، قبوض +۱۵٪، غذا +۸٪ |
| `startup_wave` | اجاره +۵٪، غذا +۳٪ |
| `saturation` | اجاره -۳٪، قبوض بدون تغییر |
| `recovery` | بازگشت به نرمال |

---

## آپدیت ۵ — Career System در Profile نمایش داده شد ✅

### فایل: `src/components/profile/CareerProfileSection.tsx`

| بخش | محتوا |
|-----|-------|
| Header | عنوان مسیر شغلی + badge رنگی بر اساس سطح |
| Current Role Box | عنوان فارسی شغل + track + سابقه |
| Stats Row (2-col) | شهرت حرفه‌ای (progress bar) + XP شغلی |
| Promotion Readiness | نوار آمادگی ارتقا + badge طلایی در ۱۰۰٪ + نقش بعدی |
| Career Roadmap | اسکرول افقی — همه سطوح با رنگ‌بندی unlocked/locked/current |

**رنگ‌بندی سطوح:**
intern=خاکستری، junior=سبز، mid=آبی، senior=طلایی، lead=نارنجی، manager=بنفش، executive=قرمز

**باگ رفع‌شده:** `useCareerStore()` قبل از `if (!mounted) return null` قرار گرفت (Rules of Hooks)

---

## آپدیت ۶ — بازار سهام پویا پیاده‌سازی شد ✅

### معماری: `src/game/market/`

```
types.ts            — Stock, StockHolding, TradeRecord, GoldState, MarketState
market-config.ts    — 6 سهام ایرانی + seed طلا + commission rates
market-simulation.ts — simulateDailyPrices() با City Wave integration
market-store.ts     — useMarketStore (persist "shahre-man-market")
```

### سهام‌های تعریف‌شده

| شناسه | نام | سکتور | قیمت پایه | نوسان |
|-------|-----|-------|-----------|-------|
| IKCO | ایران خودرو | manufacturing | ۳,۲۰۰ ت | ۱۲٪ |
| FOLD | فولاد مبارکه | manufacturing | ۸,۵۰۰ ت | ۱۰٪ |
| PRSI | بانک پارسیان | finance | ۲,۱۰۰ ت | ۸٪ |
| HMRH | همراه اول | tech | ۱۱,۰۰۰ ت | ۹٪ |
| SPHN | سپاهان | services | ۴,۸۰۰ ت | ۱۱٪ |
| SHZD | پتروشیمی شازند | construction | ۶,۲۰۰ ت | ۱۳٪ |
| طلا | — | — | ۴,۲۰۰,۰۰۰ ت/گرم | ±۱.۵٪ |

### اتصال City Waves → قیمت سهام

| موج | تأثیر |
|-----|-------|
| `tech_boom` | سهام tech +۵٪/روز |
| `recession` | همه سهام -۴٪/روز، طلا +۱.۵٪ |
| `finance_bull` | سهام finance +۶٪/روز |
| `construction_surge` | construction/manufacturing +۵٪/روز |
| `retail_holiday` | retail/services +۴٪/روز |

### Store Actions
- `buyStock(id, shares, day)` → `{ success, cost? }` — کالر مبلغ را از checking کسر می‌کند
- `sellStock(id, shares, day)` → `{ success, proceeds? }` — کالر مبلغ را به checking اضافه می‌کند
- `buyGold(grams, day)` / `sellGold(grams, day)` — مشابه
- `getPortfolioValue()` — ارزش کل پرتفوی در تومان
- `getPortfolioPnL()` — سود/زیان کل unrealized
- کمیسیون: ۰.۵٪ سهام، ۰.۲٪ طلا

### ادغام با startNextDay
```typescript
useMarketStore.getState().advanceMarketDay(
  dayInGame,
  cityMods.investment.returnModifierByAsset,
  cityWaveId,
);
```

### UI: صفحه `/stocks`
- Wave banner: موج فعلی شهر و تأثیر آن بر بازار
- Portfolio summary: ارزش کل + P&L رنگی + موجودی نقد + طلا
- کارت هر سهام: sparkline SVG ۷ روزه + درصد تغییر + تعداد سهام + P&L holding
- Trade panel inline: picker ۱/۵/۱۰/۵۰ سهم + confirm
- Gold section: picker 1g/5g/10g
- Trade history: آخرین ۵ معامله با سود/زیان

---

## وضعیت کامل سیستم‌ها

### ✅ سیستم‌های تکمیل‌شده

| سیستم | فایل‌های اصلی | وضعیت اتصال |
|-------|-------------|------------|
| City Simulation | `src/game/city/` | ✅ کامل |
| Career Progression | `src/game/career/` | ✅ کامل + در Profile نمایش |
| Mission Engine | `src/game/missions/` | ✅ کامل |
| Job Market V2 | `src/components/jobs/`, `/app/jobs` | ✅ کامل |
| Banking | `gameStore.bank` | ✅ کامل |
| Fridge & Food | `fridgeData.ts` | ✅ با تورم City |
| Marketplace | `marketplaceData.ts` | ✅ کامل |
| Living Costs | `livingCosts.ts` | ✅ با تورم City |
| Economy Config | `economyConfig.ts` | ✅ single source of truth |
| Opportunity Engine | `src/game/opportunities/` | ✅ کامل |
| Opportunity UI | `/opportunities` | ✅ کامل |
| **Stock Market** | `src/game/market/` | ✅ کامل + City Wave |
| **Career Profile** | `CareerProfileSection.tsx` | ✅ در `/profile` |
| **City Inflation** | `livingCosts.ts`, `gameStore` | ✅ به قیمت‌ها متصل |

### 🔗 اتصال‌های کلیدی startNextDay

```
startNextDay() flow:
  1. interest → loan payments → card draw
  2. weekly bills (با City inflation multipliers)
  3. city advance → integration pipeline
  4. opportunity engine (expire + generate)
  5. stock market advance (با City wave modifiers)
  6. mission init + achievements
```

### 🔲 باقی‌مانده

| قابلیت | اولویت | توضیح |
|--------|--------|-------|
| Credit Score | متوسط | بر اساس وام + تأخیر → اثر روی نرخ وام |
| Dividend Income | متوسط | سود تقسیمی روزانه سهام → checking |
| Opportunity ↔ Mission | کم | فرصت‌ها در پیشرفت ماموریت شرکت کنند |
| Insurance System | کم | بیمه عمر/خودرو/سلامت |

---

*آخرین آپدیت: جلسه توسعه ۳ | Claude Sonnet 4.6 | پروژه Jabolgha*
