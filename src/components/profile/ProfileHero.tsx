"use client";
import { player, bank, job, skills, toPersian } from "@/data/mock";

function getMoodEmoji(energy: number, hunger: number, happiness: number): string {
  if (energy < 25 || hunger < 20) return "😫";
  if (energy < 40 || hunger < 35) return "😐";
  if (happiness > 70 && energy > 60) return "😄";
  return "🙂";
}

function getHonoraryTitle(): { title: string; emoji: string } {
  const maxHardSkill = Math.max(...skills.hard.map((s) => s.level));
  if (maxHardSkill >= 7) return { title: "توسعه‌دهنده ماهر", emoji: "💻" };
  if (player.stars >= 15 && player.level >= 4) return { title: "شکارچی فرصت", emoji: "🎯" };
  if (bank.savings >= 40_000_000) return { title: "سرمایه‌گذار هوشمند", emoji: "💎" };
  if (job.type === "استارتاپ") return { title: "کارآفرین نوپا", emoji: "🚀" };
  return { title: "تازه‌وارد", emoji: "🌱" };
}

export default function ProfileHero() {
  const mood = getMoodEmoji(player.energy, player.hunger, player.happiness);
  const honorary = getHonoraryTitle();

  return (
    <div style={{
      textAlign: "center",
      padding: "24px 16px 20px",
      position: "relative",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 220,
        height: 220,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,168,67,0.1) 0%, rgba(212,168,67,0.03) 40%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Avatar with decorative frame */}
      <div style={{
        position: "relative",
        width: 100,
        height: 100,
        margin: "0 auto 12px",
      }}>
        {/* Outer rotating ring */}
        <div className="anim-rotate-slow" style={{
          position: "absolute",
          inset: -6,
          borderRadius: "50%",
          background: "conic-gradient(from 0deg, rgba(212,168,67,0.4), rgba(240,201,102,0.1), rgba(212,168,67,0.4), rgba(240,201,102,0.1), rgba(212,168,67,0.4))",
          padding: 2,
        }}>
          <div style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "#0a0e27",
          }} />
        </div>

        {/* Inner avatar circle */}
        <div className="anim-breathe" style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 35%, rgba(212,168,67,0.12), rgba(30,20,60,0.25))",
          border: "2.5px solid rgba(212,168,67,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          zIndex: 2,
          boxShadow: "0 0 30px rgba(212,168,67,0.15), 0 8px 24px rgba(0,0,0,0.3), inset 0 0 20px rgba(212,168,67,0.05)",
        }}>
          {player.avatar || "👨‍💻"}
        </div>

        {/* Mood badge (top-right) */}
        <div style={{
          position: "absolute",
          top: -2,
          right: -2,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1a1a2e, #16213e)",
          border: "2px solid rgba(212,168,67,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          zIndex: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}>
          {mood}
        </div>
      </div>

      {/* Floor shadow */}
      <div style={{
        width: 60, height: 12, borderRadius: "50%", margin: "-4px auto 0",
        background: "radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)",
      }} />

      {/* Name */}
      <div style={{
        fontSize: 20, fontWeight: 900, color: "white",
        marginTop: 10, marginBottom: 4,
        textShadow: "0 0 16px rgba(212,168,67,0.2)",
      }}>
        {player.name}
      </div>

      {/* Honorary title */}
      <div style={{
        fontSize: 11, fontWeight: 700,
        background: "linear-gradient(90deg, #D4A843, #F0C966)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}>
        <span style={{
          WebkitTextFillColor: "initial",
          fontSize: 12,
        }}>
          {honorary.emoji}
        </span>
        {honorary.title}
      </div>

      {/* Job + city */}
      <div style={{
        fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12,
      }}>
        {job.title} · {player.city}
      </div>

      {/* Level + scenario pills */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 6,
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
          background: "rgba(212,168,67,0.15)", color: "#F0C966",
          border: "1px solid rgba(212,168,67,0.25)",
        }}>
          Lv.{toPersian(player.level)}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
          background: "rgba(96,165,250,0.1)", color: "#93c5fd",
          border: "1px solid rgba(96,165,250,0.15)",
        }}>
          {player.scenario}
        </span>
      </div>
    </div>
  );
}
