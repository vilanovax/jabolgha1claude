// ─── Stock Market Store ───
// Zustand persist store for stock market state.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MarketState, StockHolding, TradeRecord } from "./types";
import { SEED_STOCKS, SEED_GOLD, MARKET_COMMISSION_RATE, GOLD_COMMISSION_RATE, MAX_TRADE_HISTORY } from "./market-config";
import { simulateDailyPrices } from "./market-simulation";

interface MarketStore extends MarketState {
  // Called from gameStore.startNextDay
  advanceMarketDay: (
    dayInGame: number,
    cityReturnModifiers: Record<string, number>,
    cityWaveId: string,
  ) => void;

  buyStock: (stockId: string, shares: number, dayInGame: number) => { success: boolean; reason?: string; cost?: number };
  sellStock: (stockId: string, shares: number, dayInGame: number) => { success: boolean; reason?: string; proceeds?: number };

  buyGold: (grams: number, dayInGame: number) => { success: boolean; reason?: string; cost?: number };
  sellGold: (grams: number, dayInGame: number) => { success: boolean; reason?: string; proceeds?: number };

  // Computed
  getPortfolioValue: () => number;   // total market value of all holdings
  getPortfolioPnL: () => number;     // total unrealized profit/loss
  getHolding: (stockId: string) => StockHolding | undefined;
}

function createInitialState(): MarketState {
  const stocks = SEED_STOCKS.map((s) => ({
    ...s,
    previousPrice: s.currentPrice,
    priceHistory: Array(7).fill(s.currentPrice) as number[],
  }));

  const gold = {
    ...SEED_GOLD,
    previousPrice: SEED_GOLD.pricePerGram,
    priceHistory: Array(7).fill(SEED_GOLD.pricePerGram) as number[],
    gramsOwned: 0,
    avgBuyPrice: 0,
  };

  return {
    stocks,
    holdings: [],
    gold,
    tradeHistory: [],
    lastUpdatedDay: 0,
  };
}

export const useMarketStore = create<MarketStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      advanceMarketDay: (dayInGame, cityReturnModifiers, cityWaveId) => {
        const state = get();
        // Only run simulation if we haven't already updated for this day
        if (state.lastUpdatedDay >= dayInGame) return;

        const { updatedStocks, updatedGold } = simulateDailyPrices(
          state.stocks,
          state.gold,
          cityReturnModifiers,
          cityWaveId,
        );

        set({
          stocks: updatedStocks,
          gold: updatedGold,
          lastUpdatedDay: dayInGame,
        });
      },

      buyStock: (stockId, shares, dayInGame) => {
        const state = get();
        const stock = state.stocks.find((s) => s.id === stockId);
        if (!stock) return { success: false, reason: "سهم یافت نشد" };
        if (shares <= 0) return { success: false, reason: "تعداد سهم نامعتبر است" };

        const commission = Math.round(stock.currentPrice * shares * MARKET_COMMISSION_RATE);
        const cost = stock.currentPrice * shares + commission;

        // Update holdings
        const existingHolding = state.holdings.find((h) => h.stockId === stockId);
        let newHoldings: StockHolding[];

        if (existingHolding) {
          const totalShares = existingHolding.shares + shares;
          const newAvgPrice = Math.round(
            (existingHolding.avgBuyPrice * existingHolding.shares + stock.currentPrice * shares) / totalShares
          );
          newHoldings = state.holdings.map((h) =>
            h.stockId === stockId
              ? { ...h, shares: totalShares, avgBuyPrice: newAvgPrice }
              : h
          );
        } else {
          newHoldings = [
            ...state.holdings,
            { stockId, shares, avgBuyPrice: stock.currentPrice },
          ];
        }

        const tradeRecord: TradeRecord = {
          id: `${stockId}-buy-${dayInGame}-${Date.now()}`,
          stockId,
          nameFa: stock.nameFa,
          type: "buy",
          shares,
          pricePerShare: stock.currentPrice,
          totalAmount: cost,
          dayInGame,
        };

        const newHistory = [tradeRecord, ...state.tradeHistory].slice(0, MAX_TRADE_HISTORY);

        set({ holdings: newHoldings, tradeHistory: newHistory });

        return { success: true, cost };
      },

      sellStock: (stockId, shares, dayInGame) => {
        const state = get();
        const stock = state.stocks.find((s) => s.id === stockId);
        if (!stock) return { success: false, reason: "سهم یافت نشد" };

        const holding = state.holdings.find((h) => h.stockId === stockId);
        if (!holding || holding.shares < shares) {
          return { success: false, reason: "سهام کافی ندارید" };
        }

        const commission = Math.round(stock.currentPrice * shares * MARKET_COMMISSION_RATE);
        const proceeds = stock.currentPrice * shares - commission;
        const profitLoss = Math.round((stock.currentPrice - holding.avgBuyPrice) * shares - commission);

        let newHoldings: StockHolding[];
        if (holding.shares === shares) {
          newHoldings = state.holdings.filter((h) => h.stockId !== stockId);
        } else {
          newHoldings = state.holdings.map((h) =>
            h.stockId === stockId ? { ...h, shares: h.shares - shares } : h
          );
        }

        const tradeRecord: TradeRecord = {
          id: `${stockId}-sell-${dayInGame}-${Date.now()}`,
          stockId,
          nameFa: stock.nameFa,
          type: "sell",
          shares,
          pricePerShare: stock.currentPrice,
          totalAmount: proceeds,
          dayInGame,
          profitLoss,
        };

        const newHistory = [tradeRecord, ...state.tradeHistory].slice(0, MAX_TRADE_HISTORY);

        set({ holdings: newHoldings, tradeHistory: newHistory });

        return { success: true, proceeds };
      },

      buyGold: (grams, dayInGame) => {
        const state = get();
        if (grams <= 0) return { success: false, reason: "مقدار طلا نامعتبر است" };

        const commission = Math.round(state.gold.pricePerGram * grams * GOLD_COMMISSION_RATE);
        const cost = state.gold.pricePerGram * grams + commission;

        const existingGrams = state.gold.gramsOwned;
        const totalGrams = existingGrams + grams;
        const newAvgBuyPrice =
          existingGrams > 0
            ? Math.round(
                (state.gold.avgBuyPrice * existingGrams + state.gold.pricePerGram * grams) / totalGrams
              )
            : state.gold.pricePerGram;

        const tradeRecord: TradeRecord = {
          id: `gold-buy-${dayInGame}-${Date.now()}`,
          stockId: "gold",
          nameFa: "طلا",
          type: "buy",
          shares: grams,
          pricePerShare: state.gold.pricePerGram,
          totalAmount: cost,
          dayInGame,
        };

        const newHistory = [tradeRecord, ...state.tradeHistory].slice(0, MAX_TRADE_HISTORY);

        set({
          gold: {
            ...state.gold,
            gramsOwned: totalGrams,
            avgBuyPrice: newAvgBuyPrice,
          },
          tradeHistory: newHistory,
        });

        return { success: true, cost };
      },

      sellGold: (grams, dayInGame) => {
        const state = get();
        if (state.gold.gramsOwned < grams) {
          return { success: false, reason: "طلای کافی ندارید" };
        }

        const commission = Math.round(state.gold.pricePerGram * grams * GOLD_COMMISSION_RATE);
        const proceeds = state.gold.pricePerGram * grams - commission;
        const profitLoss = Math.round(
          (state.gold.pricePerGram - state.gold.avgBuyPrice) * grams - commission
        );

        const tradeRecord: TradeRecord = {
          id: `gold-sell-${dayInGame}-${Date.now()}`,
          stockId: "gold",
          nameFa: "طلا",
          type: "sell",
          shares: grams,
          pricePerShare: state.gold.pricePerGram,
          totalAmount: proceeds,
          dayInGame,
          profitLoss,
        };

        const newHistory = [tradeRecord, ...state.tradeHistory].slice(0, MAX_TRADE_HISTORY);

        set({
          gold: {
            ...state.gold,
            gramsOwned: state.gold.gramsOwned - grams,
          },
          tradeHistory: newHistory,
        });

        return { success: true, proceeds };
      },

      getPortfolioValue: () => {
        const state = get();
        let total = 0;
        for (const holding of state.holdings) {
          const stock = state.stocks.find((s) => s.id === holding.stockId);
          if (stock) {
            total += stock.currentPrice * holding.shares;
          }
        }
        // Add gold value
        total += state.gold.pricePerGram * state.gold.gramsOwned;
        return total;
      },

      getPortfolioPnL: () => {
        const state = get();
        let pnl = 0;
        for (const holding of state.holdings) {
          const stock = state.stocks.find((s) => s.id === holding.stockId);
          if (stock) {
            pnl += (stock.currentPrice - holding.avgBuyPrice) * holding.shares;
          }
        }
        // Add gold P&L
        if (state.gold.gramsOwned > 0) {
          pnl += (state.gold.pricePerGram - state.gold.avgBuyPrice) * state.gold.gramsOwned;
        }
        return Math.round(pnl);
      },

      getHolding: (stockId) => {
        return get().holdings.find((h) => h.stockId === stockId);
      },
    }),
    {
      name: "shahre-man-market",
      version: 1,
    }
  )
);
