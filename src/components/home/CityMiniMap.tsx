"use client";
import { useState } from "react";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import { useCityStore } from "@/game/city/city-store";
import { toPersian } from "@/data/mock";
import type { SectorId } from "@/game/city/types";

// ─── Sector display meta ───────────────────────────────────────────────────────
const SECTOR_META: Record<SectorId, { emoji: string; nameFa: string; jobLabel: string }> = {
  tech:           { emoji: "💻", nameFa: "فناوری",     jobLabel: "برنامه‌نویسی" },
  finance:        { emoji: "📈", nameFa: "مالی",       jobLabel: "بورس و بانک" },
  construction:   { emoji: "🏗️", nameFa: "ساختمان",   jobLabel: "پیمانکاری" },
  retail:         { emoji: "🛍️", nameFa: "بازار",      jobLabel: "خرده‌فروشی" },
  services:       { emoji: "🔧", nameFa: "خدمات",      jobLabel: "سرویس" },
  manufacturing:  { emoji: "🏭", nameFa: "صنعت",       jobLabel: "تولید" },
};

// ─── Health thresholds → color + label ────────────────────────────────────────
function getHealthStyle(health: number, trend: "up" | "flat" | "down") {
  const isBoom = health >= 72 && trend === "up";
  if (isBoom)     return { color: "#fb923c", bg: "rgba(251,146,60,0.12)", label: "🔥 داغ",  barColor: "#fb923c" };
  if (health >= 60) return { color: "#4ade80", bg: "rgba(74,222,128,0.10)", label: "📈 رشد",  barColor: "#4ade80" };
  if (health >= 38) return { color: "#f59e0b", bg: "rgba(245,158,11,0.10)", label: "🟡 ثابت", barColor: "#f59e0b" };
  return              { color: "#f87171", bg: "rgba(239,68,68,0.10)",     label: "📉 رکود", barColor: "#f87171" };
}

function getTrendArrow(trend: "up" | "flat" | "down") {
  if (trend === "up")   return { symbol: "↑", color: "#4ade80" };
  if (trend === "down") return { symbol: "↓", color: "#f87171" };
  return                       { symbol: "→", color: "#94a3b8" };
}

// ─── Sector Detail Tooltip ─────────────────────────────────────────────────────
function SectorDetail({
  sectorId,
  health,
  trend,
  salaryMultiplier,
  jobDemand,
  onClose,
}: {
  sectorId: SectorId;
  health: number;
  trend: "up" | "flat" | "down";
  salaryMultiplier: number;
  jobDemand: number;
  onClose: () => void;
}) {
  const meta = SECTOR_META[sectorId];
  const hs   = getHealthStyle(health, trend);
  const salaryBonus = Math.round((salaryMultiplier - 1) * 100);
  const salarySign  = salaryBonus >= 0 ? "+" : "";

  return (
    <div
      style={{
        position: "absolute", top: 0, left: 0, right: 0,
        zIndex: 10,
        borderRadius: 18,
        background: "linear-gradient(135deg, rgba(14,16,40,0.98), rgba(8,10,28,0.98))",
        border: `1.5px solid ${hs.color}40`,
        padding: "14px 16px",
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${hs.color}20`,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>{meta.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: "white" }}>صنعت {meta.nameFa}</div>
          <div style={{
            display: "inline-flex", alignItems: "center",
            fontSize: 10, fontWeight: 800,
            color: hs.color, background: hs.bg,
            borderRadius: 8, padding: "2px 8px", marginTop: 2,
          }}>
            {hs.label}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, color: "rgba(255,255,255,0.4)",
            fontSize: 13, padding: "3px 9px",
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          ✕
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Health bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", minWidth: 56 }}>سلامت</span>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3,
              width: `${health}%`, background: hs.barColor,
              transition: "width 0.5s ease",
            }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: hs.color, minWidth: 28 }}>
            {toPersian(Math.round(health))}
          </span>
        </div>

        {/* Salary multiplier */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", minWidth: 56 }}>حقوق</span>
          <span style={{
            fontSize: 12, fontWeight: 800,
            color: salaryBonus >= 0 ? "#4ade80" : "#f87171",
          }}>
            {salarySign}{toPersian(salaryBonus)}٪ تغییر
          </span>
        </div>

        {/* Job demand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", minWidth: 56 }}>تقاضای کار</span>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3,
              width: `${jobDemand}%`, background: "#818cf8",
            }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#818cf8", minWidth: 28 }}>
            {toPersian(Math.round(jobDemand))}
          </span>
        </div>

        {/* Gameplay tip */}
        <div style={{
          marginTop: 4, padding: "8px 10px", borderRadius: 12,
          background: `${hs.color}0D`,
          border: `1px solid ${hs.color}20`,
          fontSize: 10, fontWeight: 600, color: hs.color,
        }}>
          {health >= 72 && trend === "up"
            ? `🔥 ${meta.nameFa} داغه — بهترین وقت برای کار ${meta.jobLabel}`
            : health >= 60
              ? `📈 صنعت ${meta.nameFa} در حال رشد — حقوق بهتر`
              : health >= 38
                ? `🟡 وضعیت ${meta.nameFa} پایدار — فرصت متوسط`
                : `📉 ${meta.nameFa} در رکود — احتیاط در سرمایه‌گذاری`
          }
        </div>
      </div>
    </div>
  );
}

// ─── Sector Tile ───────────────────────────────────────────────────────────────
function SectorTile({
  sectorId,
  health,
  trend,
  salaryMultiplier,
  jobDemand,
  isActive,
  onTap,
}: {
  sectorId: SectorId;
  health: number;
  trend: "up" | "flat" | "down";
  salaryMultiplier: number;
  jobDemand: number;
  isActive: boolean;
  onTap: () => void;
}) {
  const meta  = SECTOR_META[sectorId];
  const hs    = getHealthStyle(health, trend);
  const arrow = getTrendArrow(trend);

  return (
    <button
      onClick={onTap}
      style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "10px 12px", borderRadius: 14,
        background: isActive ? hs.bg : "rgba(255,255,255,0.03)",
        border: isActive ? `1.5px solid ${hs.color}40` : "1px solid rgba(255,255,255,0.07)",
        cursor: "pointer", fontFamily: "inherit", textAlign: "right",
        transition: "all 0.2s",
      }}
    >
      {/* Emoji */}
      <span style={{ fontSize: 20, flexShrink: 0 }}>{meta.emoji}</span>

      {/* Name + health bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>
          {meta.nameFa}
        </div>
        <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2,
            width: `${health}%`,
            background: hs.barColor,
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>

      {/* Trend + label */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: arrow.color }}>
          {arrow.symbol}
        </span>
        <span style={{
          fontSize: 8, fontWeight: 800, color: hs.color,
          whiteSpace: "nowrap",
        }}>
          {hs.label.split(" ")[1]}
        </span>
      </div>
    </button>
  );
}

// ─── CityMiniMap ───────────────────────────────────────────────────────────────
export default function CityMiniMap() {
  const [activeSector, setActiveSector] = useState<SectorId | null>(null);

  const sectors    = useCityStore(useShallow((s) => s.sectors));
  const waveId     = useCityStore((s) => s.currentWaveId);
  const ecoHealth  = useCityStore((s) => s.economyHealth);

  const WAVE_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
    stability:            { label: "ثبات",           color: "#818cf8", emoji: "🌐" },
    tech_boom:            { label: "موج فناوری",      color: "#4ade80", emoji: "🚀" },
    recession:            { label: "رکود",            color: "#f87171", emoji: "📉" },
    construction_surge:   { label: "رونق ساختمان",   color: "#fb923c", emoji: "🏗️" },
    finance_bull:         { label: "بازار گاوی",      color: "#34d399", emoji: "📈" },
    retail_holiday:       { label: "جشنواره خرید",   color: "#f472b6", emoji: "🛍️" },
    manufacturing_revival:{ label: "رستاخیز صنعت",   color: "#fbbf24", emoji: "🏭" },
  };
  const wave = WAVE_LABELS[waveId] ?? { label: waveId, color: "#818cf8", emoji: "🌐" };

  const sectorList = Object.values(sectors) as {
    id: SectorId; health: number; trend: "up"|"flat"|"down"; salaryMultiplier: number; jobDemand: number;
  }[];

  // sort: boom first, then by health desc
  const sorted = [...sectorList].sort((a, b) => {
    const aScore = (a.health >= 72 && a.trend === "up" ? 200 : 0) + a.health;
    const bScore = (b.health >= 72 && b.trend === "up" ? 200 : 0) + b.health;
    return bScore - aScore;
  });

  const ecoColor = ecoHealth >= 65 ? "#4ade80" : ecoHealth >= 40 ? "#f59e0b" : "#f87171";

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        borderRadius: 20, padding: "14px 14px 12px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 16 }}>🗺️</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: "white", flex: 1 }}>اقتصاد شهر</span>

          {/* Wave badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "3px 9px", borderRadius: 10,
            background: `${wave.color}15`,
            border: `1px solid ${wave.color}25`,
          }}>
            <span style={{ fontSize: 10 }}>{wave.emoji}</span>
            <span style={{ fontSize: 9, fontWeight: 800, color: wave.color }}>{wave.label}</span>
          </div>

          {/* Economy health pill */}
          <div style={{
            fontSize: 9, fontWeight: 900,
            color: ecoColor,
            background: `${ecoColor}12`,
            border: `1px solid ${ecoColor}25`,
            borderRadius: 8, padding: "3px 8px",
          }}>
            {toPersian(Math.round(ecoHealth))}٪
          </div>
        </div>

        {/* Sector grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {sorted.map((s) => (
            <SectorTile
              key={s.id}
              sectorId={s.id}
              health={s.health}
              trend={s.trend}
              salaryMultiplier={s.salaryMultiplier}
              jobDemand={s.jobDemand}
              isActive={activeSector === s.id}
              onTap={() => setActiveSector(activeSector === s.id ? null : s.id)}
            />
          ))}
        </div>

        {/* Footer link */}
        <Link
          href="/city"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 5, marginTop: 12,
            padding: "8px 0", borderRadius: 12,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            textDecoration: "none",
            fontSize: 10, fontWeight: 800,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          <span>جزئیات اقتصاد شهر</span>
          <span style={{ fontSize: 9 }}>←</span>
        </Link>
      </div>

      {/* Sector detail overlay */}
      {activeSector && (() => {
        const s = sectors[activeSector];
        return (
          <SectorDetail
            sectorId={activeSector}
            health={s.health}
            trend={s.trend}
            salaryMultiplier={s.salaryMultiplier}
            jobDemand={s.jobDemand}
            onClose={() => setActiveSector(null)}
          />
        );
      })()}
    </div>
  );
}
