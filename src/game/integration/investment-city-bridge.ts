// ─── Investment-City Bridge ───
// Applies city economy modifiers to investment return calculations.

import type { CityGameplayModifiers, InvestmentAsset } from "./city-impact-resolver";

export interface InvestmentOutcome {
  asset: InvestmentAsset;
  invested: number;
  grossReturn: number;      // invested × returnMultiplier
  netGain: number;          // grossReturn - invested
  returnMultiplier: number; // e.g. 1.15 → +15%
  riskTriggered: boolean;
  riskLoss: number;         // amount lost if risk triggered (0 if not)
  cityBonus: boolean;       // true if city wave is boosting this asset
  cityBonusLabel?: string;  // e.g. "رونق فناوری +۳۰٪"
}

/**
 * Calculate the full outcome of an investment action.
 *
 * amount      = money invested
 * asset       = asset type selected
 * modifiers   = from city-impact-resolver
 * baseReturn  = base return multiplier from action template (e.g. 1.05)
 * baseRisk    = base risk chance from action template (e.g. 0.15)
 * randSeed    = 0–1 random value for risk roll (use Math.random() in caller)
 */
export function calculateInvestmentOutcome(params: {
  amount: number;
  asset: InvestmentAsset;
  modifiers: CityGameplayModifiers;
  baseReturn: number;
  baseRisk: number;
  randSeed: number;
}): InvestmentOutcome {
  const { amount, asset, modifiers, baseReturn, baseRisk, randSeed } = params;

  const cityReturnMod = modifiers.investment.returnModifierByAsset[asset] ?? 1.0;
  const cityRiskMod = modifiers.investment.riskModifierByAsset[asset] ?? 0;

  // Final return = base × city modifier
  const finalReturn = Math.max(0.5, baseReturn * cityReturnMod);
  const finalRisk = Math.min(0.9, Math.max(0, baseRisk + cityRiskMod));

  const riskTriggered = randSeed < finalRisk;
  const riskLoss = riskTriggered ? Math.round(amount * 0.3) : 0;

  const grossReturn = Math.round(amount * finalReturn);
  const netGain = grossReturn - amount - riskLoss;

  const cityBonus = cityReturnMod > 1.05;
  const cityBonusLabel = cityBonus
    ? `+${Math.round((cityReturnMod - 1) * 100)}٪ (اقتصاد شهر)`
    : undefined;

  return {
    asset,
    invested: amount,
    grossReturn,
    netGain,
    returnMultiplier: finalReturn,
    riskTriggered,
    riskLoss,
    cityBonus,
    cityBonusLabel,
  };
}

/**
 * Get a preview of expected return for an asset (no risk roll).
 * Use this for UI preview before confirmation.
 */
export function getInvestmentPreview(
  amount: number,
  asset: InvestmentAsset,
  modifiers: CityGameplayModifiers,
  baseReturn: number,
): {
  expectedGain: number;
  returnPct: number;
  cityMultiplier: number;
  riskLevel: "low" | "medium" | "high";
} {
  const cityMod = modifiers.investment.returnModifierByAsset[asset] ?? 1.0;
  const cityRisk = modifiers.investment.riskModifierByAsset[asset] ?? 0;
  const finalReturn = Math.max(0.5, baseReturn * cityMod);
  const expectedGain = Math.round(amount * (finalReturn - 1));

  const totalRisk = cityRisk;
  const riskLevel: "low" | "medium" | "high" =
    totalRisk > 0.3 ? "high" : totalRisk > 0.15 ? "medium" : "low";

  return {
    expectedGain,
    returnPct: Math.round((finalReturn - 1) * 100),
    cityMultiplier: Math.round(cityMod * 100) / 100,
    riskLevel,
  };
}

/**
 * Get Persian label for investment asset type.
 */
export function getAssetLabelFa(asset: InvestmentAsset): string {
  const labels: Record<InvestmentAsset, string> = {
    stocks: "سهام",
    crypto: "رمزارز",
    gold: "طلا",
    startup: "استارتاپ",
    bank_savings: "سپرده بانکی",
    real_estate: "ملک",
  };
  return labels[asset] ?? asset;
}
