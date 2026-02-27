"use client";
import { useMemo } from "react";
import { toPersian } from "@/data/mock";
import { useGameStore, derivedEconomy } from "@/stores/gameStore";

export default function CityHeader() {
  const indicators = useGameStore((s) => s.indicators);
  const eco = useMemo(() => derivedEconomy(indicators), [indicators]);
  const healthColor = eco.economyHealth >= 60
    ? "#22c55e"
    : eco.economyHealth >= 40
      ? "#f59e0b"
      : "#ef4444";

  const statusColor = (() => {
    switch (eco.status) {
      case "رونق": return { bg: "rgba(74,222,128,0.15)", color: "#166534" };
      case "پایدار": return { bg: "rgba(59,130,246,0.15)", color: "#1e40af" };
      case "پرنوسان": return { bg: "rgba(250,204,21,0.15)", color: "#854d0e" };
      case "رکود": return { bg: "rgba(239,68,68,0.15)", color: "#991b1b" };
      default: return { bg: "rgba(255,255,255,0.1)", color: "#64748b" };
    }
  })();

  return (
    <div style={{
      borderRadius: 22,
      padding: "16px",
      marginBottom: 14,
      background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 6px 24px rgba(10,22,40,0.35)",
    }}>
      {/* Row 1: City name + active players */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: 18, fontWeight: 900, color: "white",
          display: "flex", alignItems: "center", gap: 8,
          textShadow: "0 0 16px rgba(250,204,21,0.2)",
        }}>
          <span style={{ fontSize: 22 }}>🌆</span>
          تهران
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 8px rgba(34,197,94,0.5), 0 0 16px rgba(34,197,94,0.25)",
          }} />
          👥 {toPersian(eco.activePlayers)} بازیکن فعال
        </div>
      </div>

      {/* Row 2: Economy status + inflation */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap",
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "3px 10px",
          borderRadius: 10,
          background: statusColor.bg, color: statusColor.color,
          border: `1px solid ${statusColor.color}30`,
        }}>
          📊 وضعیت اقتصاد: {eco.status}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "3px 10px",
          borderRadius: 10,
          background: "rgba(250,204,21,0.12)", color: "#facc15",
          border: "1px solid rgba(250,204,21,0.2)",
        }}>
          💵 تورم: {toPersian(eco.inflationRate)}٪
        </span>
      </div>

      {/* Row 3: Economy health bar */}
      <div>
        <div style={{
          display: "flex", justifyContent: "space-between", marginBottom: 4,
        }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.35)" }}>
            سلامت اقتصاد
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: healthColor }}>
            {toPersian(eco.economyHealth)}٪
          </span>
        </div>
        <div style={{
          height: 5, borderRadius: 3,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}>
          <div className="progress-bar-animated" style={{
            width: `${eco.economyHealth}%`,
            height: "100%", borderRadius: 3,
            background: `linear-gradient(90deg, ${healthColor}, ${healthColor}cc)`,
            boxShadow: `0 0 6px ${healthColor}40`,
            transition: "width 0.6s ease",
            position: "relative", overflow: "hidden",
          }} />
        </div>
      </div>
    </div>
  );
}
