# Jabolgha — Component & Architecture Reference

> تمام کامپوننت‌ها، ماژول‌های بازی، داده‌ها و سیستم‌ها

---

## فهرست مطالب

1. [ساختار پروژه](#ساختار-پروژه)
2. [Stores (state management)](#stores)
3. [کامپوننت‌های Home](#home-components)
4. [کامپوننت‌های City](#city-components)
5. [کامپوننت‌های Missions](#mission-components)
6. [کامپوننت‌های Jobs](#job-components)
7. [کامپوننت‌های Layout](#layout-components)
8. [کامپوننت‌های UI (Shared)](#ui-components)
9. [کامپوننت‌های Profile](#profile-components)
10. [ماژول‌های Game Engine (src/game/)](#game-engine-modules)
11. [ماژول‌های Legacy Engine (src/engine/)](#legacy-engine)
12. [فایل‌های داده (src/data/)](#data-files)
13. [صفحات (src/app/)](#pages)
14. [الگوهای معماری](#patterns)

---

## ساختار پروژه

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home (/)
│   ├── city/page.tsx       # City (/city)
│   ├── jobs/page.tsx       # Job Market (/jobs)
│   ├── bank/page.tsx       # Banking (/bank)
│   ├── fridge/page.tsx     # Fridge (/fridge)
│   ├── market/page.tsx     # Marketplace (/market)
│   ├── living/page.tsx     # Living Costs (/living)
│   ├── missions/page.tsx   # Missions (/missions)
│   ├── profile/page.tsx    # Profile (/profile)
│   └── skills/page.tsx     # Skills (/skills)
│
├── components/
│   ├── home/               # Home page components
│   ├── city/               # City page components
│   ├── missions/           # Mission UI components
│   ├── jobs/               # Job market components
│   ├── layout/             # TopHeader, BottomNav
│   ├── ui/                 # Shared design-system components
│   └── profile/            # Profile page sections
│
├── game/
│   ├── missions/           # Mission Engine (types, store, templates, progress...)
│   ├── city/               # City Simulation Engine
│   ├── integration/        # Integration Layer (city → jobs/investment/missions)
│   ├── events/             # Event Bus
│   └── actions/            # Action → Event mapping
│
├── engine/                 # Legacy tick-based economic simulation
├── stores/
│   └── gameStore.ts        # Main Zustand store
├── data/                   # Static game data catalogs
└── theme/
    └── tokens.ts           # Design tokens
```

---

## Stores

### `useGameStore` — `src/stores/gameStore.ts`
**Persist key**: `"shahre-man-game"`

اصلی‌ترین store بازی. تمام state بازیکن و جهان اینجاست.

| بخش | فیلدها |
|-----|--------|
| بازیکن | `player` (name, level, xp, energy, hunger, happiness, health, stars, dayInGame) |
| بانک | `bank` (checking, savings, savingsInterestRate, loans[]) |
| شغل | `job`, `jobListings` |
| مهارت | `skills` |
| موتور اقتصاد | `indicators`, `behavior`, `wave`, `activeEvents`, `eventCooldowns` |
| اکشن | `actionsCompletedToday` |
| دوره | `activeCourse`, `completedCourses` |
| کارت روزانه | `todayCard`, `cardHistory`, `cardShielded` |
| یخچال | `fridge` (tierId, items[]) |
| مسکن | `living` (housingId, isOwned, vehicleId, mobilePlanId, lastBillDay) |
| بازار | `inventory`, `marketListings` |
| شهر | `cityPlayers`, `cityOpportunities`, `cityIntegrationOpportunities` |

**اکشن‌های اصلی**:

| متد | توضیح |
|-----|-------|
| `executeAction(categoryId, optionIndex, useSponsored?)` | اجرای اکشن، emit event، اعمال تأثیرات |
| `startNextDay()` | شروع روز جدید: بهره، وام، کارت روزانه، شهر، ماموریت‌ها |
| `enrollCourse / completeSession / dropCourse` | مدیریت دوره آموزشی |
| `depositToSavings / withdrawFromSavings` | واریز/برداشت پس‌انداز |
| `takeLoan / payLoanInstallment` | وام |
| `buyFood / eatFood / upgradeFridge` | مدیریت یخچال |
| `buyFromMarket / sellToSystem / buyFromListing` | بازار |
| `doRandomLeisure` | فعالیت تفریحی تصادفی |
| `upgradeHousing / upgradeVehicle / changeMobilePlan` | ارتقاء زندگی |

---

### `useMissionStore` — `src/game/missions/store.ts`
**Persist key**: `"shahre-man-missions"`

| فیلد | نوع | توضیح |
|------|-----|-------|
| `activeStoryMission` | `Mission \| null` | ماموریت داستانی فعال |
| `activeDailyMissions` | `Mission[]` | ماموریت‌های روزانه (max 3) |
| `activeWeeklyMissions` | `Mission[]` | ماموریت‌های هفتگی (max 2) |
| `activeEventMission` | `Mission \| null` | ماموریت رویداد شهری |
| `activeRescueMission` | `Mission \| null` | ماموریت نجات (فوری) |
| `achievements` | `Mission[]` | دستاوردهای همیشگی |
| `completedUnclaimed` | `Mission[]` | ماموریت‌های تموم‌شده، جایزه نگرفته |
| `cumulativeStats` | `object` | آمار تجمعی برای achievements |
| `currentArcId` | `string \| null` | story arc جاری |
| `currentEpisodeIndex` | `number` | قسمت جاری |

**اکشن‌ها**:

| متد | توضیح |
|-----|-------|
| `initMissionsForNewDay(ctx)` | تولید ماموریت‌های روز جدید |
| `processGameplayEvent(event)` | بروزرسانی پیشرفت ماموریت‌ها |
| `claimMissionRewards(missionId)` | دریافت جایزه |
| `refreshAchievements(checkState)` | بروزرسانی دستاوردها |
| `getRecommendedMission()` | بهترین ماموریت پیشنهادی (completed > rescue > daily > story) |
| `getAllVisibleMissions()` | تمام ماموریت‌های قابل نمایش |

---

### `useCityStore` — `src/game/city/city-store.ts`
**Persist key**: `"shahre-man-city"`

| فیلد | نوع | توضیح |
|------|-----|-------|
| `sectors` | `Record<SectorId, SectorState>` | ۶ بخش اقتصادی |
| `currentWaveId` | `CityWaveId` | موج جاری شهر |
| `waveRemainingDays` | `number` | روزهای باقی‌مانده موج |
| `activeEvents` | `ActiveCityEvent[]` | رویدادهای فعال |
| `economyHealth` | `number` | سلامت کل اقتصاد (0-100) |
| `inflationLevel` | `number` | سطح تورم (0-100) |

**اکشن‌ها**:

| متد | توضیح |
|-----|-------|
| `advanceDay(dayInGame)` | اجرای شبیه‌سازی روزانه (idempotent) |
| `getPlayerSummary()` | خلاصه اقتصادی برای بازیکن |
| `resetCity()` | ریست به حالت اولیه |

---

## Home Components

### `GameHUD` — `src/components/home/GameHUD.tsx`
**Props**: `onEndDay: () => void`
**Store**: `useGameStore`

HUD ثابت بالای صفحه. نمایش روز، فاز روز، ۵ آیکون آمار (انرژی، گرسنگی، خوشحالی، XP، پول) با رنگ هشدار خودکار. دکمه «پایان روز».

---

### `CharacterStage` — `src/components/home/CharacterStage.tsx`
**Props**: `doneCount: number`
**Store**: `useGameStore`

نمایش شخصیت بازیکن با انیمیشن breathing، نام، سطح، و پیشرفت روز.

---

### `RecommendedMissionBanner` — `src/app/page.tsx` (inline)
**Props**: none
**Store**: `useMissionStore`

بنر ماموریت پیشنهادی روی Home. لینک به `/missions`. نمایش عنوان، دسته‌بندی رنگی، نوار پیشرفت. اگر `mission` نبود، `StoryBubble` نمایش داده می‌شود.

> **نکته**: `mounted` guard دارد تا hydration mismatch نشود.

---

### `StoryBubble` — `src/components/home/StoryBubble.tsx`
**Props**: none
**Store**: mock data

کارت Fallback برای وقتی Mission Engine هنوز داده ندارد. نمایش story arc از mock.ts.

---

### `RoomObjects` — `src/components/home/RoomObjects.tsx`
**Props**: `done: string[], onOpenAction: (categoryId: string) => void`
**Store**: `useGameStore`

گرید ۳ ستونه ۶ اکشن اصلی (خوردن، کار، ورزش، مطالعه، استراحت، یخچال). هر تایل وضعیت زمینه‌ای نشان می‌دهد (مثلاً درصد دوره فعال، پر/خالی بودن یخچال).

---

### `HeroActionButton` — `src/components/home/HeroActionButton.tsx`
**Props**: `done: string[], onOpenAction: (categoryId: string) => void`
**Store**: mock data

دکمه بزرگ اکشن پیشنهادی. منطق انتخاب بهترین اکشن بعدی بر اساس وضعیت بازیکن.

---

### `ActionBottomSheet` — `src/components/home/ActionBottomSheet.tsx`
**Props**: `categoryId: string | null, onClose: () => void, onDone?: (id: string) => void`
**Store**: `useGameStore` (executeAction, wave)

پیچیده‌ترین کامپوننت UI. ۳ فاز:
1. **choosing**: نمایش گزینه‌ها با costs/effects، toggle اسپانسری
2. **preview**: پیش‌نمایش تأثیرات، wave modifier
3. **result**: نتیجه اکشن، badge برند اسپانسری

ویژگی‌ها: sponsored variants (طلایی)، wave modifier badge، smart suggestions.

---

### `LeisureButton` — `src/components/home/LeisureButton.tsx`
**Props**: none
**Store**: `useGameStore` (doRandomLeisure, inventory)

دکمه «یه کاری بکن» با انیمیشن. اجرای `doRandomLeisure()` و نمایش نتیجه + پیشنهادهای خرید.

---

### `CityEventBanner` — `src/components/home/CityEventBanner.tsx`
**Props**: none
**Store**: `useGameStore` (wave, activeEvents, indicators)

بنر وضعیت شهر در Home. موج اقتصادی فعال، رویدادها، insight بازار.

---

### `EndOfDaySummary` — `src/components/home/EndOfDaySummary.tsx`
**Props**: `isOpen: boolean, onClose: () => void`
**Store**: `useGameStore`

مدال پایان روز. گرید آمار، انرژی بازیافت‌شده، اکشن‌های انجام‌شده.

---

### `DailyCardModal` — `src/components/home/DailyCardModal.tsx`
**Props**: `card: DailyCard, shielded: boolean, onDismiss: () => void`
**Store**: —

مدال کارت رویداد روزانه. نمایش آیکون، نوع (خوب/بد/خنثی)، تأثیرات، پیام سپر پس‌انداز.

---

### `QuickLinks` — `src/app/page.tsx` (inline)
**Props**: none
**Store**: `useGameStore`

گرید ۴ لینک سریع (بانک، قبوض، جمعه‌بازار، یخچال) با مقادیر زنده.

> **نکته**: `mounted` guard دارد تا hydration مشکل نداشته باشد.

---

## City Components

### `CityHeader` — `src/components/city/CityHeader.tsx`
**Props**: none
**Store**: `useGameStore` (indicators → derivedEconomy)

هدر صفحه شهر. نام شهر، بازیکنان فعال، وضعیت اقتصاد، تورم، نوار سلامت اقتصاد.

---

### `SectorGrid` — `src/components/city/SectorGrid.tsx`
**Props**: none
**Store**: `useCityStore`

گرید ۲ ستونه ۶ بخش اقتصادی. نوار سلامت رنگی، ضریب حقوق، فلش trend (↑/→/↓).

---

### `CityEventsList` — `src/components/city/CityEventsList.tsx`
**Props**: none
**Store**: `useCityStore`

کارت موج فعال شهر (نام، توضیح، ضریب سرمایه، روزهای باقی) + لیست رویدادهای فعال با badge شدت (خبر/مهم/بحران).

---

### `CityOpportunities` — `src/components/city/CityOpportunities.tsx`
**Props**: none
**Store**: `useGameStore` (cityIntegrationOpportunities)

لیست ۲-۴ فرصت روزانه از Integration Layer. رنگ‌بندی بر اساس urgency (قرمز/زرد/آبی). هر کارت با لینک CTA.

---

### `EconomicWave` — `src/components/city/EconomicWave.tsx`
**Props**: none
**Store**: `useGameStore` (wave — legacy engine)

کارت موج اقتصادی legacy (tick-based). نام، توضیح، تأثیرات، نوار پیشرفت.

---

### `EventCard` — `src/components/city/EventCard.tsx`
**Props**: `event: CityEvent`
**Store**: —

کارت رویداد legacy با شدت رنگی، آمار تأثیرگذاری، تایمر.

---

### `LimitedOpportunity` — `src/components/city/LimitedOpportunity.tsx`
**Props**: `opportunity: Opportunity`
**Store**: —

کارت فرصت محدود legacy. نقاط باقی‌مانده با dot indicator، رقبا.

---

### `MarketAnalysis` — `src/components/city/MarketAnalysis.tsx`
**Props**: none
**Store**: `useGameStore` (marketInsight)

توزیع بخش‌ها (legacy) + کارت insight بازار.

---

## Mission Components

### `StoryMissionHero` — `src/components/missions/StoryMissionHero.tsx`
**Props**: `mission: Mission, arcId: string | null, episodeIndex: number, onClaim: () => void`
**Store**: —

بزرگ‌ترین کارت ماموریت. شخصیت با انیمیشن، گفتگو، زنجیره قسمت‌ها (✓/🔒/شماره)، نوار پیشرفت ۱۰px، جوایز، دکمه CTA.

---

### `MissionCard` — `src/components/missions/MissionCard.tsx`
**Props**: `mission: Mission, recommended?: boolean, onClaim?: () => void`
**Store**: —

کارت عمومی ماموریت. رنگ‌بندی category، badge «پیشنهادی ✦»، badge «نزدیکه! 🔥» (≥75%)، نوار پیشرفت، دکمه وضعیت (برو/جایزه⭐/✓).

---

### `RewardPopup` — `src/components/missions/RewardPopup.tsx`
**Props**: `reward: MissionRewards, onDismiss: () => void`
**Store**: —

پاپ‌آپ تمام‌صفحه جایزه. ۱۲ پارتیکل burst، auto-dismiss بعد از ۲.۵ ثانیه.

---

### `LockedEpisodeTeaser` — `src/components/missions/LockedEpisodeTeaser.tsx`
**Props**: none
**Store**: —

پلیس‌هولدر پایین صفحه ماموریت‌ها. نمایش قفل بودن قسمت بعدی.

---

### `ActiveStoryArcCard` (legacy) — `src/components/missions/ActiveStoryArcCard.tsx`
**Props**: `onClaim?: (reward) => void`
**Store**: mock data

کارت story arc از mock.ts (برای نمایش legacy data).

---

### `DailyMissionCard` (legacy) — `src/components/missions/DailyMissionCard.tsx`
**Props**: `mission, recommended?, onClaim?`
**Store**: mock data

کارت ماموریت روزانه legacy.

---

### `WeeklyMissionCard` (legacy) — `src/components/missions/WeeklyMissionCard.tsx`
**Props**: `mission, onClaim?`
**Store**: mock data

کارت ماموریت هفتگی legacy با indicator قدم‌ها.

---

### `MilestoneCard` — `src/components/missions/MilestoneCard.tsx`
**Props**: `milestone`
**Store**: mock data

کارت milestone با badge پیش‌نمایش.

---

## Job Components

### `CityJobModifiers` — `src/components/jobs/CityJobModifiers.tsx`
**Props**: none
**Store**: `useCityStore` + `getCityGameplayModifiers()`

نمایش تأثیر اقتصاد شهر روی بازار کار. badge های رنگی (سبز/قرمز) برای تغییر حقوق و شانس استخدام هر بخش.

> **نکته**: `mounted` guard دارد.

---

### `JobCard` — `src/components/jobs/JobCard.tsx`
**Props**: `job, isApplied, onApply, playerXp, completedCourses, playerSkills`
**Store**: —

کارت آگهی شغلی. تب سطوح ارشدیت (junior/mid/senior)، requirements checklist، حقوق، دکمه درخواست.

---

### `PremiumJobCard` — `src/components/jobs/PremiumJobCard.tsx`
**Props**: مشابه `JobCard`
**Store**: —

نسخه premium با استایل طلایی و badge ویژه.

---

### `ApplicationModal` — `src/components/jobs/ApplicationModal.tsx`
**Props**: `visible, phase, result, jobTitle, onClose`
**Store**: —

مدال ۳ فازی درخواست شغل: loading → accepted/rejected.

---

### `ProfessionalStatusPanel` — `src/components/jobs/ProfessionalStatusPanel.tsx`
**Props**: none
**Store**: `useGameStore`

پانل وضعیت حرفه‌ای: رزومه، سطح مهارت، شانس قبولی، سابقه.

---

### `GoldenMembershipCard` — `src/components/jobs/GoldenMembershipCard.tsx`
**Props**: none
**Store**: mock data

کارت عضویت طلایی با مزایا.

---

### `JobTabFilters` — `src/components/jobs/JobTabFilters.tsx`
**Props**: `tab, onChange, counts`
**Store**: —

فیلتر تب (همه/داغ/premium).

---

## Layout Components

### `BottomNav` — `src/components/layout/BottomNav.tsx`
**Props**: none
**Store**: `useMissionStore`, `usePathname`

ناوبری پایین با ۵ تب (خانه، ماموریت، کار، شهر، پروفایل). badge تعداد ماموریت قابل دریافت.

---

### `TopHeader` — `src/components/layout/TopHeader.tsx`
**Props**: none
**Store**: mock data

هدر ثابت بالای صفحات فرعی. روز، ساعت دیجیتال، XP، پول.

---

## UI Components

### `PageShell` — `src/components/ui/PageShell.tsx`
**Props**: `title, titleEmoji, subtitle?, headerRight?, children`
**Store**: —

Wrapper صفحات فرعی با TopHeader، عنوان، BottomNav.

---

### `TabBar` — `src/components/ui/TabBar.tsx`
**Props**: `tabs: Tab<T>[], active: T, onChange, color?`
**Store**: —

سوییچر تب جنریک با TypeScript generic.

---

### `ItemCard` — `src/components/ui/ItemCard.tsx`
**Props**: `item, onAction?`
**Store**: —

کارت آیتم جنریک برای بازار/یخچال/موجودی.

---

### `ChipFilter` — `src/components/ui/ChipFilter.tsx`
**Props**: `options, active, onChange`
**Store**: —

فیلتر chip-style برای فیلترینگ لیست‌ها.

---

### `BalanceBar` — `src/components/ui/BalanceBar.tsx`
**Props**: `checking, savings`
**Store**: —

نمایش موجودی جاری و پس‌انداز.

---

### `StatBar` — `src/components/ui/StatBar.tsx`
**Props**: `label, value, max, color, emoji`
**Store**: —

نوار آمار عمومی برای health/energy/hunger.

---

### `Toast` — `src/components/ui/Toast.tsx`
**Props**: `message, type, onDismiss`
**Store**: —

اعلان موقت (toast notification).

---

### `ProgressBar` — `src/components/ui/ProgressBar.tsx`
**Props**: `value, color?, height?, showLabel?`
**Store**: —

نوار پیشرفت ساده.

---

## Profile Components

| کامپوننت | توضیح |
|----------|-------|
| `ProfileHero` | اطلاعات اصلی بازیکن (آواتار، نام، سطح، شغل) |
| `ProfileStats` | گرید آمارهای حیاتی |
| `ProfileSkills` | لیست مهارت‌های hard/soft با نوار پیشرفت |
| `ProfileXPBrand` | نمایش XP و پیشرفت به سطح بعدی |
| `ProfileBadges` | گالری badge های کسب‌شده/قفل |
| `ProfileRoom` | موجودی اتاق (inventory) |
| `ProfileRankings` | جایگاه در رنکینگ شهر |
| `ProfileMissionArc` | پیشرفت story arc |
| `ProfileLifePath` | تایم‌لاین مسیر زندگی |

---

## Game Engine Modules

### Mission Engine — `src/game/missions/`

| فایل | توضیح |
|------|-------|
| `types.ts` | انواع: MissionCategory, MissionObjective (union 16 نوع), Mission, StoryArc, GameplayEvent |
| `analyzer.ts` | `analyzePlayerForMissions(ctx)` → PlayerMissionProfile (burnout, momentum, struggling...) |
| `story-arcs.ts` | ۲ story arc: `family_saving` (5 قسمت)، `career_growth` (3 قسمت) |
| `templates.ts` | DAILY_TEMPLATES (7)، WEEKLY_TEMPLATES (5)، EVENT_TEMPLATES (3)، RESCUE_TEMPLATES (2) |
| `progress.ts` | `updateMissionProgress(mission, event)` - immutable progress update |
| `rewards.ts` | `scaleMissionRewards()` بر اساس level بازیکن |
| `selector.ts` | `generateMissionsForNewDay(ctx, state)` → GeneratedMissionSet با anti-repetition |
| `achievements.ts` | ۸ دستاورد: first_10m, first_50m, first_job, trusted_employee, professional_cert, fitness_lover, first_investment, week_survivor |
| `helpers.ts` | `getCategoryDisplay()` برای رنگ/استایل category، `sortMissionsByPriority()` |
| `store.ts` | Zustand store با persist |

**GameplayEvent types**:
`day_ended`, `money_earned`, `xp_gained`, `job_accepted`, `work_shift_completed`,
`study_session_completed`, `exercise_completed`, `rest_completed`, `investment_made`,
`meal_eaten`, `action_completed`

---

### Event Bus — `src/game/events/eventBus.ts`

```typescript
dispatchGameplayEvent(event: GameplayEvent): void
```
lazy require از missionStore برای جلوگیری از circular dependency.

---

### Action→Event Map — `src/game/actions/actionEventMap.ts`

```typescript
getActionEvents(ctx: ActionEventContext): GameplayEvent[]
// work → work_shift_completed
// study/library → study_session_completed
// exercise → exercise_completed
// rest → rest_completed
// invest → investment_made
// + money_earned if moneyGained > 0
// + xp_gained if xpGained > 0
```

---

### City Simulation Engine — `src/game/city/`

| فایل | توضیح |
|------|-------|
| `types.ts` | SectorId (6)، SectorState، CityWave، CityEvent، ActiveCityEvent، CityState، CityPlayerSummary |
| `seed-waves.ts` | ۷ موج: stability، tech_boom، recession، construction_surge، finance_bull، retail_holiday، manufacturing_revival |
| `seed-events.ts` | ۱۲ رویداد: ai_investment_surge, tech_layoffs, dollar_spike, stock_crash, banking_bonus, housing_boom, infrastructure_project, norouz_rush, import_ban, factory_strike, export_deal, energy_crisis |
| `sector-impact.ts` | `applyDailyImpacts()` + `calcEconomyHealth()` + `createInitialSectors()` |
| `wave-engine.ts` | `checkWaveDayTransition()` (روزانه، نه tick-based) |
| `event-generator.ts` | `generateDailyEvents()` انتخاب وزن‌دار + `tickActiveEvents()` |
| `city-simulation.ts` | `runDailySimulation(state, day)` → CityState جدید |
| `city-helpers.ts` | `getSectorSalaryMultiplier()`, `getInvestmentMultiplier()`, `getCostOfLivingMultiplier()`, `getCityPlayerSummary()`, `jobCategoryToSector()`, `trendIcon()`, `trendColor()` |
| `city-store.ts` | Zustand store با persist |

**چرخه موج‌ها**:
`stability → tech_boom → construction_surge → stability → finance_bull → retail_holiday → stability → recession → manufacturing_revival → (تکرار)`

**شبیه‌سازی روزانه**:
1. `tickActiveEvents()` ← کاهش remainingDays
2. `checkWaveDayTransition()` ← تغییر موج اگر لازم
3. `applyDailyImpacts()` ← wave mod + event mod + mean reversion
4. `calcEconomyHealth()` ← امتیاز ترکیبی
5. `generateDailyEvents()` ← رول احتمالی (0-2 رویداد)
6. drift `inflationLevel`

---

### Integration Layer — `src/game/integration/`

| فایل | توضیح |
|------|-------|
| `city-impact-resolver.ts` | `getCityGameplayModifiers(cityState)` → CityGameplayModifiers |
| `job-city-bridge.ts` | `enrichJobListingsWithCity()`, `calcHiringProbability()`, `getJobCityImpactLabel()`, `getCityAdjustedSalary()` |
| `investment-city-bridge.ts` | `calculateInvestmentOutcome()`, `getInvestmentPreview()` — آسست‌ها: stocks/crypto/gold/startup/bank_savings/real_estate |
| `mission-city-bridge.ts` | `generateCityEventMissions()` تزریق به missionStore، `getCityMissionWeightModifiers()` |
| `opportunity-generator.ts` | `generateCityOpportunities()` → CityOpportunity[] |
| `daily-integration-pipeline.ts` | `runDailyIntegrationPipeline()` + `getCurrentCityModifiers()` |

**CityGameplayModifiers**:
```typescript
{
  jobMarket: { salaryMultiplierBySector, hiringChanceModifierBySector, jobListingCountMultiplierBySector }
  investment: { returnModifierByAsset, riskModifierByAsset }
  economy: { costOfLivingMultiplier, rentMultiplier, foodPriceMultiplier, transportMultiplier }
  missions: { eventMissionTypes, missionWeightBoosts }
}
```

**فرمول استخدام**:
```
hireChance = baseChance + skillScore×0.3 + reputation×0.1 + cityHiringModifier
             clamp به [0.05, 0.95]
```

---

## Legacy Engine

`src/engine/` — موتور tick-based اقتصادی اولیه (همچنان فعال)

| فایل | توضیح |
|------|-------|
| `types.ts` | EconomicIndicators، WavePhase (5 فاز)، ActiveEvent، WaveState، DerivedEconomy |
| `economicIndicators.ts` | `driftIndicators()` — تغییر تدریجی شاخص‌ها |
| `waveSystem.ts` | `checkWaveTransition()`, `createInitialWave()` |
| `triggerEngine.ts` | `evaluateTriggers()` — بررسی شرط‌های trigger رویداد |
| `impactEngine.ts` | `applyEventImpacts()` — اعمال تأثیر رویدادها |
| `playerBehavior.ts` | `simulateBehavior()` — شبیه‌سازی رفتار جمعی بازیکنان |
| `eventTemplates.ts` | قالب‌های رویداد legacy |

این موتور هر `TICK_MS` (10 ثانیه) در `GameTickProvider` اجرا می‌شود.

---

## Data Files

`src/data/` — داده‌های استاتیک بازی

| فایل | محتوا |
|------|-------|
| `mock.ts` | seed data، انواع، `toPersian()`, `formatMoney()`, `COURSE_CATALOG` (10 دوره) |
| `actionTemplates.ts` | `ACTION_CATEGORIES` (7 دسته با sponsored variants)، `WAVE_ACTION_MODIFIERS` |
| `fridgeData.ts` | `FOOD_CATALOG`، `FRIDGE_TIERS` (basic/standard/premium/branded) |
| `marketplaceData.ts` | `MARKET_ITEMS`، `generateNpcListings()` |
| `leisureData.ts` | `LEISURE_ACTIVITIES`، purchase suggestions |
| `livingCosts.ts` | `HOUSING_TIERS`, `VEHICLE_TIERS`, `MOBILE_PLANS`, `calculateWeeklyBills()` |
| `loanTypes.ts` | `LOAN_TYPES` (4 نوع)، `ActiveLoan` interface، `calculateMonthlyPayment()` |
| `dailyCards.ts` | `DAILY_CARDS` (15 کارت)، `drawRandomCard()` با وزن |

---

## Pages

| صفحه | مسیر | توضیح |
|------|------|-------|
| Home | `/` | صفحه اصلی با HUD، شخصیت، اکشن‌ها، شهر |
| City | `/city` | شهر: بخش‌ها، رویدادها، فرصت‌ها، بازار، رنکینگ |
| Jobs | `/jobs` | بازار کار: لیست آگهی‌ها، CityJobModifiers، درخواست |
| Bank | `/bank` | بانک: موجودی، پس‌انداز، وام‌ها |
| Fridge | `/fridge` | یخچال: خرید، خوردن، ارتقاء |
| Market | `/market` | جمعه‌بازار: خرید/فروش آیتم‌ها |
| Living | `/living` | هزینه زندگی: مسکن، وسیله نقلیه، موبایل |
| Missions | `/missions` | ماموریت‌ها: داستان، روزانه، هفتگی، دستاوردها |
| Profile | `/profile` | پروفایل: آمار، مهارت‌ها، badge، رنکینگ |
| Skills | `/skills` | دوره‌های آموزشی: ثبت‌نام، پیشرفت |

---

## Patterns

### Hydration Safety
کامپوننت‌هایی که از Zustand persist store می‌خوانند باید `mounted` guard داشته باشند:
```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
// render placeholder until mounted
```
مثال: `RecommendedMissionBanner`, `QuickLinks`, `CityJobModifiers`

---

### Lazy Require برای Circular Prevention
وقتی A به B import می‌کند و B هم به A، از `require()` درون تابع استفاده می‌شود:
```typescript
// gameStore → eventBus → missionStore (no circular)
const { useMissionStore } = require("@/game/missions/store");
```

---

### جریان `startNextDay()`
```
1. player.dayInGame += 1
2. overnight energy recovery (+30% of missing)
3. daily savings interest
4. auto loan payments
5. daily card draw + effects
6. course day advance
7. weekly bills (every 7 days)
8. NPC market listings refresh
9. passive inventory bonuses
10. fridge expiry
─── (after set) ───
11. dispatchGameplayEvent({ type: "day_ended" })
12. useCityStore.advanceDay(dayInGame)         ← City Simulation
13. runDailyIntegrationPipeline(...)           ← Integration Layer
14. missionStore.initMissionsForNewDay(ctx)    ← Mission Generation
15. missionStore.refreshAchievements(...)      ← Achievement Update
```

---

### Color System
| کاربرد | رنگ |
|--------|-----|
| Gold / Premium / Sponsored | `#D4A843`, `#F0C966` |
| Junior | `#4ade80` (green) |
| Mid | `#60a5fa` (blue) |
| Senior | `#fbbf24` (gold) |
| Story mission | `#c084fc` (purple) |
| Daily mission | `#4ade80` (green) |
| Rescue mission | `#fb923c` (orange) |
| Weekly mission | `#60a5fa` (blue) |
| Event mission | `#f472b6` (pink) |
| Achievement | `#f59e0b` (amber) |
| Economy health | ≥70: green, ≥45: yellow, <45: red |

---

### Animation CSS Classes
تعریف‌شده در `src/app/globals.css`:

| کلاس | کاربرد |
|------|--------|
| `anim-breathe` | کارت‌های فعال (scale pulse) |
| `anim-claim-pulse` | ماموریت آماده دریافت |
| `anim-mission-glow` | آیکون ماموریت تکمیل‌شده |
| `progress-bar-animated` | نوار پیشرفت متحرک |
| `icon-idle-float` | آیکون شناور |
| `btn-bounce` | دکمه با bounce effect |
| `anim-reward-pop` | پاپ‌آپ جایزه |
| `particle-drift` | ذرات دکوراتیو |
| `page-enter` | fade-in صفحه |
| `scene-bg` | پس‌زمینه gradient صفحه اصلی |
| `game-bg` | پس‌زمینه صفحات فرعی |
