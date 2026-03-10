"use client";
import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { toPersian } from "@/data/mock";
import { useIdentityStore } from "@/game/identity/identityStore";

function getMascotEmoji(energy: number, hunger: number, happiness: number): string {
  if (energy < 20 || hunger < 15) return "😫";
  if (energy < 35 || hunger < 28) return "😐";
  if (happiness > 75 && energy > 70 && hunger > 60) return "😄";
  if (happiness > 50) return "🙂";
  return "😶";
}

export default function CharacterStage({ doneCount }: { doneCount: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const player   = useGameStore((s) => s.player);
  const identity = useIdentityStore((s) => s);

  const totalTasks = 6;
  const mascot = getMascotEmoji(player.energy, player.hunger, player.happiness);

  const titleLabel = mounted && identity.activeTitle?.nameFa
    ? identity.activeTitle.nameFa
    : null;

  const archetypeLabel = mounted && identity.archetype?.id && identity.archetype.id !== "undecided"
    ? identity.archetype.nameFa
    : null;

  const repColor = mounted
    ? ({ unknown: "#94a3b8", trusted: "#60a5fa", professional: "#a78bfa", well_known: "#f59e0b", city_star: "#facc15" }[
        identity.reputation?.tier ?? "unknown"
      ] ?? "#94a3b8")
    : "#94a3b8";

  const glowColor = player.happiness > 70
    ? "rgba(99,102,241,0.25)"
    : player.energy < 30
      ? "rgba(239,68,68,0.18)"
      : "rgba(99,102,241,0.15)";

  const subLabel = titleLabel ?? archetypeLabel ?? `Lv.${toPersian(player.level)}`;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 12px",
      borderRadius: 18,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Avatar */}
      <div
        className="anim-breathe"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 35%, rgba(99,102,241,0.18), rgba(20,16,50,0.4))",
          border: "2px solid rgba(255,255,255,0.09)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24,
          flexShrink: 0,
          boxShadow: `0 0 14px ${glowColor}`,
          transition: "box-shadow 0.5s",
        }}
      >
        {mascot}
      </div>

      {/* Name + role */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16, fontWeight: 900, color: "white",
          letterSpacing: "-0.3px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {player.name.split(" ")[0]}
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600,
          color: repColor,
          marginTop: 1,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {subLabel}
        </div>
      </div>

      {/* Today's progress */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 2, flexShrink: 0,
      }}>
        <div style={{
          fontSize: 17, fontWeight: 900,
          color: doneCount >= totalTasks ? "#4ade80" : "rgba(255,255,255,0.7)",
          fontVariantNumeric: "tabular-nums",
        }}>
          {toPersian(doneCount)}<span style={{ fontSize: 10, opacity: 0.4 }}>/{toPersian(totalTasks)}</span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {Array.from({ length: totalTasks }).map((_, i) => (
            <div key={i} style={{
              width: 4, height: 4, borderRadius: "50%",
              background: i < doneCount ? "#4ade80" : "rgba(255,255,255,0.12)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
