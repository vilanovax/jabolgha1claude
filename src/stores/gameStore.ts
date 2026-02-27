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
} from "@/data/mock";

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

export interface ActionResult {
  success: boolean;
  effects: ActionEffect[];
  riskTriggered?: { label: string };
  insufficientReason?: string;
}

export interface RoutineState {
  morning: string | null;
  noon: string | null;
  evening: string | null;
  night: string | null;
}

type RoutineSlot = keyof RoutineState;

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
  routine: RoutineState;
  routineStreak: number;
  routineCompletedToday: string[];   // slot names completed today

  // Actions
  tick: () => void;
  setRunning: (v: boolean) => void;
  resetGame: () => void;
  executeAction: (categoryId: string, optionIndex: number) => ActionResult;
  setRoutineSlot: (slot: RoutineSlot, categoryId: string | null) => void;
  completeRoutineSlot: (slot: RoutineSlot) => void;
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
      routine: { morning: null, noon: null, evening: null, night: null },
      routineStreak: 0,
      routineCompletedToday: [],

      setRunning: (v) => set({ isRunning: v }),

      executeAction: (categoryId, optionIndex) => {
        const category = ACTION_CATEGORIES.find((c) => c.id === categoryId);
        if (!category) return { success: false, effects: [], insufficientReason: "دسته‌بندی نامعتبر" };

        const option = category.options[optionIndex];
        if (!option) return { success: false, effects: [], insufficientReason: "گزینه نامعتبر" };

        const state = get();

        // Check energy
        if (option.costs.energy && state.player.energy < option.costs.energy) {
          return { success: false, effects: [], insufficientReason: "انرژی کافی نیست! ⚡" };
        }

        // Check money
        if (option.costs.money && state.bank.checking < option.costs.money) {
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

        if (option.costs.energy) {
          newPlayer.energy = Math.max(0, newPlayer.energy - Math.round(option.costs.energy * costMult));
        }
        if (option.costs.money) {
          newBank.checking = Math.max(0, newBank.checking - Math.round(option.costs.money * costMult));
        }

        // Apply effects with wave multiplier
        const appliedEffects: ActionEffect[] = [];
        for (const effect of option.effects) {
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
        if (option.risk && Math.random() < option.risk.chance) {
          riskTriggered = { label: option.risk.label };
          const rk = option.risk.penalty.key;
          const rv = option.risk.penalty.value;
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

        return { success: true, effects: appliedEffects, riskTriggered };
      },

      setRoutineSlot: (slot, categoryId) => {
        set((state) => ({
          routine: { ...state.routine, [slot]: categoryId },
        }));
      },

      completeRoutineSlot: (slot) => {
        set((state) => {
          if (state.routineCompletedToday.includes(slot)) return {};
          const completed = [...state.routineCompletedToday, slot];

          // Check if all 4 slots completed for combo bonus
          const allDone = completed.length === 4;
          let newPlayer = state.player;
          let newStreak = state.routineStreak;
          if (allDone) {
            newPlayer = { ...state.player, xp: state.player.xp + 5 };
            newStreak = state.routineStreak + 1;
          }

          return {
            routineCompletedToday: completed,
            routineStreak: newStreak,
            player: newPlayer,
          };
        });
      },

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
          routine: { morning: null, noon: null, evening: null, night: null },
          routineStreak: 0,
          routineCompletedToday: [],
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
        routine: state.routine,
        routineStreak: state.routineStreak,
        routineCompletedToday: state.routineCompletedToday,
      }),
    },
  ),
);
