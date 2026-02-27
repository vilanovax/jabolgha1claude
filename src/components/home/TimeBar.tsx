"use client";
import { useGameStore } from "@/stores/gameStore";
import { toPersian } from "@/data/mock";
import type { DayPhase } from "@/stores/gameStore";

const PHASE_CONFIG: Record<DayPhase, { emoji: string; label: string; color: string }> = {
  morning: { emoji: "🌅", label: "صبح", color: "#facc15" },
  noon:    { emoji: "☀️", label: "ظهر", color: "#fb923c" },
  evening: { emoji: "🌇", label: "عصر", color: "#f97316" },
  night:   { emoji: "🌙", label: "شب", color: "#818cf8" },
};

export default function TimeBar() {
  const currentMinutes = useGameStore((s) => s.currentMinutes);
  const isEndOfDay = useGameStore((s) => s.isEndOfDay);
  const dayInGame = useGameStore((s) => s.player.dayInGame);
  const getPhase = useGameStore((s) => s.getPhase);
  const getTimeLabel = useGameStore((s) => s.getTimeLabel);
  const getDayProgress = useGameStore((s) => s.getDayProgress);

  const phase = getPhase();
  const config = PHASE_CONFIG[phase];
  const progress = getDayProgress();
  const timeLabel = getTimeLabel();

  return (
    <div style={{ width: "100%" }}>
      {/* Row 1: Phase info */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 6, marginBottom: 4,
      }}>
        <span style={{ fontSize: 14 }}>{config.emoji}</span>
        <span style={{
          fontSize: 13, fontWeight: 900, color: "white",
          textShadow: `0 0 10px ${config.color}40`,
        }}>
          {toPersian(timeLabel)}
        </span>
      </div>

      {/* Row 2: Progress bar */}
      <div style={{
        position: "relative",
        height: 4, borderRadius: 2,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}>
        {/* Fill */}
        <div
          className="anim-time-progress"
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 2,
            background: isEndOfDay
              ? "linear-gradient(90deg, #818cf8, #f87171)"
              : `linear-gradient(90deg, ${config.color}80, ${config.color})`,
          }}
        />

        {/* Phase markers at 25%, 50%, 75% */}
        {[25, 50, 75].map((pct) => (
          <div key={pct} style={{
            position: "absolute",
            top: 0,
            left: `${pct}%`,
            width: 1,
            height: "100%",
            background: "rgba(255,255,255,0.12)",
          }} />
        ))}
      </div>

      {/* Remaining time label */}
      <div style={{
        textAlign: "center", marginTop: 3,
        fontSize: 8, fontWeight: 600,
        color: isEndOfDay ? "#f87171" : "rgba(255,255,255,0.3)",
      }}>
        {isEndOfDay
          ? "پایان روز 🌙"
          : `${toPersian(960 - currentMinutes)} دقیقه باقی‌مونده`
        }
      </div>
    </div>
  );
}
