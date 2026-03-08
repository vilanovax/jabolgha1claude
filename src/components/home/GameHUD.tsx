"use client";
import { useGameStore } from "@/stores/gameStore";
import { formatMoney, toPersian } from "@/data/mock";

interface Props {
  onEndDay: () => void;
}

const DAY_PHASES = [
  { key: "morning", emoji: "🌅", label: "صبح", color: "#fbbf24", bg: "rgba(251,191,36,0.10)" },
  { key: "noon", emoji: "☀️", label: "ظهر", color: "#fb923c", bg: "rgba(251,146,60,0.10)" },
  { key: "evening", emoji: "🌇", label: "عصر", color: "#f97316", bg: "rgba(249,115,22,0.10)" },
  { key: "night", emoji: "🌙", label: "شب", color: "#818cf8", bg: "rgba(129,140,248,0.10)" },
] as const;

function getPhase(actionsCount: number) {
  if (actionsCount <= 1) return DAY_PHASES[0];
  if (actionsCount <= 3) return DAY_PHASES[1];
  if (actionsCount <= 5) return DAY_PHASES[2];
  return DAY_PHASES[3];
}

export default function GameHUD({ onEndDay }: Props) {
  const player = useGameStore((s) => s.player);
  const bank = useGameStore((s) => s.bank);
  const actionsCount = useGameStore((s) => s.actionsCompletedToday.length);

  const phase = getPhase(actionsCount);

  const stats = [
    { icon: "⭐", value: toPersian(player.stars), color: "#facc15", warn: false },
    { icon: "✨", value: toPersian(player.xp), color: "#c084fc", warn: false },
    { icon: "💰", value: formatMoney(bank.checking + bank.savings), color: "#4ade80", warn: bank.checking < 5_000_000 },
    { icon: "⚡", value: toPersian(player.energy), color: "#fb923c", warn: player.energy < 30 },
    { icon: "🍔", value: toPersian(player.hunger), color: "#f87171", warn: player.hunger < 30 },
  ];

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 430,
      zIndex: 50,
      padding: "8px 12px",
      pointerEvents: "none",
    }}>
      <div style={{
        borderRadius: 22,
        padding: "8px 14px",
        background: "rgba(10,14,39,0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        pointerEvents: "auto",
      }}>
        {/* Row 1: Day + Phase + Level + End Day */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)",
            }}>
              روز {toPersian(player.dayInGame)}
            </span>
            {/* Phase badge */}
            <span className="phase-badge" style={{
              fontSize: 9, fontWeight: 800,
              padding: "2px 8px", borderRadius: 10,
              background: phase.bg,
              color: phase.color,
              border: `1px solid ${phase.color}33`,
              display: "flex", alignItems: "center", gap: 3,
            }}>
              <span style={{ fontSize: 11 }}>{phase.emoji}</span>
              {phase.label}
            </span>
          </div>

          <button
            onClick={onEndDay}
            style={{
              fontSize: 9, fontWeight: 800,
              padding: "3px 10px", borderRadius: 10,
              background: "rgba(99,102,241,0.12)",
              color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.2)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            پایان روز 🌙
          </button>

          <span style={{
            fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)",
          }}>
            Lv.{toPersian(player.level)}
          </span>
        </div>

        {/* Row 2: Stat icons */}
        <div style={{
          display: "flex", justifyContent: "space-between", gap: 2,
        }}>
          {stats.map((s) => (
            <div key={s.icon} className={s.warn ? "stat-warn-pulse" : ""} style={{
              display: "flex", alignItems: "center", gap: 3,
            }}>
              <span style={{ fontSize: 11 }}>{s.icon}</span>
              <span style={{
                fontSize: 10, fontWeight: 800, color: s.color,
                fontVariantNumeric: "tabular-nums",
              }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
