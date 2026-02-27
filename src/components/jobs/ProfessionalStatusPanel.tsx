"use client";
import { professionalStatus, toPersian } from "@/data/mock";

export default function ProfessionalStatusPanel() {
  const ps = professionalStatus;
  const repPct = Math.round(ps.reputation);

  return (
    <div style={{
      borderRadius: 22,
      padding: "16px",
      marginBottom: 14,
      background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 6px 24px rgba(10,22,40,0.35)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Section label */}
      <div style={{
        fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)",
        marginBottom: 12, display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ fontSize: 14 }}>📋</span>
        وضعیت حرفه‌ای
      </div>

      {/* 2x2 grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
      }}>
        {/* Resume Level */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: "10px 12px",
        }}>
          <div style={{
            fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.35)",
            marginBottom: 6, display: "flex", alignItems: "center", gap: 4,
          }}>
            📄 سطح رزومه
          </div>
          <div style={{
            fontSize: 13, fontWeight: 800, color: "#60a5fa", marginBottom: 6,
          }}>
            {ps.resumeSkill} Lv.{toPersian(ps.resumeLevel)}
          </div>
          <div style={{
            height: 4, borderRadius: 2,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${(ps.resumeLevel / 10) * 100}%`,
              height: "100%", borderRadius: 2,
              background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
              transition: "width 0.6s ease",
            }} />
          </div>
        </div>

        {/* Reputation */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: "10px 12px",
        }}>
          <div style={{
            fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.35)",
            marginBottom: 6, display: "flex", alignItems: "center", gap: 4,
          }}>
            ⭐ اعتبار حرفه‌ای
          </div>
          <div style={{
            fontSize: 13, fontWeight: 800, color: "#facc15", marginBottom: 6,
          }}>
            {toPersian(repPct)} / {toPersian(100)}
          </div>
          <div style={{
            height: 4, borderRadius: 2,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${repPct}%`,
              height: "100%", borderRadius: 2,
              background: "linear-gradient(90deg, #facc15, #f59e0b)",
              transition: "width 0.6s ease",
            }} />
          </div>
        </div>

        {/* Acceptance Chance */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: "10px 12px",
        }}>
          <div style={{
            fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.35)",
            marginBottom: 6, display: "flex", alignItems: "center", gap: 4,
          }}>
            🎯 شانس قبولی پایه
          </div>
          <div style={{
            fontSize: 18, fontWeight: 900, color: "#4ade80",
          }}>
            {toPersian(ps.baseAcceptanceChance)}٪
          </div>
        </div>

        {/* Experience */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: "10px 12px",
        }}>
          <div style={{
            fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.35)",
            marginBottom: 6, display: "flex", alignItems: "center", gap: 4,
          }}>
            🏢 تجربه کاری
          </div>
          <div style={{
            fontSize: 18, fontWeight: 900, color: "white",
          }}>
            {toPersian(ps.experienceYears)} سال
          </div>
        </div>
      </div>
    </div>
  );
}
