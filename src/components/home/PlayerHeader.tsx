"use client";
import { player, toPersian } from "@/data/mock";

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
        width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
        background: "rgba(255,255,255,0.06)",
        border: "2px solid rgba(212,168,67,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26,
      }}>
        {mascot}
      </div>

      {/* Name + Level + Progress bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4,
        }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "white" }}>
            {player.name.split(" ")[0]}
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            Lv.{toPersian(player.level)} · {player.scenario}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            flex: 1, height: 6, borderRadius: 4,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${progressPct}%`,
              height: "100%",
              borderRadius: 4,
              background: "linear-gradient(90deg, #22c55e, #4ade80)",
              boxShadow: "0 0 8px rgba(74,222,128,0.4)",
              transition: "width 0.6s ease",
            }} />
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#4ade80",
            whiteSpace: "nowrap",
          }}>
            {toPersian(doneCount)}/{toPersian(totalTasks)}
          </span>
        </div>
      </div>
    </div>
  );
}
