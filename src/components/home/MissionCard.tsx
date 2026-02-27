"use client";
import Link from "next/link";
import { storyArc, dailyMissions, getMissionStats, formatMoney, toPersian } from "@/data/mock";

export default function MissionCard() {
  const stats = getMissionStats();
  const arc = storyArc;
  const progressPct = Math.min(100, Math.round((arc.progress / arc.target) * 100));
  const dailyDone = dailyMissions.filter(
    (m) => m.status === "done" || m.status === "claimable"
  ).length;

  return (
    <div style={{
      borderRadius: 20,
      padding: "14px 16px",
      marginBottom: 10,
      background: "linear-gradient(145deg, #1a1a2e, #16213e)",
      border: "1px solid rgba(250,204,21,0.15)",
      boxShadow: "0 4px 20px rgba(10,22,40,0.3)",
    }}>
      {/* Header row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 10,
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 14 }}>🎬</span>
          داستان فعال
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 8, padding: "2px 6px",
          }}>
            ☀️ {toPersian(dailyDone)}/{toPersian(dailyMissions.length)}
          </span>
          {stats.claimableCount > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700, color: "#facc15",
              background: "rgba(250,204,21,0.12)",
              borderRadius: 8, padding: "2px 6px",
            }}>
              {toPersian(stats.claimableCount)} پاداش ⭐
            </span>
          )}
        </div>
      </div>

      {/* Story arc mini preview */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          background: "rgba(255,255,255,0.05)",
          border: "1.5px solid rgba(250,204,21,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
        }}>
          {arc.character}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "white", marginBottom: 2 }}>
            «{arc.title}»
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            {arc.characterName} · اپیزود {toPersian(arc.episode)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", marginBottom: 4,
        }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
            پیشرفت
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#facc15" }}>
            {arc.unit === "تومان" ? formatMoney(arc.progress) : toPersian(arc.progress)} / {arc.unit === "تومان" ? formatMoney(arc.target) : toPersian(arc.target)}
          </span>
        </div>
        <div style={{
          height: 6, borderRadius: 4,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${progressPct}%`,
            height: "100%",
            borderRadius: 4,
            background: "linear-gradient(90deg, #facc15, #fbbf24)",
            boxShadow: "0 0 8px rgba(250,204,21,0.4)",
            transition: "width 0.6s ease",
          }} />
        </div>
      </div>

      {/* CTA */}
      <Link href="/missions" style={{ textDecoration: "none" }}>
        <button style={{
          width: "100%",
          padding: "9px 0",
          borderRadius: 14,
          border: "1px solid rgba(250,204,21,0.2)",
          background: "rgba(250,204,21,0.08)",
          color: "#facc15",
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "inherit",
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}>
          مشاهده همه ماموریت‌ها
        </button>
      </Link>
    </div>
  );
}
