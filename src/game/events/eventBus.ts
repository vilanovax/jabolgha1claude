// ─── Gameplay Event Bus ───
// Central dispatcher for all gameplay events.
// Actions emit events here; the Mission Engine listens and updates progress.
// Using a direct call pattern (no pub/sub overhead) via lazy import of mission store.

import type { GameplayEvent } from "@/game/missions/types";

// Dispatch a gameplay event to all listeners.
// Called after any significant player action.
export function dispatchGameplayEvent(event: GameplayEvent): void {
  // Lazy import to avoid circular dependencies
  // gameStore → eventBus → missionStore (no circular)
  const { useMissionStore } = require("@/game/missions/store") as typeof import("@/game/missions/store");
  const missionState = useMissionStore.getState();

  // Build a minimal context from mission store's own cumulative stats
  // (full context is only needed for mission generation, not progress updates)
  missionState.processGameplayEvent(event, {} as never);
}
