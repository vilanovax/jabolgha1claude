# Jabolgha (Shahre Man) - Life Simulation Game

## Overview
A Persian-language life simulation game built with Next.js 16 + React 19 + Zustand 5. The player manages vital stats (energy, hunger, happiness, health, XP, money) through daily actions, career progression, and financial decisions.

## Tech Stack
- **Framework**: Next.js 16.1.6 with App Router (Turbopack)
- **UI**: React 19, inline styles with design token system
- **State**: Zustand 5 with persist middleware (key: "shahre-man-game")
- **Language**: Persian (Farsi), RTL, mobile-first PWA

## Project Structure
```
src/
  app/           # Next.js pages (/, /jobs, /bank, /city, /fridge, /market, /living, /missions, /profile, /skills)
  components/    # React components organized by feature
    home/        # Home page (GameHUD, RoomObjects, StoryBubble, LeisureButton, CityEventBanner, etc.)
    ui/          # Shared UI (PageShell, TabBar, Toast, ItemCard, ChipFilter, BalanceBar, StatBar)
    layout/      # TopHeader, BottomNav
    jobs/        # Job-related components
  data/          # Game data catalogs
    mock.ts            # Seed data, types, toPersian(), formatMoney()
    actionTemplates.ts # 7 action categories with sponsored variants
    fridgeData.ts      # Food catalog, fridge tiers (basic → branded)
    marketplaceData.ts # Market items, NPC listings
    leisureData.ts     # Leisure activities, purchase suggestions
    livingCosts.ts     # Housing, vehicles, mobile plans, bills
    loanTypes.ts       # Loan catalog
    dailyCards.ts      # Random daily events
  engine/        # Economic simulation (indicators, waves, triggers, impacts, behavior)
  stores/        # Zustand store (gameStore.ts)
  theme/         # Design system tokens (tokens.ts)
docs/
  GAME_DESIGN.md   # Full game design documentation
  MASTER_PROMPT.md # AI master prompt for building core systems
```

## Key Files
- `src/stores/gameStore.ts` - Central game state + all actions
- `src/theme/tokens.ts` - Design tokens (colors, spacing, radius, fonts, preset styles)
- `src/components/ui/index.ts` - Barrel export for shared UI components

## Commands
- `npm run dev` - Dev server
- `npm run build` - Production build (must pass before commit)
- `npm run lint` - ESLint

## Conventions
- All user-facing text is in Persian
- Design tokens over magic values: use `colors`, `sp`, `radius`, `font` from `@/theme/tokens`
- Preset styles: `cardStyle`, `actionBtnStyle()`, `tierChipStyle()`, `bannerStyle()`, etc.
- Shared components: `PageShell`, `TabBar`, `ItemCard`, `ChipFilter` for consistent pages
- Gold theme (#D4A843, #F0C966) for premium/sponsored elements
- `toPersian()` for digit conversion, `formatMoney()` for currency display
- Guard `formatMoney` against null/undefined inputs
- Game state is flat with actions as Zustand store methods
