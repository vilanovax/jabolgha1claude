"use client";
import Link from "next/link";
import { storyArc, formatMoney, toPersian } from "@/data/mock";

export default function ProfileMissionArc() {
  const arc = storyArc;
  const progressPct = Math.min(100, Math.round((arc.progress / arc.target) * 100));
  const progressLabel = arc.unit === "تومان"
    ? `${formatMoney(arc.progress)} / ${formatMoney(arc.target)}`
    : `${toPersian(arc.progress)} / ${toPersian(arc.target)}`;

  return (
    <div style={{ padding: "0 8px", marginBottom: 16 }}>
      {/* Section header */}
      <div style={{
        fontSize: 14, fontWeight: 800, color: "white",
        display: "flex", alignItems: "center", gap: 6,
        marginBottom: 10,
      }}>
        <span style={{ fontSize: 16 }}>🎬</span>
        ماموریت فعال
      </div>

      <Link href="/missions" style={{ textDecoration: "none" }}>
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          {/* Character */}
          <div style={{
            width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
            background: "rgba(255,255,255,0.05)",
            border: "1.5px solid rgba(250,204,21,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, marginTop: 2,
            boxShadow: "0 0 10px rgba(250,204,21,0.08)",
          }}>
            {arc.character}
          </div>

          {/* Bubble */}
          <div style={{
            flex: 1, minWidth: 0,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px 18px 18px 18px",
            padding: "10px 14px",
          }}>
            {/* Name + episode */}
            <div style={{
              fontSize: 9, fontWeight: 700, color: "#facc15",
              marginBottom: 4, display: "flex", justifyContent: "space-between",
            }}>
              <span>{arc.characterName}</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>
                اپیزود {toPersian(arc.episode)} از {toPersian(arc.totalEpisodes)}
              </span>
            </div>

            {/* Title */}
            <div style={{
              fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.65)",
              marginBottom: 8, lineHeight: 1.5,
            }}>
              «{arc.title}»
            </div>

            {/* Progress */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{
                flex: 1, height: 4, borderRadius: 3,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${progressPct}%`, height: "100%", borderRadius: 3,
                  background: "linear-gradient(90deg, #facc15, #fbbf24)",
                  boxShadow: "0 0 6px rgba(250,204,21,0.3)",
                }} />
              </div>
              <span style={{
                fontSize: 9, fontWeight: 700, color: "#facc15",
                whiteSpace: "nowrap",
              }}>
                {progressLabel}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
