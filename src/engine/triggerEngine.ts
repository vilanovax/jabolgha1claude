import type {
  EconomicIndicators,
  PlayerBehaviorSignals,
  TriggerCondition,
  EventTemplate,
  ActiveEvent,
  WavePhase,
} from "./types";
import { EVENT_TEMPLATES } from "./eventTemplates";

function evaluateCondition(
  cond: TriggerCondition,
  indicators: EconomicIndicators,
  behavior: PlayerBehaviorSignals,
): boolean {
  const sourceObj = cond.source === "indicator" ? indicators : behavior;
  const val = (sourceObj as unknown as Record<string, number>)[cond.key];
  if (val === undefined) return false;

  switch (cond.operator) {
    case ">":  return val > cond.value;
    case "<":  return val < cond.value;
    case ">=": return val >= cond.value;
    case "<=": return val <= cond.value;
    case "==": return Math.abs(val - cond.value) < 0.5;
    case "between": return val >= cond.value && val <= (cond.valueMax ?? cond.value);
    default: return false;
  }
}

function calcEconomicPressure(
  template: EventTemplate,
  indicators: EconomicIndicators,
): number {
  const indicatorConds = template.triggerConditions.filter(c => c.source === "indicator");
  if (indicatorConds.length === 0) return 0.5;

  let pressure = 0;
  for (const cond of indicatorConds) {
    const val = (indicators as unknown as Record<string, number>)[cond.key] ?? 50;
    if (cond.operator === ">" || cond.operator === ">=") {
      pressure += Math.max(0, (val - cond.value) / (100 - cond.value || 1));
    } else if (cond.operator === "<" || cond.operator === "<=") {
      pressure += Math.max(0, (cond.value - val) / (cond.value || 1));
    }
  }
  return Math.min(1, pressure / indicatorConds.length);
}

function calcBehaviorFactor(
  template: EventTemplate,
  behavior: PlayerBehaviorSignals,
): number {
  const behaviorConds = template.triggerConditions.filter(c => c.source === "behavior");
  if (behaviorConds.length === 0) return 0.5;

  let factor = 0;
  for (const cond of behaviorConds) {
    const val = (behavior as unknown as Record<string, number>)[cond.key] ?? 50;
    if (cond.operator === ">" || cond.operator === ">=") {
      factor += Math.max(0, (val - cond.value) / (100 - cond.value || 1));
    } else if (cond.operator === "<" || cond.operator === "<=") {
      factor += Math.max(0, (cond.value - val) / (cond.value || 1));
    }
  }
  return Math.min(1, factor / behaviorConds.length);
}

function calcProbability(
  template: EventTemplate,
  indicators: EconomicIndicators,
  behavior: PlayerBehaviorSignals,
): number {
  const base = template.baseWeight;
  const econ = calcEconomicPressure(template, indicators);
  const behav = calcBehaviorFactor(template, behavior);
  const rand = Math.random();

  return base * 0.4 + econ * 0.3 + behav * 0.2 + rand * 0.1;
}

export function evaluateTriggers(
  indicators: EconomicIndicators,
  behavior: PlayerBehaviorSignals,
  activeEventIds: Set<string>,
  cooldowns: Record<string, number>,
  currentWavePhase: WavePhase,
  currentTick: number,
  maxActiveEvents = 5,
): ActiveEvent[] {
  const newEvents: ActiveEvent[] = [];

  for (const template of EVENT_TEMPLATES) {
    if (activeEventIds.has(template.id)) continue;
    if ((cooldowns[template.id] ?? 0) > 0) continue;
    if (template.allowedWavePhases && !template.allowedWavePhases.includes(currentWavePhase)) continue;
    if (activeEventIds.size + newEvents.length >= maxActiveEvents) break;

    const allMet = template.triggerConditions.every(c =>
      evaluateCondition(c, indicators, behavior),
    );
    if (!allMet) continue;

    const prob = calcProbability(template, indicators, behavior);
    if (prob <= 0.45) continue;

    newEvents.push({
      templateId: template.id,
      emoji: template.emoji,
      severity: template.severity,
      category: template.category,
      title: template.title,
      description: template.description,
      displayImpacts: template.displayImpacts,
      remainingTicks: template.durationTicks,
      totalTicks: template.durationTicks,
      activatedAtTick: currentTick,
      affectedPlayers: 50 + Math.floor(Math.random() * 250),
    });
  }

  return newEvents;
}
