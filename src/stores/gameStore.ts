import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  player as seedPlayer,
  bank as seedBank,
  job as seedJob,
  housing as seedHousing,
  skills as seedSkills,
  jobListings as seedJobs,
  cityPlayers as seedPlayers,
  cityOpportunities as seedOpportunities,
  marketInsight as seedInsight,
  completedCourses as seedCompletedCourses,
} from "@/data/mock";

import { LOAN_TYPES, calculateMonthlyPayment } from "@/data/loanTypes";
import type { ActiveLoan } from "@/data/loanTypes";
import { drawRandomCard } from "@/data/dailyCards";
import type { DailyCard } from "@/data/dailyCards";
import { COURSE_CATALOG } from "@/data/mock";
import { FOOD_CATALOG, FRIDGE_TIERS } from "@/data/fridgeData";
import type { FridgeSlot } from "@/data/fridgeData";
import { HOUSING_TIERS, VEHICLE_TIERS, MOBILE_PLANS, calculateWeeklyBills } from "@/data/livingCosts";
import { MARKET_ITEMS, generateNpcListings } from "@/data/marketplaceData";
import type { MarketListing } from "@/data/marketplaceData";
import { LEISURE_ACTIVITIES } from "@/data/leisureData";
import type { LeisureActivity } from "@/data/leisureData";
import { dispatchGameplayEvent } from "@/game/events/eventBus";
import { getActionEvents } from "@/game/actions/actionEventMap";

export interface ActiveCourseState {
  courseId: string;
  isSponsored: boolean;       // enrolled in sponsored variant
  currentDay: number;         // 1-based
  sessionsCompletedToday: number;
  startedOnDay: number;       // player.dayInGame when enrolled
}

export interface CourseEnrollResult {
  success: boolean;
  reason?: string;
}

export interface SessionResult {
  success: boolean;
  reason?: string;
  xpGained?: number;
  energyCost?: number;
  courseCompleted?: boolean;
}

import type {
  EconomicIndicators,
  PlayerBehaviorSignals,
  ActiveEvent,
  WaveState,
  DerivedEconomy,
  EconomyStatus,
  IndicatorKey,
} from "@/engine/types";

import { driftIndicators } from "@/engine/economicIndicators";
import { simulateBehavior } from "@/engine/playerBehavior";
import { checkWaveTransition, createInitialWave } from "@/engine/waveSystem";
import { evaluateTriggers } from "@/engine/triggerEngine";
import { applyEventImpacts } from "@/engine/impactEngine";
import { ACTION_CATEGORIES, WAVE_ACTION_MODIFIERS } from "@/data/actionTemplates";
import type { ActionEffect } from "@/data/actionTemplates";
import { toPersian } from "@/data/mock";

export interface ActionResult {
  success: boolean;
  effects: ActionEffect[];
  riskTriggered?: { label: string };
  insufficientReason?: string;
  wasSponsored?: boolean;
  brandName?: string;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function derivedEconomy(indicators: EconomicIndicators): DerivedEconomy {
  const health = Math.round(
    (100 - indicators.Unemployment_Rate) * 0.25 +
    indicators.IT_Demand * 0.2 +
    indicators.Startup_Growth * 0.2 +
    (100 - indicators.Inflation_Index) * 0.2 +
    indicators.Education_Boom * 0.15,
  );

  const inflationRate = Math.round(indicators.Inflation_Index * 0.1 * 10) / 10;

  let status: EconomyStatus;
  if (health >= 70) status = "رونق";
  else if (health >= 55) status = "پایدار";
  else if (health >= 35) status = "پرنوسان";
  else status = "رکود";

  const activePlayers = Math.round(600 + health * 4);

  return { status, inflationRate, economyHealth: health, activePlayers };
}

const INITIAL_INDICATORS: EconomicIndicators = {
  IT_Demand: 65,
  Startup_Growth: 60,
  Inflation_Index: 45,
  Unemployment_Rate: 25,
  Import_Pressure: 40,
  Education_Boom: 50,
};

const INITIAL_BEHAVIOR: PlayerBehaviorSignals = {
  itJobsTakenPct: 52,
  dollarInvestorsPct: 22,
  unemployedPct: 18,
  studyingPct: 30,
  startupFoundersPct: 30,
  avgITSkillLevel: 5.5,
};

interface GameState {
  // Player & world data (seeded from mock)
  player: typeof seedPlayer;
  bank: typeof seedBank;
  job: typeof seedJob;
  housing: typeof seedHousing;
  skills: typeof seedSkills;
  jobListings: typeof seedJobs;
  cityPlayers: typeof seedPlayers;
  cityOpportunities: typeof seedOpportunities;
  cityIntegrationOpportunities: import("@/game/integration/opportunity-generator").CityOpportunity[];
  marketInsight: typeof seedInsight;

  // Event engine state
  indicators: EconomicIndicators;
  behavior: PlayerBehaviorSignals;
  activeEvents: ActiveEvent[];
  eventCooldowns: Record<string, number>;
  wave: WaveState;
  currentTick: number;
  isRunning: boolean;

  // Action engine state
  actionsCompletedToday: string[];   // category IDs done today

  // Course / education state
  completedCourses: string[];        // IDs of completed courses
  activeCourse: ActiveCourseState | null;

  // Daily card state
  todayCard: DailyCard | null;
  cardHistory: { dayInGame: number; cardId: string }[];
  cardShielded: boolean;             // was savings shield active for today's card?

  // Fridge state
  fridge: {
    tierId: string;
    items: FridgeSlot[];
  };

  // Living costs state
  living: {
    housingId: string;
    isOwned: boolean;
    vehicleId: string;
    mobilePlanId: string;
    lastBillDay: number;       // last day bills were paid
  };

  // Marketplace state
  inventory: string[];               // owned MarketItem IDs
  marketListings: MarketListing[];    // NPC + player listings

  // Actions
  tick: () => void;
  setRunning: (v: boolean) => void;
  resetGame: () => void;
  executeAction: (categoryId: string, optionIndex: number, useSponsored?: boolean) => ActionResult;
  completeCourse: (courseId: string) => void;
  // Education
  enrollCourse: (courseId: string, useSponsored: boolean) => CourseEnrollResult;
  completeSession: () => SessionResult;
  dropCourse: () => void;
  isJobEligible: (jobId: number, seniority: "junior" | "mid" | "senior") => { eligible: boolean; missingXp: boolean; missingCourses: string[]; missingSkills: string[] };
  // Banking
  depositToSavings: (amount: number) => { success: boolean; reason?: string };
  withdrawFromSavings: (amount: number) => { success: boolean; reason?: string };
  takeLoan: (loanTypeId: string) => { success: boolean; reason?: string };
  payLoanInstallment: (loanId: string) => { success: boolean; reason?: string };
  // Living costs
  upgradeHousing: (tierId: string, buy: boolean) => { success: boolean; reason?: string };
  upgradeVehicle: (tierId: string) => { success: boolean; reason?: string };
  changeMobilePlan: (planId: string) => { success: boolean; reason?: string };
  // Fridge
  buyFood: (foodId: string) => { success: boolean; reason?: string };
  eatFood: (slotIndex: number) => { success: boolean; effects?: { energy: number; happiness: number; health: number }; reason?: string };
  trashFood: (slotIndex: number) => void;
  upgradeFridge: (tierId: string) => { success: boolean; reason?: string };
  clearExpiredItems: () => { expiredNames: string[] };
  // Marketplace
  buyFromMarket: (itemId: string) => { success: boolean; reason?: string };
  sellToSystem: (itemId: string) => { success: boolean; reason?: string };
  buyFromListing: (listingId: string) => { success: boolean; reason?: string };
  // Leisure (یه کاری کن)
  doRandomLeisure: () => { success: boolean; activity?: LeisureActivity; reason?: string; ateFoodName?: string };
  // Day transition
  startNextDay: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Seed data
      player: { ...seedPlayer },
      bank: { ...seedBank },
      job: { ...seedJob },
      housing: { ...seedHousing },
      skills: { ...seedSkills },
      jobListings: [...seedJobs],
      cityPlayers: [...seedPlayers],
      cityOpportunities: [...seedOpportunities],
      cityIntegrationOpportunities: [],
      marketInsight: { ...seedInsight },

      // Engine initial state
      indicators: { ...INITIAL_INDICATORS },
      behavior: { ...INITIAL_BEHAVIOR },
      activeEvents: [],
      eventCooldowns: {},
      wave: createInitialWave(),
      currentTick: 0,
      isRunning: true,

      // Action engine initial state
      actionsCompletedToday: [],

      // Course / education initial state
      completedCourses: [...seedCompletedCourses],
      activeCourse: null,

      // Daily card initial state
      todayCard: null,
      cardHistory: [],
      cardShielded: false,

      // Fridge initial state
      fridge: { tierId: "basic", items: [] },

      // Living costs initial state
      living: {
        housingId: "apartment_basic",
        isOwned: false,
        vehicleId: "none",
        mobilePlanId: "basic",
        lastBillDay: 0,
      },

      // Marketplace initial state
      inventory: [],
      marketListings: [],

      setRunning: (v) => set({ isRunning: v }),

      startNextDay: () => {
        set((state) => {
          const newPlayer = { ...state.player };
          newPlayer.dayInGame += 1;
          // Overnight recovery: restore 30% of missing energy
          const missingEnergy = 100 - newPlayer.energy;
          newPlayer.energy = Math.min(100, newPlayer.energy + Math.round(missingEnergy * 0.3));

          // ─── Banking: daily savings interest ───
          const newBank = { ...state.bank };
          const dailyInterest = Math.round(newBank.savings * (newBank.savingsInterestRate / 100));
          newBank.savings += dailyInterest;
          newBank.totalInterestEarned += dailyInterest;

          // ─── Banking: auto-pay loan installments ───
          const updatedLoans: ActiveLoan[] = [];
          for (const loan of newBank.loans) {
            if (newPlayer.dayInGame >= loan.nextPaymentDay) {
              if (newBank.checking >= loan.monthlyPayment) {
                newBank.checking -= loan.monthlyPayment;
                const newRemaining = loan.remainingInstallments - 1;
                if (newRemaining > 0) {
                  updatedLoans.push({
                    ...loan,
                    remainingInstallments: newRemaining,
                    remainingPrincipal: Math.max(0, loan.remainingPrincipal - Math.round(loan.monthlyPayment * (1 - loan.interestRate / 100))),
                    nextPaymentDay: loan.nextPaymentDay + 30,
                  });
                }
                // if newRemaining === 0, loan is paid off — don't add it back
              } else {
                // Late payment: penalty
                updatedLoans.push({
                  ...loan,
                  latePayments: loan.latePayments + 1,
                  nextPaymentDay: loan.nextPaymentDay + 30,
                });
                newPlayer.happiness = Math.max(0, newPlayer.happiness - 10);
              }
            } else {
              updatedLoans.push(loan);
            }
          }
          newBank.loans = updatedLoans;

          // ─── Daily card draw ───
          const card = drawRandomCard();
          let shielded = false;

          for (const effect of card.effects) {
            let value = effect.value;

            // Savings shield: reduce monetary loss by 70% if player has savings
            if (card.savingsShield && effect.target === "checking" && value < 0 && newBank.savings > 0) {
              value = Math.round(value * 0.3); // only 30% of damage gets through
              shielded = true;
            }

            if (effect.target === "checking") {
              if (card.checkingOnly) {
                newBank.checking = Math.max(0, newBank.checking + value);
              } else {
                newBank.checking = Math.max(0, newBank.checking + value);
              }
            } else if (effect.target in newPlayer) {
              (newPlayer as Record<string, unknown>)[effect.target] = Math.max(
                0,
                ((newPlayer as Record<string, unknown>)[effect.target] as number) + value,
              );
            }
          }

          // ─── Course: advance day & reset sessions ───
          let newActiveCourse = state.activeCourse;
          if (newActiveCourse) {
            const courseDef = COURSE_CATALOG.find((c) => c.id === newActiveCourse!.courseId);
            if (courseDef) {
              const nextDay = newActiveCourse.currentDay + 1;
              if (nextDay > courseDef.totalDays) {
                // Course completed! (handled via completeSession, but safety net)
                newActiveCourse = null;
              } else {
                newActiveCourse = {
                  ...newActiveCourse,
                  currentDay: nextDay,
                  sessionsCompletedToday: 0,
                };
              }
            }
          }

          // ─── Weekly bills ───
          let newLiving = { ...state.living };
          const daysSinceLastBill = newPlayer.dayInGame - newLiving.lastBillDay;
          if (daysSinceLastBill >= 7) {
            const { total } = calculateWeeklyBills(
              newLiving.housingId, newLiving.vehicleId,
              newLiving.mobilePlanId, newLiving.isOwned,
            );
            if (newBank.checking >= total) {
              newBank.checking -= total;
            } else {
              // Can't pay bills: deduct what we can, happiness penalty
              newBank.checking = 0;
              newPlayer.happiness = Math.max(0, newPlayer.happiness - 15);
            }
            newLiving = { ...newLiving, lastBillDay: newPlayer.dayInGame };
          }

          // ─── Marketplace: refresh NPC listings ───
          const newListings = generateNpcListings(newPlayer.dayInGame, 3);

          // ─── Inventory: apply passive bonuses ───
          for (const ownedId of state.inventory) {
            const item = MARKET_ITEMS.find((m) => m.id === ownedId);
            if (item?.passiveBonus) {
              if (item.passiveBonus.energy) newPlayer.energy = Math.min(100, newPlayer.energy + item.passiveBonus.energy);
              if (item.passiveBonus.happiness) newPlayer.happiness = Math.min(100, newPlayer.happiness + item.passiveBonus.happiness);
              if (item.passiveBonus.health) newPlayer.health = Math.max(0, Math.min(100, (newPlayer.health ?? 80) + (item.passiveBonus.health ?? 0)));
            }
          }

          // ─── Fridge: expire items ───
          const newFridgeItems = state.fridge.items.filter(
            (slot) => newPlayer.dayInGame <= slot.expiresOnDay,
          );
          const expiredCount = state.fridge.items.length - newFridgeItems.length;
          if (expiredCount > 0) {
            newPlayer.happiness = Math.max(0, newPlayer.happiness - expiredCount * 2);
          }

          return {
            player: newPlayer,
            bank: newBank,
            todayCard: card,
            cardShielded: shielded,
            cardHistory: [...state.cardHistory, { dayInGame: newPlayer.dayInGame, cardId: card.id }],
            actionsCompletedToday: [],
            activeCourse: newActiveCourse,
            fridge: { ...state.fridge, items: newFridgeItems },
            living: newLiving,
            marketListings: newListings,
          };
        });

        // ─── Emit day_ended to Mission Engine, then generate new missions ───
        dispatchGameplayEvent({ type: "day_ended" });

        const gs = get();
        const { useMissionStore } = require("@/game/missions/store") as typeof import("@/game/missions/store");
        const missionStore = useMissionStore.getState();
        missionStore.initMissionsForNewDay({
          day: gs.player.dayInGame,
          player: {
            level: gs.player.level,
            xp: gs.player.xp,
            money: gs.bank.checking,
            stars: gs.player.stars ?? 0,
            energy: gs.player.energy,
            hunger: gs.player.hunger,
            stress: gs.player.happiness < 40 ? 65 : gs.player.happiness < 60 ? 35 : 15,
            happiness: gs.player.happiness,
            health: gs.player.health ?? 80,
            reputation: 50,
            currentJobId: null,
            strongestSkillTree: null,
            studySessionsLast7Days: 2,
            workShiftsLast7Days: 3,
            exerciseSessionsLast7Days: 1,
            restSessionsLast7Days: 1,
            jobsAppliedLast7Days: 0,
            jobRejectionsLast7Days: 0,
            savings: gs.bank.savings,
            debt: gs.bank.loans.reduce((s, l) => s + (l.remainingPrincipal ?? 0), 0),
            investmentsTotal: missionStore.cumulativeStats.totalInvested,
            routineConsistencyScore: Math.min(
              1,
              missionStore.cumulativeStats.totalWorkShifts / Math.max(1, gs.player.dayInGame)
            ),
          },
          world: {
            currentWaveType: gs.wave.currentPhase,
            inflationLevel: gs.indicators.Inflation_Index,
            unemploymentRate: gs.indicators.Unemployment_Rate,
            techDemandLevel: gs.indicators.IT_Demand,
          },
        });

        // ─── Advance City Simulation ───
        const { useCityStore } = require("@/game/city/city-store") as typeof import("@/game/city/city-store");
        useCityStore.getState().advanceDay(gs.player.dayInGame);

        // ─── Daily Integration Pipeline: city → jobs, missions, opportunities ───
        const { runDailyIntegrationPipeline } = require("@/game/integration/daily-integration-pipeline") as typeof import("@/game/integration/daily-integration-pipeline");
        const cityState = useCityStore.getState();
        const integrationResult = runDailyIntegrationPipeline(
          cityState,
          gs.player.dayInGame,
          gs.player.level,
        );
        set({ cityIntegrationOpportunities: integrationResult.opportunities });

        // Refresh achievements
        missionStore.refreshAchievements({
          totalMoneyEarned: missionStore.cumulativeStats.totalMoneyEarned,
          totalJobsAccepted: missionStore.cumulativeStats.totalJobsAccepted,
          totalWorkShifts: missionStore.cumulativeStats.totalWorkShifts,
          totalStudySessions: missionStore.cumulativeStats.totalStudySessions,
          totalExerciseSessions: missionStore.cumulativeStats.totalExerciseSessions,
          totalInvested: missionStore.cumulativeStats.totalInvested,
          totalCoursesCompleted: gs.completedCourses.length,
          currentSavings: gs.bank.savings,
          currentLevel: gs.player.level,
          daysPlayed: gs.player.dayInGame,
        });
      },

      executeAction: (categoryId, optionIndex, useSponsored = false) => {
        const category = ACTION_CATEGORIES.find((c) => c.id === categoryId);
        if (!category) return { success: false, effects: [], insufficientReason: "دسته‌بندی نامعتبر" };

        const baseOption = category.options[optionIndex];
        if (!baseOption) return { success: false, effects: [], insufficientReason: "گزینه نامعتبر" };

        // Resolve sponsored variant
        const sponsored = useSponsored ? baseOption.sponsoredVariant : undefined;
        if (useSponsored && !sponsored) {
          return { success: false, effects: [], insufficientReason: "نسخه اسپانسری موجود نیست" };
        }

        const activeCosts = sponsored ? sponsored.costs : baseOption.costs;
        const activeEffects = sponsored ? sponsored.effects : baseOption.effects;
        const activeRisk = sponsored ? (sponsored.risk !== undefined ? sponsored.risk : baseOption.risk) : baseOption.risk;

        const state = get();

        // Check energy
        if (activeCosts.energy && state.player.energy < activeCosts.energy) {
          return { success: false, effects: [], insufficientReason: "انرژی کافی نیست! ⚡" };
        }

        // Check money
        if (activeCosts.money && state.bank.checking < activeCosts.money) {
          return { success: false, effects: [], insufficientReason: "موجودی کافی نیست! 💰" };
        }

        // Get wave modifier
        const waveModifier = WAVE_ACTION_MODIFIERS[state.wave.currentPhase];
        const catMod = waveModifier.categoryModifiers[categoryId];
        const effectMult = catMod?.effectMult ?? 1;
        const costMult = catMod?.costMult ?? 1;

        // Apply costs
        const newPlayer = { ...state.player };
        const newBank = { ...state.bank };

        if (activeCosts.energy) {
          newPlayer.energy = Math.max(0, newPlayer.energy - Math.round(activeCosts.energy * costMult));
        }
        if (activeCosts.money) {
          newBank.checking = Math.max(0, newBank.checking - Math.round(activeCosts.money * costMult));
        }

        // Apply effects with wave multiplier
        const appliedEffects: ActionEffect[] = [];
        for (const effect of activeEffects) {
          const value = Math.round(effect.value * effectMult);
          appliedEffects.push({ ...effect, value });

          if (effect.key === "money") {
            newBank.checking = Math.max(0, newBank.checking + value);
          } else if (effect.key in newPlayer) {
            (newPlayer as Record<string, unknown>)[effect.key] = Math.max(
              0,
              ((newPlayer as Record<string, unknown>)[effect.key] as number) + value,
            );
          }
        }

        // Roll risk
        let riskTriggered: { label: string } | undefined;
        if (activeRisk && Math.random() < activeRisk.chance) {
          riskTriggered = { label: activeRisk.label };
          const rk = activeRisk.penalty.key;
          const rv = activeRisk.penalty.value;
          if (rk === "money") {
            newBank.checking = Math.max(0, newBank.checking + rv);
          } else if (rk in newPlayer) {
            (newPlayer as Record<string, unknown>)[rk] = Math.max(
              0,
              ((newPlayer as Record<string, unknown>)[rk] as number) + rv,
            );
          }
        }

        // Track completion
        const actionsCompletedToday = state.actionsCompletedToday.includes(categoryId)
          ? state.actionsCompletedToday
          : [...state.actionsCompletedToday, categoryId];

        set({ player: newPlayer, bank: newBank, actionsCompletedToday });

        // ─── Emit gameplay events for Mission Engine ───
        const moneyGained = appliedEffects
          .filter((e) => e.key === "money" && e.value > 0)
          .reduce((sum, e) => sum + e.value, 0);
        const xpGained = appliedEffects
          .filter((e) => e.key === "xp" && e.value > 0)
          .reduce((sum, e) => sum + e.value, 0);
        const moneyCost = activeCosts.money ?? 0;

        const events = getActionEvents({ categoryId, moneyGained, xpGained, moneyCost });
        events.forEach(dispatchGameplayEvent);

        return {
          success: true,
          effects: appliedEffects,
          riskTriggered,
          wasSponsored: useSponsored,
          brandName: sponsored?.brandName,
        };
      },

      completeCourse: (courseId) => {
        set((state) => {
          if (state.completedCourses.includes(courseId)) return {};
          return { completedCourses: [...state.completedCourses, courseId] };
        });
      },

      enrollCourse: (courseId, useSponsored) => {
        const state = get();
        if (state.activeCourse) return { success: false, reason: "قبلاً در یک دوره ثبت‌نام کردی" };
        if (state.completedCourses.includes(courseId)) return { success: false, reason: "این دوره رو قبلاً گذروندی" };

        const courseDef = COURSE_CATALOG.find((c) => c.id === courseId);
        if (!courseDef) return { success: false, reason: "دوره نامعتبر" };

        if (useSponsored && !courseDef.sponsoredVariant) {
          return { success: false, reason: "نسخه اسپانسری موجود نیست" };
        }

        const cost = useSponsored && courseDef.sponsoredVariant ? courseDef.sponsoredVariant.cost : courseDef.cost;
        if (state.bank.checking < cost) return { success: false, reason: "موجودی کافی نیست" };

        set({
          bank: { ...state.bank, checking: state.bank.checking - cost },
          activeCourse: {
            courseId,
            isSponsored: useSponsored,
            currentDay: 1,
            sessionsCompletedToday: 0,
            startedOnDay: state.player.dayInGame,
          },
        });
        return { success: true };
      },

      completeSession: () => {
        const state = get();
        const ac = state.activeCourse;
        if (!ac) return { success: false, reason: "دوره فعالی نداری" };

        const courseDef = COURSE_CATALOG.find((c) => c.id === ac.courseId);
        if (!courseDef) return { success: false, reason: "دوره نامعتبر" };

        const sponsored = ac.isSponsored ? courseDef.sponsoredVariant : undefined;
        const sessionsPerDay = courseDef.sessionsPerDay;

        if (ac.sessionsCompletedToday >= sessionsPerDay) {
          return { success: false, reason: "session‌های امروز تکمیل شده!" };
        }

        const energyCost = sponsored ? sponsored.energyCostPerSession : courseDef.energyCostPerSession;
        if (state.player.energy < energyCost) {
          return { success: false, reason: "انرژی کافی نیست! ⚡" };
        }

        const newPlayer = { ...state.player };
        newPlayer.energy = Math.max(0, newPlayer.energy - energyCost);

        // XP per session = total XP / (totalDays * sessionsPerDay)
        const totalXp = sponsored ? sponsored.xpReward : courseDef.xpReward;
        const totalSessions = courseDef.totalDays * sessionsPerDay;
        const xpPerSession = Math.round(totalXp / totalSessions);
        newPlayer.xp += xpPerSession;

        const newSessionsCompleted = ac.sessionsCompletedToday + 1;
        const isLastDay = ac.currentDay >= courseDef.totalDays;
        const allSessionsDone = newSessionsCompleted >= sessionsPerDay;
        const courseCompleted = isLastDay && allSessionsDone;

        let newActiveCourse: ActiveCourseState | null = {
          ...ac,
          sessionsCompletedToday: newSessionsCompleted,
        };
        let newCompletedCourses = state.completedCourses;

        if (courseCompleted) {
          // Course completed!
          newActiveCourse = null;
          newCompletedCourses = [...state.completedCourses, courseDef.id];
          // Bonus XP for completion
          newPlayer.xp += Math.round(totalXp * 0.2); // 20% completion bonus
          newPlayer.happiness = Math.min(100, newPlayer.happiness + 10);
        }

        set({
          player: newPlayer,
          activeCourse: newActiveCourse,
          completedCourses: newCompletedCourses,
        });

        return {
          success: true,
          xpGained: xpPerSession + (courseCompleted ? Math.round(totalXp * 0.2) : 0),
          energyCost,
          courseCompleted,
        };
      },

      dropCourse: () => {
        set({ activeCourse: null });
      },

      isJobEligible: (jobId, seniority) => {
        const state = get();
        const jobListing = state.jobListings.find((j) => j.id === jobId);
        if (!jobListing) return { eligible: false, missingXp: false, missingCourses: [], missingSkills: [] };

        const level = jobListing.seniorityLevels.find((l) => l.key === seniority);
        if (!level) return { eligible: false, missingXp: false, missingCourses: [], missingSkills: [] };

        const missingXp = state.player.xp < level.minXp;
        const missingCourses = level.requiredCourses.filter(
          (c) => !state.completedCourses.includes(c),
        );
        const missingSkills = level.requirements
          .filter((req) => {
            const allSkills = [...state.skills.hard, ...state.skills.soft];
            const playerSkill = allSkills.find((s) => s.name === req.skill);
            return !playerSkill || playerSkill.level < req.level;
          })
          .map((req) => `${req.skill} Lv.${req.level}`);

        return {
          eligible: !missingXp && missingCourses.length === 0 && missingSkills.length === 0,
          missingXp,
          missingCourses,
          missingSkills,
        };
      },

      // ─── Living Cost Actions ────────────────

      upgradeHousing: (tierId, buy) => {
        const state = get();
        const newTier = HOUSING_TIERS.find((h) => h.id === tierId);
        if (!newTier) return { success: false, reason: "نوع مسکن نامعتبر" };
        if (state.player.level < newTier.requiredLevel) {
          return { success: false, reason: `سطح ${newTier.requiredLevel} لازمه` };
        }

        const currentHousing = HOUSING_TIERS.find((h) => h.id === state.living.housingId);
        let cost: number;

        if (buy) {
          if (newTier.purchasePrice === 0) return { success: false, reason: "این مسکن قابل خرید نیست" };
          // Sell current if owned
          const saleCredit = state.living.isOwned && currentHousing ? currentHousing.resaleValue : 0;
          cost = newTier.purchasePrice - saleCredit;
        } else {
          // Just switching rental — no upfront cost beyond first month
          cost = 0; // rent is handled in weekly bills
        }

        if (cost > 0 && state.bank.checking < cost) {
          return { success: false, reason: "موجودی کافی نیست! 💰" };
        }

        const newBank = cost > 0 ? { ...state.bank, checking: state.bank.checking - cost } : state.bank;
        set({
          bank: newBank,
          living: { ...state.living, housingId: tierId, isOwned: buy },
        });
        return { success: true };
      },

      upgradeVehicle: (tierId) => {
        const state = get();
        const newTier = VEHICLE_TIERS.find((v) => v.id === tierId);
        if (!newTier) return { success: false, reason: "نوع خودرو نامعتبر" };
        if (state.player.level < newTier.requiredLevel) {
          return { success: false, reason: `سطح ${newTier.requiredLevel} لازمه` };
        }

        const currentVehicle = VEHICLE_TIERS.find((v) => v.id === state.living.vehicleId);
        const saleCredit = currentVehicle ? currentVehicle.resaleValue : 0;
        const cost = newTier.purchasePrice - saleCredit;

        if (cost > 0 && state.bank.checking < cost) {
          return { success: false, reason: "موجودی کافی نیست! 💰" };
        }

        set({
          bank: { ...state.bank, checking: state.bank.checking - cost },
          living: { ...state.living, vehicleId: tierId },
        });
        return { success: true };
      },

      changeMobilePlan: (planId) => {
        const plan = MOBILE_PLANS.find((p) => p.id === planId);
        if (!plan) return { success: false, reason: "پلن نامعتبر" };
        set((state) => ({
          living: { ...state.living, mobilePlanId: planId },
        }));
        return { success: true };
      },

      // ─── Fridge Actions ──────────────────────

      buyFood: (foodId) => {
        const state = get();
        const food = FOOD_CATALOG.find((f) => f.id === foodId);
        if (!food) return { success: false, reason: "آیتم نامعتبر" };

        const tier = FRIDGE_TIERS.find((t) => t.id === state.fridge.tierId)!;
        if (state.fridge.items.length >= tier.slots) {
          return { success: false, reason: `یخچال پره! (${tier.slots}/${tier.slots})` };
        }
        if (state.bank.checking < food.price) {
          return { success: false, reason: "موجودی کافی نیست! 💰" };
        }

        const slot: FridgeSlot = {
          foodId,
          addedOnDay: state.player.dayInGame,
          expiresOnDay: state.player.dayInGame + food.baseShelfLife + tier.shelfLifeBonus,
        };

        set({
          bank: { ...state.bank, checking: state.bank.checking - food.price },
          fridge: { ...state.fridge, items: [...state.fridge.items, slot] },
        });
        return { success: true };
      },

      eatFood: (slotIndex) => {
        const state = get();
        const slot = state.fridge.items[slotIndex];
        if (!slot) return { success: false, reason: "آیتم یافت نشد" };

        const food = FOOD_CATALOG.find((f) => f.id === slot.foodId);
        if (!food) return { success: false, reason: "آیتم نامعتبر" };

        if (state.player.dayInGame > slot.expiresOnDay) {
          // Expired — auto-trash
          const newItems = state.fridge.items.filter((_, i) => i !== slotIndex);
          set({ fridge: { ...state.fridge, items: newItems } });
          return { success: false, reason: "تاریخ مصرف گذشته! دور انداخته شد 🗑️" };
        }

        const newPlayer = { ...state.player };
        newPlayer.energy = Math.min(100, newPlayer.energy + food.effects.energy);
        newPlayer.happiness = Math.min(100, newPlayer.happiness + food.effects.happiness);
        newPlayer.health = Math.max(0, Math.min(100, (newPlayer.health ?? 80) + food.effects.health));

        const newItems = state.fridge.items.filter((_, i) => i !== slotIndex);
        set({ player: newPlayer, fridge: { ...state.fridge, items: newItems } });
        return { success: true, effects: food.effects };
      },

      trashFood: (slotIndex) => {
        const state = get();
        const newItems = state.fridge.items.filter((_, i) => i !== slotIndex);
        set({ fridge: { ...state.fridge, items: newItems } });
      },

      upgradeFridge: (tierId) => {
        const state = get();
        const newTier = FRIDGE_TIERS.find((t) => t.id === tierId);
        if (!newTier) return { success: false, reason: "مدل یخچال نامعتبر" };

        const currentTier = FRIDGE_TIERS.find((t) => t.id === state.fridge.tierId)!;
        if (newTier.slots <= currentTier.slots) {
          return { success: false, reason: "این یخچال ارتقا نیست!" };
        }
        if (state.player.level < newTier.requiredLevel) {
          return { success: false, reason: `سطح ${newTier.requiredLevel} لازمه` };
        }

        const netCost = newTier.price - currentTier.resaleValue;
        if (state.bank.checking < netCost) {
          return { success: false, reason: "موجودی کافی نیست! 💰" };
        }

        // Extend expiry on existing items
        const bonusDiff = newTier.shelfLifeBonus - currentTier.shelfLifeBonus;
        const updatedItems = state.fridge.items.map((slot) => ({
          ...slot,
          expiresOnDay: slot.expiresOnDay + bonusDiff,
        }));

        set({
          bank: { ...state.bank, checking: state.bank.checking - netCost },
          fridge: { tierId, items: updatedItems },
        });
        return { success: true };
      },

      // ─── Marketplace Actions ─────────────────

      buyFromMarket: (itemId) => {
        const state = get();
        const item = MARKET_ITEMS.find((m) => m.id === itemId);
        if (!item) return { success: false, reason: "آیتم نامعتبر" };
        if (state.player.level < item.requiredLevel) {
          return { success: false, reason: `سطح ${item.requiredLevel} لازمه` };
        }
        if (state.bank.checking < item.price) {
          return { success: false, reason: "موجودی کافی نیست! 💰" };
        }

        // If it's a fridge, use the fridge upgrade system
        if (item.upgradeLink?.system === "fridge") {
          const result = get().upgradeFridge(item.upgradeLink.tierId);
          return result;
        }

        // Check if already owned (for unique items)
        if (state.inventory.includes(itemId)) {
          return { success: false, reason: "قبلاً داری!" };
        }

        set({
          bank: { ...state.bank, checking: state.bank.checking - item.price },
          inventory: [...state.inventory, itemId],
        });
        return { success: true };
      },

      sellToSystem: (itemId) => {
        const state = get();
        const item = MARKET_ITEMS.find((m) => m.id === itemId);
        if (!item) return { success: false, reason: "آیتم نامعتبر" };
        if (!state.inventory.includes(itemId)) {
          return { success: false, reason: "این آیتم رو نداری!" };
        }

        set({
          bank: { ...state.bank, checking: state.bank.checking + item.resaleValue },
          inventory: state.inventory.filter((id) => id !== itemId),
        });
        return { success: true };
      },

      buyFromListing: (listingId) => {
        const state = get();
        const listing = state.marketListings.find((l) => l.id === listingId);
        if (!listing) return { success: false, reason: "آگهی پیدا نشد" };

        const item = MARKET_ITEMS.find((m) => m.id === listing.itemId);
        if (!item) return { success: false, reason: "آیتم نامعتبر" };

        if (state.bank.checking < listing.askingPrice) {
          return { success: false, reason: "موجودی کافی نیست! 💰" };
        }

        // If it's a fridge, handle upgrade
        if (item.upgradeLink?.system === "fridge") {
          const currentTier = FRIDGE_TIERS.find((t) => t.id === state.fridge.tierId)!;
          const newTier = FRIDGE_TIERS.find((t) => t.id === item.upgradeLink!.tierId);
          if (!newTier) return { success: false, reason: "مدل یخچال نامعتبر" };
          if (newTier.slots <= currentTier.slots) {
            return { success: false, reason: "این یخچال ارتقا نیست!" };
          }

          const bonusDiff = newTier.shelfLifeBonus - currentTier.shelfLifeBonus;
          const updatedItems = state.fridge.items.map((slot) => ({
            ...slot,
            expiresOnDay: slot.expiresOnDay + bonusDiff,
          }));

          set({
            bank: { ...state.bank, checking: state.bank.checking - listing.askingPrice },
            fridge: { tierId: newTier.id, items: updatedItems },
            marketListings: state.marketListings.filter((l) => l.id !== listingId),
          });
          return { success: true };
        }

        // Regular item
        if (state.inventory.includes(listing.itemId)) {
          return { success: false, reason: "قبلاً داری!" };
        }

        set({
          bank: { ...state.bank, checking: state.bank.checking - listing.askingPrice },
          inventory: [...state.inventory, listing.itemId],
          marketListings: state.marketListings.filter((l) => l.id !== listingId),
        });
        return { success: true };
      },

      doRandomLeisure: () => {
        const state = get();
        const hasFridgeFood = state.fridge.items.length > 0;

        // Filter available activities
        const available = LEISURE_ACTIVITIES.filter((act) => {
          if (act.requires?.inventoryAny) {
            if (!act.requires.inventoryAny.some((id) => state.inventory.includes(id))) return false;
          }
          if (act.requires?.hasFridgeFood && !hasFridgeFood) return false;
          return true;
        });

        if (available.length === 0) {
          return { success: false, reason: "هیچ تفریحی در دسترس نیست!" };
        }

        // Random pick
        const activity = available[Math.floor(Math.random() * available.length)];
        const newPlayer = { ...state.player };
        let ateFoodName: string | undefined;

        // Apply effects
        if (activity.effects.energy) newPlayer.energy = clamp(newPlayer.energy + activity.effects.energy, 0, 100);
        if (activity.effects.happiness) newPlayer.happiness = clamp(newPlayer.happiness + activity.effects.happiness, 0, 100);
        if (activity.effects.health) newPlayer.health = clamp((newPlayer.health ?? 80) + activity.effects.health, 0, 100);

        // If activity requires food, consume a random fridge item
        let newFridgeItems = state.fridge.items;
        if (activity.requires?.hasFridgeFood && state.fridge.items.length > 0) {
          const idx = Math.floor(Math.random() * state.fridge.items.length);
          const slot = state.fridge.items[idx];
          const food = FOOD_CATALOG.find((f) => f.id === slot.foodId);
          ateFoodName = food?.name;
          // Apply food effects too
          if (food) {
            newPlayer.energy = clamp(newPlayer.energy + food.effects.energy, 0, 100);
            newPlayer.happiness = clamp(newPlayer.happiness + food.effects.happiness, 0, 100);
            newPlayer.health = clamp((newPlayer.health ?? 80) + food.effects.health, 0, 100);
          }
          newFridgeItems = state.fridge.items.filter((_, i) => i !== idx);
        }

        set({
          player: newPlayer,
          fridge: { ...state.fridge, items: newFridgeItems },
        });
        return { success: true, activity, ateFoodName };
      },

      clearExpiredItems: () => {
        const state = get();
        const expired = state.fridge.items.filter(
          (slot) => state.player.dayInGame > slot.expiresOnDay,
        );
        if (expired.length === 0) return { expiredNames: [] };

        const expiredNames = expired.map((slot) => {
          const food = FOOD_CATALOG.find((f) => f.id === slot.foodId);
          return food ? food.name : slot.foodId;
        });

        const remaining = state.fridge.items.filter(
          (slot) => state.player.dayInGame <= slot.expiresOnDay,
        );
        const newPlayer = { ...state.player };
        newPlayer.happiness = Math.max(0, newPlayer.happiness - expired.length * 2);

        set({
          fridge: { ...state.fridge, items: remaining },
          player: newPlayer,
        });
        return { expiredNames };
      },

      // ─── Banking Actions ─────────────────────

      depositToSavings: (amount) => {
        const state = get();
        if (amount <= 0) return { success: false, reason: "مبلغ نامعتبر" };
        if (amount > state.bank.checking) return { success: false, reason: "موجودی حساب جاری کافی نیست" };
        set({
          bank: {
            ...state.bank,
            checking: state.bank.checking - amount,
            savings: state.bank.savings + amount,
          },
        });
        return { success: true };
      },

      withdrawFromSavings: (amount) => {
        const state = get();
        if (amount <= 0) return { success: false, reason: "مبلغ نامعتبر" };
        if (amount > state.bank.savings) return { success: false, reason: "موجودی پس‌انداز کافی نیست" };
        set({
          bank: {
            ...state.bank,
            savings: state.bank.savings - amount,
            checking: state.bank.checking + amount,
          },
        });
        return { success: true };
      },

      takeLoan: (loanTypeId) => {
        const state = get();
        const loanType = LOAN_TYPES.find((l) => l.id === loanTypeId);
        if (!loanType) return { success: false, reason: "نوع وام نامعتبر" };
        if (state.player.level < loanType.requiresLevel) return { success: false, reason: `سطح ${loanType.requiresLevel} لازم است` };
        if (state.bank.savings < loanType.requiresSavings) return { success: false, reason: `حداقل ${loanType.requiresSavings.toLocaleString()} پس‌انداز لازم است` };
        if (state.bank.loans.length >= 3) return { success: false, reason: "حداکثر ۳ وام فعال مجاز است" };

        const monthly = calculateMonthlyPayment(loanType.maxAmount, loanType.interestRate, loanType.termMonths);
        const newLoan: ActiveLoan = {
          id: `loan_${Date.now()}`,
          typeId: loanType.id,
          typeName: loanType.name,
          originalAmount: loanType.maxAmount,
          remainingPrincipal: loanType.maxAmount,
          monthlyPayment: monthly,
          interestRate: loanType.interestRate,
          remainingInstallments: loanType.termMonths,
          totalInstallments: loanType.termMonths,
          nextPaymentDay: state.player.dayInGame + 30,
          latePayments: 0,
        };

        set({
          bank: {
            ...state.bank,
            checking: state.bank.checking + loanType.maxAmount,
            loans: [...state.bank.loans, newLoan],
          },
        });
        return { success: true };
      },

      payLoanInstallment: (loanId) => {
        const state = get();
        const loan = state.bank.loans.find((l) => l.id === loanId);
        if (!loan) return { success: false, reason: "وام یافت نشد" };
        if (state.bank.checking < loan.monthlyPayment) return { success: false, reason: "موجودی کافی نیست" };

        const updatedLoans = state.bank.loans
          .map((l) => {
            if (l.id !== loanId) return l;
            const newRemaining = l.remainingInstallments - 1;
            const newPrincipal = Math.max(0, l.remainingPrincipal - Math.round(l.monthlyPayment * (1 - l.interestRate / 100)));
            return {
              ...l,
              remainingInstallments: newRemaining,
              remainingPrincipal: newPrincipal,
              nextPaymentDay: l.nextPaymentDay + 30,
            };
          })
          .filter((l) => l.remainingInstallments > 0);

        set({
          bank: {
            ...state.bank,
            checking: state.bank.checking - loan.monthlyPayment,
            loans: updatedLoans,
          },
        });
        return { success: true };
      },

      // ─── Engine Tick ─────────────────────

      tick: () => {
        set((state) => {
          const newTick = state.currentTick + 1;

          // Layer 1: Drift indicators
          let newIndicators = driftIndicators(state.indicators, state.wave.currentPhase);

          // Layer 2: Simulate behavior
          const newBehavior = simulateBehavior(newIndicators, state.behavior);

          // Wave: advance tick + check transition
          let newWave: WaveState = { ...state.wave, ticksInPhase: state.wave.ticksInPhase + 1 };
          const transition = checkWaveTransition(newWave);
          if (transition) {
            newWave = transition;
          }

          // Decay active events
          const activeEvents = state.activeEvents
            .map(e => ({ ...e, remainingTicks: e.remainingTicks - 1 }))
            .filter(e => e.remainingTicks > 0);

          // Decay cooldowns
          const cooldowns = { ...state.eventCooldowns };
          for (const key of Object.keys(cooldowns)) {
            cooldowns[key] = Math.max(0, cooldowns[key] - 1);
          }

          // Layer 3: Evaluate triggers
          const activeIds = new Set(activeEvents.map(e => e.templateId));
          const newEvents = evaluateTriggers(
            newIndicators, newBehavior, activeIds, cooldowns,
            newWave.currentPhase, newTick,
          );

          // Layer 4: Apply impacts
          const playerPatch: Record<string, number> = {};
          for (const event of newEvents) {
            const { indicatorPatches, playerPatches } = applyEventImpacts(event.templateId);

            for (const [k, v] of Object.entries(indicatorPatches)) {
              newIndicators = {
                ...newIndicators,
                [k]: clamp((newIndicators[k as IndicatorKey] ?? 50) + (v as number), 0, 100),
              };
            }

            for (const [k, v] of Object.entries(playerPatches)) {
              playerPatch[k] = (playerPatch[k] ?? 0) + v;
            }

            // Set cooldown from template
            cooldowns[event.templateId] = 60; // default fallback
          }

          // Apply player patches
          const newPlayer = { ...state.player };
          for (const [k, v] of Object.entries(playerPatch)) {
            if (k in newPlayer) {
              (newPlayer as Record<string, unknown>)[k] = Math.max(
                0,
                ((newPlayer as Record<string, unknown>)[k] as number) + v,
              );
            }
          }

          return {
            currentTick: newTick,
            indicators: newIndicators,
            behavior: newBehavior,
            wave: newWave,
            activeEvents: [...activeEvents, ...newEvents],
            eventCooldowns: cooldowns,
            player: newPlayer,
          };
        });
      },

      resetGame: () => {
        set({
          player: { ...seedPlayer },
          bank: { ...seedBank },
          job: { ...seedJob },
          housing: { ...seedHousing },
          skills: { ...seedSkills },
          jobListings: [...seedJobs],
          cityPlayers: [...seedPlayers],
          cityOpportunities: [...seedOpportunities],
          marketInsight: { ...seedInsight },
          indicators: { ...INITIAL_INDICATORS },
          behavior: { ...INITIAL_BEHAVIOR },
          activeEvents: [],
          eventCooldowns: {},
          wave: createInitialWave(),
          currentTick: 0,
          isRunning: true,
          actionsCompletedToday: [],
          completedCourses: [...seedCompletedCourses],
          activeCourse: null,
          todayCard: null,
          cardHistory: [],
          cardShielded: false,
          fridge: { tierId: "basic", items: [] },
          living: { housingId: "apartment_basic", isOwned: false, vehicleId: "none", mobilePlanId: "basic", lastBillDay: 0 },
          inventory: [],
          marketListings: [],
        });
      },
    }),
    {
      name: "shahre-man-game",
      partialize: (state) => ({
        player: state.player,
        bank: state.bank,
        indicators: state.indicators,
        behavior: state.behavior,
        activeEvents: state.activeEvents,
        eventCooldowns: state.eventCooldowns,
        wave: state.wave,
        currentTick: state.currentTick,
        actionsCompletedToday: state.actionsCompletedToday,
        completedCourses: state.completedCourses,
        activeCourse: state.activeCourse,
        todayCard: state.todayCard,
        cardHistory: state.cardHistory,
        cardShielded: state.cardShielded,
        fridge: state.fridge,
        living: state.living,
        inventory: state.inventory,
        marketListings: state.marketListings,
      }),
    },
  ),
);
