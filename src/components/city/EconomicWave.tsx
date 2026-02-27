"use client";
import { toPersian } from "@/data/mock";
import { useGameStore } from "@/stores/gameStore";

export default function EconomicWave() {
  const waveState = useGameStore((s) => s.wave);
  const wave = {
    name: waveState.phaseName,
    emoji: waveState.phaseEmoji,
    description: waveState.phaseDescription,
    effects: waveState.effects,
    remainingDays: Math.max(1, Math.ceil((waveState.phaseDurationTicks - waveState.ticksInPhase) / 6)),
    totalDays: Math.ceil(waveState.phaseDurationTicks / 6),
  };
  const progressPct = Math.round((waveState.ticksInPhase / waveState.phaseDurationTicks) * 100);

  return (
    <div className="anim-breathe" style={{
      borderRadius: 20,
      padding: "16px",
      marginBottom: 14,
      background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)",
      border: "1px solid rgba(129,140,248,0.2)",
      boxShadow: "0 0 20px rgba(99,102,241,0.1), 0 6px 24px rgba(10,22,40,0.35)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", top: -30, left: -30, width: 100, height: 100,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
      }}>
        <span style={{ fontSize: 24 }}>{wave.emoji}</span>
        <div>
          <div style={{
            fontSize: 14, fontWeight: 800, color: "white",
          }}>
            {wave.name}
          </div>
          <div style={{
            fontSize: 11, color: "rgba(255,255,255,0.5)",
          }}>
            {wave.description}
          </div>
        </div>
      </div>

      {/* Effects */}
      <div style={{ marginBottom: 12 }}>
        {wave.effects.map((e, i) => (
          <div key={i} style={{
            fontSize: 11, fontWeight: 600,
            color: e.positive ? "#4ade80" : "#f87171",
            marginBottom: 4, display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 10 }}>{e.positive ? "✅" : "❌"}</span>
            {e.text}
          </div>
        ))}
      </div>

      {/* Timer */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 6,
      }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
          ⏳ {toPersian(wave.remainingDays)} روز باقی‌مانده
        </span>
        <span style={{
          fontSize: 9, fontWeight: 800, color: "#000",
          background: "linear-gradient(135deg, #818cf8, #6366f1)",
          borderRadius: 6, padding: "1px 6px",
        }}>
          {toPersian(progressPct)}٪
        </span>
      </div>
      <div style={{
        height: 4, borderRadius: 2,
        background: "rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${progressPct}%`,
          height: "100%", borderRadius: 2,
          background: "linear-gradient(90deg, #818cf8, #6366f1)",
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}
