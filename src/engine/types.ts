// ======= Layer 1: Economic Indicators =======

export type IndicatorKey =
  | "IT_Demand"
  | "Startup_Growth"
  | "Inflation_Index"
  | "Unemployment_Rate"
  | "Import_Pressure"
  | "Education_Boom";

/** Each indicator is 0-100 */
export interface EconomicIndicators {
  IT_Demand: number;
  Startup_Growth: number;
  Inflation_Index: number;
  Unemployment_Rate: number;
  Import_Pressure: number;
  Education_Boom: number;
}

// ======= Layer 2: Player Behavior Signals =======

export interface PlayerBehaviorSignals {
  itJobsTakenPct: number;
  dollarInvestorsPct: number;
  unemployedPct: number;
  studyingPct: number;
  startupFoundersPct: number;
  avgITSkillLevel: number;
}

// ======= Layer 3: Event Templates & Triggers =======

export type TriggerOperator = ">" | "<" | ">=" | "<=" | "==" | "between";

export interface TriggerCondition {
  source: "indicator" | "behavior";
  key: keyof EconomicIndicators | keyof PlayerBehaviorSignals;
  operator: TriggerOperator;
  value: number;
  valueMax?: number;
}

export type EventSeverity = "normal" | "important" | "critical" | "golden";
export type EventCategory = "economic" | "market" | "opportunity" | "social" | "crisis";

export interface EventImpact {
  target: "indicator" | "player" | "economy";
  key: string;
  delta: number;
  text: string;
  positive: boolean;
}

export interface EventTemplate {
  id: string;
  emoji: string;
  severity: EventSeverity;
  category: EventCategory;
  title: string;
  description: string;
  triggerConditions: TriggerCondition[];
  baseWeight: number;
  durationTicks: number;
  impacts: EventImpact[];
  displayImpacts: { text: string; positive: boolean }[];
  cooldownTicks: number;
  allowedWavePhases?: WavePhase[];
}

export interface ActiveEvent {
  templateId: string;
  emoji: string;
  severity: EventSeverity;
  category: EventCategory;
  title: string;
  description: string;
  displayImpacts: { text: string; positive: boolean }[];
  remainingTicks: number;
  totalTicks: number;
  activatedAtTick: number;
  affectedPlayers: number;
}

// ======= Wave System =======

export type WavePhase =
  | "startup_wave"
  | "it_growth"
  | "saturation"
  | "mini_recession"
  | "recovery";

export interface WaveState {
  currentPhase: WavePhase;
  phaseName: string;
  phaseEmoji: string;
  phaseDescription: string;
  effects: { text: string; positive: boolean }[];
  ticksInPhase: number;
  phaseDurationTicks: number;
  cycleCount: number;
}

// ======= Derived Economy =======

export type EconomyStatus = "رونق" | "پایدار" | "پرنوسان" | "رکود";

export interface DerivedEconomy {
  status: EconomyStatus;
  inflationRate: number;
  economyHealth: number;
  activePlayers: number;
}
