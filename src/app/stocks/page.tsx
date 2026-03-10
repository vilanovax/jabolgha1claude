"use client";
import { useState, useEffect } from "react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useGameStore } from "@/stores/gameStore";
import { useMarketStore } from "@/game/market/market-store";
import { useCityStore } from "@/game/city/city-store";
import { toPersian, formatMoney } from "@/data/mock";
import { colors, sp, radius, font, cardStyle } from "@/theme/tokens";
import type { Stock, StockHolding, TradeRecord } from "@/game/market/types";

// ─── Wave display info ────────────────────────────────────────
const WAVE_INFO: Record<string, { nameFa: string; emoji: string; marketSentiment: string; sentimentColor: string }> = {
  tech_boom:          { nameFa: "رونق فناوری", emoji: "🚀", marketSentiment: "بازار صعودی (فناوری)", sentimentColor: "#60a5fa" },
  recession:          { nameFa: "رکود اقتصادی", emoji: "📉", marketSentiment: "بازار نزولی — احتیاط", sentimentColor: "#f87171" },
  finance_bull:       { nameFa: "رونق مالی", emoji: "📈", marketSentiment: "بازار صعودی (بانک‌ها)", sentimentColor: "#4ade80" },
  construction_surge: { nameFa: "رونق ساخت‌وساز", emoji: "🏗️", marketSentiment: "فرصت در صنایع", sentimentColor: "#fbbf24" },
  retail_holiday:     { nameFa: "جشن خرید", emoji: "🛍️", marketSentiment: "رونق خدمات و خرده‌فروشی", sentimentColor: "#a78bfa" },
  steady_growth:      { nameFa: "رشد پایدار", emoji: "🌱", marketSentiment: "بازار متعادل", sentimentColor: "#4ade80" },
  inflation_crisis:   { nameFa: "بحران تورمی", emoji: "🔥", marketSentiment: "طلا و کالا ارجح است", sentimentColor: "#f87171" },
};

// ─── Sparkline SVG ────────────────────────────────────────────
function Sparkline({ history, color = "#60a5fa" }: { history: number[]; color?: string }) {
  if (!history || history.length < 2) return null;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const w = 70;
  const h = 30;
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed",
      bottom: 90,
      left: "50%",
      transform: "translateX(-50%)",
      padding: "10px 20px",
      borderRadius: radius.xl,
      background: colors.overlayDark,
      border: "1px solid rgba(255,255,255,0.1)",
      color: "white",
      fontSize: font.base,
      fontWeight: font.bold,
      zIndex: 300,
      whiteSpace: "nowrap",
      backdropFilter: "blur(10px)",
    }}>
      {message}
    </div>
  );
}

// ─── Trend arrow ──────────────────────────────────────────────
function TrendArrow({ current, previous }: { current: number; previous: number }) {
  if (current > previous) {
    return <span style={{ color: "#4ade80", fontSize: font.xl }}>↑</span>;
  } else if (current < previous) {
    return <span style={{ color: "#f87171", fontSize: font.xl }}>↓</span>;
  }
  return <span style={{ color: colors.textMuted, fontSize: font.xl }}>—</span>;
}

// ─── Inline trade panel ──────────────────────────────────────
type ShareAmount = 1 | 5 | 10 | 50;
const SHARE_AMOUNTS: ShareAmount[] = [1, 5, 10, 50];
const GOLD_AMOUNTS: number[] = [1, 5, 10];

function StockTradePanel({
  stock,
  holding,
  onBuy,
  onSell,
}: {
  stock: Stock;
  holding?: StockHolding;
  onBuy: (shares: number) => void;
  onSell: (shares: number) => void;
}) {
  const [selectedAmt, setSelectedAmt] = useState<number>(1);
  const totalCost = stock.currentPrice * selectedAmt;
  const pnl = holding ? (stock.currentPrice - holding.avgBuyPrice) * holding.shares : 0;

  return (
    <div style={{
      marginTop: 10,
      padding: 12,
      borderRadius: radius.lg,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Amount selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {SHARE_AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => setSelectedAmt(amt)}
            style={{
              padding: "4px 10px",
              borderRadius: radius.md,
              border: `1px solid ${selectedAmt === amt ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.08)"}`,
              background: selectedAmt === amt ? "rgba(96,165,250,0.15)" : "transparent",
              color: selectedAmt === amt ? "#60a5fa" : colors.textMuted,
              fontSize: font.md,
              fontWeight: font.bold,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {toPersian(amt)} سهم
          </button>
        ))}
      </div>

      {/* Cost info */}
      <div style={{ fontSize: font.md, color: colors.textSecondary, marginBottom: 10 }}>
        هزینه: <span style={{ color: "white", fontWeight: font.bold }}>{formatMoney(totalCost)}</span>
        {" "}(+کارمزد ۰.۵٪)
      </div>

      {/* Holdings info */}
      {holding && (
        <div style={{ fontSize: font.md, color: colors.textMuted, marginBottom: 10 }}>
          موجودی: {toPersian(holding.shares)} سهم · سود/زیان:{" "}
          <span style={{ color: pnl >= 0 ? "#4ade80" : "#f87171", fontWeight: font.bold }}>
            {pnl >= 0 ? "+" : ""}{formatMoney(Math.round(pnl))}
          </span>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onBuy(selectedAmt)}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: radius.lg,
            border: "1px solid rgba(74,222,128,0.3)",
            background: "rgba(74,222,128,0.12)",
            color: "#4ade80",
            fontSize: font.md,
            fontWeight: font.heavy,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          خرید
        </button>
        <button
          onClick={() => onSell(selectedAmt)}
          disabled={!holding || holding.shares < selectedAmt}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: radius.lg,
            border: `1px solid ${holding && holding.shares >= selectedAmt ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.06)"}`,
            background: holding && holding.shares >= selectedAmt ? "rgba(248,113,113,0.12)" : "transparent",
            color: holding && holding.shares >= selectedAmt ? "#f87171" : colors.textSubtle,
            fontSize: font.md,
            fontWeight: font.heavy,
            cursor: holding && holding.shares >= selectedAmt ? "pointer" : "default",
            fontFamily: "inherit",
            opacity: holding && holding.shares >= selectedAmt ? 1 : 0.5,
          }}
        >
          فروش
        </button>
      </div>
    </div>
  );
}

function GoldTradePanel({
  onBuy,
  onSell,
  gramsOwned,
}: {
  onBuy: (grams: number) => void;
  onSell: (grams: number) => void;
  gramsOwned: number;
}) {
  const [selectedGrams, setSelectedGrams] = useState<number>(1);

  return (
    <div style={{
      marginTop: 10,
      padding: 12,
      borderRadius: radius.lg,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {GOLD_AMOUNTS.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGrams(g)}
            style={{
              padding: "4px 10px",
              borderRadius: radius.md,
              border: `1px solid ${selectedGrams === g ? "rgba(212,168,67,0.5)" : "rgba(255,255,255,0.08)"}`,
              background: selectedGrams === g ? "rgba(212,168,67,0.15)" : "transparent",
              color: selectedGrams === g ? "#D4A843" : colors.textMuted,
              fontSize: font.md,
              fontWeight: font.bold,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {toPersian(g)} گرم
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onBuy(selectedGrams)}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: radius.lg,
            border: "1px solid rgba(74,222,128,0.3)",
            background: "rgba(74,222,128,0.12)",
            color: "#4ade80",
            fontSize: font.md,
            fontWeight: font.heavy,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          خرید طلا
        </button>
        <button
          onClick={() => onSell(selectedGrams)}
          disabled={gramsOwned < selectedGrams}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: radius.lg,
            border: `1px solid ${gramsOwned >= selectedGrams ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.06)"}`,
            background: gramsOwned >= selectedGrams ? "rgba(248,113,113,0.12)" : "transparent",
            color: gramsOwned >= selectedGrams ? "#f87171" : colors.textSubtle,
            fontSize: font.md,
            fontWeight: font.heavy,
            cursor: gramsOwned >= selectedGrams ? "pointer" : "default",
            fontFamily: "inherit",
            opacity: gramsOwned >= selectedGrams ? 1 : 0.5,
          }}
        >
          فروش طلا
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function StocksPage() {
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Game store
  const checking = useGameStore((s) => s.bank.checking);
  const dayInGame = useGameStore((s) => s.player.dayInGame);

  // Market store
  const stocks = useMarketStore((s) => s.stocks);
  const holdings = useMarketStore((s) => s.holdings);
  const gold = useMarketStore((s) => s.gold);
  const tradeHistory = useMarketStore((s) => s.tradeHistory);
  const getPortfolioValue = useMarketStore((s) => s.getPortfolioValue);
  const getPortfolioPnL = useMarketStore((s) => s.getPortfolioPnL);
  const buyStock = useMarketStore((s) => s.buyStock);
  const sellStock = useMarketStore((s) => s.sellStock);
  const buyGold = useMarketStore((s) => s.buyGold);
  const sellGold = useMarketStore((s) => s.sellGold);

  // City store for wave
  const waveId = useCityStore((s) => s.currentWaveId);
  const waveInfo = WAVE_INFO[waveId] ?? { nameFa: "عادی", emoji: "🌐", marketSentiment: "بازار عادی", sentimentColor: colors.textMuted };

  if (!mounted) return null;

  const portfolioValue = getPortfolioValue();
  const portfolioPnL = getPortfolioPnL();
  const goldValue = gold.pricePerGram * gold.gramsOwned;

  // Handlers
  const handleBuyStock = (stockId: string, shares: number) => {
    const stock = stocks.find((s) => s.id === stockId);
    if (!stock) return;
    const commission = Math.round(stock.currentPrice * shares * 0.005);
    const totalCost = stock.currentPrice * shares + commission;

    if (checking < totalCost) {
      setToast("موجودی کافی نیست ❌");
      return;
    }

    const result = buyStock(stockId, shares, dayInGame);
    if (result.success && result.cost) {
      useGameStore.setState((s) => ({
        bank: { ...s.bank, checking: s.bank.checking - result.cost! },
      }));
      setToast(`خرید ${toPersian(shares)} سهم انجام شد ✅`);
    } else {
      setToast(result.reason ?? "خطا در خرید ❌");
    }
  };

  const handleSellStock = (stockId: string, shares: number) => {
    const result = sellStock(stockId, shares, dayInGame);
    if (result.success && result.proceeds) {
      useGameStore.setState((s) => ({
        bank: { ...s.bank, checking: s.bank.checking + result.proceeds! },
      }));
      setToast(`فروش ${toPersian(shares)} سهم انجام شد ✅`);
    } else {
      setToast(result.reason ?? "خطا در فروش ❌");
    }
  };

  const handleBuyGold = (grams: number) => {
    const commission = Math.round(gold.pricePerGram * grams * 0.002);
    const totalCost = gold.pricePerGram * grams + commission;

    if (checking < totalCost) {
      setToast("موجودی کافی نیست ❌");
      return;
    }

    const result = buyGold(grams, dayInGame);
    if (result.success && result.cost) {
      useGameStore.setState((s) => ({
        bank: { ...s.bank, checking: s.bank.checking - result.cost! },
      }));
      setToast(`خرید ${toPersian(grams)} گرم طلا انجام شد ✅`);
    } else {
      setToast(result.reason ?? "خطا در خرید ❌");
    }
  };

  const handleSellGold = (grams: number) => {
    const result = sellGold(grams, dayInGame);
    if (result.success && result.proceeds) {
      useGameStore.setState((s) => ({
        bank: { ...s.bank, checking: s.bank.checking + result.proceeds! },
      }));
      setToast(`فروش ${toPersian(grams)} گرم طلا انجام شد ✅`);
    } else {
      setToast(result.reason ?? "خطا در فروش ❌");
    }
  };

  const recentTrades = tradeHistory.slice(0, 5);

  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      {/* Floating particles */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{
          position: "fixed",
          width: 3, height: 3, borderRadius: "50%",
          background: i % 2 === 0 ? "rgba(96,165,250,0.3)" : "rgba(74,222,128,0.3)",
          top: `${15 + i * 20}%`,
          left: `${8 + i * 22}%`,
          animation: `particle-drift ${5 + i * 2}s ease-in-out ${i * 1.5}s infinite`,
          pointerEvents: "none", zIndex: 0,
        }} />
      ))}

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 10px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", gap: 14,
      }}>

        {/* ═══ Page Header ═══ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            fontSize: 20, fontWeight: 900, color: "white",
            display: "flex", alignItems: "center", gap: 8,
            textShadow: "0 0 16px rgba(96,165,250,0.3)",
          }}>
            <span style={{ fontSize: 22 }}>📊</span>
            بازار سهام
          </div>
          <div style={{
            fontSize: font.md, fontWeight: font.bold,
            color: "#60a5fa",
            background: "rgba(96,165,250,0.1)",
            border: "1px solid rgba(96,165,250,0.2)",
            borderRadius: radius.pill,
            padding: "4px 12px",
          }}>
            {portfolioValue > 0 ? formatMoney(portfolioValue) : "پرتفوی خالی"}
          </div>
        </div>

        {/* ═══ Wave Banner ═══ */}
        <div style={{
          padding: "10px 14px",
          borderRadius: radius.xl,
          background: `${waveInfo.sentimentColor}10`,
          border: `1px solid ${waveInfo.sentimentColor}20`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{waveInfo.emoji}</span>
            <div>
              <div style={{ fontSize: font.md, fontWeight: font.bold, color: "white" }}>
                {waveInfo.nameFa}
              </div>
              <div style={{ fontSize: font.sm, color: colors.textMuted }}>
                {waveInfo.marketSentiment}
              </div>
            </div>
          </div>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: waveInfo.sentimentColor,
            boxShadow: `0 0 8px ${waveInfo.sentimentColor}`,
          }} />
        </div>

        {/* ═══ Portfolio Summary ═══ */}
        <div style={{
          ...cardStyle,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: 16,
        }}>
          <div style={{ fontSize: font.lg, fontWeight: font.bold, color: colors.textSecondary, marginBottom: 12 }}>
            خلاصه پرتفوی
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: font.md, color: colors.textMuted }}>ارزش پرتفوی</span>
              <span style={{ fontSize: font.xl, fontWeight: font.heavy, color: "white" }}>
                {formatMoney(portfolioValue)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: font.md, color: colors.textMuted }}>سود/زیان کل</span>
              <span style={{
                fontSize: font.xl, fontWeight: font.heavy,
                color: portfolioPnL >= 0 ? "#4ade80" : "#f87171",
              }}>
                {portfolioPnL >= 0 ? "+" : ""}{formatMoney(portfolioPnL)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: font.md, color: colors.textMuted }}>طلا</span>
              <span style={{ fontSize: font.md, fontWeight: font.bold, color: "#D4A843" }}>
                {toPersian(gold.gramsOwned)} گرم · {formatMoney(goldValue)}
              </span>
            </div>
            <div style={{
              height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: font.md, color: colors.textMuted }}>موجودی نقدی</span>
              <span style={{ fontSize: font.md, fontWeight: font.bold, color: "#60a5fa" }}>
                {formatMoney(checking)}
              </span>
            </div>
          </div>
        </div>

        {/* ═══ Stock List ═══ */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: -4 }}>
          <span style={{ fontSize: 16 }}>📈</span>
          <span style={{ fontSize: font["2xl"], fontWeight: font.heavy, color: "white" }}>سهام</span>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#60a5fa", opacity: 0.6,
            boxShadow: "0 0 6px #60a5fa",
          }} />
        </div>

        {stocks.map((stock) => {
          const holding = holdings.find((h) => h.stockId === stock.id);
          const isExpanded = expandedId === stock.id;
          const isUp = stock.currentPrice >= stock.previousPrice;
          const pctChange = ((stock.currentPrice - stock.previousPrice) / stock.previousPrice) * 100;

          return (
            <div
              key={stock.id}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${isExpanded ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 20,
                padding: 16,
                transition: "border-color 0.2s",
              }}
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : stock.id)}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* Left: emoji + name + ticker */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{stock.emoji}</span>
                    <div>
                      <div style={{ fontSize: font.lg, fontWeight: font.heavy, color: "white" }}>
                        {stock.nameFa}
                      </div>
                      <div style={{
                        display: "inline-block",
                        fontSize: font.sm, fontWeight: font.bold,
                        color: "#60a5fa",
                        background: "rgba(96,165,250,0.1)",
                        border: "1px solid rgba(96,165,250,0.2)",
                        borderRadius: radius.sm,
                        padding: "1px 6px",
                        marginTop: 2,
                      }}>
                        {stock.ticker}
                      </div>
                      {holding && (
                        <div style={{
                          fontSize: font.sm, color: colors.textMuted, marginTop: 2,
                        }}>
                          {toPersian(holding.shares)} سهم در اختیار
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: price + sparkline */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <TrendArrow current={stock.currentPrice} previous={stock.previousPrice} />
                      <span style={{ fontSize: font.xl, fontWeight: font.heavy, color: "white" }}>
                        {formatMoney(stock.currentPrice)}
                      </span>
                    </div>
                    <div style={{
                      fontSize: font.sm, fontWeight: font.bold,
                      color: isUp ? "#4ade80" : "#f87171",
                    }}>
                      {isUp ? "+" : ""}{toPersian(pctChange.toFixed(1))}٪
                    </div>
                    <Sparkline
                      history={stock.priceHistory}
                      color={isUp ? "#4ade80" : "#f87171"}
                    />
                  </div>
                </div>

                {/* Dividend chip */}
                {stock.dividendYield > 0 && (
                  <div style={{ marginTop: 6 }}>
                    <span style={{
                      fontSize: font.xs, fontWeight: font.bold,
                      color: "#D4A843",
                      background: "rgba(212,168,67,0.1)",
                      border: "1px solid rgba(212,168,67,0.2)",
                      borderRadius: radius.sm,
                      padding: "2px 6px",
                    }}>
                      سود تقسیمی: {toPersian((stock.dividendYield * 100).toFixed(0))}٪ سالانه
                    </span>
                  </div>
                )}
              </div>

              {/* Expandable Trade Panel */}
              {isExpanded && (
                <StockTradePanel
                  stock={stock}
                  holding={holding}
                  onBuy={(shares) => handleBuyStock(stock.id, shares)}
                  onSell={(shares) => handleSellStock(stock.id, shares)}
                />
              )}
            </div>
          );
        })}

        {/* ═══ Gold Section ═══ */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: -4, marginTop: 4 }}>
          <span style={{ fontSize: 16 }}>🥇</span>
          <span style={{ fontSize: font["2xl"], fontWeight: font.heavy, color: "white" }}>طلا</span>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#D4A843", opacity: 0.6,
            boxShadow: "0 0 6px #D4A843",
          }} />
        </div>

        <div style={{
          background: "rgba(212,168,67,0.04)",
          border: "1px solid rgba(212,168,67,0.12)",
          borderRadius: 20,
          padding: 16,
        }}>
          <div
            onClick={() => setExpandedId(expandedId === "gold" ? null : "gold")}
            style={{ cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28 }}>🥇</span>
                <div>
                  <div style={{ fontSize: font.lg, fontWeight: font.heavy, color: "white" }}>
                    طلای فیزیکی
                  </div>
                  <div style={{ fontSize: font.md, color: colors.textMuted, marginTop: 2 }}>
                    {gold.gramsOwned > 0
                      ? `${toPersian(gold.gramsOwned)} گرم در اختیار`
                      : "بدون موجودی"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <TrendArrow current={gold.pricePerGram} previous={gold.previousPrice} />
                  <span style={{ fontSize: font.lg, fontWeight: font.heavy, color: "#D4A843" }}>
                    {formatMoney(gold.pricePerGram)}
                  </span>
                </div>
                <div style={{ fontSize: font.sm, color: colors.textMuted }}>هر گرم</div>
                <Sparkline history={gold.priceHistory} color="#D4A843" />
              </div>
            </div>

            {gold.gramsOwned > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: font.md, color: colors.textSecondary }}>
                  ارزش کل: <span style={{ color: "#D4A843", fontWeight: font.bold }}>{formatMoney(goldValue)}</span>
                  {" "}· سود/زیان:{" "}
                  <span style={{
                    fontWeight: font.bold,
                    color: gold.pricePerGram >= gold.avgBuyPrice ? "#4ade80" : "#f87171",
                  }}>
                    {gold.pricePerGram >= gold.avgBuyPrice ? "+" : ""}
                    {formatMoney(Math.round((gold.pricePerGram - gold.avgBuyPrice) * gold.gramsOwned))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {expandedId === "gold" && (
            <GoldTradePanel
              onBuy={handleBuyGold}
              onSell={handleSellGold}
              gramsOwned={gold.gramsOwned}
            />
          )}
        </div>

        {/* ═══ Trade History ═══ */}
        {recentTrades.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>🕐</span>
              <span style={{ fontSize: font["2xl"], fontWeight: font.heavy, color: "white" }}>
                تاریخچه معاملات
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentTrades.map((trade) => (
                <TradeHistoryRow key={trade.id} trade={trade} />
              ))}
            </div>
          </div>
        )}

      </div>

      {toast && (
        <Toast message={toast} onDone={() => setToast(null)} />
      )}

      <BottomNav />
    </div>
  );
}

function TradeHistoryRow({ trade }: { trade: TradeRecord }) {
  const isBuy = trade.type === "buy";
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: radius.xl,
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: radius.md,
          background: isBuy ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12,
        }}>
          {isBuy ? "↑" : "↓"}
        </div>
        <div>
          <div style={{ fontSize: font.md, fontWeight: font.bold, color: "white" }}>
            {trade.nameFa}
          </div>
          <div style={{ fontSize: font.sm, color: colors.textMuted }}>
            {isBuy ? "خرید" : "فروش"} · {toPersian(trade.shares)} {trade.stockId === "gold" ? "گرم" : "سهم"}
            {" "}· روز {toPersian(trade.dayInGame)}
          </div>
        </div>
      </div>
      <div style={{ textAlign: "left" }}>
        <div style={{
          fontSize: font.md, fontWeight: font.heavy,
          color: isBuy ? "#f87171" : "#4ade80",
        }}>
          {isBuy ? "-" : "+"}{formatMoney(trade.totalAmount)}
        </div>
        {trade.profitLoss !== undefined && (
          <div style={{
            fontSize: font.sm, fontWeight: font.bold,
            color: trade.profitLoss >= 0 ? "#4ade80" : "#f87171",
          }}>
            {trade.profitLoss >= 0 ? "+" : ""}{formatMoney(trade.profitLoss)}
          </div>
        )}
      </div>
    </div>
  );
}
