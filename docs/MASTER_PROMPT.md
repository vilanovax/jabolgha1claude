# Master Prompt - Core Game Systems

> This prompt defines the full game architecture for AI-assisted development.
> It covers the core game loop, all major systems, and design principles.
> Use this as the primary reference when building new features.

---

## Game Identity

You are building the core systems of a life-simulation strategy web game.

The game is a mobile-first web app (PWA) that simulates a character's life,
career growth, economic decisions, and daily routines.

The design should feel like a hybrid between:

- BitLife
- Game Dev Tycoon
- The Sims (lite)
- Idle Life Sim
- Social economy simulator

The UI is modern, minimal, and slightly playful.
The architecture must support multiple systems interacting together.

---

## 1. Core Game Loop

The game is built around a repeating loop:

```
Check Status → Choose Action → Time Passes → Receive Results → Update World → Repeat
```

Each game day has limited time.
Players must decide how to spend their time between:

- survival needs (eating, sleeping)
- career growth (work, interviews)
- learning skills (courses, study)
- economic activities (invest, trade)
- personal wellbeing (exercise, rest, leisure)

---

## 2. Time System

Each game day has **960 minutes** (16 active hours).

Day phases:

| Phase | Minutes | Emoji | Description |
|-------|---------|-------|-------------|
| Morning | 0 - 240 | 🌅 | Best for study, breakfast, planning |
| Noon | 240 - 480 | ☀️ | Work shift, interviews |
| Evening | 480 - 720 | 🌇 | Exercise, social, side projects |
| Night | 720 - 960 | 🌙 | Investment, relax, sleep |

Every action consumes time:

| Action | Duration |
|--------|----------|
| Breakfast | 15 min |
| Study session | 60 min |
| Work shift | 480 min |
| Exercise | 45 min |
| Rest | 30 min |

When time reaches 960, the player must sleep.
Sleeping ends the day and resets some stats.

---

## 3. Player Stats System

```typescript
type PlayerStats = {
  level: number;
  xp: number;
  money: number;        // checking account
  savings: number;      // savings account (earns interest)
  stars: number;        // premium currency
  energy: number;       // 0-100, decreases with actions
  hunger: number;       // 0-100, increases over time (needs eating)
  stress: number;       // 0-100, increases with work
  happiness: number;    // 0-100, mood and satisfaction
  health: number;       // 0-100, physical health
  reputation: number;   // social standing
}
```

**Rules:**
- Hunger increases over time → must eat
- Energy decreases with actions → must rest/sleep
- Stress increases with work → must relax
- Exercise improves health
- Rest reduces stress
- Overnight recovery: energy recovers 30% of missing

---

## 4. Action Engine

All actions are defined in a database-like structure:

```typescript
type GameAction = {
  id: string;
  title: string;
  duration: number;          // minutes
  energyCost?: number;
  moneyCost?: number;
  effects: {
    xp?: number;
    money?: number;
    energy?: number;
    health?: number;
    happiness?: number;
    stress?: number;
  };
  probabilityEvents?: {
    chance: number;
    effect: object;
  }[];
}
```

### Action Categories (7)

| Category | ID | Primary Effects |
|----------|-----|----------------|
| Exercise | `exercise` | health ↑, energy ↓ |
| Eating | `eat` | hunger ↓, energy ↑ |
| Sleep | `sleep` | energy ↑↑ |
| Study | `study` | xp ↑, energy ↓ |
| Work | `work` | money ↑, energy ↓, stress ↑ |
| Rest | `rest` | happiness ↑, stress ↓ |
| Investment | `invest` | money ↑↓ (risk) |

Each category has 3 tier options (easy/medium/hard) with optional sponsored variants (branded, more expensive, better effects).

---

## 5. Daily Routine System

The game encourages daily routines:

**Morning routines:**
- Breakfast, planning, short study

**Afternoon:**
- Work, interviews

**Evening:**
- Gym, social, study

**Night:**
- Investment, relax, sleep

The UI highlights recommended actions depending on time of day.
Completing all 4 phase routines gives a streak combo bonus.

---

## 6. Career System

Players progress through jobs with seniority levels:

```typescript
type Job = {
  id: string;
  title: string;
  companyType: "startup" | "corporate" | "government";
  seniorityLevels: {
    key: "junior" | "mid" | "senior";
    salary: number;
    requiredSkills: Record<string, number>;
    requiredCourses: string[];
    minXp: number;
  }[];
  stressLevel: number;
}
```

Players can: apply → interview → receive offer → work shifts → earn salary.
Career progression: Junior → Mid → Senior with increasing requirements.

---

## 7. Skill Tree System

Skills are structured as a tree with prerequisites:

```typescript
type SkillNode = {
  id: string;
  name: string;
  tree: "tech" | "business" | "soft" | "finance";
  prerequisites: string[];
  xpCost: number;
  effects: {
    actionBuff?: string;
    unlockAction?: string;
    statModifier?: object;
  };
}
```

**Categories:** Tech, Business, Soft Skills, Finance
**Courses** unlock skills and job positions.

---

## 8. Economy System

Players can use money in several ways:

| System | Description |
|--------|-------------|
| Bank Savings | Safe, daily interest (~0.08%/day) |
| Stocks | Medium risk, affected by wave system |
| Crypto | High risk, high reward |
| Gold/Coins | Stable store of value |
| Currency (Dollar) | Hedge against inflation |
| Loans | Borrow with monthly payments |

```typescript
type Asset = {
  type: "saving" | "stock" | "crypto" | "gold" | "currency";
  riskLevel: number;       // 0-100
  expectedReturn: number;  // % daily
  volatility: number;      // price swing factor
}
```

**Savings Shield:** Having savings reduces negative daily event losses by 70%.

---

## 9. Dynamic City Events

The city generates random events that affect economy and opportunities:

| Event Type | Example | Effect |
|-----------|---------|--------|
| Economic | Dollar rises 10% | Currency holders profit |
| Job Market | Tech hiring boom | More job offers |
| Recession | Layoffs wave | Job loss risk |
| Opportunity | Freelance surge | Side income available |

Events are driven by 6 economic indicators that drift over time:
IT Demand, Startup Growth, Inflation, Unemployment, Import Pressure, Education Boom.

**Wave System:** 5-phase economic cycles affect all action costs/effects.

---

## 10. Room / Personal Space System

Players can upgrade their room with items from the marketplace:

```typescript
type RoomItem = {
  id: string;
  slot: "bed" | "desk" | "decor" | "appliance" | "electronics";
  price: number;
  effects: {
    energyRecovery?: number;
    focus?: number;
    happiness?: number;
  };
}
```

**Items unlock leisure activities** (TV → watch shows, PS5 → gaming, laptop → browse).
**Branded items** cost more but provide better stat bonuses.

---

## 11. Mission System

```typescript
type Mission = {
  id: string;
  title: string;
  type: "story" | "daily" | "weekly" | "milestone";
  targetValue: number;
  progress: number;
  rewards: { money?: number; xp?: number; stars?: number };
}
```

**Story Arc:** Multi-episode narrative quests (main storyline)
**Daily Missions:** 3 per day (eat breakfast, work shift, study)
**Weekly Missions:** 2 per week (work 5 days, exercise 3 times)
**Milestones:** Long-term achievements (save 50M, complete 5 courses)

---

## 12. End of Day Summary

At the end of each day:

1. Show daily summary: money earned, XP gained, stat changes
2. Draw random daily card (positive/negative/neutral event)
3. Apply savings interest
4. Auto-pay loan installments
5. Apply passive bonuses from owned items
6. Refresh marketplace listings
7. Check for expired fridge items

---

## 13. UI Structure

### Main Layout
- **GameHUD** (fixed top): Day, phase, level, stats
- **BottomNav** (fixed bottom): Home, Jobs, City, Profile

### Home Page Structure
```
HUD
─────────────────────
Hero Mission Card
─────────────────────
Suggested Main Action
─────────────────────
"امروز چیکار می‌کنی؟"
Action Grid (2×3):
🍳 بخور | 💻 کار | 🏋 ورزش
📚 مطالعه | 🛋 استراحت | ❄️ یخچال
─────────────────────
🎲 یه کاری کن (leisure)
─────────────────────
"وضعیت شهر"
City Event Banner
─────────────────────
Quick Links (2×2):
🏦 بانک | 📋 قبوض
🏪 بازار | ❄️ یخچال
```

### Sub-Pages
| Route | Purpose |
|-------|---------|
| `/bank` | Banking, savings, loans |
| `/fridge` | Food inventory, supermarket, fridge upgrades |
| `/market` | Buy/sell items, NPC bazaar |
| `/living` | Housing, vehicles, mobile plans, bills |
| `/jobs` | Job listings, applications |
| `/skills` | Courses, skill tree |
| `/city` | Economic events, wave status |
| `/missions` | Story arc, daily/weekly missions |
| `/profile` | Stats, badges, rankings |

---

## 14. Design Principles

The game should feel:
- **Strategic but simple** — meaningful choices without complexity
- **Relaxing but meaningful** — casual pace with real progression
- **Humorous and social** — relatable real-life situations
- **Addictive** — daily streaks, surprise rewards, luck events

### Gaming Feel
- Icons have glow, bounce, and float animations
- Warning states pulse when stats are low
- Day phase changes color scheme subtly
- Actions show contextual hints (hunger %, last exercise)
- Mission card is prominent with progress bar glow

### Design System
- Single token file for all visual constants (`src/theme/tokens.ts`)
- Shared UI components for consistency (`src/components/ui/`)
- Gold gradient (#D4A843 → #F0C966) for premium/sponsored elements
- Dark glass card aesthetic with subtle borders

### Future Expansion Support
- Multiplayer economy
- City-wide market competition
- Player-to-player trading
- Social features (guilds, leaderboards)
- Real-time events

---

## 15. Addiction Engine (Future)

Systems designed for daily engagement:

| Mechanic | Description |
|----------|-------------|
| Daily Streak | Consecutive days playing → bonus multiplier |
| Surprise Rewards | Random valuable drops on login |
| Luck Events | Lottery, found money, unexpected gifts |
| FOMO Events | Time-limited opportunities |
| Social Proof | "X players earned Y today" |
| Progress Hooks | Always close to next level/milestone |
| Collection Drive | Complete item sets for bonuses |
| Viral Loops | Share achievements, invite friends |
