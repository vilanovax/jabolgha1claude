"use client";
import { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/stores/gameStore";
import { formatMoney, toPersian } from "@/data/mock";

// ─── Flash hook ───────────────────────────────────────────────────────────────
function useFlash(value: number): "gain" | "loss" | null {
  const prev = useRef(value);
  const [flash, setFlash] = useState<"gain" | "loss" | null>(null);
  useEffect(() => {
    if (value !== prev.current) {
      setFlash(value > prev.current ? "gain" : "loss");
      prev.current = value;
      const t = setTimeout(() => setFlash(null), 750);
      return () => clearTimeout(t);
    }
  }, [value]);
  return flash;
}

// ─── StatBar ──────────────────────────────────────────────────────────────────
function StatBar({
  icon, value, warn, barColor,
}: {
  icon: string; value: number; warn: boolean; barColor: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  const color = warn ? "#f87171" : barColor;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1 }}>
      <span style={{ fontSize: 12, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
      <div style={{
        flex: 1, height: 5, borderRadius: 3,
        background: "rgba(255,255,255,0.08)", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 3,
          width: `${pct}%`,
          background: color,
          transition: "width 0.5s ease, background 0.3s",
        }} />
      </div>
      <span style={{
        fontSize: 11, fontWeight: 800,
        color: warn ? "#f87171" : "rgba(255,255,255,0.65)",
        minWidth: 20, textAlign: "left",
        fontVariantNumeric: "tabular-nums",
        flexShrink: 0,
      }}>
        {toPersian(Math.round(value))}
      </span>
    </div>
  );
}

// ─── Day phase ────────────────────────────────────────────────────────────────
const PHASES = [
  { emoji: "🌅", label: "صبح",  color: "#fbbf24", bg: "rgba(251,191,36,0.10)" },
  { emoji: "☀️",  label: "ظهر",  color: "#fb923c", bg: "rgba(251,146,60,0.10)" },
  { emoji: "🌇", label: "عصر",  color: "#f97316", bg: "rgba(249,115,22,0.10)" },
  { emoji: "🌙", label: "شب",   color: "#818cf8", bg: "rgba(129,140,248,0.10)" },
] as const;

function getPhase(n: number) {
  if (n <= 1) return PHASES[0];
  if (n <= 3) return PHASES[1];
  if (n <= 5) return PHASES[2];
  return PHASES[3];
}

// ─── Meal dots ────────────────────────────────────────────────────────────────
const MEALS = [
  { key: "breakfast" as const, emoji: "🌅", label: "صبحانه" },
  { key: "lunch"     as const, emoji: "☀️",  label: "ناهار"  },
  { key: "dinner"    as const, emoji: "🌙", label: "شام"    },
];

// ─── GameHUD ──────────────────────────────────────────────────────────────────
export default function GameHUD({ onEndDay }: { onEndDay: () => void }) {
  const player  = useGameStore((s) => s.player);
  const bank    = useGameStore((s) => s.bank);
  const actions = useGameStore((s) => s.actionsCompletedToday);
  const pending = useGameStore((s) => s.pendingDeliveries ?? []);

  const totalMoney = bank.checking + bank.savings;
  const moneyFlash = useFlash(totalMoney);
  const levelFlash = useFlash(player.level);
  const isLevelUp  = levelFlash === "gain";
  const phase      = getPhase(actions.length);

  const moneyColor = moneyFlash === "gain" ? "#4ade80" : moneyFlash === "loss" ? "#f87171" : "#4ade80";

  return (
    <div style={{
      position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, zIndex: 50,
      padding: "10px 12px 0",
      pointerEvents: "none",
    }}>
      <div style={{
        borderRadius: 22, padding: "11px 14px 13px",
        background: "rgba(6,9,28,0.80)",
        backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
        border: `1px solid ${isLevelUp ? "rgba(212,168,67,0.45)" : "rgba(255,255,255,0.07)"}`,
        boxShadow: isLevelUp
          ? "0 0 20px rgba(212,168,67,0.2), 0 6px 32px rgba(0,0,0,0.5)"
          : "0 6px 32px rgba(0,0,0,0.5)",
        transition: "border-color 0.3s, box-shadow 0.3s",
        pointerEvents: "auto",
        display: "flex", flexDirection: "column", gap: 10,
      }}>

        {/* ── Row 1: Money + Level + Day + End ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, direction: "rtl" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5, flex: 1 }}>
            <span style={{ fontSize: 12 }}>💰</span>
            <span style={{
              fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px",
              color: moneyColor, fontVariantNumeric: "tabular-nums",
              transition: "color 0.3s",
            }}>
              {formatMoney(totalMoney)}
            </span>
            {pending.length > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 800, color: "#f59e0b",
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 8, padding: "1px 6px",
              }}>
                📦{toPersian(pending.length)}
              </span>
            )}
          </div>
          <span style={{
            fontSize: 12, fontWeight: 800,
            color: isLevelUp ? "#facc15" : "rgba(255,255,255,0.4)",
            transition: "color 0.3s",
          }}>
            ⭐ Lv.{toPersian(player.level)}
          </span>
          <div style={{
            display: "flex", alignItems: "center", gap: 3,
            padding: "3px 9px", borderRadius: 10,
            background: phase.bg, border: `1px solid ${phase.color}20`,
          }}>
            <span style={{ fontSize: 10 }}>{phase.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: phase.color }}>{phase.label}</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>· روز {toPersian(player.dayInGame)}</span>
          </div>
          <button
            onClick={onEndDay}
            style={{
              fontSize: 11, fontWeight: 800, padding: "4px 11px", borderRadius: 10,
              background: "rgba(99,102,241,0.12)", color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.2)",
              cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
            }}
          >
            پایان 🌙
          </button>
        </div>

        {/* ── Row 2: 4 stat bars in 2×2 grid ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <StatBar icon="⚡" value={player.energy}       warn={player.energy < 30}        barColor="#facc15" />
            <StatBar icon="❤️" value={player.health ?? 80} warn={(player.health ?? 80) < 25} barColor="#f43f5e" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <StatBar icon="😊" value={player.happiness}    warn={player.happiness < 25}     barColor="#c084fc" />
            <StatBar icon="🍔" value={player.hunger}       warn={player.hunger < 30}         barColor="#4ade80" />
          </div>
        </div>

        {/* ── Row 3: Meal dots ── */}
        {(() => {
          const meals = player.mealsToday ?? { breakfast: false, lunch: false, dinner: false, snackCount: 0 };
          const totalEaten = [meals.breakfast, meals.lunch, meals.dinner].filter(Boolean).length + Math.min(meals.snackCount, 2);
          const allDone = meals.breakfast && meals.lunch && meals.dinner;
          return (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              paddingTop: 2, borderTop: "1px solid rgba(255,255,255,0.05)",
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.2)", flex: 1 }}>
                وعده‌های امروز
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {MEALS.map(({ key, emoji }) => {
                  const done = meals[key];
                  return (
                    <div key={key} style={{
                      display: "flex", alignItems: "center", gap: 2,
                      padding: "2px 7px", borderRadius: 8,
                      background: done ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${done ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.06)"}`,
                    }}>
                      <span style={{ fontSize: 9 }}>{emoji}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 800,
                        color: done ? "#4ade80" : "rgba(255,255,255,0.2)",
                      }}>
                        {done ? "✓" : "·"}
                      </span>
                    </div>
                  );
                })}
                {meals.snackCount > 0 && (
                  <div style={{
                    padding: "2px 7px", borderRadius: 8,
                    background: "rgba(251,146,60,0.08)",
                    border: "1px solid rgba(251,146,60,0.2)",
                    fontSize: 9, fontWeight: 800, color: "#fb923c",
                  }}>
                    +{toPersian(meals.snackCount)} 🍿
                  </div>
                )}
              </div>
              {/* Penalty warning if no meals */}
              {totalEaten === 0 && (
                <span style={{
                  fontSize: 8, fontWeight: 800, color: "#f87171",
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  borderRadius: 6, padding: "1px 6px",
                }}>
                  ⚠️ نخوردی!
                </span>
              )}
              {allDone && (
                <span style={{
                  fontSize: 8, fontWeight: 800, color: "#4ade80",
                  background: "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.2)",
                  borderRadius: 6, padding: "1px 6px",
                }}>
                  ✅ کامل
                </span>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
