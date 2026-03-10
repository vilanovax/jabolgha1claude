"use client";
import { colors, font, sp, radius } from "@/theme/tokens";
import type { Opportunity } from "@/game/opportunities/types";
import { formatMoney } from "@/data/mock";

interface OpportunityHistoryListProps {
  resolvedOpportunities: Opportunity[];
}

function getMainMoneyOutcome(opp: Opportunity): number | null {
  // Find highest-probability outcome and return its money effect
  const sorted = [...opp.outcomes].sort((a, b) => b.probability - a.probability);
  for (const outcome of sorted) {
    if (outcome.effects.money !== undefined) {
      return outcome.effects.money;
    }
  }
  return null;
}

export default function OpportunityHistoryList({
  resolvedOpportunities,
}: OpportunityHistoryListProps) {
  const last5 = [...resolvedOpportunities]
    .reverse()
    .slice(0, 5);

  if (last5.length === 0) return null;

  return (
    <div style={{ direction: "rtl" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: sp.md,
          marginBottom: sp.lg,
        }}
      >
        <span style={{ fontSize: font["2xl"] }}>📋</span>
        <span style={{ fontSize: font["2xl"], fontWeight: 800, color: "white" }}>
          تاریخچه
        </span>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: colors.textMuted,
            opacity: 0.6,
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: sp.md }}>
        {last5.map((opp) => {
          const isResolved = opp.status === "resolved";
          const isRejected = opp.status === "rejected";
          const isExpired = opp.status === "expired";

          const moneyOutcome = getMainMoneyOutcome(opp);

          let statusEmoji: string = "📋";
          let statusColor: string = colors.textMuted;
          let statusLabel: string = "بسته شده";

          if (isResolved) {
            statusEmoji = "✅";
            statusColor = colors.success;
            statusLabel = "قبول شد";
          } else if (isRejected) {
            statusEmoji = "❌";
            statusColor = colors.danger;
            statusLabel = "رد شد";
          } else if (isExpired) {
            statusEmoji = "⏰";
            statusColor = colors.textMuted;
            statusLabel = "منقضی";
          }

          return (
            <div
              key={opp.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `${sp.md}px ${sp.lg}px`,
                borderRadius: radius.lg,
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${colors.cardBorder}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: sp.md }}>
                <span style={{ fontSize: font.xl }}>{statusEmoji}</span>
                <div>
                  <div
                    style={{
                      fontSize: font.lg,
                      fontWeight: 700,
                      color: isResolved ? "white" : colors.textSecondary,
                    }}
                  >
                    {opp.titleFa}
                  </div>
                  <div style={{ fontSize: font.sm, fontWeight: 600, color: statusColor }}>
                    {statusLabel}
                  </div>
                </div>
              </div>

              {isResolved && moneyOutcome !== null && (
                <div
                  style={{
                    fontSize: font.base,
                    fontWeight: 700,
                    color: moneyOutcome >= 0 ? colors.success : colors.danger,
                    background:
                      moneyOutcome >= 0
                        ? "rgba(34,197,94,0.1)"
                        : "rgba(239,68,68,0.1)",
                    borderRadius: radius.md,
                    padding: "2px 8px",
                  }}
                >
                  {moneyOutcome >= 0 ? "+" : ""}
                  {formatMoney(moneyOutcome)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
