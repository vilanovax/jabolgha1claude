"use client";
import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { professionalStatus, toPersian } from "@/data/mock";

export default function CareerProfileCard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const player = useGameStore((s) => s.player);
  const ps     = professionalStatus;

  const xp        = mounted ? player.xp    : 0;
  const level     = mounted ? player.level : 1;
  const rep       = ps.reputation;
  const chance    = ps.baseAcceptanceChance;
  const expYears  = ps.experienceYears;

  return (
    <div style={{
      marginBottom: 14,
      padding: "14px 16px",
      background: "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 18,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)",
        marginBottom: 12, display: "flex", alignItems: "center", gap: 6,
      }}>
        📋 پروفایل حرفه‌ای
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
        {/* Level badge */}
        <div style={{
          width: 56, flexShrink: 0,
          background: "linear-gradient(135deg, #1e3a5f, #1e40af)",
          border: "1px solid rgba(96,165,250,0.3)",
          borderRadius: 14,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 2,
        }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>سطح</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#60a5fa", lineHeight: 1 }}>
            {toPersian(level)}
          </div>
          <div style={{ fontSize: 8, color: "rgba(96,165,250,0.6)", fontWeight: 700 }}>
            XP {toPersian(xp)}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {/* Reputation */}
          <div style={{
            padding: "8px 10px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>⭐ اعتبار</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#facc15" }}>{toPersian(rep)}</div>
            <div style={{
              marginTop: 4, height: 3, borderRadius: 2,
              background: "rgba(255,255,255,0.08)", overflow: "hidden",
            }}>
              <div style={{
                width: `${rep}%`, height: "100%", borderRadius: 2,
                background: "linear-gradient(90deg, #facc15, #f59e0b)",
              }} />
            </div>
          </div>

          {/* Acceptance chance */}
          <div style={{
            padding: "8px 10px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>🎯 شانس قبولی</div>
            <div style={{
              fontSize: 14, fontWeight: 900,
              color: chance >= 60 ? "#4ade80" : chance >= 40 ? "#fbbf24" : "#f87171",
            }}>
              {toPersian(chance)}٪
            </div>
          </div>

          {/* Resume skill */}
          <div style={{
            padding: "8px 10px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>📄 رزومه</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa" }}>
              {ps.resumeSkill} Lv.{toPersian(ps.resumeLevel)}
            </div>
          </div>

          {/* Experience */}
          <div style={{
            padding: "8px 10px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>🏢 تجربه</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "white" }}>
              {toPersian(expYears)} سال
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
