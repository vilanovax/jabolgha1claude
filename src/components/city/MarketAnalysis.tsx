"use client";
import { toPersian } from "@/data/mock";
import { useGameStore } from "@/stores/gameStore";

const sectors = [
  { name: "IT / برنامه‌نویسی", pct: 38, status: "اشباع", color: "#ef4444" },
  { name: "فروش / بازرگانی", pct: 21, status: "متعادل", color: "#22c55e" },
  { name: "آموزش", pct: 12, status: "متعادل", color: "#22c55e" },
  { name: "رستوران / غذا", pct: 6, status: "فرصت", color: "#f97316" },
  { name: "سلامت", pct: 9, status: "نیاز", color: "#3b82f6" },
  { name: "سایر", pct: 14, status: "متعادل", color: "#6b7280" },
];

export default function MarketAnalysis() {
  const marketInsight = useGameStore((s) => s.marketInsight);

  return (
    <>
      {/* Sector distribution */}
      <div style={{
        borderRadius: 20,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        marginBottom: 12,
      }}>
        <div style={{ padding: "14px" }}>
          <div style={{
            fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.5)",
            display: "flex", alignItems: "center", gap: 6,
            marginBottom: 14,
          }}>
            <span style={{ fontSize: 14 }}>📊</span> توزیع مشاغل شهر
          </div>

          {sectors.map((s) => (
            <div key={s.name} style={{ marginBottom: 12 }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{s.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 7px",
                    background: `${s.color}18`, color: s.color,
                    borderRadius: 8, border: `1px solid ${s.color}30`,
                  }}>{s.status}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.6)",
                    minWidth: 28, textAlign: "left" as const,
                  }}>{toPersian(s.pct)}٪</span>
                </div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.06)", borderRadius: 4,
                height: 5, overflow: "hidden",
              }}>
                <div style={{
                  width: `${s.pct}%`, height: "100%",
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)`,
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Insight */}
      <div style={{
        borderRadius: 20,
        padding: "14px",
        background: "rgba(139,92,246,0.07)",
        border: "1px solid rgba(139,92,246,0.18)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
        }}>
          <span style={{ fontSize: 16 }}>🔮</span>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#a78bfa" }}>
            تحلیل بازار
          </div>
          <span style={{
            fontSize: 8, fontWeight: 700, padding: "2px 7px",
            borderRadius: 7,
            background: "rgba(139,92,246,0.3)",
            color: "#c4b5fd",
            marginRight: "auto",
          }}>
            PRO
          </span>
        </div>
        <div style={{
          fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 10,
        }}>
          {marketInsight.text}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(167,139,250,0.7)" }}>
            اطمینان تحلیل:
          </span>
          <div style={{
            flex: 1, height: 3, borderRadius: 2,
            background: "rgba(139,92,246,0.15)", overflow: "hidden",
          }}>
            <div style={{
              width: `${marketInsight.confidence}%`,
              height: "100%", borderRadius: 2,
              background: "linear-gradient(90deg, #8b5cf6, #a855f7)",
              transition: "width 0.6s ease",
            }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#a78bfa" }}>
            {toPersian(marketInsight.confidence)}٪
          </span>
        </div>
      </div>
    </>
  );
}
