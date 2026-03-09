// ─── Action → GameplayEvent Mapping ───
// Defines which events are emitted after each action category is executed.
// Returns an array because one action can emit multiple events.

import type { GameplayEvent } from "@/game/missions/types";

export interface ActionEventContext {
  categoryId: string;
  moneyGained: number;   // net money earned (positive only)
  xpGained: number;
  moneyCost: number;     // money spent (for invest)
}

// Map an executed action to the gameplay events it should emit.
export function getActionEvents(ctx: ActionEventContext): GameplayEvent[] {
  const events: GameplayEvent[] = [];

  // Category-specific events
  switch (ctx.categoryId) {
    case "work":
      events.push({ type: "work_shift_completed" });
      break;
    case "study":
    case "library":
      events.push({ type: "study_session_completed" });
      break;
    case "exercise":
      events.push({ type: "exercise_completed" });
      break;
    case "rest":
      events.push({ type: "rest_completed" });
      break;
    case "invest":
      if (ctx.moneyCost > 0) {
        events.push({ type: "investment_made", amount: ctx.moneyCost });
      }
      break;
    default:
      events.push({ type: "action_completed", actionId: ctx.categoryId });
  }

  // Universal events based on effects
  if (ctx.moneyGained > 0) {
    events.push({ type: "money_earned", amount: ctx.moneyGained });
  }
  if (ctx.xpGained > 0) {
    events.push({ type: "xp_gained", amount: ctx.xpGained });
  }

  return events;
}
