"use client";
import { player, toPersian } from "@/data/mock";

function getMascotEmoji(energy: number, hunger: number): string {
  if (energy < 25 || hunger < 20) return "😫";
  if (energy < 40 || hunger < 35) return "😐";
  if (energy > 75 && hunger > 60) return "😄";
  return "🙂";
}

export default function CharacterStage({ doneCount }: { doneCount: number }) {
  const mascot = getMascotEmoji(player.energy, player.hunger);
  const totalTasks = 7;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "16px 0 8px",
      position: "relative",
    }}>
      {/* Ambient glow ring behind character */}
      <div style={{
        position: "absolute",
        top: 10,
        width: 130,
        height: 130,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        animation: "glow-ring 3s ease-in-out infinite",
      }} />

      {/* Character */}
      <div className="anim-breathe" style={{
        width: 90,
        height: 90,
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 35%, rgba(99,102,241,0.15), rgba(30,20,60,0.3))",
        border: "2px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
        position: "relative",
        zIndex: 2,
        boxShadow: "0 0 30px rgba(99,102,241,0.2)",
      }}>
        {mascot}
      </div>

      {/* Floor shadow */}
      <div style={{
        width: 70,
        height: 14,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)",
        marginTop: -4,
        zIndex: 1,
      }} />

      {/* Name + level */}
      <div style={{
        marginTop: 8,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 16, fontWeight: 900, color: "white",
          textShadow: "0 0 16px rgba(99,102,241,0.3)",
        }}>
          {player.name.split(" ")[0]}
        </div>
        <div style={{
          fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)",
          marginTop: 2,
        }}>
          Lv.{toPersian(player.level)} · {player.scenario} · {toPersian(doneCount)}/{toPersian(totalTasks)}
        </div>
      </div>
    </div>
  );
}
