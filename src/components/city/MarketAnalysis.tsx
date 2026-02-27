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
        borderRadius: 24, overflow: "hidden",
        background: "white",
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        marginBottom: 12,
      }}>
        <div style={{ padding: "16px" }}>
          <div style={{
            fontSize: 14, fontWeight: 800, color: "#1e293b",
            display: "flex", alignItems: "center", gap: 6,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 16 }}>📊</span> توزیع مشاغل شهر
          </div>

          {sectors.map((s) => (
            <div key={s.name} style={{ marginBottom: 12 }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5,
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{s.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px",
                    background: `${s.color}15`, color: s.color,
                    borderRadius: "var(--r-full)", border: `1px solid ${s.color}30`,
                  }}>{s.status}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 800, color: "#0f172a",
                    minWidth: 28, textAlign: "left" as const,
                  }}>{toPersian(s.pct)}٪</span>
                </div>
              </div>
              <div style={{
                background: "#f1f5f9", borderRadius: "var(--r-full)",
                height: 6, overflow: "hidden",
              }}>
                <div style={{
                  width: `${s.pct}%`, height: "100%",
                  borderRadius: "var(--r-full)",
                  background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)`,
                  boxShadow: `0 0 6px ${s.color}40`,
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
        padding: "14px 16px",
        background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(168,85,247,0.03))",
        border: "1.5px solid rgba(139,92,246,0.15)",
        boxShadow: "0 4px 16px rgba(139,92,246,0.08)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
        }}>
          <span style={{ fontSize: 18 }}>🔮</span>
          <div style={{
            fontSize: 13, fontWeight: 800, color: "#6d28d9",
          }}>
            تحلیل بازار
          </div>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 8px",
            borderRadius: 8,
            background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
            color: "white",
            marginRight: "auto",
          }}>
            PRO
          </span>
        </div>
        <div style={{
          fontSize: 12, color: "#475569", lineHeight: 1.7, marginBottom: 10,
        }}>
          {marketInsight.text}
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#8b5cf6" }}>
            اطمینان تحلیل:
          </span>
          <div style={{
            flex: 1, height: 4, borderRadius: 2,
            background: "rgba(139,92,246,0.1)",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${marketInsight.confidence}%`,
              height: "100%", borderRadius: 2,
              background: "linear-gradient(90deg, #8b5cf6, #a855f7)",
              transition: "width 0.6s ease",
            }} />
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#6d28d9",
          }}>
            {toPersian(marketInsight.confidence)}٪
          </span>
        </div>
      </div>
    </>
  );
}
