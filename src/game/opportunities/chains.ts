import type { OutcomeTier } from "./types";

// ─── Chain Data Structures ────────────────────────────────────────────────────

export interface ChainStep {
  templateId: string;
  /** What outcome tier the previous step must achieve to unlock this step */
  requiredPrevTier: OutcomeTier | "any_success";
}

export interface OpportunityChain {
  id: string;
  nameFa: string;
  descriptionFa: string;
  steps: ChainStep[];   // steps[0] is the entry-point template (regular or chain)
}

// ─── Chain Definitions ────────────────────────────────────────────────────────

export const OPPORTUNITY_CHAINS: OpportunityChain[] = [
  {
    id: "freelance_ladder",
    nameFa: "نردبان فریلنس",
    descriptionFa: "از یک پروژه اضطراری شروع کن و به مشتری دائمی برس",
    steps: [
      { templateId: "freelance_emergency",       requiredPrevTier: "big_win"     },
      { templateId: "chain_freelance_contract",  requiredPrevTier: "big_win"     },
      { templateId: "chain_long_term_client",    requiredPrevTier: "any_success" },
    ],
  },
  {
    id: "startup_path",
    nameFa: "مسیر استارتاپ",
    descriptionFa: "سرمایه‌گذاری اولیه، پیگیری، و خروج با سود",
    steps: [
      { templateId: "startup_angel",            requiredPrevTier: "big_win"     },
      { templateId: "chain_startup_followup",   requiredPrevTier: "any_success" },
      { templateId: "chain_startup_exit",       requiredPrevTier: "any_success" },
    ],
  },
  {
    id: "bulk_trade",
    nameFa: "تجارت عمده",
    descriptionFa: "خرید عمده، فروش سریع، ایجاد کانال تجاری",
    steps: [
      { templateId: "cheap_bulk_buy",       requiredPrevTier: "any_success" },
      { templateId: "chain_bulk_resale",    requiredPrevTier: "any_success" },
    ],
  },
];

// ─── Chain Helper ─────────────────────────────────────────────────────────────

/**
 * After resolving `resolvedTemplateId` with `outcomeTier`,
 * returns the next chain step templateId if a chain unlocks — otherwise null.
 */
export function getChainNextTemplateId(
  resolvedTemplateId: string,
  outcomeTier: OutcomeTier,
): string | null {
  for (const chain of OPPORTUNITY_CHAINS) {
    for (let i = 0; i < chain.steps.length - 1; i++) {
      if (chain.steps[i].templateId !== resolvedTemplateId) continue;

      const nextStep = chain.steps[i + 1];
      const tierQualifies =
        nextStep.requiredPrevTier === "any_success"
          ? outcomeTier !== "setback"
          : outcomeTier === nextStep.requiredPrevTier;

      return tierQualifies ? nextStep.templateId : null;
    }
  }
  return null;
}

/** Returns the chain a template belongs to (if any) */
export function getChainForTemplate(
  templateId: string,
): { chain: OpportunityChain; stepIndex: number } | null {
  for (const chain of OPPORTUNITY_CHAINS) {
    const idx = chain.steps.findIndex((s) => s.templateId === templateId);
    if (idx !== -1) return { chain, stepIndex: idx };
  }
  return null;
}
