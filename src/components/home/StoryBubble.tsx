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
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "0 8px",
      marginBottom: 8,
    }}>
      {/* Character avatar */}
      <div style={{
        width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
        background: "rgba(255,255,255,0.06)",
        border: "1.5px solid rgba(250,204,21,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22,
        marginTop: 4,
        boxShadow: "0 0 12px rgba(250,204,21,0.1)",
      }}>
        {arc.character}
      </div>

      {/* Speech bubble */}
      <Link href="/missions" style={{ textDecoration: "none", flex: 1, minWidth: 0 }}>
        <div style={{
          position: "relative",
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "6px 20px 20px 20px",
          padding: "12px 14px",
        }}>
          {/* Character name + episode */}
          <div style={{
            fontSize: 9, fontWeight: 700, color: "#facc15",
            marginBottom: 4, display: "flex", justifyContent: "space-between",
          }}>
            <span>{arc.characterName}</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>
              اپیزود {toPersian(arc.episode)}
            </span>
          </div>

          {/* Dialogue */}
          <div style={{
            fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)",
            lineHeight: 1.5, marginBottom: 8,
          }}>
            «{arc.title}»
          </div>

          {/* Progress row */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{
              flex: 1, height: 4, borderRadius: 3,
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}>
              <div style={{
                width: `${progressPct}%`,
                height: "100%",
                borderRadius: 3,
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
      </Link>
    </div>
  );
}
