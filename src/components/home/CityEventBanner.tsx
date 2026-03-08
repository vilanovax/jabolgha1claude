"use client";
import Link from "next/link";
import { useGameStore } from "@/stores/gameStore";
import { toPersian } from "@/data/mock";

const PHASE_LABELS: Record<string, { emoji: string; label: string; color: string }> = {
  startup_wave: { emoji: "🚀", label: "موج استارتاپ", color: "#4ade80" },
  mini_recession: { emoji: "📉", label: "رکود کوچک", color: "#f87171" },
  recovery: { emoji: "📈", label: "ریکاوری", color: "#60a5fa" },
  growth: { emoji: "💹", label: "رشد اقتصادی", color: "#34d399" },
  bubble: { emoji: "🫧", label: "حباب بازار", color: "#fbbf24" },
};

export default function CityEventBanner() {
  const wave = useGameStore((s) => s.wave);
  const activeEvents = useGameStore((s) => s.activeEvents);
  const indicators = useGameStore((s) => s.indicators);

  const phaseInfo = PHASE_LABELS[wave.currentPhase] ?? {
    emoji: "🌐", label: wave.phaseName, color: "#818cf8",
  };

  // Get top active event for display
  const topEvent = activeEvents.length > 0 ? activeEvents[0] : null;

  // Derive a market insight from indicators
  const itDemand = indicators.IT_Demand ?? 50;
  const inflation = indicators.Inflation_Index ?? 45;
  const insights: { emoji: string; text: string; color: string }[] = [];

  if (itDemand > 60) {
    insights.push({ emoji: "💻", text: "تقاضای IT بالاست · فرصت فریلنس", color: "#4ade80" });
  }
  if (inflation > 55) {
    insights.push({ emoji: "📊", text: "تورم بالا · هزینه‌ها بیشتر شده", color: "#f87171" });
  }
  if (itDemand <= 40) {
    insights.push({ emoji: "⚠️", text: "بازار IT کند شده · مهارت بساز", color: "#fbbf24" });
  }

  // Always show at least one insight
  if (insights.length === 0) {
    insights.push({ emoji: "🌐", text: "وضعیت اقتصاد پایدار", color: "#818cf8" });
  }

  return (
    <Link href="/city" style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        margin: "0 4px",
        padding: "12px 14px",
        borderRadius: 18,
        background: `linear-gradient(135deg, ${phaseInfo.color}0D, ${phaseInfo.color}05)`,
        border: `1px solid ${phaseInfo.color}20`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Phase header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 8,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 16 }}>{phaseInfo.emoji}</span>
            <span style={{
              fontSize: 11, fontWeight: 800, color: phaseInfo.color,
            }}>
              {phaseInfo.label}
            </span>
          </div>
          <span style={{
            fontSize: 9, fontWeight: 700,
            padding: "2px 8px", borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.3)",
          }}>
            رویدادهای شهر →
          </span>
        </div>

        {/* Active event */}
        {topEvent && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: 6,
            padding: "6px 10px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.03)",
          }}>
            <span style={{ fontSize: 14 }}>{topEvent.emoji}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)",
              flex: 1,
            }}>
              {topEvent.title}
            </span>
            <span style={{
              fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.2)",
            }}>
              {toPersian(topEvent.remainingTicks)} تیک
            </span>
          </div>
        )}

        {/* Market insights */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {insights.slice(0, 2).map((ins, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 12 }}>{ins.emoji}</span>
              <span style={{
                fontSize: 10, fontWeight: 600, color: ins.color,
              }}>
                {ins.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
