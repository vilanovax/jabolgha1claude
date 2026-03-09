"use client";
import Link from "next/link";
import { useGameStore } from "@/stores/gameStore";
import { toPersian } from "@/data/mock";
import type { CityOpportunity } from "@/game/integration/opportunity-generator";

const urgencyStyle = {
  high:   { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)",  badge: "#f87171", badgeBg: "rgba(248,113,113,0.12)", label: "فوری" },
  medium: { bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)",   badge: "#fbbf24", badgeBg: "rgba(251,191,36,0.12)",  label: "مهم" },
  low:    { bg: "rgba(96,165,250,0.06)",  border: "rgba(96,165,250,0.15)",  badge: "#60a5fa", badgeBg: "rgba(96,165,250,0.10)",  label: "" },
};

export default function CityOpportunities() {
  const opportunities = useGameStore((s) => s.cityIntegrationOpportunities);

  if (!opportunities || opportunities.length === 0) return null;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)",
        marginBottom: 10, display: "flex", alignItems: "center", gap: 6,
      }}>
        <span>🔥</span> فرصت‌های امروز شهر
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {opportunities.map((op) => (
          <OpportunityCard key={op.id} op={op} />
        ))}
      </div>
    </div>
  );
}

function OpportunityCard({ op }: { op: CityOpportunity }) {
  const style = urgencyStyle[op.urgency];

  return (
    <Link href={op.ctaHref} style={{ textDecoration: "none" }}>
      <div style={{
        padding: "12px 14px",
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 16,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}>{op.emoji}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginBottom: 2,
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "white" }}>
              {op.titleFa}
            </span>
            {style.label && (
              <span style={{
                fontSize: 8, fontWeight: 700,
                padding: "1px 6px", borderRadius: 6,
                background: style.badgeBg, color: style.badge,
                border: `1px solid ${style.badge}30`,
              }}>
                {style.label}
              </span>
            )}
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            {op.descFa}
          </div>
          {op.expiresInDays !== undefined && (
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>
              ⏳ {toPersian(op.expiresInDays)} روز باقی‌مانده
            </div>
          )}
        </div>

        <div style={{
          fontSize: 10, fontWeight: 700,
          color: style.badge,
          background: style.badgeBg,
          border: `1px solid ${style.badge}30`,
          borderRadius: 10, padding: "5px 10px",
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
          {op.ctaFa} →
        </div>
      </div>
    </Link>
  );
}
