"use client";
import { useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "@/stores/gameStore";
import { useMissionStore } from "@/game/missions/store";
import { useCityStore } from "@/game/city/city-store";
import { getMissionProgressPercent } from "@/game/missions/progress";
import { toPersian, formatMoney } from "@/data/mock";

// ─── Sector health → signal label ─────────────────────────────────────────────
function getSectorSignal(health: number, trend: "up" | "flat" | "down") {
  const isBoom = health >= 72 && trend === "up";
  if (isBoom)     return { label: "🔥 داغ",  color: "#fb923c" };
  if (health >= 60) return { label: "📈 رشد",  color: "#4ade80" };
  if (health >= 38) return { label: "🟡 ثابت", color: "#f59e0b" };
  return              { label: "📉 رکود", color: "#f87171" };
}

const SECTOR_NAMES: Record<string, string> = {
  tech: "فناوری", finance: "مالی", construction: "ساختمان",
  retail: "بازار", services: "خدمات", manufacturing: "صنعت",
};

// ─── DailyHookCard ─────────────────────────────────────────────────────────────
export default function DailyHookCard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Game store
  const dayInGame       = useGameStore((s) => s.player.dayInGame);
  const dailyReward     = useGameStore((s) => s.dailyReward);
  const dailyDeals      = useGameStore((s) => s.dailyDeals);
  const claimDailyReward = useGameStore((s) => s.claimDailyReward);
  const buyDailyDeal    = useGameStore((s) => s.buyDailyDeal);
  const checking        = useGameStore((s) => s.bank.checking);

  // Mission store
  const getRecommended  = useMissionStore((s) => s.getRecommendedMission);
  const activeDailies   = useMissionStore(useShallow((s) => s.activeDailyMissions));

  // City store
  const sectors         = useCityStore(useShallow((s) => s.sectors));

  const [claimFlash, setClaimFlash] = useState<"energy" | "money" | null>(null);
  const [buyFlash, setBuyFlash] = useState<string | null>(null);

  if (!mounted) return null;

  // Pick recommended mission (daily preferred)
  const mission = getRecommended() ?? activeDailies[0] ?? null;

  // Top sector by health + boom
  const sectorList = Object.values(sectors);
  const topSector = [...sectorList].sort((a, b) => {
    const aScore = (a.health >= 72 && a.trend === "up" ? 200 : 0) + a.health;
    const bScore = (b.health >= 72 && b.trend === "up" ? 200 : 0) + b.health;
    return bScore - aScore;
  })[0];
  const signal = topSector ? getSectorSignal(topSector.health, topSector.trend) : null;

  const handleClaim = () => {
    const result = claimDailyReward();
    if (result.energy) setClaimFlash("energy");
    else if (result.money) setClaimFlash("money");
    setTimeout(() => setClaimFlash(null), 1500);
  };

  const handleBuyDeal = (dealId: string) => {
    const result = buyDailyDeal(dealId);
    if (result.success) {
      setBuyFlash(dealId);
      setTimeout(() => setBuyFlash(null), 1500);
    }
  };

  const todayReward = dailyReward?.day === dayInGame ? dailyReward : null;
  const todayDeals  = dailyDeals.filter((d) => d.expiresOnDay >= dayInGame);

  return (
    <div style={{
      borderRadius: 20,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 14px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 14 }}>📅</span>
        <span style={{ fontSize: 12, fontWeight: 900, color: "white", flex: 1 }}>
          امروز در شهر
        </span>
        <span style={{
          fontSize: 9, fontWeight: 700,
          color: "rgba(255,255,255,0.3)",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 8, padding: "2px 7px",
        }}>
          روز {toPersian(dayInGame)}
        </span>
      </div>

      <div style={{ padding: "10px 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* ── Row 1: Login Reward ── */}
        {todayReward && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 14,
            background: todayReward.claimed
              ? "rgba(255,255,255,0.02)"
              : "rgba(250,204,21,0.06)",
            border: `1px solid ${todayReward.claimed ? "rgba(255,255,255,0.06)" : "rgba(250,204,21,0.2)"}`,
          }}>
            <span style={{ fontSize: 18 }}>{todayReward.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 11, fontWeight: 800,
                color: todayReward.claimed ? "rgba(255,255,255,0.3)" : "white",
              }}>
                جایزه روزانه
              </div>
              <div style={{
                fontSize: 10, fontWeight: 600,
                color: todayReward.claimed ? "rgba(255,255,255,0.2)" : "#facc15",
              }}>
                {claimFlash
                  ? (claimFlash === "energy" ? "⚡ انرژی اضافه شد!" : "💰 به حسابت واریز شد!")
                  : todayReward.labelFa}
              </div>
            </div>
            {!todayReward.claimed && (
              <button
                onClick={handleClaim}
                style={{
                  padding: "6px 14px", borderRadius: 10,
                  background: "rgba(250,204,21,0.85)",
                  color: "#1a1000", border: "none",
                  fontSize: 11, fontWeight: 900,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                دریافت
              </button>
            )}
            {todayReward.claimed && (
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
                ✅ دریافت شد
              </span>
            )}
          </div>
        )}

        {/* ── Row 2: Daily Mission ── */}
        {mission && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 14,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <span style={{ fontSize: 16 }}>{mission.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.65)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {mission.titleFa}
              </div>
              {/* Mini progress bar */}
              <div style={{
                height: 3, borderRadius: 2,
                background: "rgba(255,255,255,0.08)", overflow: "hidden", marginTop: 4,
              }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  width: `${getMissionProgressPercent(mission)}%`,
                  background: "#4ade80",
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
            <span style={{
              fontSize: 9, fontWeight: 700,
              color: "#4ade80", background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.2)",
              borderRadius: 8, padding: "2px 7px", whiteSpace: "nowrap",
            }}>
              🎯 ماموریت
            </span>
          </div>
        )}

        {/* ── Row 3: City Signal ── */}
        {topSector && signal && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 14,
            background: `${signal.color}08`,
            border: `1px solid ${signal.color}20`,
          }}>
            <span style={{ fontSize: 16 }}>📊</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.65)" }}>
                سیگنال بازار
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: signal.color, marginTop: 1 }}>
                {signal.label} · صنعت {SECTOR_NAMES[topSector.id] ?? topSector.id}
              </div>
            </div>
            {topSector.salaryMultiplier !== 1 && (
              <span style={{
                fontSize: 9, fontWeight: 800,
                color: topSector.salaryMultiplier > 1 ? "#4ade80" : "#f87171",
              }}>
                {topSector.salaryMultiplier > 1 ? "+" : ""}
                {toPersian(Math.round((topSector.salaryMultiplier - 1) * 100))}٪ حقوق
              </span>
            )}
          </div>
        )}

        {/* ── Row 4: Daily Deals ── */}
        {todayDeals.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.25)" }}>
              🏷️ معامله امروز
            </div>
            {todayDeals.map((deal) => {
              const bought = deal.sold || buyFlash === deal.id;
              const cantAfford = checking < deal.dealPrice;
              return (
                <div
                  key={deal.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 12px", borderRadius: 12,
                    background: bought ? "rgba(255,255,255,0.02)" : "rgba(251,146,60,0.06)",
                    border: `1px solid ${bought ? "rgba(255,255,255,0.06)" : "rgba(251,146,60,0.2)"}`,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{deal.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 10, fontWeight: 800,
                      color: bought ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.75)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {deal.nameFa}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        color: "#fb923c",
                      }}>
                        {formatMoney(deal.dealPrice)}
                      </span>
                      <span style={{
                        fontSize: 8, fontWeight: 600,
                        color: "rgba(255,255,255,0.2)",
                        textDecoration: "line-through",
                      }}>
                        {formatMoney(deal.originalPrice)}
                      </span>
                      <span style={{
                        fontSize: 8, fontWeight: 800, color: "#4ade80",
                        background: "rgba(74,222,128,0.1)", borderRadius: 6, padding: "1px 5px",
                      }}>
                        ۲۸٪ تخفیف
                      </span>
                    </div>
                  </div>
                  {bought ? (
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
                      ✅
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuyDeal(deal.id)}
                      disabled={cantAfford}
                      style={{
                        padding: "5px 10px", borderRadius: 9,
                        background: cantAfford ? "rgba(255,255,255,0.04)" : "rgba(251,146,60,0.8)",
                        color: cantAfford ? "rgba(255,255,255,0.2)" : "#1a0800",
                        border: "none", fontSize: 10, fontWeight: 900,
                        cursor: cantAfford ? "default" : "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      خرید
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
