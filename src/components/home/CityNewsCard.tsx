"use client";
import { useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCityStore } from "@/game/city/city-store";
import { CITY_WAVES } from "@/game/city/seed-waves";
import { toPersian } from "@/data/mock";
import type { ActiveCityEvent } from "@/game/city/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SEVERITY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  minor:  { text: "#facc15", bg: "rgba(250,204,21,0.08)",  border: "rgba(250,204,21,0.18)" },
  major:  { text: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.18)" },
  crisis: { text: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.18)" },
};

const SECTOR_EMOJIS: Record<string, string> = {
  tech: "💻", finance: "📊", construction: "🏗️",
  retail: "🛍️", services: "🤝", manufacturing: "🏭",
};

const SECTOR_NAMES: Record<string, string> = {
  tech: "فناوری", finance: "مالی", construction: "ساختمان",
  retail: "بازار", services: "خدمات", manufacturing: "صنعت",
};

function healthColor(h: number): string {
  if (h >= 70) return "#4ade80";
  if (h >= 50) return "#facc15";
  if (h >= 35) return "#fb923c";
  return "#f87171";
}

function trendArrow(trend: "up" | "flat" | "down"): string {
  return trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
}

// Derive a one-line actionable tip from city state
function getTip(
  waveId: string,
  economyHealth: number,
  events: ActiveCityEvent[],
): { emoji: string; text: string } | null {
  const crisis = events.find((e) => e.severity === "crisis");
  if (crisis) return { emoji: "⚠️", text: "بحران فعاله — هزینه‌ات رو کاهش بده" };

  if (waveId === "tech_boom")           return { emoji: "💡", text: "الان بهترین وقت درخواست شغل IT‌ه" };
  if (waveId === "finance_bull")        return { emoji: "📈", text: "سرمایه‌گذاری الان پربازده‌تره" };
  if (waveId === "recession")           return { emoji: "🛡", text: "رکوده — پس‌انداز کن، هزینه کم کن" };
  if (waveId === "retail_holiday")      return { emoji: "🛍️", text: "فصل خریده — قیمت‌ها بالاست" };
  if (waveId === "construction_surge")  return { emoji: "🏗️", text: "بازار ساخت‌وساز داغه" };
  if (waveId === "manufacturing_revival") return { emoji: "🏭", text: "صنعت در حال احیاست" };
  if (economyHealth >= 70)             return { emoji: "🚀", text: "اقتصاد سالمه — وقت رشده" };
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CityNewsCard() {
  const [mounted, setMounted] = useState(false);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const currentWaveId      = useCityStore((s) => s.currentWaveId);
  const waveRemainingDays  = useCityStore((s) => s.waveRemainingDays);
  const economyHealth      = useCityStore((s) => s.economyHealth);
  const activeEvents       = useCityStore(useShallow((s) => s.activeEvents));
  const sectors            = useCityStore(useShallow((s) => s.sectors));

  if (!mounted) return null;

  const wave = CITY_WAVES[currentWaveId];
  const sectorList = Object.values(sectors).sort((a, b) => b.health - a.health);
  const visibleSectors = showAll ? sectorList : sectorList.slice(0, 3);
  const latestEvent = activeEvents[0] ?? null;
  const hasCrisis = activeEvents.some((e) => e.severity === "crisis");
  const tip = getTip(currentWaveId, economyHealth, activeEvents);

  // Economy health label
  const healthLabel =
    economyHealth >= 70 ? { label: "رونق", color: "#4ade80" } :
    economyHealth >= 55 ? { label: "پایدار", color: "#facc15" } :
    economyHealth >= 35 ? { label: "نوسانی", color: "#fb923c" } :
                          { label: "رکود",   color: "#f87171" };

  return (
    <div style={{
      borderRadius: 20,
      background: "rgba(255,255,255,0.03)",
      border: hasCrisis
        ? "1px solid rgba(248,113,113,0.18)"
        : "1px solid rgba(255,255,255,0.07)",
      overflow: "hidden",
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: "12px 14px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 14 }}>📰</span>
        <span style={{ fontSize: 12, fontWeight: 900, color: "white", flex: 1 }}>
          اخبار شهر
        </span>
        {/* Economy health pill */}
        <span style={{
          fontSize: 9, fontWeight: 800,
          color: healthLabel.color,
          background: `${healthLabel.color}12`,
          border: `1px solid ${healthLabel.color}30`,
          borderRadius: 8, padding: "2px 8px",
        }}>
          {healthLabel.label} {toPersian(economyHealth)}٪
        </span>
      </div>

      <div style={{ padding: "10px 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* ── Wave headline ── */}
        <div style={{
          padding: "10px 12px", borderRadius: 14,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{wave.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: "white" }}>
                {wave.nameFa}
              </div>
              <div style={{
                fontSize: 9, fontWeight: 600,
                color: "rgba(255,255,255,0.4)", marginTop: 2,
                lineHeight: 1.4,
              }}>
                {wave.descriptionFa}
              </div>
            </div>
            <span style={{
              fontSize: 9, fontWeight: 700,
              color: "rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8, padding: "2px 7px", whiteSpace: "nowrap",
            }}>
              {toPersian(waveRemainingDays)} روز دیگه
            </span>
          </div>
        </div>

        {/* ── Breaking event (if any) ── */}
        {latestEvent && (() => {
          const sc = SEVERITY_COLORS[latestEvent.severity] ?? SEVERITY_COLORS.minor;
          const impact: string[] = [];
          if (latestEvent.salaryImpact > 0)  impact.push(`حقوق +${Math.round(latestEvent.salaryImpact * 100)}٪`);
          if (latestEvent.salaryImpact < 0)  impact.push(`حقوق ${Math.round(latestEvent.salaryImpact * 100)}٪`);
          if (latestEvent.investmentImpact > 0) impact.push(`سرمایه‌گذاری +${Math.round(latestEvent.investmentImpact * 100)}٪`);
          if (latestEvent.investmentImpact < 0) impact.push(`سرمایه‌گذاری ${Math.round(latestEvent.investmentImpact * 100)}٪`);

          return (
            <div style={{
              padding: "8px 12px", borderRadius: 12,
              background: sc.bg, border: `1px solid ${sc.border}`,
              display: "flex", gap: 8, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 14, marginTop: 1 }}>{latestEvent.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: sc.text }}>
                  {latestEvent.titleFa}
                </div>
                <div style={{
                  fontSize: 9, fontWeight: 600,
                  color: "rgba(255,255,255,0.4)", marginTop: 2,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {latestEvent.descriptionFa}
                </div>
                {impact.length > 0 && (
                  <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
                    {impact.map((tag, i) => (
                      <span key={i} style={{
                        fontSize: 8, fontWeight: 800,
                        color: sc.text, background: sc.bg,
                        border: `1px solid ${sc.border}`,
                        borderRadius: 6, padding: "1px 5px",
                      }}>
                        {toPersian(tag)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {latestEvent.remainingDays > 0 && (
                <span style={{
                  fontSize: 8, fontWeight: 700,
                  color: "rgba(255,255,255,0.25)",
                  whiteSpace: "nowrap",
                }}>
                  {toPersian(latestEvent.remainingDays)}ر دیگه
                </span>
              )}
            </div>
          );
        })()}

        {/* ── Sector mini bars ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.2)" }}>
            📊 وضعیت سکتورها
          </div>
          {visibleSectors.map((sector) => {
            const color = healthColor(sector.health);
            return (
              <div key={sector.id} style={{
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 10, width: 18, textAlign: "center" }}>
                  {SECTOR_EMOJIS[sector.id] ?? "🏢"}
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  color: "rgba(255,255,255,0.5)",
                  width: 52, textAlign: "right",
                }}>
                  {SECTOR_NAMES[sector.id] ?? sector.id}
                </span>
                <div style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: "rgba(255,255,255,0.06)", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    width: `${sector.health}%`,
                    background: color,
                    transition: "width 0.6s ease",
                  }} />
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 800,
                  color: color, width: 26, textAlign: "right",
                }}>
                  {toPersian(Math.round(sector.health))}
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 900,
                  color: sector.trend === "up" ? "#4ade80"
                       : sector.trend === "down" ? "#f87171"
                       : "rgba(255,255,255,0.3)",
                  width: 10,
                }}>
                  {trendArrow(sector.trend)}
                </span>
              </div>
            );
          })}

          {/* Show more / less toggle */}
          {sectorList.length > 3 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              style={{
                background: "none", border: "none",
                fontSize: 9, fontWeight: 700,
                color: "rgba(255,255,255,0.25)",
                cursor: "pointer", fontFamily: "inherit",
                textAlign: "right", padding: "2px 0",
              }}
            >
              {showAll ? "▲ کمتر" : `▼ ${toPersian(sectorList.length - 3)} سکتور دیگه`}
            </button>
          )}
        </div>

        {/* ── Actionable tip ── */}
        {tip && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 12px", borderRadius: 10,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <span style={{ fontSize: 12 }}>{tip.emoji}</span>
            <span style={{
              fontSize: 9, fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
            }}>
              {tip.text}
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
