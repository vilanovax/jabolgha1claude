# Jabolgha - Game Design Document

## 1. Player Vital Parameters

### 1.1 Core Stats (stored in `player` object)

| Parameter | Key | Emoji | Initial | Range | Description |
|-----------|-----|-------|---------|-------|-------------|
| Energy | `energy` | ⚡ | 68 | 0-100 | Required for actions like work, study, exercise |
| Hunger | `hunger` | 🍔 | 55 | 0-100 | Satiety level, replenished by eating |
| Happiness | `happiness` | 😊 | 72 | 0-100 | Mood and satisfaction |
| Security | `security` | 🛡️ | 58 | 0-100 | Financial/life security feeling |
| XP | `xp` | ✨ | 1240 | 0+ | Experience points for leveling |
| Stars | `stars` | ⭐ | 18 | 0+ | Premium currency |
| Money | `bank.checking` | 💰 | 12.5M | 0+ | Checking account balance (Toman) |
| Savings | `bank.savings` | 🏦 | 50M | 0+ | Savings account |

### 1.2 Vitals Display (in `vitals` array for UI)

Additional vitals tracked for display: health (❤️), knowledge (📚), work experience (💼), wealth (💎).

### 1.3 Overnight Recovery

At the start of each new day (`startNextDay`):
- Energy recovers 30% of missing energy: `energy += (100 - energy) * 0.3`
- `dayInGame` increments by 1
- Daily action/routine trackers reset

---

## 2. Action System

### 2.1 Overview

7 action categories defined in `src/data/actionTemplates.ts`, each with 3 tier options (easy/medium/hard).

**File**: `src/data/actionTemplates.ts`
**Store method**: `executeAction(categoryId, optionIndex, useSponsored?)`

### 2.2 Categories

| Category | ID | Emoji | Description |
|----------|----|-------|-------------|
| Exercise | `exercise` | 🏃 | Physical activity |
| Eating | `eat` | 🍔 | Food and nutrition |
| Sleep | `sleep` | 😴 | Rest and recovery |
| Study | `study` | 📚 | Learning and education |
| Work | `work` | 💼 | Employment and income |
| Rest | `rest` | ☕ | Leisure and relaxation |
| Investment | `invest` | 📈 | Financial investments |

### 2.3 Action Flow

1. Player selects category → option → normal/sponsored
2. System checks: energy sufficient? money sufficient?
3. Wave modifier applied to costs and effects
4. Costs deducted (energy, money)
5. Effects applied (stat changes)
6. Risk roll (if applicable) → penalty on failure
7. Time advanced by action's `time` cost (minutes)
8. Action tracked in `actionsCompletedToday`

### 2.4 Effects Matrix

| Category | Costs | Primary Effects | Secondary Effects |
|----------|-------|-----------------|-------------------|
| Exercise 🏃 | energy, money | health ↑ | happiness ↑, stars ↑ |
| Eating 🍔 | money | energy ↑, hunger ↑ | happiness ↑ |
| Sleep 😴 | (time only) | energy ↑ | happiness ↑, health ↑ |
| Study 📚 | energy | xp ↑ | stars ↑ |
| Work 💼 | energy | money ↑ | xp ↑, stars ↑ |
| Rest ☕ | money | energy ↑, happiness ↑ | stars ↑ |
| Investment 📈 | money | money ↑ (profit) | xp ↑, stars ↑ |

### 2.5 Risks

| Action | Risk | Chance | Penalty |
|--------|------|--------|---------|
| Exercise (hard) | Injury | 15% | energy -30 |
| Study (hard) | Mental fatigue | 10% | happiness -10 |
| Work (overtime) | Burnout | 8% | happiness -15 |
| Investment (stock) | Loss | 15% | money -10M |
| Investment (crypto) | Loss | 25% | money -25M |

---

## 3. Sponsored Variant System

### 3.1 Overview

Each action option can have an optional `sponsoredVariant` with a real brand. Sponsored versions cost more money but provide significantly better stat effects.

**Interface**: `SponsoredVariant` in `actionTemplates.ts`

### 3.2 Structure

```typescript
interface SponsoredVariant {
  brandName: string;       // "ردبول", "کاله"
  brandEmoji: string;
  displayName: string;     // "انرژی‌زای ردبول"
  costs: { energy?: number; money?: number; time: number };
  effects: ActionEffect[];
  risk?: ActionRisk;
}
```

### 3.3 Brands by Category

| Category | Tier 1 | Tier 2 | Tier 3 |
|----------|--------|--------|--------|
| Exercise | Nike | Technogym | CrossFit |
| Eating | Kalleh | Ramak | Pak |
| Sleep | (none) | Relax | Tempur |
| Study | Kindle | Coursera | Udemy |
| Work | (none) | (none) | (none) |
| Rest | Ahmad Tea | Netflix | Cafe Lamiz |
| Investment | Nobitex | Sahamyab | Goldman |

### 3.4 UI

- Toggle between "عادی" (Normal) and "✦ اسپانسری" (Sponsored) in ActionBottomSheet
- Gold gradient styling (#D4A843 → #F0C966) for sponsored elements
- Brand badge shown during execution and in results

---

## 4. Time System

### 4.1 Day Structure

- Total day: **960 minutes** (16 waking hours, 07:00-23:00)
- 4 phases, 240 minutes each:

| Phase | Key | Label | Minutes | Real Time |
|-------|-----|-------|---------|-----------|
| Morning | `morning` | صبح | 0-239 | 07:00-11:00 |
| Noon | `noon` | ظهر | 240-479 | 11:00-15:00 |
| Evening | `evening` | عصر | 480-719 | 15:00-19:00 |
| Night | `night` | شب | 720-960 | 19:00-23:00 |

### 4.2 Store Methods

- `advanceTime(minutes)` - Advance clock, trigger end-of-day at 960
- `forceEndOfDay()` - Skip to end of day
- `startNextDay()` - Reset clock, recovery, increment day
- `getPhase()` - Current phase based on minutes
- `getTimeLabel()` - Formatted Persian time string
- `getDayProgress()` - 0-1 progress ratio

---

## 5. Routine System

### 5.1 Overview

Player assigns actions to 4 daily routine slots (one per phase). Completing all 4 gives a combo bonus.

### 5.2 State

```typescript
routine: { morning: string | null, noon: string | null, evening: string | null, night: string | null }
routineStreak: number          // consecutive days of full routine
routineCompletedToday: string[] // slot names completed today
```

### 5.3 Combo Bonus

When all 4 slots completed in one day:
- +5 XP
- routineStreak increments

---

## 6. Career & Job System

### 6.1 Active Job

**File**: `src/data/mock.ts` → `job` object

```typescript
{
  title: "توسعه‌دهنده فرانت‌اند",
  company: "استارتاپ دیجی‌کد",
  type: "استارتاپ",
  seniority: "mid",    // junior | mid | senior
  salary: 45_000_000,
  industryXp: "IT",
  daysWorked: 32,
}
```

### 6.2 Job Listings with Seniority Levels

Each job listing has 3 seniority tiers with different requirements:

**Interface**: `JobListing` with `seniorityLevels: SeniorityLevel[]`

```typescript
interface SeniorityLevel {
  key: "junior" | "mid" | "senior";
  label: string;          // "جونیور", "میدلول", "سینیور"
  salary: number;
  minXp: number;
  requiredCourses: string[];
  requirements: { skill: string; level: number }[];
}
```

### 6.3 Available Jobs

| # | Title | Company | Type | Junior Salary | Mid Salary | Senior Salary |
|---|-------|---------|------|---------------|------------|---------------|
| 1 | توسعه‌دهنده پایتون | استارتاپ نوآوران | استارتاپ | 25M | 45M | 70M |
| 2 | مدرس آنلاین پایتون | آموزشگاه فناوری | شرکت | 18M | 30M | 50M |
| 3 | فرانت‌اند React | شرکت پیشرو | شرکت | 30M | 55M | 85M |
| 4 | کارشناس IT | سازمان دولتی | دولتی | 15M | 22M | 35M |
| 5 | مدیر فنی CTO | تک‌استار ونچرز | استارتاپ | 60M | 100M | 150M |
| 6 | تحلیلگر داده | دیجی‌کالا | شرکت | 30M | 55M | 80M |

### 6.4 Job Eligibility Check

**Store method**: `isJobEligible(jobId, seniority)`

Returns:
- `eligible: boolean` - Meets all requirements
- `missingXp: boolean` - XP too low
- `missingCourses: string[]` - Courses not completed
- `missingSkills: string[]` - Skills below required level

### 6.5 Seniority Requirements Example (توسعه‌دهنده پایتون)

| Level | Min XP | Courses | Skills |
|-------|--------|---------|--------|
| Junior | 300 | Python Basics | برنامه‌نویسی Lv.3 |
| Mid | 800 | Python Basics | برنامه‌نویسی Lv.6 |
| Senior | 2500 | Python Basics + Data Science | برنامه‌نویسی Lv.8 |

---

## 7. Course / Education System

### 7.1 Course Catalog

10 online courses across 5 fields:

**File**: `src/data/mock.ts` → `COURSE_CATALOG`

| ID | Name | Field | Days | Cost | XP Reward | Skill Boost |
|----|------|-------|------|------|-----------|-------------|
| python_basics | Python Basics | programming | 7 | 2M | 50 | programming +150 |
| react_advanced | React Advanced | programming | 10 | 5M | 80 | programming +250 |
| data_science | Data Science | programming | 14 | 8M | 100 | programming +300 |
| digital_marketing | Digital Marketing | marketing | 5 | 3M | 40 | marketing +200 |
| seo_mastery | SEO Mastery | marketing | 7 | 4M | 60 | marketing +250 |
| accounting_fundamentals | Accounting Fundamentals | accounting | 8 | 3.5M | 50 | accounting +200 |
| financial_analysis | Financial Analysis | accounting | 12 | 7M | 90 | accounting +350 |
| ui_ux_design | UI/UX Design | design | 10 | 6M | 70 | design +280 |
| leadership_101 | Leadership 101 | management | 6 | 4M | 45 | leadership +180 |
| project_management | Project Management | management | 8 | 5M | 60 | time_management +220 |

### 7.2 State

- `completedCourses: string[]` - Array of completed course IDs (persisted)
- `completeCourse(courseId)` - Mark a course as completed

### 7.3 Course → Job Dependency

Courses unlock job positions:
- **Python Basics** → Python Developer, Python Teacher
- **React Advanced** → React Frontend, CTO
- **Data Science** → Data Analyst, Python Senior
- **Leadership 101** → CTO (mid+)
- **Project Management** → CTO (senior), IT Senior
- **UI/UX Design** → React Frontend (senior)
- **Financial Analysis** → Data Analyst (senior)

---

## 8. Skills System

### 8.1 Hard Skills

| Skill | Key | Initial Level | Max XP |
|-------|-----|--------------|--------|
| برنامه‌نویسی | programming | 8 | 1000 |
| بازاریابی | marketing | 3 | 500 |
| حسابداری | accounting | 1 | 200 |
| طراحی | design | 2 | 200 |

### 8.2 Soft Skills

| Skill | Key | Initial Level | Max XP |
|-------|-----|--------------|--------|
| مذاکره | negotiation | 4 | 1000 |
| مدیریت زمان | time_management | 6 | 1000 |
| ارتباطات | communication | 3 | 500 |
| رهبری | leadership | 1 | 200 |

---

## 9. Economic Engine

### 9.1 Overview

A background simulation that affects the game world. Runs via `tick()` method.

**Files**: `src/engine/`

### 9.2 Layers (executed per tick)

1. **Drift Indicators** (`economicIndicators.ts`) - 6 macro indicators drift over time
2. **Simulate Behavior** (`playerBehavior.ts`) - NPC behavior responds to indicators
3. **Wave System** (`waveSystem.ts`) - 5-phase economic cycles
4. **Trigger Engine** (`triggerEngine.ts`) - Event triggers based on conditions
5. **Impact Engine** (`impactEngine.ts`) - Events affect indicators & player

### 9.3 Economic Indicators

| Indicator | Key | Initial |
|-----------|-----|---------|
| IT Demand | `IT_Demand` | 65 |
| Startup Growth | `Startup_Growth` | 60 |
| Inflation Index | `Inflation_Index` | 45 |
| Unemployment Rate | `Unemployment_Rate` | 25 |
| Import Pressure | `Import_Pressure` | 40 |
| Education Boom | `Education_Boom` | 50 |

### 9.4 Derived Economy

Calculated from indicators:
- **Economy Health** (0-100): weighted composite
- **Status**: رونق (≥70) / پایدار (≥55) / پرنوسان (≥35) / رکود (<35)
- **Inflation Rate**: `Inflation_Index * 0.1`
- **Active Players**: `600 + health * 4`

### 9.5 Wave Action Modifiers

Each wave phase modifies action costs and effects per category via `WAVE_ACTION_MODIFIERS`:
- `effectMult` - Multiplier on action effects
- `costMult` - Multiplier on action costs

---

## 10. Banking System

**Files**: `src/data/loanTypes.ts`, `src/data/mock.ts` (bank object), `src/stores/gameStore.ts`, `src/app/bank/page.tsx`

### 10.1 Bank Accounts

| Account | Key | Initial | Interest |
|---------|-----|---------|----------|
| Checking | `bank.checking` | 12.5M | None |
| Savings | `bank.savings` | 50M | 0.08% daily (~2.4%/month) |

- `bank.savingsInterestRate`: Daily interest rate (default: 0.08%)
- `bank.totalInterestEarned`: Lifetime interest accumulated

### 10.2 Banking Actions (Store Methods)

| Method | Description |
|--------|-------------|
| `depositToSavings(amount)` | Move money from checking → savings |
| `withdrawFromSavings(amount)` | Move money from savings → checking |
| `takeLoan(loanTypeId)` | Apply for a loan (credited to checking) |
| `payLoanInstallment(loanId)` | Manually pay a loan installment |

### 10.3 Daily Interest Calculation

Calculated automatically in `startNextDay()`:

```
dailyInterest = savings * (savingsInterestRate / 100)
savings += dailyInterest
totalInterestEarned += dailyInterest
```

**Tunable parameters:**
- `bank.savingsInterestRate` in `src/data/mock.ts` — change the daily rate

### 10.4 Loan System

**File**: `src/data/loanTypes.ts`

#### Available Loan Types

| ID | Name | Max Amount | Monthly Rate | Term | Level Req | Savings Req |
|----|------|-----------|-------------|------|-----------|-------------|
| `emergency` | وام اضطراری 🆘 | 10M | 3% | 6 months | 1 | 0 |
| `personal` | وام شخصی 💳 | 30M | 2% | 12 months | 2 | 0 |
| `business` | وام کسب‌وکار 🏢 | 100M | 1.8% | 18 months | 3 | 20M |
| `housing` | وام مسکن 🏠 | 200M | 1.5% | 24 months | 5 | 50M |

#### Loan Rules

- **Max active loans**: 3 simultaneous
- **Eligibility**: Player level + minimum savings balance
- **Monthly payment**: Calculated via amortization formula (`calculateMonthlyPayment`)
- **Auto-payment**: At `startNextDay()`, if `dayInGame >= loan.nextPaymentDay`, installment is auto-deducted from checking
- **Late payment**: If checking balance is insufficient:
  - `latePayments` counter increments
  - Player loses 10 happiness
  - Payment is deferred to next 30-day cycle

#### ActiveLoan Structure

```typescript
interface ActiveLoan {
  id: string;
  typeId: string;           // references LoanType.id
  typeName: string;
  originalAmount: number;
  remainingPrincipal: number;
  monthlyPayment: number;
  interestRate: number;
  remainingInstallments: number;
  totalInstallments: number;
  nextPaymentDay: number;   // dayInGame when next payment is due
  latePayments: number;     // count of missed payments
}
```

**Tunable parameters:**
- Loan amounts, rates, terms, requirements → `LOAN_TYPES` array in `src/data/loanTypes.ts`
- Max active loans → hardcoded to 3 in `takeLoan()` in `gameStore.ts`
- Late payment happiness penalty → hardcoded to -10 in `startNextDay()`

### 10.5 Savings Protection (Shield Mechanic)

Savings balance protects against negative daily card effects:
- Cards with `savingsShield: true` check if player has any savings
- If yes, monetary loss is **reduced by 70%** (only 30% damage gets through)
- Visual feedback: shield emoji and green message in DailyCardModal
- Cards with `checkingOnly: true` can **never** touch savings — only deduct from checking

**Tunable parameters:**
- Shield reduction: 70% → change `value * 0.3` in `startNextDay()` card logic
- Which cards have shield → `savingsShield` / `checkingOnly` flags in `src/data/dailyCards.ts`

### 10.6 Income Sources

- **Work actions**: Part-time (20M), Full-shift (45M), Overtime (70M)
- **Investment returns**: Bank deposit (2M), Stock (8M), Crypto (20M)
- **Savings interest**: ~40K/day on 50M savings at 0.08% rate
- **Mission rewards**: Daily/weekly missions
- **Daily cards**: Random positive cards (1M-15M)

### 10.7 Expenses

- **Rent**: 12M/month
- **Food**: Action costs (5K-100K per meal tier)
- **Exercise**: Gym fees (0-80K)
- **Rest**: Entertainment costs (5K-50K)
- **Courses**: One-time fees (2M-8M)
- **Investment capital**: 10M-50M per action
- **Loan installments**: Auto-deducted monthly
- **Daily cards**: Random negative cards (1M-8M)

---

## 11. Daily Random Cards System

**File**: `src/data/dailyCards.ts`

### 11.1 Overview

Each day, the player receives ONE random card that can be positive, negative, or neutral. Cards are drawn automatically at the start of each new day (inside `startNextDay()`).

### 11.2 Card Structure

```typescript
interface DailyCard {
  id: string;
  name: string;           // Persian name
  emoji: string;
  type: "positive" | "negative" | "neutral";
  description: string;    // Persian description
  weight: number;          // relative probability (higher = more likely)
  effects: CardEffect[];
  checkingOnly?: boolean;  // only touches checking, never savings
  savingsShield?: boolean; // savings reduces monetary loss by 70%
}
```

### 11.3 Card Pool

#### Positive Cards (~37% probability)

| ID | Name | Emoji | Effects | Weight |
|----|------|-------|---------|--------|
| `bonus_salary` | پاداش حقوقی | 🎉 | +5M checking | 8 |
| `family_gift` | هدیه خانواده | 🎁 | +3M checking, +10 happiness | 7 |
| `lottery_win` | بلیت بخت‌آزمایی | 🍀 | +15M checking, +20 happiness | 2 |
| `tax_refund` | بازگشت مالیات | 🏛️ | +2M checking | 6 |
| `found_money` | پول پیدا کردی! | 💵 | +1M checking, +5 happiness | 5 |

#### Negative Cards (~32% probability)

| ID | Name | Emoji | Effects | Shield | Weight |
|----|------|-------|---------|--------|--------|
| `robbery` | دزدی! | 🦹 | -8M checking, -15 happiness | ✅ savingsShield + checkingOnly | 5 |
| `phone_broken` | گوشیت خراب شد | 📱 | -3M checking, -10 happiness | ❌ | 6 |
| `tax_penalty` | جریمه مالیاتی | 📋 | -5M checking | ❌ | 5 |
| `car_accident` | تصادف جزئی | 🚗 | -4M checking, -15 energy | ❌ | 4 |
| `pickpocket` | جیب‌بری! | 🤏 | -2M checking | ✅ savingsShield + checkingOnly | 6 |

#### Neutral Cards (~31% probability)

| ID | Name | Emoji | Effects | Weight |
|----|------|-------|---------|--------|
| `mentor_advice` | نصیحت استاد | 🧓 | +15 xp | 6 |
| `motivation_burst` | انگیزه ناگهانی | 🔥 | +20 energy, +10 happiness | 7 |
| `boring_day` | روز خسته‌کننده | 😐 | -5 happiness | 8 |
| `social_invite` | دعوت دوستانه | 🎊 | +15 happiness, -1M checking | 5 |

### 11.4 Weighted Random Selection

```typescript
function drawRandomCard(): DailyCard {
  totalWeight = sum of all card weights
  roll = random(0, totalWeight)
  iterate cards, subtract weight from roll until roll <= 0
}
```

### 11.5 Integration Flow

1. Player clicks "شروع روز بعد" in EndOfDaySummary
2. `startNextDay()` runs: interest → loan payments → card draw → effects applied
3. `todayCard` and `cardShielded` set in state
4. DailyCardModal appears showing the card result
5. Player dismisses → new day begins

### 11.6 State

```typescript
todayCard: DailyCard | null;         // today's drawn card
cardHistory: { dayInGame: number; cardId: string }[];  // history log
cardShielded: boolean;               // was savings shield active?
```

### 11.7 Tuning Guide

To adjust card system balance:
- **Card probabilities**: Change `weight` values in `DAILY_CARDS` array
- **Add new cards**: Add entries to `DAILY_CARDS` in `src/data/dailyCards.ts`
- **Effect amounts**: Change `value` in each card's `effects` array
- **Shield strength**: Change `value * 0.3` factor in `startNextDay()` (currently 70% reduction)
- **Add new effect targets**: Add to `CardEffect.target` type union and handle in `startNextDay()`

---

## 12. Mission System

### 12.1 Types

- **Story Arc**: Multi-episode narrative quests
- **Daily Missions**: 3 per day (e.g., eat breakfast, work shift, study)
- **Weekly Missions**: 2 per week (e.g., work 5 days, exercise 3 times)
- **Milestones**: Long-term achievements (e.g., save 50M, complete 5 courses)

### 12.2 Rewards

Missions award combinations of: XP, Stars, Money, Badges

---

## 13. Marketplace (جمعه‌بازار)

**Files**: `src/data/marketplaceData.ts`, `src/app/market/page.tsx`

### 13.1 Overview

Central hub for buying and selling all non-food items: fridges, electronics, furniture, appliances.

### 13.2 Market Categories

| Category | Key | Description |
|----------|-----|-------------|
| لوازم خانگی | `appliance` | Appliances (washing machine, AC, vacuum) |
| الکترونیک | `electronics` | Phones, laptops, gaming consoles |
| مبلمان | `furniture` | Sofas, beds, desks |
| وسیله نقلیه | `vehicle` | Vehicles (displayed but managed via living) |
| مسکن | `housing` | Housing (displayed but managed via living) |

### 13.3 Market Item Structure

```typescript
interface MarketItem {
  id: string;
  name: string;
  emoji: string;
  category: MarketCategory;
  description: string;
  price: number;
  resaleValue: number;        // sell-back price (< purchase price)
  requiredLevel: number;
  passiveBonus?: { energy?: number; happiness?: number; health?: number };
  fridgeSpec?: { slots: number; shelfLifeBonus: number };
  upgradeLink?: { system: "fridge"; tierId: string };
  isSponsored?: boolean;
  brand?: string;
}
```

### 13.4 Items Catalog (~25 items)

**Fridges (7):** Basic → Smart → LG → Samsung → Bosch (branded ones have more slots + shelf life)
**Appliances (3):** Washing machine, AC, vacuum cleaner
**Electronics (6):** Basic phone, Samsung, iPhone, basic laptop, MacBook, PS5
**Furniture (5):** Basic sofa, luxury sofa, desk, bookshelf, bed

### 13.5 Tabs

| Tab | Key | Description |
|-----|-----|-------------|
| 🛒 خرید | `buy` | Browse and buy from catalog with category filter |
| 💰 فروش | `sell` | Sell owned items to system at resaleValue |
| 🏪 بازار آزاد | `bazaar` | NPC peer listings at 60-90% discount |

### 13.6 NPC Peer Listings (Bazaar)

```typescript
interface MarketListing {
  id: string;
  itemId: string;
  sellerName: string;
  sellerEmoji: string;
  askingPrice: number;     // 60-90% of retail
  condition: "new" | "used";
}
```

- Generated daily via `generateNpcListings(currentDay, count)`
- Refreshed in `startNextDay()`
- Seeded by day number for consistency

### 13.7 Store Actions

| Method | Description |
|--------|-------------|
| `buyFromMarket(itemId)` | Buy from catalog, deduct checking, add to inventory |
| `sellToSystem(itemId)` | Sell owned item at resaleValue |
| `buyFromListing(listingId)` | Buy from NPC listing at discounted price |

### 13.8 Inventory & Passive Bonuses

- `inventory: string[]` — array of owned item IDs (persisted)
- Items with `passiveBonus` grant daily stat boosts in `startNextDay()`
- Fridge items delegate to `upgradeFridge()` for fridge system integration

---

## 14. Fridge System

**Files**: `src/data/fridgeData.ts`, `src/app/fridge/page.tsx`

### 14.1 Fridge Tiers

| ID | Name | Emoji | Slots | Shelf Life Bonus | Price | Level | Branded |
|----|------|-------|-------|-----------------|-------|-------|---------|
| `basic` | یخچال ساده | 🧊 | 6 | +0 | 0 | 1 | No |
| `medium` | یخچال متوسط | ❄️ | 10 | +1 | 8M | 2 | No |
| `large` | یخچال بزرگ | 🧊 | 14 | +2 | 18M | 4 | No |
| `smart` | یخچال هوشمند | 🌡️ | 16 | +3 | 30M | 6 | No |
| `lg` | یخچال LG | ❄️ | 18 | +3 | 42M | 7 | ✅ LG |
| `samsung` | یخچال سامسونگ | 🧊 | 20 | +4 | 50M | 8 | ✅ Samsung |
| `bosch` | یخچال بوش | ❄️ | 24 | +5 | 65M | 10 | ✅ Bosch |

### 14.2 Food System

- `FOOD_CATALOG`: Array of food items with `baseShelfLife`, `effects`, `price`
- Total shelf life = `baseShelfLife + fridgeTier.shelfLifeBonus`
- Food stored as `FridgeSlot: { foodId, purchasedOnDay, expiresOnDay }`

### 14.3 Expired Food Auto-Trash

On entering fridge page, `clearExpiredItems()` runs automatically:
- Removes all items where `expiresOnDay <= player.dayInGame`
- Returns list of expired food names
- Applies happiness penalty: `-2 per expired item`
- Shows dismissible banner listing discarded items

### 14.4 Tabs

| Tab | Description |
|-----|-------------|
| ❄️ یخچال | View fridge contents, eat or trash food, see empty slots |
| 🛒 سوپرمارکت | Buy food with category filter, shows shelf life with bonus |
| ⬆️ ارتقا | Upgrade fridge tier (net cost = new price - current resaleValue) |

---

## 15. Leisure System (یه کاری کن)

**Files**: `src/data/leisureData.ts`, `src/components/home/LeisureButton.tsx`

### 15.1 Overview

Random leisure button on home page. Picks a random available activity based on player's inventory and fridge contents.

### 15.2 Activity Types (15 total)

#### No Requirements
| Activity | Emoji | Effects | Time |
|----------|-------|---------|------|
| کشش و نرمش | 🧘 | ⚡+5 😊+3 ❤️+3 | 10min |
| خیال‌پردازی | 💭 | 😊+5 | 15min |
| قدم زدن تو خونه | 🚶 | ⚡+3 😊+2 | 5min |

#### Needs Phone
| Activity | Emoji | Requires | Effects | Time |
|----------|-------|----------|---------|------|
| چک کردن اینستاگرام | 📲 | phone_* | 😊+6 ⚡-3 | 20min |
| گوش دادن موزیک | 🎵 | phone_* | 😊+8 ⚡+3 | 15min |
| گوش دادن پادکست | 🎙️ | phone_* | 😊+5 ⚡+2 | 30min |

#### Needs TV/Console/Laptop
| Activity | Emoji | Requires | Effects | Time |
|----------|-------|----------|---------|------|
| تماشای تلویزیون | 📺 | console/laptop | 😊+10 ⚡+5 | 30min |
| سریال دیدن | 🎬 | console/laptop/phone_premium | 😊+12 ⚡+3 | 45min |
| بازی کردن | 🎮 | console_ps5 | 😊+15 ⚡-5 | 60min |
| گشت زدن اینترنت | 🌐 | laptop_* | 😊+4 ⚡-2 | 20min |
| یوتیوب دیدن | ▶️ | laptop/phone_premium | 😊+8 ⚡+2 | 25min |

#### Needs Fridge Food
| Activity | Emoji | Effects | Time |
|----------|-------|---------|------|
| یه میون‌وعده بخور | 🍪 | 😊+6 ⚡+8 | 5min |
| یه غذا درست کن | 🍳 | 😊+10 ⚡+15 ❤️+5 | 40min |

#### Needs Furniture
| Activity | Emoji | Requires | Effects | Time |
|----------|-------|----------|---------|------|
| چرت روی مبل | 😴 | sofa_* | ⚡+15 😊+4 | 20min |
| مطالعه روی مبل | 📖 | sofa_* | 😊+7 ⚡+2 | 30min |

### 15.3 Purchase Suggestions

`getLeisureSuggestions(inventory)` returns up to 3 suggestions for items the player could buy to unlock new activities. Shows as expandable panel with links to `/market`.

### 15.4 Store Action

`doRandomLeisure()`:
1. Filters activities by player's current inventory and fridge contents
2. Picks one randomly
3. Applies effects to player stats
4. If food activity: consumes one random fridge item
5. Returns activity details + consumed food name

---

## 16. Living Costs System

**Files**: `src/data/livingCosts.ts`, `src/app/living/page.tsx`

### 16.1 Overview

Weekly recurring bills calculated from housing, vehicle, and mobile plan choices.

### 16.2 Housing Tiers

| ID | Name | Rent/Month | Purchase | Bills/Week | Happiness | Energy | Level |
|----|------|-----------|----------|------------|-----------|--------|-------|
| `shared_room` | اتاق مشترک | 3M | - | ~2M | +2 | +3 | 1 |
| `studio` | استودیو | 6M | 150M | ~3M | +5 | +5 | 2 |
| `apartment_1bed` | آپارتمان ۱ خوابه | 12M | 500M | ~5M | +8 | +8 | 3 |
| `apartment_2bed` | آپارتمان ۲ خوابه | 18M | 800M | ~7M | +12 | +10 | 5 |
| `villa` | ویلا | 30M | 2B | ~12M | +18 | +15 | 8 |
| `penthouse` | پنت‌هاوس | 50M | 5B | ~18M | +25 | +20 | 10 |

### 16.3 Vehicle Tiers

| ID | Name | Purchase | Fuel+Insurance/Week | Happiness | Level |
|----|------|----------|-------------------|-----------|-------|
| `none` | پیاده/مترو | 0 | 0 | +0 | 1 |
| `motorcycle` | موتورسیکلت | 15M | 500K | +3 | 2 |
| `pride` | پراید | 50M | 1.5M | +5 | 3 |
| `peugeot` | پژو ۲۰۶ | 120M | 2M | +8 | 4 |
| `samand` | سمند | 100M | 2.5M | +7 | 4 |
| `mvm` | MVM X55 | 200M | 3M | +10 | 6 |
| `hyundai` | هیوندای توسان | 500M | 4M | +15 | 8 |
| `benz` | مرسدس بنز | 1.5B | 6M | +25 | 10 |

### 16.4 Mobile Plans

| ID | Name | Data GB | Weekly Cost |
|----|------|---------|-------------|
| `prepaid` | اعتباری | 2 | 50K |
| `basic` | مقرون | 5 | 200K |
| `standard` | استاندارد | 20 | 500K |
| `premium` | پریمیوم | 100 | 1M |
| `unlimited` | نامحدود | ∞ | 2M |

### 16.5 Weekly Bills Calculation

```
total = housing.bills (water + electricity + gas + internet)
      + housing.monthlyRent / 4 (if renting)
      + vehicle.weeklyFuelCost + vehicle.weeklyInsurance
      + mobilePlan.weeklyCost
```

Auto-deducted every 7 days via `startNextDay()`.

---

## 17. Design System

**Files**: `src/theme/tokens.ts`, `src/components/ui/`

### 17.1 Token System

Single source of truth for all visual constants in `src/theme/tokens.ts`:

| Export | Description |
|--------|-------------|
| `colors` | All color values (brand, semantic, surface, text, overlay) |
| `sp` | Spacing scale (xs:4 → 6xl:40) |
| `radius` | Border radius scale (sm:8 → pill:9999) |
| `font` | Font sizes (2xs:8 → 5xl:24) + weights (normal:400 → black:900) |
| `shadow` | Box shadow presets |
| `icon` | Icon size presets (sm:36, md:46, lg:48) |

### 17.2 Preset Style Objects

| Export | Description |
|--------|-------------|
| `cardStyle` | Glass card container |
| `sponsoredCardStyle` | Branded card with gold border |
| `iconBoxStyle(size)` | Rounded icon container |
| `sponsoredBadgeStyle` | "✦ Brand" gold badge |
| `statChipStyle(color)` | Small stat chip (⚡+20) |
| `tierChipStyle(color)` | Larger tier/upgrade chip |
| `tabStyle(active, color)` | Tab button styling |
| `actionBtnStyle(enabled, color)` | Action button (buy, sell, eat) |
| `chipStyle(active, color)` | Filter chip |
| `bannerStyle(color)` | Section info banner |
| `emptyStateStyle` | Empty state text |
| `pageContentStyle` | Page content wrapper |
| `pageHeaderStyle` | Page header with back button |
| `backBtnStyle` | Back button circle |
| `toastStyle` | Toast notification |
| `tabBarStyle` | Tab bar container |

### 17.3 Shared UI Components

**Directory**: `src/components/ui/` (barrel export via `index.ts`)

| Component | Props | Description |
|-----------|-------|-------------|
| `PageShell` | title, titleEmoji, subtitle?, headerRight?, children | Full page wrapper with TopHeader, BottomNav, back button |
| `TabBar<T>` | tabs, active, onChange, color? | Generic tab bar |
| `Toast` | message: string \| null | Toast notification |
| `ChipFilter` | chips, active, onChange, color? | Horizontal scrollable filter chips |
| `ItemCard` | emoji, name, isSponsored?, brand?, badges?, description?, details?, action?, sponsoredIconBg?, iconSize? | Universal item card |
| `BalanceBar` | amount, label? | Balance display bar |
| `StatBar` | stats: {label, value, emoji, color, warnBelow?}[] | Horizontal stat pills with warning colors |

### 17.4 Adoption

Pages refactored to use design system:
- ✅ `/fridge` — Full refactor with PageShell, TabBar, ItemCard, tokens
- ✅ `/market` — Full refactor with PageShell, TabBar, ItemCard, ChipFilter, tokens
- 🔄 `/living` — Pending refactor

---

## 18. UI Architecture

### 18.1 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Character stage, HUD, actions, routine, time bar, leisure button |
| `/jobs` | Jobs | Job listings with seniority tabs, application modal |
| `/bank` | Bank | Checking/savings, loans, interest |
| `/city` | City | Economic wave, events, opportunities, market analysis |
| `/fridge` | Fridge | Food inventory, supermarket, fridge upgrades |
| `/market` | Marketplace | Buy/sell items, NPC bazaar |
| `/living` | Living Costs | Housing, vehicles, mobile plans, weekly bills |
| `/missions` | Missions | Story arc, daily/weekly missions, milestones |
| `/profile` | Profile | Stats, skills, badges, rankings |
| `/skills` | Skills | Hard/soft skills, active course |

### 18.2 Key Components

- **ActionBottomSheet**: Main action execution flow (choose → execute → result)
- **GameHUD**: Top-level stats display
- **TimeBar**: Day progress and phase indicator
- **EndOfDaySummary**: End-of-day stats summary
- **DailyCardModal**: Random daily card popup (after starting new day)
- **CharacterStage**: Player avatar and room
- **DailyRoutine**: 4-slot routine manager
- **LeisureButton**: Random leisure activity picker with purchase suggestions

### 18.3 Layout

- **TopHeader**: Player info, stats bar
- **BottomNav**: Navigation tabs (Home, Jobs, City, Profile)
- **GameTickProvider**: Wraps app, runs engine ticks

---

## 19. State Persistence

Zustand persist middleware saves to localStorage under key `"shahre-man-game"`:

```typescript
partialize: (state) => ({
  player, bank, indicators, behavior, activeEvents, eventCooldowns,
  wave, currentTick, actionsCompletedToday, routine, routineStreak,
  routineCompletedToday, completedCourses,
  todayCard, cardHistory, cardShielded,
  currentMinutes, isEndOfDay,
  fridge, inventory, marketListings, living,
})
```

Non-persisted state (re-seeded on load): job, skills, jobListings, cityPlayers, cityOpportunities, marketInsight.

---

## 16. Dynamic City Simulation Engine

### 16.1 Overview

The city simulation runs **once per day** (triggered in `startNextDay()`) and models the macro-economic environment of Tehran. It runs independently from the legacy tick-based engine (`src/engine/`) and is stored in a separate Zustand store.

**File location**: `src/game/city/`
**Store key**: `"shahre-man-city"` (persisted)

---

### 16.2 Core Types (`types.ts`)

| Type | Purpose |
|------|---------|
| `SectorId` | 6 sectors: `tech`, `finance`, `construction`, `retail`, `services`, `manufacturing` |
| `SectorState` | Health (0–100), salary multiplier (0.5–1.8), job demand (0–100), trend |
| `CityWaveId` | 7 wave types: stability, tech_boom, recession, construction_surge, finance_bull, retail_holiday, manufacturing_revival |
| `CityWave` | Wave definition: sector modifiers (healthDelta, salaryMod, jobDemandDelta), inflation delta, investment bonus, min/max days |
| `CityEvent` | Event: affected sectors, health/salary/job/investment impacts, duration, optional mission tag |
| `ActiveCityEvent` | Event currently running + `remainingDays`, `startedOnDay` |
| `CityState` | Snapshot: sectors, currentWaveId, waveRemainingDays, activeEvents, economyHealth, inflationLevel, lastUpdatedDay |

---

### 16.3 Economy Sectors

Each sector has:
- **health** (0–100): sector vitality, drifts toward mean (60) with ±3% per day
- **salaryMultiplier** (0.5–1.8): applied to all job salaries in that sector
- **jobDemand** (0–100): affects how many openings are available
- **trend**: `"up"` | `"flat"` | `"down"` for UI indicators

Sector weights in economy health score:
| Sector | Weight |
|--------|--------|
| Tech | 25% |
| Finance | 20% |
| Construction | 15% |
| Retail | 15% |
| Services | 15% |
| Manufacturing | 10% |

---

### 16.4 City Waves (`seed-waves.ts`)

7 named archetypes cycle through the city. Each wave lasts 4–10 days and modifies all sectors daily.

| Wave | Primary Beneficiary | Investment Bonus |
|------|---------------------|-----------------|
| Stability ⚖️ | Balanced | ×1.0 |
| Tech Boom 🚀 | Tech, Finance | ×1.3 |
| Recession 📉 | None (all hurt) | ×0.7 |
| Construction Surge 🏗️ | Construction, Manufacturing | ×1.1 |
| Finance Bull 🐂 | Finance, Tech | ×1.5 |
| Retail Holiday 🛍️ | Retail, Services | ×1.0 |
| Manufacturing Revival 🏭 | Manufacturing, Construction | ×1.1 |

Wave cycle order: `stability → tech_boom → construction_surge → stability → finance_bull → retail_holiday → stability → recession → manufacturing_revival → (repeat)`

---

### 16.5 City Events (`seed-events.ts`)

12 event templates that can fire during the simulation. Each event:
- Is active for 3–6 days
- Applies `sectorHealthDelta` to affected sectors each day
- Modifies salary and investment multipliers
- Can be restricted to specific waves (`triggerWaves`)
- May carry a `missionEventTag` for mission engine integration

| Event | Severity | Key Impact |
|-------|----------|-----------|
| AI Investment Surge | major | +12% salary, +20% investments |
| Tech Layoffs | crisis | -15% salary, -10 job demand |
| Dollar Spike | major | +30% investments, -5% salary |
| Stock Crash | crisis | -25% investments |
| Banking Bonus | minor | +10% investments |
| Housing Boom | major | +10% construction salary |
| Infrastructure Project | major | +8 job demand in construction |
| Norouz Rush | minor | +retail job demand |
| Import Ban | major | -retail/manufacturing health |
| Factory Strike | crisis | -manufacturing health |
| Export Deal | major | +manufacturing/construction |
| Energy Crisis | crisis | -7% salary across 3 sectors |

---

### 16.6 Daily Simulation Flow (`city-simulation.ts`)

Called via `useCityStore.getState().advanceDay(dayInGame)` inside `startNextDay()`.

```
1. tickActiveEvents()         → decrement remainingDays, remove expired
2. checkWaveDayTransition()   → possibly rotate to next wave
3. applyDailyImpacts()        → update all 6 sectors (wave mod + event mod + mean reversion)
4. calcEconomyHealth()        → composite score from sector weights
5. generateDailyEvents()      → probabilistic roll (0-2 new events)
6. Update inflationLevel      → slow drift based on wave.globalInflationDelta
```

---

### 16.7 Player-Facing Multipliers (`city-helpers.ts`)

| Function | Returns | Used by |
|----------|---------|---------|
| `getSectorSalaryMultiplier(state, sectorId)` | `salaryMultiplier` for that sector | Job listings |
| `getInvestmentMultiplier(state)` | Wave bonus + finance health + events | Invest action |
| `getCostOfLivingMultiplier(state)` | 0.80–1.45× (inflation 10–90) | Living costs |
| `getCityPlayerSummary(state)` | Full `CityPlayerSummary` object | City page UI |
| `jobCategoryToSector(category)` | Maps job strings to `SectorId` | Job salary calc |

---

### 16.8 Store (`city-store.ts`)

```typescript
useCityStore {
  // State (CityState fields spread)
  sectors, currentWaveId, waveRemainingDays, activeEvents, economyHealth, ...

  // Actions
  advanceDay(dayInGame: number): void   // idempotent (skips if already updated)
  getPlayerSummary(): CityPlayerSummary
  resetCity(): void
}
```

---

### 16.9 City UI Components

| Component | Location | Shows |
|-----------|----------|-------|
| `SectorGrid` | `src/components/city/SectorGrid.tsx` | 2-col grid of all 6 sectors with health bars, salary multiplier, trend arrow |
| `CityEventsList` | `src/components/city/CityEventsList.tsx` | Active wave card + list of active city events with severity badges |

Both components pull directly from `useCityStore` (no prop drilling).

---

### 16.10 Integration Points

- **`gameStore.startNextDay()`** → calls `useCityStore.getState().advanceDay()` via lazy require
- **Job market** → use `getSectorSalaryMultiplier()` when displaying or applying for jobs
- **Investment action** → use `getInvestmentMultiplier()` to scale investment returns
- **Mission engine** → city events with `missionEventTag` can be used to trigger event missions
- **City page** → `SectorGrid` and `CityEventsList` components replace basic event display


---

## 17. Integration Layer: City Engine ↔ Game Systems

### 17.1 Overview

The integration layer converts `CityState` into concrete gameplay modifiers consumed by the Job Market, Investment, Mission Engine, and City UI.

**File location**: `src/game/integration/`
**Trigger**: called in `gameStore.startNextDay()` after city simulation runs

---

### 17.2 Data Flow

```
City Simulation (daily) → CityState
        ↓
city-impact-resolver.ts → CityGameplayModifiers
        ↓
┌──────────────┬────────────────┬─────────────────┬──────────────────┐
│ Job Market   │ Investment     │ Mission Engine  │ Opportunities    │
│ salary mult  │ return by asset│ event missions  │ player actions   │
│ hiring mod   │ risk mod       │ weight boosts   │ shown on city UI │
└──────────────┴────────────────┴─────────────────┴──────────────────┘
```

---

### 17.3 `CityGameplayModifiers` Structure (`city-impact-resolver.ts`)

```typescript
{
  jobMarket: {
    salaryMultiplierBySector: Record<SectorId, number>
    hiringChanceModifierBySector: Record<SectorId, number>  // additive %
    jobListingCountMultiplierBySector: Record<SectorId, number>
  }
  investment: {
    returnModifierByAsset: Record<InvestmentAsset, number>  // multiplicative
    riskModifierByAsset: Record<InvestmentAsset, number>    // additive chance
  }
  economy: {
    costOfLivingMultiplier: number
    rentMultiplier: number
    foodPriceMultiplier: number
    transportMultiplier: number
  }
  missions: {
    eventMissionTypes: string[]
    missionWeightBoosts: Partial<Record<string, number>>
  }
}
```

---

### 17.4 Job-City Bridge (`job-city-bridge.ts`)

| Function | Purpose |
|----------|---------|
| `enrichJobListingsWithCity(listings, modifiers)` | Returns job listings with city-scaled salaries + hiring modifiers |
| `calcHiringProbability(params)` | Combines baseChance + skill + reputation + cityModifier |
| `getCityAdjustedSalary(baseSalary, sector, modifiers)` | Per-sector salary with city mult |
| `getJobCityImpactLabel(sector, modifiers)` | Persian label for UI badges |

Hiring formula:
```
hireChance = baseChance + skillScore × 0.3 + reputation × 0.1 + cityHiringModifier
             clamped to [0.05, 0.95]
```

---

### 17.5 Investment-City Bridge (`investment-city-bridge.ts`)

Asset types: `stocks`, `crypto`, `gold`, `startup`, `bank_savings`, `real_estate`

Example wave effects on return multipliers:
| Wave | Stocks | Crypto | Gold | Startup |
|------|--------|--------|------|---------|
| finance_bull | ×1.35 | ×1.0 | ×1.05 | ×1.0 |
| tech_boom | ×1.0 | ×1.4 | ×1.05 | ×1.3 |
| recession | ×0.75 | ×0.6 | ×1.15 | ×0.7 |

High inflation → bank_savings real return ×0.9, gold ×1.25

---

### 17.6 Mission-City Bridge (`mission-city-bridge.ts`)

Generates new `Mission` objects from city wave/events. Injected into `useMissionStore.activeEventMission` each day.

- Wave missions: 1 per wave type (tech_boom → work shift, recession → save money, etc.)
- Event missions: fire once when event starts (`startedOnDay === dayInGame`)
- All use correct `MissionObjective` union types from `@/game/missions/types`

---

### 17.7 Opportunity Generator (`opportunity-generator.ts`)

Generates 2–4 `CityOpportunity[]` items shown on city page:
- **job_hiring**: sector with highest demand
- **investment_hot**: when wave.investmentBonus > 1.1
- **cost_alert**: recession or economyHealth < 40
- **skill_demand**: top sector (tech/finance)
- Events with severity major/crisis

Stored in `gameStore.cityIntegrationOpportunities`, shown via `CityOpportunities` component.

---

### 17.8 Daily Pipeline (`daily-integration-pipeline.ts`)

```typescript
runDailyIntegrationPipeline(cityState, dayInGame, playerLevel)
→ {
    modifiers: CityGameplayModifiers,
    opportunities: CityOpportunity[]
  }
```

Also injects event missions into `useMissionStore` as a side effect.

`getCurrentCityModifiers()` — read-only helper for UI components (no side effects).

---

### 17.9 UI Integration

| Component | Location | Shows |
|-----------|----------|-------|
| `CityOpportunities` | `/city` Events tab | Player opportunity cards with CTA links |
| `CityJobModifiers` | `/jobs` page header | Per-sector salary/hiring impact badges |

