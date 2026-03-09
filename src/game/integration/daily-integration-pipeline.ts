// ─── Daily Integration Pipeline ───
// Called once per day after city simulation runs.
// Connects City Engine → Job Market, Missions, Opportunities.

import type { CityState } from "@/game/city/types";
import { getCityGameplayModifiers } from "./city-impact-resolver";
import { generateCityEventMissions } from "./mission-city-bridge";
import { generateCityOpportunities } from "./opportunity-generator";

export interface DailyIntegrationResult {
  modifiers: ReturnType<typeof getCityGameplayModifiers>;
  // Missions are injected into missionStore directly
  // Opportunities are returned for gameStore
  opportunities: ReturnType<typeof generateCityOpportunities>;
}

/**
 * Run the full daily integration pipeline.
 *
 * - Derives CityGameplayModifiers from latest city state
 * - Generates city-event missions and injects into mission store
 * - Generates player opportunities for city page
 *
 * Returns modifiers and opportunities for consumption by gameStore.
 */
export function runDailyIntegrationPipeline(
  cityState: CityState,
  dayInGame: number,
  playerLevel: number,
): DailyIntegrationResult {
  const modifiers = getCityGameplayModifiers(cityState);

  // Inject event missions into mission store
  const { useMissionStore } = require("@/game/missions/store") as typeof import("@/game/missions/store");
  const missionStore = useMissionStore.getState();

  const cityMissions = generateCityEventMissions(cityState, dayInGame, playerLevel);

  // Only inject if there's no active event mission already
  if (cityMissions.length > 0 && !missionStore.activeEventMission) {
    // Take the first generated mission as the event mission
    // (others are lost — keep it simple; can be extended to queue)
    const newEventMission = cityMissions[0];
    // Directly set via internal Zustand set — we use a workaround via processGameplayEvent
    // Actually we need to set it directly. We'll use the store's internal pattern:
    (useMissionStore as unknown as { setState: (s: object) => void }).setState({
      activeEventMission: newEventMission,
    });
  }

  // Generate player opportunities
  const opportunities = generateCityOpportunities(cityState, modifiers, dayInGame);

  return { modifiers, opportunities };
}

/**
 * Get current city gameplay modifiers (read-only, no side effects).
 * Call this from Job Market UI, Investment UI, etc.
 */
export function getCurrentCityModifiers() {
  const { useCityStore } = require("@/game/city/city-store") as typeof import("@/game/city/city-store");
  const cityState = useCityStore.getState();
  return getCityGameplayModifiers(cityState);
}
