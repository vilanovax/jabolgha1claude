// ─── Dynamic City Simulation Engine: Core Types ───

export type SectorId =
  | "tech"
  | "finance"
  | "construction"
  | "retail"
  | "services"
  | "manufacturing";

export interface SectorState {
  id: SectorId;
  nameFa: string;
  emoji: string;
  health: number;          // 0–100
  trend: "up" | "flat" | "down";
  salaryMultiplier: number; // 0.6–1.6
  jobDemand: number;        // 0–100 (how many openings are available)
}

// ─── City Waves ───

export type CityWaveId =
  | "stability"
  | "tech_boom"
  | "recession"
  | "construction_surge"
  | "finance_bull"
  | "retail_holiday"
  | "manufacturing_revival";

export interface CityWaveSectorMod {
  healthDelta: number;    // added to sector health each day
  salaryMod: number;      // additive to salaryMultiplier
  jobDemandDelta: number; // added to jobDemand
}

export interface CityWave {
  id: CityWaveId;
  nameFa: string;
  emoji: string;
  descriptionFa: string;
  sectorMods: Partial<Record<SectorId, CityWaveSectorMod>>;
  globalInflationDelta: number; // affects cost of living
  investmentBonus: number;      // multiplier on investment returns e.g. 1.2
  minDays: number;
  maxDays: number;
}

// ─── City Events ───

export type CityEventId = string;

export type CityEventSeverity = "minor" | "major" | "crisis";

export interface CityEvent {
  id: CityEventId;
  emoji: string;
  titleFa: string;
  descriptionFa: string;
  severity: CityEventSeverity;
  affectedSectors: SectorId[];
  sectorHealthDelta: number;   // applied to affectedSectors per day
  salaryImpact: number;        // multiplier delta (e.g. -0.1 or +0.15)
  jobDemandDelta: number;      // added to job demand in affected sectors
  investmentImpact: number;    // multiplier delta
  durationDays: number;
  triggerWaves?: CityWaveId[]; // only triggers during these waves
  missionEventTag?: string;    // tag sent to mission engine as event mission
}

export interface ActiveCityEvent extends CityEvent {
  startedOnDay: number;
  remainingDays: number;
}

// ─── City State ───

export interface CityState {
  sectors: Record<SectorId, SectorState>;
  currentWaveId: CityWaveId;
  waveRemainingDays: number;
  waveElapsedDays: number;
  activeEvents: ActiveCityEvent[];
  economyHealth: number; // 0–100 composite score
  inflationLevel: number; // 0–100 (affects living costs multiplier)
  lastUpdatedDay: number;
}

// ─── Player-Facing City Summary ───

export interface CityPlayerSummary {
  economyHealth: number;
  waveNameFa: string;
  waveEmoji: string;
  waveDescFa: string;
  sectors: SectorState[];
  activeEvents: ActiveCityEvent[];
  salaryMultiplierForSector: (sectorId: SectorId) => number;
  investmentMultiplier: number;
  costOfLivingMultiplier: number; // > 1 means more expensive
}
