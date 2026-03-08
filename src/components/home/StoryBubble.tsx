"use client";
import Link from "next/link";
import { storyArc, formatMoney, toPersian } from "@/data/mock";

export default function StoryBubble() {
  const arc = storyArc;
  const progressPct = Math.min(100, Math.round((arc.progress / arc.target) * 100));
  const progressLabel = arc.unit === "تومان"
    ? `${formatMoney(arc.progress)} / ${formatMoney(arc.target)}`
    : `${toPersian(arc.progress)} / ${toPersian(arc.target)}`;

  return (
    <Link href="/missions" style={{ textDecoration: "none", display: "block" }}>
      <div className="mission-hero-card" style={{
        margin: "0 4px 12px",
        padding: "16px 18px",
        borderRadius: 22,
        background: "linear-gradient(135deg, rgba(250,204,21,0.08), rgba(251,191,36,0.03))",
        border: "1.5px solid rgba(250,204,21,0.15)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow overlay */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 120, height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Top row: badge + episode */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 10,
        }}>
          <span style={{
            fontSize: 9, fontWeight: 800,
            padding: "3px 10px", borderRadius: 12,
            background: "linear-gradient(135deg, rgba(250,204,21,0.2), rgba(250,204,21,0.08))",
            color: "#facc15",
            border: "1px solid rgba(250,204,21,0.25)",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span className="anim-mission-glow" style={{ fontSize: 12 }}>🎯</span>
            ماموریت فعال
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)",
          }}>
            اپیزود {toPersian(arc.episode)} از {toPersian(arc.totalEpisodes)}
          </span>
        </div>

        {/* Character + mission text */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 12,
        }}>
          <div className="anim-breathe" style={{
            width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
            background: "rgba(255,255,255,0.06)",
            border: "2px solid rgba(250,204,21,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26,
            boxShadow: "0 0 16px rgba(250,204,21,0.12)",
          }}>
            {arc.character}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: "#facc15",
              marginBottom: 2,
            }}>
              {arc.characterName}
            </div>
            <div style={{
              fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.8)",
              lineHeight: 1.4,
            }}>
              «{arc.title}»
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            flex: 1, height: 8, borderRadius: 6,
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}>
            <div className="mission-progress-fill" style={{
              width: `${progressPct}%`,
              height: "100%",
              borderRadius: 6,
              background: "linear-gradient(90deg, #facc15, #f59e0b)",
              boxShadow: "0 0 10px rgba(250,204,21,0.4)",
              transition: "width 0.5s ease",
            }} />
          </div>
          <span style={{
            fontSize: 11, fontWeight: 800, color: "#facc15",
            whiteSpace: "nowrap",
          }}>
            {progressLabel}
          </span>
        </div>

        {/* Reward preview */}
        <div style={{
          display: "flex", gap: 8, marginTop: 10,
        }}>
          {arc.reward.xp > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
              background: "rgba(192,132,252,0.12)", color: "#c084fc",
            }}>
              ✨ {toPersian(arc.reward.xp)} XP
            </span>
          )}
          {arc.reward.stars > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
              background: "rgba(250,204,21,0.12)", color: "#facc15",
            }}>
              ⭐ {toPersian(arc.reward.stars)}
            </span>
          )}
          {arc.reward.money > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
              background: "rgba(74,222,128,0.12)", color: "#4ade80",
            }}>
              💰 {formatMoney(arc.reward.money)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
