import type { EconomicIndicators } from "./types";
import { EVENT_TEMPLATES } from "./eventTemplates";

export function applyEventImpacts(templateId: string): {
  indicatorPatches: Partial<EconomicIndicators>;
  playerPatches: Record<string, number>;
} {
  const template = EVENT_TEMPLATES.find(t => t.id === templateId);
  if (!template) return { indicatorPatches: {}, playerPatches: {} };

  const indicatorPatches: Record<string, number> = {};
  const playerPatches: Record<string, number> = {};

  for (const impact of template.impacts) {
    switch (impact.target) {
      case "indicator":
        indicatorPatches[impact.key] = (indicatorPatches[impact.key] ?? 0) + impact.delta;
        break;
      case "player":
        playerPatches[impact.key] = (playerPatches[impact.key] ?? 0) + impact.delta;
        break;
    }
  }

  return {
    indicatorPatches: indicatorPatches as Partial<EconomicIndicators>,
    playerPatches,
  };
}
