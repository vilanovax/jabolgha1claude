"use client";
import { colors, font, sp, radius } from "@/theme/tokens";
import type { Opportunity } from "@/game/opportunities/types";
import { getOpportunityCountdownTextFa } from "@/game/opportunities/helpers";

interface ExpiringOpportunitiesProps {
  opportunities: Opportunity[];
  currentDay: number;
}

export default function ExpiringOpportunities({
  opportunities,
  currentDay,
}: ExpiringOpportunitiesProps) {
  const expiring = opportunities
    .filter(
      (o) =>
        o.status === "available" && o.expiresAtDay - currentDay <= 1,
    )
    .slice(0, 3);

  if (expiring.length === 0) return null;

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
        <span style={{ fontSize: font["2xl"] }}>⏰</span>
        <span style={{ fontSize: font["2xl"], fontWeight: 800, color: colors.danger }}>
          در حال انقضا
        </span>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: colors.danger,
            boxShadow: `0 0 6px ${colors.danger}`,
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: sp.md }}>
        {expiring.map((opp) => {
          const countdown = getOpportunityCountdownTextFa(opp, currentDay);
          return (
            <div
              key={opp.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `${sp.md}px ${sp.lg}px`,
                borderRadius: radius.lg,
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: sp.md }}>
                <span style={{ fontSize: font["2xl"] }}>⏰</span>
                <span
                  style={{
                    fontSize: font.lg,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {opp.titleFa}
                </span>
              </div>
              <div
                style={{
                  fontSize: font.sm,
                  fontWeight: 700,
                  color: colors.danger,
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: radius.md,
                  padding: "2px 8px",
                  whiteSpace: "nowrap",
                }}
              >
                {countdown}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
