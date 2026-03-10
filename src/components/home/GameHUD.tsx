"use client";
import { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/stores/gameStore";
import { formatMoney, toPersian } from "@/data/mock";
import { calculateWeeklyBills } from "@/data/livingCosts";
import { WORK_INCOME_BASE, WORK_DAYS_PER_MONTH } from "@/data/economyConfig";
import { getRoomBuffs } from "@/data/roomItems";

// ─── Day phase ──────────────────────────────────────────────────────────────
const DAY_PHASES = [
  { emoji: "🌅", label: "صبح",  color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  { emoji: "☀️",  label: "ظهر",  color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  { emoji: "🌇", label: "عصر",  color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  { emoji: "🌙", label: "شب",   color: "#818cf8", bg: "rgba(129,140,248,0.12)" },
] as const;

function getPhase(n: number) {
  if (n <= 1) return DAY_PHASES[0];
  if (n <= 3) return DAY_PHASES[1];
  if (n <= 5) return DAY_PHASES[2];
  return DAY_PHASES[3];
}

// ─── Flash hook ──────────────────────────────────────────────────────────────
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

// ─── StatBar ─────────────────────────────────────────────────────────────────
function StatBar({ icon, value, color, warnBelow }: {
  icon: string; value: number; color: string; warnBelow: number;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const isWarn = clamped < warnBelow;
  const barColor = isWarn
    ? "linear-gradient(90deg, #ef4444, #f87171)"
    : `linear-gradient(90deg, ${color}bb, ${color})`;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, flex: 1, minWidth: 0 }}>
      <span style={{ fontSize: 11, flexShrink: 0, lineHeight: 1 }}>{icon}</span>
      <div style={{
        flex: 1, height: 4, borderRadius: 3,
        background: "rgba(255,255,255,0.09)", overflow: "hidden", position: "relative",
      }}>
        <div style={{
          position: "absolute", insetBlock: 0, left: 0,
          width: `${clamped}%`, borderRadius: 3, background: barColor,
          boxShadow: isWarn ? "0 0 6px #ef444455" : `0 0 5px ${color}44`,
          transition: "width 0.5s ease, background 0.3s ease",
        }} />
      </div>
      <span style={{
        fontSize: 8, fontWeight: 700,
        color: isWarn ? "#f87171" : "rgba(255,255,255,0.45)",
        width: 20, textAlign: "right", flexShrink: 0,
        fontVariantNumeric: "tabular-nums", transition: "color 0.3s ease",
      }}>
        {toPersian(Math.round(clamped))}
      </span>
    </div>
  );
}

// ─── ResourceBadge ───────────────────────────────────────────────────────────
function ResourceBadge({ icon, value, color, flash }: {
  icon: string; value: string; color: string; flash: "gain" | "loss" | null;
}) {
  const flashColor = flash === "gain" ? "#4ade80" : flash === "loss" ? "#f87171" : null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 3, padding: "2px 6px",
      borderRadius: 8,
      background: flashColor ? `${flashColor}14` : "transparent",
      border: `1px solid ${flashColor ? `${flashColor}28` : "transparent"}`,
      transition: "background 0.2s ease, border-color 0.2s ease",
    }}>
      <span style={{ fontSize: 11, lineHeight: 1 }}>{icon}</span>
      <span style={{
        fontSize: 10, fontWeight: 800,
        color: flashColor ?? color,
        fontVariantNumeric: "tabular-nums", transition: "color 0.2s ease",
      }}>
        {value}
      </span>
    </div>
  );
}

// ─── DayTimeIndicator ────────────────────────────────────────────────────────
function DayTimeIndicator({ actionsCount, dayInGame }: { actionsCount: number; dayInGame: number }) {
  const phase = getPhase(actionsCount);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 4, padding: "2px 7px",
      borderRadius: 8, background: phase.bg, border: `1px solid ${phase.color}25`,
    }}>
      <span style={{ fontSize: 10 }}>{phase.emoji}</span>
      <span style={{ fontSize: 8, fontWeight: 800, color: phase.color }}>{phase.label}</span>
      <span style={{ fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>
        · روز {toPersian(dayInGame)}
      </span>
    </div>
  );
}

// ─── Life Status ─────────────────────────────────────────────────────────────
function getLifeStatus(energy: number, happiness: number, health: number) {
  const avg = (energy + happiness + health) / 3;
  if (avg >= 68) return { emoji: "😊", label: "زندگی خوب",  color: "#4ade80", bg: "rgba(74,222,128,0.10)" };
  if (avg >= 42) return { emoji: "😐", label: "متوسط",      color: "#f59e0b", bg: "rgba(245,158,11,0.10)" };
  return              { emoji: "😵", label: "اوضاع خراب", color: "#f87171", bg: "rgba(248,113,113,0.10)" };
}

// ─── EconomyRow ──────────────────────────────────────────────────────────────
function EconomyRow() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const job       = useGameStore((s) => s.job);
  const living    = useGameStore((s) => s.living);
  const roomItems = useGameStore((s) => s.roomItems ?? []);
  const pending   = useGameStore((s) => s.pendingDeliveries ?? []);
  const player    = useGameStore((s) => s.player);

  if (!mounted) return null;

  // ── Income per shift ──
  const roomBuffs = getRoomBuffs(roomItems);
  let baseIncome: number;
  if (job && typeof job === "object" && "salary" in job && typeof job.salary === "number") {
    baseIncome = Math.round(job.salary / WORK_DAYS_PER_MONTH);
  } else {
    baseIncome = WORK_INCOME_BASE.full_shift;
  }
  const incomePerShift = Math.round(baseIncome * roomBuffs.workIncomeMultiplier);

  // ── Daily living cost ──
  const { total: weeklyBills } = calculateWeeklyBills(
    living.housingId, living.vehicleId, living.mobilePlanId, living.isOwned,
  );
  const dailyCost = Math.round(weeklyBills / 7);

  // ── Life status ──
  const ls = getLifeStatus(player.energy, player.happiness, player.health ?? 80);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      paddingTop: 3,
      borderTop: "1px solid rgba(255,255,255,0.05)",
    }}>
      {/* Income */}
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 9 }}>📈</span>
        <span style={{ fontSize: 9, fontWeight: 800, color: "#4ade80", fontVariantNumeric: "tabular-nums" }}>
          +{formatMoney(incomePerShift)}
        </span>
        <span style={{ fontSize: 7, color: "rgba(255,255,255,0.25)" }}>/شیفت</span>
      </div>

      <span style={{ fontSize: 7, color: "rgba(255,255,255,0.15)" }}>·</span>

      {/* Cost */}
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 9 }}>💸</span>
        <span style={{ fontSize: 9, fontWeight: 800, color: "#f87171", fontVariantNumeric: "tabular-nums" }}>
          -{formatMoney(dailyCost)}
        </span>
        <span style={{ fontSize: 7, color: "rgba(255,255,255,0.25)" }}>/روز</span>
      </div>

      {/* Delivery badge */}
      {pending.length > 0 && (
        <>
          <span style={{ fontSize: 7, color: "rgba(255,255,255,0.15)" }}>·</span>
          <div style={{
            display: "flex", alignItems: "center", gap: 3,
            padding: "1px 6px", borderRadius: 6,
            background: "rgba(245,158,11,0.10)",
            border: "1px solid rgba(245,158,11,0.20)",
          }}>
            <span style={{ fontSize: 9 }}>📦</span>
            <span style={{ fontSize: 8, fontWeight: 800, color: "#f59e0b" }}>
              {toPersian(pending.length)}
            </span>
          </div>
        </>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Life status */}
      <div style={{
        display: "flex", alignItems: "center", gap: 3,
        padding: "2px 7px", borderRadius: 8,
        background: ls.bg,
        border: `1px solid ${ls.color}25`,
      }}>
        <span style={{ fontSize: 9 }}>{ls.emoji}</span>
        <span style={{ fontSize: 8, fontWeight: 800, color: ls.color }}>{ls.label}</span>
      </div>
    </div>
  );
}

// ─── GameHUD ─────────────────────────────────────────────────────────────────
interface Props {
  onEndDay: () => void;
}

export default function GameHUD({ onEndDay }: Props) {
  const player  = useGameStore((s) => s.player);
  const bank    = useGameStore((s) => s.bank);
  const actions = useGameStore((s) => s.actionsCompletedToday);

  const totalMoney = bank.checking + bank.savings;

  const moneyFlash = useFlash(totalMoney);
  const xpFlash    = useFlash(player.xp);
  const starsFlash = useFlash(player.stars);
  const levelFlash = useFlash(player.level);

  const isLevelUp = levelFlash === "gain";

  return (
    <div style={{
      position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, zIndex: 50,
      padding: "8px 10px 0", pointerEvents: "none",
    }}>
      <div style={{
        borderRadius: 20, padding: "9px 12px 10px",
        background: "rgba(7,11,32,0.68)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${isLevelUp ? "rgba(212,168,67,0.5)" : "rgba(255,255,255,0.07)"}`,
        boxShadow: isLevelUp
          ? "0 0 20px rgba(212,168,67,0.25), 0 4px 24px rgba(0,0,0,0.4)"
          : "0 4px 24px rgba(0,0,0,0.4)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        pointerEvents: "auto",
        display: "flex", flexDirection: "column", gap: 7,
      }}>
        {/* ── Row 1: Vital bars ── */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <StatBar icon="⚡" value={player.energy}       color="#f97316" warnBelow={30} />
          <StatBar icon="🍔" value={player.hunger}       color="#f87171" warnBelow={30} />
          <StatBar icon="😊" value={player.happiness}    color="#f472b6" warnBelow={25} />
          <StatBar icon="❤️" value={player.health ?? 80} color="#4ade80" warnBelow={25} />
        </div>

        {/* ── Row 2: Resources + day + end ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Money */}
          <ResourceBadge
            icon="💰"
            value={formatMoney(totalMoney)}
            color="#4ade80"
            flash={moneyFlash}
          />

          {/* XP / Stars */}
          <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ResourceBadge icon="✨" value={`Lv.${toPersian(player.level)}`} color="#c084fc" flash={xpFlash} />
            <ResourceBadge icon="⭐" value={toPersian(player.stars)}        color="#facc15" flash={starsFlash} />
          </div>

          {/* Day + End button */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <DayTimeIndicator actionsCount={actions.length} dayInGame={player.dayInGame} />
            <button
              onClick={onEndDay}
              style={{
                fontSize: 8, fontWeight: 800, padding: "3px 9px", borderRadius: 8,
                background: "rgba(99,102,241,0.14)", color: "#818cf8",
                border: "1px solid rgba(99,102,241,0.22)",
                cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
              }}
            >
              پایان 🌙
            </button>
          </div>
        </div>

        {/* ── Row 3: Economy snapshot ── */}
        <EconomyRow />
      </div>
    </div>
  );
}
