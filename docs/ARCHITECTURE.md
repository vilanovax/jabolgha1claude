# Jabolgha — نقشه کامل معماری پروژه

> آخرین بروزرسانی: ۱۴۰۴ (مارچ ۲۰۲۶)
> پلتفرم: Next.js 16.1.6 (App Router) + React 19 + TypeScript + Zustand 5
> زبان UI: فارسی (RTL) — موبایل‌اول (PWA، maxWidth: 430px)

---

## ساختار کلی

```
src/
├── app/          ← صفحات Next.js (13 صفحه)
├── components/   ← کامپوننت‌های React (83 فایل)
├── data/         ← کاتالوگ داده و کانفیگ اقتصادی (11 فایل)
├── engine/       ← موتور شبیه‌ساز اقتصادی قدیمی (7 فایل)
├── game/         ← سیستم‌های اصلی بازی (56 فایل)
├── hooks/        ← React Hookهای سفارشی (1 فایل)
├── stores/       ← Zustand Store مرکزی (1 فایل)
└── theme/        ← توکن‌های طراحی (1 فایل)
```

**مجموع: ~173 فایل TypeScript/TSX**

---

## لایه ۱ — صفحات (`src/app/`)

| مسیر | نام صفحه | نقش |
|------|---------|-----|
| `/` | خانه | هاب اصلی بازی — stats، actions، روتین روزانه |
| `/jobs` | بازار کار | Job Market V2 با match score و interview |
| `/bank` | بانک | پس‌انداز، وام، تاریخچه تراکنش |
| `/city` | شهر | شبیه‌سازی اقتصادی شهر — بخش‌ها، موج‌ها، رویدادها |
| `/fridge` | یخچال | مدیریت غذا و تغذیه |
| `/market` | بازار | خرید و فروش با NPCها |
| `/missions` | ماموریت‌ها | ماموریت‌های روزانه، هفتگی، داستانی |
| `/opportunities` | فرصت‌ها | فرصت‌های پویا بر اساس شهر |
| `/profile` | من | پروفایل بازیکن — هویت، مسیر شغلی |
| `/skills` | مهارت‌ها | درس‌ها و مهارت‌های حرفه‌ای |
| `/living` | زندگی | مسکن، وسیله نقلیه، قبوض |
| `/stocks` | سهام | بازار سهام و سرمایه‌گذاری |

---

## لایه ۲ — کامپوننت‌ها (`src/components/`)

### `ui/` — سیستم طراحی مشترک
```typescript
PageShell      // قاب کامل صفحه با BottomNav
TabBar         // تب‌های ناوبری
Toast          // اعلان‌های لحظه‌ای
ChipFilter     // دکمه‌های فیلتر
ItemCard       // کارت نمایش آیتم
BalanceBar     // نوار پیشرفت رنگی
StatBar        // نمایش آمار با مقدار
```

### `layout/` — چارچوب صفحه
```
TopHeader.tsx   ← نوار بالای صفحه
BottomNav.tsx   ← ناوبری پایین (home، ماموریت‌ها، فرصت‌ها، شهر، من)
```

### `home/` — صفحه خانه

| کامپوننت | نقش |
|---------|-----|
| `GameHUD` | HUD بازی — vital bars + منابع + Economy Row + Life Status |
| `RoomObjects` | آیتم‌های تعاملی اتاق (۶ شیء قابل کلیک) |
| `RoomShop` | Bottom sheet خرید آیتم‌های اتاق |
| `ActionBottomSheet` | منوی اکشن‌های قابل اجرا |
| `StoryBubble` | دیالوگ روایی |
| `CityEventBanner` | بنر رویداد شهری |
| `EndOfDaySummary` | خلاصه روزانه |
| `DailyCardModal` | کارت رویداد تصادفی روزانه |
| `HomeOpportunityWidget` | ویجت فرصت‌های ویژه |

**GameHUD — ۳ ردیف:**
- ردیف ۱: StatBarهای ⚡/🍔/😊/❤️ با انیمیشن warn
- ردیف ۲: 💰 پول + ✨ سطح + ⭐ ستاره + روز + دکمه پایان
- ردیف ۳ (Economy Row): 📈 درآمد/شیفت · 💸 هزینه/روز · 📦 تحویل‌های در راه · وضعیت زندگی

### `commerce/` — سیستم خرید یکپارچه ⭐ جدید

| کامپوننت | نقش |
|---------|-----|
| `CommerceItemCard` | کارت مشترک آیتم — badge اثر، قیمت نسبی، state‌های مختلف |
| `PhoneCommerceSheet` | گوشی — تب سفارش غذا / فروشگاه آنلاین / تاکسی |
| `JomehBazaarSheet` | جمعه‌بازار — تم سبز، ۲۰٪ ارزان‌تر، هزینه انرژی |
| `VendorStoreSheet` | Bottom sheet عمومی برای هر vendor با category filter |

### `jobs/` — بازار کار

| کامپوننت | نقش |
|---------|-----|
| `JobCardV2` | کارت شغل با Match Score قابل گسترش |
| `InterviewModal` | فرایند مصاحبه سه‌مرحله‌ای (loading→question→result) |
| `CityEconomyBanner` | وضعیت اقتصادی شهر |
| `SmartFilters` | فیلتر هوشمند (همه/مناسب‌من/داغ/ویژه) |
| `CareerProfileCard` | نمایش مسیر شغلی بازیکن |

**Match Score:** XP 40% + مهارت‌ها 30% + دوره‌ها 15% + تقاضای شهر 15%

### `opportunities/` — فرصت‌ها

| کامپوننت | نقش |
|---------|-----|
| `FeaturedOpportunityCard` | فرصت برجسته با border بر اساس نادری |
| `OpportunityCard` | کارت معمولی — countdown، risk badge، chain badge |
| `OpportunityDetailsSheet` | bottom sheet جزئیات با نمودار احتمال |
| `MarketAlertBanner` | هشدار بر اساس موج فعلی |
| `HomeOpportunityWidget` | ویجت صفحه خانه |

### `profile/` — پروفایل بازیکن (۵ بخش فعال)

| کامپوننت | نقش |
|---------|-----|
| `PlayerHeroCard` | آواتار، Title، Archetype، Reputation، XP bar |
| `PlayerFocusCard` | Life Path + آمادگی ارتقا |
| `ActiveMissionCard` | ماموریت فعال |
| `RoomPreviewCard` | پیش‌نمایش اتاق |
| `AchievementsPreviewCard` | دستاوردها |

---

## لایه ۳ — داده (`src/data/`)

| فایل | محتوا |
|-----|-------|
| `economyConfig.ts` | **Single source of truth** — WORK_INCOME_BASE، QUICK_INVEST، WORK_DAYS_PER_MONTH |
| `actionTemplates.ts` | ۷ دسته اکشن با variant اسپانسری + WAVE_ACTION_MODIFIERS |
| `mock.ts` | داده‌های اولیه، `toPersian()`، `formatMoney()` |
| `roomItems.ts` | **جدید** — RoomItem catalog (13 آیتم، ۵ دسته، ۴ tier)، `getRoomBuffs()` |
| `vendors.ts` | **جدید** — VendorDefinition (4 vendor)، priceMultiplier، deliveryDays |
| `purchasables.ts` | **جدید** — PurchasableItem، adapter از room/market/food، `getPurchasablesForVendor()` |
| `fridgeData.ts` | FOOD_CATALOG (24 آیتم)، FRIDGE_TIERS (7 tier)، SmartFeature enum، FoodQuality |
| `brandModifiers.ts` | **جدید** — BRAND_MODIFIERS: shelf life، effect bonus، price/delivery discount |
| `foodCombos.ts` | **جدید** — 9 کومبو، `detectCombo()` |
| `livingCosts.ts` | HOUSING_TIERS، `calculateWeeklyBills(BillInflationMultipliers)` |
| `loanTypes.ts` | LOAN_TYPES، `calculateMonthlyPayment()` |
| `dailyCards.ts` | ۳۰+ کارت رویداد، `drawRandomCard()` |
| `marketplaceData.ts` | MARKET_ITEMS، `generateNpcListings()` |

### کانفیگ اقتصادی
```typescript
WORK_INCOME_BASE = { part_time: 1_500_000, full_shift: 3_000_000, overtime: 5_000_000 }
WORK_DAYS_PER_MONTH = 22
QUICK_INVEST = {
  small:  { cost: 5M,  grossReturn: 7M  }   // EV: +1.3M، ریسک ۳۵٪
  medium: { cost: 15M, grossReturn: 21M }    // EV: +2.4M، ریسک ۴۵٪
  big:    { cost: 30M, grossReturn: 45M }    // EV: +6M، ریسک ۵۰٪
}
```

### سیستم آیتم‌های اتاق (roomItems.ts) ⭐ جدید

**۱۳ آیتم** در ۵ دسته با اثرات روزانه:

| دسته | اثر | مثال |
|-----|-----|------|
| work | workIncomeMultiplier (ضربی) | مانیتور دوم +20% |
| study | learningSpeedMultiplier (ضربی) | میز تحریر +25% |
| energy | dailyEnergyBonus (جمعی) | قهوه‌ساز +10 |
| lifestyle | dailyHappinessBonus (جمعی) | کنسول بازی +12 |
| decor | dailyHappinessBonus (جمعی) | گیاه آپارتمانی +3 |

**۴ Tier اتاق:**
- 0 آیتم → اتاق خوابگاهی (خاکستری)
- 2 آیتم → اتاق دانشجویی (آبی)
- 5 آیتم → اتاق حرفه‌ای (بنفش)
- 8 آیتم → آپارتمان کامل (طلایی)

`getRoomBuffs(ownedIds[])` — اثرات multiplier با **ضرب** و اثرات bonus با **جمع** ترکیب می‌شوند.

### سیستم Vendor (vendors.ts) ⭐ جدید

| VendorId | نام | کانال | قیمت | تحویل | انرژی |
|---------|-----|------|------|-------|-------|
| `online_store` | دیجی‌مال | آنلاین | +5٪ | 2 روز | 0 |
| `food_delivery` | سفارش غذا | آنلاین | +20٪ | همان روز | 0 |
| `jomeh_bazaar` | جمعه‌بازار | فیزیکی | -20٪ | فوری | 15 |
| `ride_service` | تاکسی | آنلاین | base | فوری | 0 |

---

## لایه ۴ — موتور قدیمی (`src/engine/`)

سیستم قدیمی — بیشتر توسط City Engine جایگزین شده. برای سازگاری نگه داشته شده.

| فایل | نقش |
|-----|-----|
| `types.ts` | EconomicIndicators (6 شاخص)، WavePhase |
| `economicIndicators.ts` | `driftIndicators()` |
| `waveSystem.ts` | فازهای موج قدیمی |
| `playerBehavior.ts` | `simulateBehavior()` |
| `triggerEngine.ts` | `evaluateTriggers()` |
| `impactEngine.ts` | `applyEventImpacts()` |

---

## لایه ۵ — سیستم‌های بازی (`src/game/`)

**قلب معماری** — هر زیرسیستم مستقل، persist‌شده، و با lazy require وصل می‌شود.

---

### `missions/` — موتور ماموریت
**Store:** `useMissionStore` — persist: `"shahre-man-missions"`

| فایل | نقش |
|-----|-----|
| `types.ts` | Mission، MissionCategory، MissionObjective (14 نوع) |
| `store.ts` | state + actions |
| `analyzer.ts` | `analyzePlayerForMissions()` |
| `progress.ts` | `updateMissionProgress()` |
| `rewards.ts` | `scaleMissionRewards()` |
| `selector.ts` | `generateMissionsForNewDay()` |
| `story-arcs.ts` | STORY_ARCS — داستان‌های چند اپیزودی |
| `achievements.ts` | catalog دستاوردها |
| `templates.ts` | قالب‌های روزانه، هفتگی، رویداد، نجات |
| `helpers.ts` | `getRecommendedMission()` — priority: completed > rescue > daily > story |

**Integration:** `executeAction()` → `dispatchGameplayEvent()` → `processGameplayEvent()`

---

### `city/` — شبیه‌ساز شهر
**Store:** `useCityStore` — persist: `"shahre-man-city"`

| فایل | نقش |
|-----|-----|
| `types.ts` | SectorId (6)، CityWave، CityEvent، CityState |
| `city-simulation.ts` | `runDailySimulation()` |
| `seed-waves.ts` | ۷ آرکتایپ موج |
| `seed-events.ts` | ۱۲ قالب رویداد |
| `wave-engine.ts` | انتقال فاز موج |
| `event-generator.ts` | تولید رویداد |

**۶ بخش:** فناوری · ساختمان · خدمات · تولید · آموزش · تجارت

**۷ موج:** stability · tech_boom · startup_surge · finance_bull · construction_surge · retail_holiday · recession

---

### `career/` — پیشرفت شغلی
**Store:** `useCareerStore` — persist: `"shahre-man-career"`

- **۸ مسیر:** tech · data · design · education · marketing · finance · operations · management
- **۷ سطح:** intern → junior → mid → senior → lead → manager → executive
- **SALARY_MULTIPLIERS:** intern 0.6× → executive 3.0×
- **CAREER_TITLE_MAP:** 8 track × 7 level = 56 عنوان فارسی

---

### `opportunities/` — موتور فرصت پیشرفته ⭐ ارتقا
**Store:** `useOpportunityStore` — persist: `"shahre-man-opportunities"`

| فایل | نقش |
|-----|-----|
| `types.ts` | OutcomeTier، OpportunityContextProfile، OpportunityMemory، chain fields |
| `seed-opportunities.ts` | **20 قالب** — 15 معمولی + 5 chain step |
| `chains.ts` | 3 زنجیره: freelance_ladder، startup_path، bulk_trade |
| `scoring.ts` | **فرمول 6 عاملی** — Relevance×0.30 + CityFit×0.20 + Affordability×0.15 + IdentityMatch×0.15 + Novelty×0.10 + Excitement×0.10 |
| `analyzer.ts` | OpportunityContextProfile — liquidityLevel، riskTolerance، careerMomentum، identityArchetype |
| `generator.ts` | Phase 1: chain injection → Phase 2: weighted random با scoring |
| `resolver.ts` | roll احتمال تجمعی + inferOutcomeTier |
| `store.ts` | memory، pendingChainTemplateIds، recentlyResolvedTemplateIds |

**Generation Flow:**
```
Phase 1: inject pendingChainTemplateIds (priority, source="chain")
Phase 2: if room < 2 active:
  30% skip → else score all eligible → rarity roll 70/25/5% → weighted select
```

**Chain System:**
```
freelance_ladder: کار فریلنس → قرارداد → مشتری بلندمدت (big_win trigger)
startup_path:    سرمایه‌گذاری استارتاپ → فالوآپ → خروج (small_win+)
bulk_trade:      خرید عمده → فروش مجدد (any non-setback)
```

---

### `integration/` — خط لوله یکپارچه‌سازی
**فراخوانی‌شده در `startNextDay()` بعد از advanceDay شهر.**

| فایل | نقش |
|-----|-----|
| `city-impact-resolver.ts` | CityState → CityGameplayModifiers |
| `daily-integration-pipeline.ts` | `runDailyIntegrationPipeline()` |
| `job-city-bridge.ts` | `enrichJobListingsWithCity()`، `calcHiringProbability()` |
| `investment-city-bridge.ts` | `calculateInvestmentOutcome()` |
| `mission-city-bridge.ts` | `generateCityEventMissions()` |
| `opportunity-generator.ts` | `generateCityOpportunities()` |

**CityGameplayModifiers:**
```typescript
{
  salary:     { multiplierBySector: Record<SectorId, number> }
  hiring:     { hiringChanceModifierBySector, averageHiringBoost }
  investment: { returnModifierByAsset: Record<string, number> }
  economy:    { rentMultiplier, foodPriceMultiplier, transportMultiplier, costOfLivingMultiplier }
}
```

---

### `market/` — بازار سهام
**Store:** `useMarketStore` — persist: `"shahre-man-market"`

**۶ سهام ایرانی + طلا:**
- IKCO (تولید) · FOLD (تولید) · PRSI (مالی) · HMRH (فناوری) · SPHN (خدمات) · SHZD (ساختمان)
- طلا: 4,200,000 ت/گرم، کمیسیون 0.2% در مقابل 0.5% سهام

**اثر موج:** tech_boom→tech+5%، recession→همه-4%+طلا+1.5%، finance_bull→finance+6%

---

### `identity/` — هویت بازیکن
**Store:** `useIdentityStore` — persist: `"shahre-man-identity"`

- **۶ Archetype:** entrepreneur · specialist · professional · investor · safe_planner · undecided
- **۱۶+ عنوان:** باز می‌شوند از level، money، savings، reputation، skill، career track
- **Reputation Tiers:** ناشناس(0-19) → ستاره شهر(80+)
- **Life Path:** مسیر روایی per track

---

### `purchase/` — موتور خرید ⭐ جدید
**Pure functions — بدون Zustand**

| فایل | نقش |
|-----|-----|
| `purchaseEngine.ts` | `getPurchaseQuote()` — محاسبه قیمت نهایی + انرژی + تحویل |
| | `validatePurchase()` — بررسی ownership، level، پول، انرژی |
| | `getImmediateStatsDelta()` — اثرات فوری |

---

### `events/` + `actions/`
| فایل | نقش |
|-----|-----|
| `events/eventBus.ts` | `dispatchGameplayEvent()` — ارتباط cross-system |
| `actions/actionEventMap.ts` | نگاشت اکشن‌ها به رویدادهای ماموریت |

---

## لایه ۶ — Store مرکزی (`src/stores/gameStore.ts`)

**Zustand Store:** `useGameStore` — persist: `"shahre-man-game"`

### State اصلی:
```typescript
player:            { level, energy, hunger, happiness, health, xp, stars, dayInGame,
                     mealsToday: {breakfast, lunch, dinner, snackCount},  // جدید
                     currentMealHistory: string[] }                        // جدید
bank:              { checking, savings, loans, savingsInterestRate, ... }
job:               { title, salary, type, ... }
skills:            { hard: Skill[], soft: Skill[] }
living:            { housingId, vehicleId, mobilePlanId, lastBillDay }
fridge:            { tierId, items: FridgeSlot[] }   // FridgeSlot.spoiled جدید
inventory:         string[]         // MarketItem IDs
roomItems:         string[]         // RoomItem IDs
pendingDeliveries: PendingDelivery[] // سفارش‌های در راه
```

### اکشن‌های کلیدی:
```typescript
executeAction(categoryId, optionIndex, useSponsored?)  // اکشن روزانه
startNextDay()                                          // تیک روزانه
enrollCourse / completeSession / dropCourse
depositToSavings / withdrawFromSavings / takeLoan
upgradeHousing / upgradeVehicle / changeMobilePlan
buyFood / eatFood / upgradeFridge
buyFromMarket / sellToSystem
buyRoomItem(itemId)                                     // جدید
purchaseItem(purchasableId, vendorId)                   // جدید — سیستم vendor
```

---

## جریان `startNextDay()`

```
1. بهره پس‌انداز + پرداخت اقساط وام
2. drawRandomCard() → اعمال اثرات
3. قبوض هفتگی (با BillInflationMultipliers از شهر)
4. پیشرفت دوره + reset sessions
5. Inventory passive bonuses → Room item daily buffs
6. Commerce: fulfill arrived deliveries → inventory/roomItems ← جدید
7. Fridge: expire items
8. useCityStore.advanceDay()
9. runDailyIntegrationPipeline() (city→jobs/missions/opportunities)
10. useOpportunityStore: expireStale + generateNew
11. useMarketStore.advanceMarketDay()
12. useMissionStore: initMissionsForNewDay + refreshAchievements
13. useIdentityStore.recalculate()
```

---

## جریان `executeAction()`

```
executeAction(categoryId, optionIndex, useSponsored?)
  ├─ Resolve sponsored OR base option
  ├─ Check: energy + money کافی؟
  ├─ WAVE modifier: effectMult × costMult
  ├─ Work income: job.salary÷22 × shiftMul × roomBuffs.workIncomeMultiplier
  ├─ Study XP: totalXp × roomBuffs.learningSpeedMultiplier
  ├─ Apply effects → player + bank
  ├─ Roll risk → penalty اگر triggered
  ├─ dispatchGameplayEvent() → mission tracking
  ├─ handleWorkShiftCompleted() → career XP
  └─ applyReputationEvent("work_shift_completed") → identity
```

---

## Storeهای Zustand

| Store | Persist Key | محتوا |
|-------|------------|-------|
| `useGameStore` | shahre-man-game | حالت اصلی |
| `useMissionStore` | shahre-man-missions | ماموریت‌ها + دستاوردها |
| `useCityStore` | shahre-man-city | شبیه‌ساز شهر |
| `useCareerStore` | shahre-man-career | پیشرفت شغلی |
| `useOpportunityStore` | shahre-man-opportunities | فرصت‌ها |
| `useMarketStore` | shahre-man-market | بازار سهام |
| `useIdentityStore` | shahre-man-identity | هویت بازیکن |

---

## الگوهای معماری

### ۱. جلوگیری از Circular Dependency
```typescript
// lazy require داخل body اکشن‌های store
const { useCityStore } = require("@/game/city/city-store");
```

### ۲. Mounted Guard — همه Hooks قبل از Guard
```typescript
export default function MyComponent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const store = useMyStore();   // ← قبل از guard
  if (!mounted) return null;    // ← guard بعد از hooks
}
```

### ۳. جلوگیری از Re-render بی‌نهایت
```typescript
// برای selectors که array/object برمی‌گردانند
const sectors = useCityStore(useShallow((s) => Object.values(s.sectors)));
```

### ۴. Room Buffs — ترکیب اثرات
```typescript
// multiplierها ضربی (stack می‌شوند)، bonusها جمعی
workIncomeMultiplier = chair(1.10) × monitor(1.20) × internet(1.15) = 1.518
dailyEnergyBonus = coffee(10) + ac(15) + bike(8) = 33
```

### ۵. Commerce — دو کانال
```typescript
// آنلاین: بدون انرژی، تأخیر تحویل، قیمت بالاتر
// فیزیکی: انرژی خرج می‌شود، فوری، قیمت پایین‌تر
quote = getPurchaseQuote(item, vendorId, context)
// → finalPrice = item.basePrice × vendor.priceMultiplier
// → energyCost = vendor.channelType === "physical" ? vendor.energyCostToVisit : 0
// → deliveryDay = currentDay + vendor.deliveryDays
```

---

## وضعیت پیاده‌سازی

| سیستم | وضعیت | یادداشت |
|-------|--------|---------|
| Action Engine | ✅ کامل | ۷ دسته، اسپانسری، ریسک، مدیفایر موج |
| Mission Engine | ✅ کامل | ۳ داستان، daily/weekly/rescue/achievement |
| City Simulation | ✅ کامل | ۶ بخش، ۷ موج، ۱۲ رویداد |
| Career Progression | ✅ کامل | ۸ مسیر، ۷ سطح، ۵۶ عنوان |
| Stock Market | ✅ کامل | ۶ سهام + طلا، wave boosts |
| Identity System | ✅ کامل | ۶ آرکتایپ، ۱۶+ عنوان، اعتبار |
| Opportunity Engine | ✅ کامل | **20 قالب، chains، 6-factor scoring** |
| Room Items | ✅ کامل | **13 آیتم، 4 tier، daily buffs** |
| Commerce / Vendor | ✅ کامل | **4 vendor، delivery queue، دو کانال** |
| Game Economy HUD | ✅ کامل | **Economy Row، Life Status، delivery badge** |
| Banking & Loans | ✅ کامل | بهره، وام، پرداخت خودکار |
| Living Costs | ✅ کامل | ۴ مسکن، ۳ خودرو، تورم شهری |
| Education / Courses | ✅ کامل | ۱۵ دوره، session، اسپانسری |
| Fridge & Food | ✅ کامل | ۳۰+ غذا، tier، انقضا |
| Marketplace | ⚠️ ناقص | آیتم‌ها کار می‌کند؛ P2P = stub |
| Leisure Activities | ✅ کامل | ۱۲ فعالیت |
| Daily Card System | ✅ کامل | ۳۰+ رویداد، سپر پس‌انداز |
| Integration Layer | ✅ کامل | City↔jobs/missions/opportunities |
| Legacy Engine | 🗑️ مرده | برای سازگاری نگه داشته |

---

## نقشه یکپارچگی

| یکپارچگی | وضعیت |
|---------|--------|
| City → Jobs | ✅ حقوق × multiplier شهر |
| City → Living Costs | ✅ مضرب‌ها در startNextDay |
| City → Stocks | ✅ sector boosts موج |
| City → Invest | ✅ مضرب بازده/ریسک |
| City → Missions | ✅ تولید ماموریت رویداد |
| City → Opportunities | ✅ scoring factor موج |
| Action → Missions | ✅ dispatchGameplayEvent |
| Action → Career | ✅ handleWorkShiftCompleted |
| Action → Identity | ✅ applyReputationEvent |
| Room Items → Income | ✅ workIncomeMultiplier در executeAction |
| Room Items → Study | ✅ learningSpeedMultiplier در completeSession |
| Room Items → Daily | ✅ dailyEnergyBonus در startNextDay |
| Commerce → Inventory | ✅ immediate یا delivery queue |
| Opportunity → Career | ❌ careerXp dispatch stub |
| Stocks → Missions | ❌ معاملات mission event فایر نمی‌کنند |
| Loan Default → Jobs | ❌ جریمه اعتبار دارد؛ از دست دادن شغل ندارد |

---

## مدل اقتصادی بازی

### درآمد

| منبع | مقدار | یادداشت |
|------|-------|---------|
| فریلنس پاره‌وقت | ۱.۵M/اکشن | بدون شغل |
| فریلنس شیفت کامل | ۳M/اکشن | |
| اضافه‌کاری | ۵M/اکشن | |
| حقوق شغلی | `salary ÷ 22 × shiftMul × roomBuff` | |
| حقوق ماهانه | ۴۰M – ۱۵۰M | بسته به track + level |
| سرمایه‌گذاری کوچک | EV +1.3M (ورود 5M) | ریسک ۳۵٪ |
| بهره پس‌انداز | ۰.۰۸٪/روز ≈ ۲۹٪ سالانه | |
| جوایز ماموریت | ۵M – ۵۰M | |
| فرصت‌های ویژه | ۶M – ۸۰M | |

### هزینه

| هزینه | مقدار | تناوب |
|-------|-------|-------|
| قبوض هفتگی | ۵M – ۲۰M | هفتگی |
| خرید غذا (فروشگاه) | ۵۰۰K – ۳M | هر بار |
| خرید غذا (delivery) | +20٪ | |
| خرید غذا (جمعه‌بازار) | -20٪ + ۱۵ انرژی | |
| آیتم‌های اتاق | ۸۰۰K – ۹M | یک‌بار |
| اقساط وام | ۱.۱M – ۴.۲M | ماهانه |
| موجودی اولیه | ۶۲.۵M | ۱۲.۵M checking + ۵۰M savings |

---

## مشکلات شناخته‌شده و اولویت‌ها

### اولویت بالا
1. **Stocks → Missions** — معاملات سهام mission event فایر نمی‌کنند
2. **Opportunity → Career** — careerXp ارسال نمی‌شود
3. **Game-over / fail state** — بازیکن نمی‌تواند ورشکست شود
4. **Loan default → Jobs** — از دست دادن شغل پیاده نشده

### اولویت متوسط
5. Marketplace P2P UI
6. بررسی اعتبار وام
7. صفحه آمار تاریخی

### بدهی فنی
8. `require()` تنبل → باید event bus بشود
9. پوشه legacy `/engine/` حذف شود
10. `player.money` / `player.savings` منسوخ — از `bank.*` استفاده کنید
