// ─── Stock Market Configuration ───

import type { Stock, GoldState } from "./types";

export const SEED_STOCKS: Omit<Stock, "previousPrice" | "priceHistory">[] = [
  {
    id: "ikco",
    nameFa: "ایران خودرو",
    ticker: "IKCO",
    sector: "manufacturing",
    emoji: "🚗",
    currentPrice: 3_200,
    volatility: 0.12,
    dividendYield: 0,
  },
  {
    id: "foulad",
    nameFa: "فولاد مبارکه",
    ticker: "FOLD",
    sector: "manufacturing",
    emoji: "⚙️",
    currentPrice: 8_500,
    volatility: 0.10,
    dividendYield: 0.04,
  },
  {
    id: "parsian",
    nameFa: "بانک پارسیان",
    ticker: "PRSI",
    sector: "finance",
    emoji: "🏦",
    currentPrice: 2_100,
    volatility: 0.08,
    dividendYield: 0.06,
  },
  {
    id: "hamrahaval",
    nameFa: "همراه اول",
    ticker: "HMRH",
    sector: "tech",
    emoji: "📱",
    currentPrice: 11_000,
    volatility: 0.09,
    dividendYield: 0.05,
  },
  {
    id: "sepahan",
    nameFa: "سپاهان",
    ticker: "SPHN",
    sector: "services",
    emoji: "🏭",
    currentPrice: 4_800,
    volatility: 0.11,
    dividendYield: 0.03,
  },
  {
    id: "shazand",
    nameFa: "پتروشیمی شازند",
    ticker: "SHZD",
    sector: "construction",
    emoji: "🏗️",
    currentPrice: 6_200,
    volatility: 0.13,
    dividendYield: 0.02,
  },
];

export const SEED_GOLD: Omit<GoldState, "previousPrice" | "priceHistory" | "gramsOwned" | "avgBuyPrice"> = {
  pricePerGram: 4_200_000,  // تومان per gram
};

export const MARKET_COMMISSION_RATE = 0.005;  // 0.5% per trade
export const GOLD_COMMISSION_RATE = 0.002;    // 0.2% per trade
export const MAX_TRADE_HISTORY = 20;
