// ─── Identity Store ────────────────────────────────────────────
// Persisted Zustand store for the player's game identity.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { analyzeIdentity } from "./identityAnalyzer";
import { ARCHETYPES } from "./archetypes";
import { TITLES } from "./titles";
import { buildReputation } from "./reputation";
import type { IdentityState, IdentitySignals } from "./types";
import { applyReputationEvent } from "./reputation";
import type { ReputationEvent } from "./reputation";

// ── Default initial state ──────────────────────────────────────

function defaultIdentityState(): IdentityState {
  return {
    archetype: ARCHETYPES.undecided,
    activeTitle: TITLES.find((t) => t.id === "fresh_start")!,
    unlockedTitleIds: ["fresh_start"],
    reputation: buildReputation(10),
    lifePath: [],
  };
}

// ── Store interface ────────────────────────────────────────────

interface IdentityStoreState extends IdentityState {
  /** Recalculate all identity layers from current game signals */
  recalculate: (signals: IdentitySignals) => void;
  /** Apply a reputation event (work shift, loan default, etc.) */
  applyReputationEvent: (event: ReputationEvent) => void;
  /** Set active title manually (player choice) */
  setActiveTitle: (titleId: string) => void;
}

// ── Store ──────────────────────────────────────────────────────

export const useIdentityStore = create<IdentityStoreState>()(
  persist(
    (set, get) => ({
      ...defaultIdentityState(),

      recalculate: (signals: IdentitySignals) => {
        const identity = analyzeIdentity(signals);
        set(identity);
      },

      applyReputationEvent: (event: ReputationEvent) => {
        const current = get().reputation.value;
        const newValue = applyReputationEvent(current, event);
        set({ reputation: buildReputation(newValue) });
      },

      setActiveTitle: (titleId: string) => {
        const title = TITLES.find((t) => t.id === titleId);
        if (!title) return;
        const unlocked = get().unlockedTitleIds;
        if (!unlocked.includes(titleId)) return;
        set({ activeTitle: title });
      },
    }),
    { name: "shahre-man-identity" },
  ),
);
