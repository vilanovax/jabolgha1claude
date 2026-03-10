// ─── Stock Market Types ───

export interface Stock {
  id: string;
  nameFa: string;
  ticker: string;          // e.g. "IKCO"
  sector: string;          // maps to city SectorId
  emoji: string;
  currentPrice: number;    // تومان per share
  previousPrice: number;   // for trend calculation
  priceHistory: number[];  // last 7 days, index 0 = oldest
  volatility: number;      // 0.05–0.30 base daily swing
  dividendYield: number;   // annual % (0 = no dividend)
}

export interface StockHolding {
  stockId: string;
  shares: number;
  avgBuyPrice: number;     // cost basis per share
}

export interface TradeRecord {
  id: string;
  stockId: string;
  nameFa: string;
  type: "buy" | "sell";
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  dayInGame: number;
  profitLoss?: number;     // only on sell
}

export interface GoldState {
  pricePerGram: number;
  previousPrice: number;
  priceHistory: number[];  // last 7 days
  gramsOwned: number;
  avgBuyPrice: number;
}

export interface MarketState {
  stocks: Stock[];
  holdings: StockHolding[];
  gold: GoldState;
  tradeHistory: TradeRecord[];
  lastUpdatedDay: number;
}
