"use client";
import { useShallow } from "zustand/react/shallow";
import { useCityStore } from "@/game/city/city-store";
import { trendIcon, trendColor, getEconomyHealthLabelFa } from "@/game/city/city-helpers";
import { toPersian } from "@/data/mock";

export default function SectorGrid() {
  const sectors = useCityStore(useShallow((s) => Object.values(s.sectors)));
  const currentWaveId = useCityStore((s) => s.currentWaveId);
  const waveRemainingDays = useCityStore((s) => s.waveRemainingDays);
  const economyHealth = useCityStore((s) => s.economyHealth);
  const { label: healthLabel, color: healthColor } = getEconomyHealthLabelFa(economyHealth);

  return (
    <div style={{ marginBottom: 14 }}>
      {/* City Wave badge */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 10,
      }}>
        <div style={{
          fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.7)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          🏙️ بخش‌های اقتصادی شهر
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
          background: `${healthColor}18`, color: healthColor,
          border: `1px solid ${healthColor}30`,
        }}>
          {healthLabel} · {toPersian(economyHealth)}٪
        </span>
      </div>

      {/* Sector grid 2-col */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
      }}>
        {sectors.map((sector) => {
          const barColor = sector.health >= 70
            ? "#4ade80" : sector.health >= 45
            ? "#fbbf24" : "#f87171";

          return (
            <div key={sector.id} style={{
              padding: "10px 12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Trend indicator */}
              <div style={{
                position: "absolute", top: 8, left: 10,
                fontSize: 11, fontWeight: 900,
                color: trendColor(sector.trend),
              }}>
                {trendIcon(sector.trend)}
              </div>

              {/* Emoji + Name */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                marginBottom: 6,
              }}>
                <span style={{ fontSize: 18 }}>{sector.emoji}</span>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: "rgba(255,255,255,0.8)",
                }}>
                  {sector.nameFa}
                </div>
              </div>

              {/* Health bar */}
              <div style={{
                height: 4, borderRadius: 3,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden", marginBottom: 4,
              }}>
                <div style={{
                  width: `${sector.health}%`, height: "100%", borderRadius: 3,
                  background: `linear-gradient(90deg, ${barColor}, ${barColor}bb)`,
                  transition: "width 0.6s ease",
                }} />
              </div>

              {/* Stats row */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span style={{
                  fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 600,
                }}>
                  سلامت {toPersian(Math.round(sector.health))}٪
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  color: sector.salaryMultiplier >= 1.05 ? "#4ade80"
                    : sector.salaryMultiplier <= 0.95 ? "#f87171"
                    : "rgba(255,255,255,0.4)",
                }}>
                  ×{toPersian(sector.salaryMultiplier.toFixed(2))} حقوق
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
