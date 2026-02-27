"use client";
import { player, bank, job, formatMoney, toPersian } from "@/data/mock";

function getMoodEmoji(energy: number, hunger: number, happiness: number): string {
  if (energy < 25 || hunger < 20) return "😫";
  if (energy < 40 || hunger < 35) return "😐";
  if (happiness > 70 && energy > 60) return "😄";
  return "🙂";
}

export default function ProfileHero() {
  const mood = getMoodEmoji(player.energy, player.hunger, player.happiness);
  const xpPct = Math.round((player.xp / player.xpNext) * 100);

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
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Avatar */}
      <div className="anim-breathe" style={{
        width: 90,
        height: 90,
        borderRadius: "50%",
        margin: "0 auto 12px",
        background: "radial-gradient(circle at 40% 35%, rgba(212,168,67,0.12), rgba(30,20,60,0.25))",
        border: "2.5px solid rgba(212,168,67,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
        position: "relative",
        zIndex: 2,
        boxShadow: "0 0 30px rgba(212,168,67,0.15), 0 8px 24px rgba(0,0,0,0.3)",
      }}>
        {mood}
      </div>

      {/* Floor shadow */}
      <div style={{
        width: 60, height: 12, borderRadius: "50%", margin: "-4px auto 0",
        background: "radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)",
      }} />

      {/* Name */}
      <div style={{
        fontSize: 20, fontWeight: 900, color: "white",
        marginTop: 10, marginBottom: 3,
        textShadow: "0 0 12px rgba(212,168,67,0.2)",
      }}>
        {player.name}
      </div>

      {/* Job + city */}
      <div style={{
        fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12,
      }}>
        {job.title} · {player.city}
      </div>

      {/* Level + scenario pills */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 6, marginBottom: 16,
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

      {/* XP bar */}
      <div style={{ padding: "0 24px", marginBottom: 16 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", marginBottom: 4,
        }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>XP</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#F0C966" }}>
            {toPersian(player.xp)} / {toPersian(player.xpNext)}
          </span>
        </div>
        <div style={{
          height: 6, borderRadius: 4,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${xpPct}%`, height: "100%", borderRadius: 4,
            background: "linear-gradient(90deg, #D4A843, #F0C966)",
            boxShadow: "0 0 8px rgba(212,168,67,0.5)",
            transition: "width 0.6s ease",
          }} />
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 16,
      }}>
        {[
          { icon: "💰", value: formatMoney(bank.checking + bank.savings), label: "دارایی", color: "#4ade80" },
          { icon: "⭐", value: toPersian(player.stars), label: "ستاره", color: "#facc15" },
          { icon: "✨", value: toPersian(player.xp), label: "تجربه", color: "#c084fc" },
        ].map((s) => (
          <div key={s.label} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>
              {s.icon}
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: s.color }}>
              {s.value}
            </span>
            <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
