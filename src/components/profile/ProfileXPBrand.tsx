"use client";
import { player, bank, badges, skills, toPersian } from "@/data/mock";

function calcBrandScore(): number {
  const earnedPct = badges.filter((b) => b.earned).length / badges.length;
  const allSkills = [...skills.hard, ...skills.soft];
  const avgLevel = allSkills.reduce((s, sk) => s + sk.level, 0) / allSkills.length;
  const levelFactor = Math.min(player.level / 10, 1);
  const starFactor = Math.min(player.stars / 50, 1);
  return Math.round(
    (earnedPct * 0.25 + (avgLevel / 10) * 0.25 + levelFactor * 0.25 + starFactor * 0.25) * 100,
  );
}

export default function ProfileXPBrand() {
  const xpPct = Math.round((player.xp / player.xpNext) * 100);
  const brandScore = calcBrandScore();
  const brandColor = brandScore > 50 ? "#D4A843" : brandScore > 30 ? "#3b82f6" : "#64748b";

  // SVG circle params
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (brandScore / 100) * circumference;

  return (
    <div style={{
      display: "flex",
      gap: 12,
      padding: "0 8px",
      marginBottom: 16,
    }}>
      {/* XP Section */}
      <div style={{
        flex: 1,
        padding: "14px 16px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 8,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 800,
            background: "linear-gradient(135deg, #D4A843, #F0C966)",
            color: "#1a1a2e",
            borderRadius: 8, padding: "2px 8px",
          }}>
            Lv.{toPersian(player.level)}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, color: "#F0C966",
          }}>
            {toPersian(player.xp)} / {toPersian(player.xpNext)}
          </span>
        </div>

        {/* XP bar */}
        <div style={{
          height: 8, borderRadius: 4,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}>
          <div className="progress-bar-animated" style={{
            width: `${xpPct}%`,
            height: "100%",
            borderRadius: 4,
            background: "linear-gradient(90deg, #D4A843, #F0C966)",
            boxShadow: "0 0 12px rgba(212,168,67,0.5), 0 0 4px rgba(212,168,67,0.3)",
            transition: "width 0.6s ease",
            position: "relative",
            overflow: "hidden",
          }} />
        </div>

        {/* Glow under bar */}
        <div style={{
          height: 6,
          marginTop: -3,
          borderRadius: "0 0 4px 4px",
          background: `radial-gradient(ellipse at ${xpPct}% 0%, rgba(212,168,67,0.15) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{
          fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.3)",
          textAlign: "center", marginTop: 4,
        }}>
          تجربه
        </div>
      </div>

      {/* Brand Section */}
      <div style={{
        width: 100,
        padding: "12px 0",
        borderRadius: 20,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* SVG Circle */}
        <div style={{ position: "relative", width: 64, height: 64 }}>
          <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
            {/* Background circle */}
            <circle
              cx="32" cy="32" r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="4"
            />
            {/* Progress circle */}
            <circle
              cx="32" cy="32" r={radius}
              fill="none"
              stroke={brandColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          {/* Center number */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 900,
            color: brandColor,
          }}>
            {toPersian(brandScore)}
          </div>
        </div>

        <div style={{
          fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.3)",
          marginTop: 4,
        }}>
          برند شخصی
        </div>
      </div>
    </div>
  );
}
