"use client";
import { colors, font, sp, radius } from "@/theme/tokens";
import type { Opportunity, OpportunityType } from "@/game/opportunities/types";
import {
  getOpportunityTypeEmojiAndLabel,
  getOpportunityCountdownTextFa,
  getOpportunityRiskLabelFa,
  getOpportunityRewardPreviewFa,
} from "@/game/opportunities/helpers";
import { toPersian } from "@/data/mock";

interface OpportunityCardProps {
  opportunity: Opportunity;
  currentDay: number;
  onAccept: () => void;
  onReject: () => void;
  onDetails: () => void;
}

function getTypeColor(type: OpportunityType): string {
  switch (type) {
    case "economic": return colors.success;
    case "career": return colors.info;
    case "skill": return colors.purple;
    case "city": return "#fb923c";
    case "lifestyle": return "#22d3ee";
    case "network": return colors.pink;
    default: return colors.textMuted;
  }
}

function getRiskColor(risk: string): string {
  if (risk === "ریسک بالا") return colors.danger;
  if (risk === "ریسک متوسط") return colors.warning;
  return colors.success;
}

export default function OpportunityCard({
  opportunity,
  currentDay,
  onAccept,
  onDetails,
}: OpportunityCardProps) {
  const { emoji, labelFa } = getOpportunityTypeEmojiAndLabel(opportunity.type);
  const countdown = getOpportunityCountdownTextFa(opportunity, currentDay);
  const risk = getOpportunityRiskLabelFa(opportunity);
  const reward = getOpportunityRewardPreviewFa(opportunity);
  const typeColor = getTypeColor(opportunity.type);
  const riskColor = getRiskColor(risk);

  const hasMoneyCost = (opportunity.cost.money ?? 0) > 0;

  return (
    <div
      style={{
        padding: `${sp.xl}px`,
        borderRadius: radius["2xl"],
        background: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        borderRight: `3px solid ${typeColor}`,
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        gap: sp.md,
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: sp.md }}>
        <div style={{ display: "flex", alignItems: "center", gap: sp.md, minWidth: 0 }}>
          <span style={{ fontSize: font["2xl"], flexShrink: 0 }}>{emoji}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: font.xs, fontWeight: 700, color: typeColor, marginBottom: 2 }}>
              {labelFa}
            </div>
            <div
              style={{
                fontSize: font.xl,
                fontWeight: 800,
                color: "white",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {opportunity.titleFa}
            </div>
          </div>
        </div>
        {/* Countdown badge */}
        <div
          style={{
            fontSize: font.xs,
            fontWeight: 700,
            color: "#f59e0b",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: radius.md,
            padding: "2px 8px",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          ⏰ {countdown}
        </div>
      </div>

      {/* Info chips row */}
      <div style={{ display: "flex", gap: sp.sm, flexWrap: "wrap", alignItems: "center" }}>
        {/* Chain badge */}
        {opportunity.source === "chain" && (
          <div
            style={{
              fontSize: font.xs,
              fontWeight: 800,
              color: "#c084fc",
              background: "rgba(192,132,252,0.12)",
              border: "1px solid rgba(192,132,252,0.25)",
              borderRadius: radius.md,
              padding: "2px 7px",
            }}
          >
            🔗 زنجیره · مرحله {toPersian(opportunity.chainStep ?? 2)}
          </div>
        )}
        <div
          style={{
            fontSize: font.xs,
            fontWeight: 700,
            color: riskColor,
            background: `${riskColor}15`,
            border: `1px solid ${riskColor}30`,
            borderRadius: radius.md,
            padding: "2px 7px",
          }}
        >
          {risk}
        </div>
        {hasMoneyCost && (
          <div
            style={{
              fontSize: font.xs,
              fontWeight: 700,
              color: colors.dangerMuted,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: radius.md,
              padding: "2px 7px",
            }}
          >
            هزینه لازم
          </div>
        )}
        <div
          style={{
            fontSize: font.xs,
            fontWeight: 600,
            color: colors.success,
            marginRight: "auto",
          }}
        >
          {reward}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: sp.md }}>
        <button
          onClick={onDetails}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: radius.lg,
            border: `1px solid ${colors.cardBorder}`,
            background: "rgba(255,255,255,0.04)",
            color: colors.textSecondary,
            fontSize: font.base,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          جزئیات
        </button>
        <button
          onClick={onAccept}
          style={{
            flex: 2,
            padding: "8px",
            borderRadius: radius.lg,
            border: `1px solid ${typeColor}50`,
            background: `${typeColor}20`,
            color: typeColor,
            fontSize: font.base,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          قبول ✓
        </button>
      </div>
    </div>
  );
}
