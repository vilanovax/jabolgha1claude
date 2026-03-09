// ─── City Simulation Store ───
// Zustand store for city state. Updated daily via runDailySimulation().

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CityState } from "./types";
import { createInitialCityState, runDailySimulation } from "./city-simulation";
import { getCityPlayerSummary } from "./city-helpers";
import type { CityPlayerSummary } from "./types";

interface CityStoreState extends CityState {
  // Actions
  advanceDay: (dayInGame: number) => void;
  getPlayerSummary: () => CityPlayerSummary;
  resetCity: () => void;
}

export const useCityStore = create<CityStoreState>()(
  persist(
    (set, get) => ({
      ...createInitialCityState(),

      advanceDay: (dayInGame: number) => {
        const state = get();
        // Only run simulation if we haven't already updated for this day
        if (state.lastUpdatedDay >= dayInGame) return;

        const newState = runDailySimulation(state, dayInGame);
        set(newState);
      },

      getPlayerSummary: () => {
        const state = get();
        return getCityPlayerSummary(state);
      },

      resetCity: () => {
        set(createInitialCityState());
      },
    }),
    {
      name: "shahre-man-city",
      version: 1,
    }
  )
);
