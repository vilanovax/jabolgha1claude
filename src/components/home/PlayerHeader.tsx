"use client";
import { player } from "@/data/mock";

function getMascotEmoji(energy: number, hunger: number): string {
  if (energy < 25 || hunger < 20) return "😫";
  if (energy < 40 || hunger < 35) return "😐";
  if (energy > 75 && hunger > 60) return "😄";
  return "🙂";
}

export default function PlayerHeader({ doneCount }: { doneCount: number }) {
  const totalTasks = 7;
  const progressPct = Math.round((doneCount / totalTasks) * 100);
  const mascot = getMascotEmoji(player.energy, player.hunger);

  // SVG ring parameters
  const size = 44;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progressPct / 100);

  return (
    <div style={{
      borderRadius: 20,
      padding: "14px 16px",
      marginBottom: 10,
      background: "linear-gradient(145deg, #0F2340, #1B3A5C 60%, #263E66)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 6px 24px rgba(10,22,40,0.35)",
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}>
      {/* Avatar */}
      <div style={{
        width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
        background: "rgba(255,255,255,0.06)",
        border: "2px solid rgba(212,168,67,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28,
      }}>
        {mascot}
      </div>

      {/* Name + Level */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>
          {player.name.split(" ")[0]}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
          Lv.{player.level} · {player.scenario}
        </div>
      </div>

      {/* Daily progress ring */}
      <div style={{ width: size, height: size, flexShrink: 0, position: "relative" }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#4ade80" strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.8s ease",
              filter: "drop-shadow(0 0 4px rgba(74,222,128,0.4))",
            }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 800, color: "#4ade80",
        }}>
          {progressPct}٪
        </div>
      </div>
    </div>
  );
}
