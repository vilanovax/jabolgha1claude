// ─── Stock Market Daily Simulation ───

import type { Stock, GoldState } from "./types";

/**
 * Update all stock prices for a new day.
 * cityReturnModifiers: Record<assetId, multiplier> from CityGameplayModifiers.investment.returnModifierByAsset
 * cityWaveId: current wave for sector-specific effects
 */
export function simulateDailyPrices(
  stocks: Stock[],
  gold: GoldState,
  cityReturnModifiers: Record<string, number>,
  cityWaveId: string,
): { updatedStocks: Stock[]; updatedGold: GoldState } {
  const updatedStocks: Stock[] = stocks.map((stock) => {
    // 1. Base random drift
    let totalDrift = (Math.random() - 0.5) * 2 * stock.volatility;

    // 2. Sector wave boost
    if (cityWaveId === "tech_boom" && stock.sector === "tech") {
      totalDrift += 0.05;
    }
    if (cityWaveId === "recession") {
      totalDrift -= 0.04;
    }
    if (cityWaveId === "finance_bull" && stock.sector === "finance") {
      totalDrift += 0.06;
    }
    if (
      cityWaveId === "construction_surge" &&
      (stock.sector === "construction" || stock.sector === "manufacturing")
    ) {
      totalDrift += 0.05;
    }
    if (
      cityWaveId === "retail_holiday" &&
      (stock.sector === "retail" || stock.sector === "services")
    ) {
      totalDrift += 0.04;
    }

    // 3. City return modifier
    const stockModifier = cityReturnModifiers["stocks"] ?? 1;
    totalDrift += stockModifier - 1;

    // 4. Final price
    const newPrice = Math.max(100, Math.round(stock.currentPrice * (1 + totalDrift)));

    // 5. Update priceHistory: drop oldest, push new price (keep last 7)
    const newHistory = [...stock.priceHistory.slice(-6), newPrice];

    return {
      ...stock,
      previousPrice: stock.currentPrice,
      currentPrice: newPrice,
      priceHistory: newHistory,
    };
  });

  // Gold simulation
  let goldDrift = (Math.random() - 0.5) * 0.03; // ± 1.5%

  // Recession / inflation bonus
  if (cityWaveId === "recession" || cityWaveId === "inflation_crisis") {
    goldDrift += 0.015;
  }

  // City modifier
  const goldModifier = cityReturnModifiers["gold"] ?? 1;
  goldDrift += goldModifier - 1;

  const newGoldPrice = Math.max(1_000_000, Math.round(gold.pricePerGram * (1 + goldDrift)));
  const newGoldHistory = [...gold.priceHistory.slice(-6), newGoldPrice];

  const updatedGold: GoldState = {
    ...gold,
    previousPrice: gold.pricePerGram,
    pricePerGram: newGoldPrice,
    priceHistory: newGoldHistory,
  };

  return { updatedStocks, updatedGold };
}
