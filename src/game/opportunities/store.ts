import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Opportunity, OpportunityMemory } from "./types";
import type { AnalyzerInput } from "./analyzer";
import type { ResolveResult } from "./resolver";
import { generateOpportunitiesForDay } from "./generator";
import { resolveOpportunity } from "./resolver";
import { getVisibleOpportunities } from "./helpers";
import { getChainNextTemplateId } from "./chains";

const EMPTY_MEMORY: OpportunityMemory = {
  acceptedByType: {},
  rejectedByType:  {},
  successfulByType: {},
  totalResolved: 0,
};

interface OpportunityStoreState {
  activeOpportunities:  Opportunity[];
  resolvedOpportunities: Opportunity[];
  rejectedOpportunityTemplateIds: string[];
  recentlyResolvedTemplateIds: string[];   // last 6 resolved template IDs for novelty scoring
  pendingChainTemplateIds: string[];        // chain steps queued for next generation cycle
  memory: OpportunityMemory;

  // Called from startNextDay in gameStore
  generateOpportunitiesForNewDay: (
    currentDay: number,
    playerInput: AnalyzerInput,
  ) => void;

  acceptOpportunity: (id: string) => ResolveResult | null;
  rejectOpportunity: (id: string) => void;
  expireStaleOpportunities: (currentDay: number) => void;
  getVisible: (currentDay: number) => Opportunity[];
}

export const useOpportunityStore = create<OpportunityStoreState>()(
  persist(
    (set, get) => ({
      activeOpportunities:            [],
      resolvedOpportunities:          [],
      rejectedOpportunityTemplateIds: [],
      recentlyResolvedTemplateIds:    [],
      pendingChainTemplateIds:        [],
      memory: { ...EMPTY_MEMORY },

      // ── Generate ──────────────────────────────────────────────────────────
      generateOpportunitiesForNewDay: (currentDay, playerInput) => {
        const state = get();

        // Expire stale active opportunities
        const updatedActive = state.activeOpportunities.map((o) =>
          o.status === "available" && o.expiresAtDay < currentDay
            ? { ...o, status: "expired" as const }
            : o,
        );
        const stillActive = updatedActive.filter((o) => o.status === "available");

        const newOpps = generateOpportunitiesForDay(
          currentDay,
          playerInput,
          stillActive.length,
          state.rejectedOpportunityTemplateIds,
          state.pendingChainTemplateIds,
          state.memory,
          state.recentlyResolvedTemplateIds,
        );

        // Clear chain unlocks that were just injected
        const injectedChainIds = newOpps
          .filter((o) => o.source === "chain")
          .map((o) => o.id.replace(/_day\d+$/, ""));

        const remainingPendingChains = state.pendingChainTemplateIds.filter(
          (id) => !injectedChainIds.includes(id),
        );

        set({
          activeOpportunities: [...updatedActive, ...newOpps],
          pendingChainTemplateIds: remainingPendingChains,
        });
      },

      // ── Accept ────────────────────────────────────────────────────────────
      acceptOpportunity: (id) => {
        const state = get();
        const opp = state.activeOpportunities.find(
          (o) => o.id === id && o.status === "available",
        );
        if (!opp) return null;

        const result = resolveOpportunity(opp);
        const templateId = opp.id.replace(/_day\d+$/, "");

        // ── Memory: track accepts + successes ─────────────────────────────
        const newMemory: OpportunityMemory = {
          acceptedByType: {
            ...state.memory.acceptedByType,
            [opp.type]: (state.memory.acceptedByType[opp.type] ?? 0) + 1,
          },
          rejectedByType: { ...state.memory.rejectedByType },
          successfulByType: result.outcomeTier === "big_win"
            ? {
                ...state.memory.successfulByType,
                [opp.type]: (state.memory.successfulByType[opp.type] ?? 0) + 1,
              }
            : { ...state.memory.successfulByType },
          totalResolved: state.memory.totalResolved + 1,
        };

        // ── Chain: check if this unlocks a next step ──────────────────────
        const nextChainTemplateId = getChainNextTemplateId(templateId, result.outcomeTier);
        const pendingChainTemplateIds = nextChainTemplateId
          ? [...state.pendingChainTemplateIds, nextChainTemplateId]
          : [...state.pendingChainTemplateIds];

        // ── Recently resolved (keep last 6) ───────────────────────────────
        const recentlyResolvedTemplateIds = [
          ...state.recentlyResolvedTemplateIds.slice(-5),
          templateId,
        ];

        // ── Apply career XP if applicable ─────────────────────────────────
        const careerXp = result.appliedEffects.careerXp;
        if (careerXp && careerXp > 0) {
          try {
            const { useCareerStore } = require("@/game/career/career-store") as typeof import("@/game/career/career-store");
            const cs = useCareerStore.getState();
            cs.addCareerXp(cs.primaryTrack ?? "tech", careerXp);
          } catch { /* career store not yet init */ }
        }

        // ── Apply identity reputation ─────────────────────────────────────
        if (result.appliedEffects.reputation && result.appliedEffects.reputation > 0) {
          try {
            const { useIdentityStore } = require("@/game/identity/identityStore") as typeof import("@/game/identity/identityStore");
            useIdentityStore.getState().applyReputationEvent("opportunity_taken");
          } catch { /* identity store not yet init */ }
        }

        set({
          activeOpportunities: state.activeOpportunities.filter((o) => o.id !== id),
          resolvedOpportunities: [
            ...state.resolvedOpportunities,
            { ...opp, status: "resolved" as const },
          ],
          memory: newMemory,
          pendingChainTemplateIds,
          recentlyResolvedTemplateIds,
        });

        return result;
      },

      // ── Reject ────────────────────────────────────────────────────────────
      rejectOpportunity: (id) => {
        const state = get();
        const opp = state.activeOpportunities.find(
          (o) => o.id === id && o.status === "available",
        );
        if (!opp) return;

        const templateId = opp.id.replace(/_day\d+$/, "");

        const newMemory: OpportunityMemory = {
          ...state.memory,
          rejectedByType: {
            ...state.memory.rejectedByType,
            [opp.type]: (state.memory.rejectedByType[opp.type] ?? 0) + 1,
          },
        };

        set({
          activeOpportunities: state.activeOpportunities.filter((o) => o.id !== id),
          resolvedOpportunities: [
            ...state.resolvedOpportunities,
            { ...opp, status: "rejected" as const },
          ],
          rejectedOpportunityTemplateIds: [
            ...state.rejectedOpportunityTemplateIds.slice(-9),
            templateId,
          ],
          memory: newMemory,
        });
      },

      // ── Expire ────────────────────────────────────────────────────────────
      expireStaleOpportunities: (currentDay) => {
        const state = get();
        const updated = state.activeOpportunities.map((o) =>
          o.status === "available" && o.expiresAtDay < currentDay
            ? { ...o, status: "expired" as const }
            : o,
        );
        set({ activeOpportunities: updated });
      },

      // ── Visible ───────────────────────────────────────────────────────────
      getVisible: (currentDay) =>
        getVisibleOpportunities(get().activeOpportunities, currentDay),
    }),
    { name: "shahre-man-opportunities" },
  ),
);
