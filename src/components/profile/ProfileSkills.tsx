"use client";
import { skills, toPersian } from "@/data/mock";

function getBarColor(level: number): string {
  if (level >= 7) return "#D4A843";
  if (level >= 4) return "#3b82f6";
  return "#64748b";
}

export default function ProfileSkills() {
  const topSkills = [...skills.hard]
    .sort((a, b) => b.level - a.level)
    .slice(0, 4);

  return (
    <div style={{ padding: "0 8px", marginBottom: 16 }}>
      {/* Section header */}
      <div style={{
        fontSize: 14, fontWeight: 800, color: "white",
        display: "flex", alignItems: "center", gap: 6,
        marginBottom: 10, padding: "0 4px",
      }}>
        <span style={{ fontSize: 16 }}>🎯</span>
        مهارت‌ها
      </div>

      <div style={{
        padding: "14px 16px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}>
        {topSkills.map((sk) => {
          const pct = Math.round((sk.xp / sk.maxXp) * 100);
          const color = getBarColor(sk.level);
          return (
            <div key={sk.name}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 4,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <span style={{ fontSize: 13 }}>{sk.emoji}</span>
                  {sk.name}
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 800, color,
                  background: `${color}20`,
                  borderRadius: 6, padding: "1px 6px",
                }}>
                  Lv.{toPersian(sk.level)}
                </span>
              </div>
              <div style={{
                height: 4, borderRadius: 2,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${pct}%`,
                  height: "100%",
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                  boxShadow: `0 0 4px ${color}30`,
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
