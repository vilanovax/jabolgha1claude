"use client";
import { useState, useEffect, useMemo } from "react";
import { useCityStore } from "@/game/city/city-store";
import { getCityGameplayModifiers } from "@/game/integration/city-impact-resolver";

const WAVE_META: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  stability:            { label: "ثبات اقتصادی",    emoji: "⚖️",  color: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
  tech_boom:            { label: "رونق فناوری",      emoji: "🚀",  color: "#4ade80", bg: "rgba(74,222,128,0.08)" },
  recession:            { label: "رکود اقتصادی",    emoji: "📉",  color: "#f87171", bg: "rgba(248,113,113,0.08)" },
  finance_bull:         { label: "بازار گاوی",       emoji: "🐂",  color: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
  construction_surge:   { label: "موج ساخت‌وساز",   emoji: "🏗️", color: "#fb923c", bg: "rgba(251,146,60,0.08)" },
  retail_holiday:       { label: "فصل خرید",         emoji: "🛍️", color: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
  manufacturing_revival:{ label: "احیای صنعت",       emoji: "🏭",  color: "#34d399", bg: "rgba(52,211,153,0.08)" },
};

export default function CityEconomyBanner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const lastUpdatedDay = useCityStore((s) => s.lastUpdatedDay);
  const economyHealth  = useCityStore((s) => s.economyHealth);
  const currentWaveId  = useCityStore((s) => s.currentWaveId);

  const modifiers = useMemo(() => {
    if (!mounted) return null;
    return getCityGameplayModifiers(useCityStore.getState());
  }, [mounted, lastUpdatedDay, economyHealth]);

  if (!mounted) return null;

  const meta  = WAVE_META[currentWaveId] ?? WAVE_META.stability;

  // Average hiring boost across all sectors
  const boost = modifiers
    ? (() => {
        const vals = Object.values(modifiers.jobMarket.hiringChanceModifierBySector);
        return vals.reduce((s, v) => s + v, 0) / (vals.length || 1);
      })()
    : 0;
  const boostLabel = boost > 0.03 ? `+${Math.round(boost * 100)}٪ شانس استخدام` :
                     boost < -0.03 ? `${Math.round(boost * 100)}٪ شانس استخدام` : null;

  const healthColor = economyHealth >= 65 ? "#4ade80" : economyHealth >= 40 ? "#fbbf24" : "#f87171";

  return (
    <div style={{
      marginBottom: 14,
      padding: "12px 14px",
      background: meta.bg,
      border: `1px solid ${meta.color}20`,
      borderRadius: 18,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{meta.emoji}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: meta.color, marginBottom: 2 }}>
          {meta.label}
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
          سلامت اقتصاد شهر:&nbsp;
          <span style={{ color: healthColor, fontWeight: 700 }}>{Math.round(economyHealth)}٪</span>
          {boostLabel && (
            <span style={{ marginRight: 6, color: boost > 0 ? "#4ade80" : "#f87171", fontWeight: 700 }}>
              &nbsp;·&nbsp;{boostLabel}
            </span>
          )}
        </div>
      </div>

      {/* Health ring */}
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: `conic-gradient(${healthColor} ${economyHealth * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          background: "#0f172a",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 800, color: healthColor,
        }}>
          {Math.round(economyHealth)}
        </div>
      </div>
    </div>
  );
}
