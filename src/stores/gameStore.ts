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

          return {
            player: newPlayer,
            bank: newBank,
            todayCard: card,
            cardShielded: shielded,
            cardHistory: [...state.cardHistory, { dayInGame: newPlayer.dayInGame, cardId: card.id }],
            actionsCompletedToday: [],
            activeCourse: newActiveCourse,
          };
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
      }),
    },
  ),
);
