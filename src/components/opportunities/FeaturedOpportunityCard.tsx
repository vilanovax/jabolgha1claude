"use client";
import { colors, font, sp, radius } from "@/theme/tokens";
import type { Opportunity } from "@/game/opportunities/types";
import {
  getOpportunityTypeEmojiAndLabel,
  getOpportunityCountdownTextFa,
  getOpportunityRiskLabelFa,
} from "@/game/opportunities/helpers";
import { formatMoney, toPersian } from "@/data/mock";

interface FeaturedOpportunityCardProps {
  opportunity: Opportunity;
  currentDay: number;
  onAccept: () => void;
  onReject: () => void;
}

function getRarityStyle(rarity: Opportunity["rarity"]): {
  borderColor: string;
  glowColor: string;
  badgeBg: string;
  badgeColor: string;
  badgeLabel: string;
} {
  switch (rarity) {
    case "epic":
      return {
        borderColor: "rgba(212,168,67,0.4)",
        glowColor: "rgba(212,168,67,0.15)",
        badgeBg: "linear-gradient(135deg, #D4A843, #F0C966)",
        badgeColor: "#000",
        badgeLabel: "حماسی",
      };
    case "rare":
      return {
        borderColor: "rgba(59,130,246,0.4)",
        glowColor: "rgba(59,130,246,0.12)",
        badgeBg: "rgba(59,130,246,0.25)",
        badgeColor: "#60a5fa",
        badgeLabel: "نادر",
      };
    default:
      return {
        borderColor: "rgba(255,255,255,0.1)",
        glowColor: "transparent",
        badgeBg: "rgba(255,255,255,0.1)",
        badgeColor: colors.textSecondary,
        badgeLabel: "معمولی",
      };
  }
}

function getRiskColor(risk: string): string {
  if (risk === "ریسک بالا") return colors.danger;
  if (risk === "ریسک متوسط") return colors.warning;
  return colors.success;
}

export default function FeaturedOpportunityCard({
  opportunity,
  currentDay,
  onAccept,
  onReject,
}: FeaturedOpportunityCardProps) {
  const { emoji, labelFa } = getOpportunityTypeEmojiAndLabel(opportunity.type);
  const countdown = getOpportunityCountdownTextFa(opportunity, currentDay);
  const risk = getOpportunityRiskLabelFa(opportunity);
  const rarity = getRarityStyle(opportunity.rarity);
  const riskColor = getRiskColor(risk);

  const hasCost =
    (opportunity.cost.money ?? 0) > 0 ||
    (opportunity.cost.energy ?? 0) > 0 ||
    (opportunity.cost.timeMinutes ?? 0) > 0;

  return (
    <div
      style={{
        padding: `${sp["2xl"]}px`,
        borderRadius: radius["3xl"],
        background: `radial-gradient(ellipse at top right, ${rarity.glowColor}, rgba(255,255,255,0.03))`,
        border: `1px solid ${rarity.borderColor}`,
        boxShadow: `0 8px 32px ${rarity.glowColor}`,
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        gap: sp.lg,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: sp.md }}>
          <span style={{ fontSize: font["4xl"] }}>{emoji}</span>
          <div>
            <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 2 }}>
              <div
                style={{
                  fontSize: font.sm,
                  fontWeight: 700,
                  color: colors.textMuted,
                }}
              >
                {labelFa}
              </div>
              {opportunity.source === "chain" && (
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#c084fc",
                    background: "rgba(192,132,252,0.12)",
                    border: "1px solid rgba(192,132,252,0.25)",
                    borderRadius: 6,
                    padding: "1px 6px",
                  }}
                >
                  🔗 زنجیره · مرحله {toPersian(opportunity.chainStep ?? 2)}
                </div>
              )}
            </div>
            <div style={{ fontSize: font["5xl"], fontWeight: 900, color: "white" }}>
              {opportunity.titleFa}
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: font.sm,
            fontWeight: 700,
            padding: "3px 10px",
            background: rarity.badgeBg,
            color: rarity.badgeColor,
            borderRadius: radius.pill,
            flexShrink: 0,
          }}
        >
          {rarity.badgeLabel}
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: font.lg,
          color: colors.textSecondary,
          lineHeight: 1.6,
        }}
      >
        {opportunity.descriptionFa}
      </div>

      {/* Recommended reason */}
      {opportunity.recommendedReasonFa && (
        <div
          style={{
            fontSize: font.base,
            color: "#a78bfa",
            padding: `${sp.sm}px ${sp.md}px`,
            background: "rgba(167,139,250,0.08)",
            border: "1px solid rgba(167,139,250,0.15)",
            borderRadius: radius.md,
          }}
        >
          ✦ {opportunity.recommendedReasonFa}
        </div>
      )}

      {/* Countdown + Risk row */}
      <div style={{ display: "flex", alignItems: "center", gap: sp.md }}>
        <div
          style={{
            fontSize: font.base,
            fontWeight: 700,
            color: "#f59e0b",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: radius.md,
            padding: "3px 10px",
          }}
        >
          ⏰ {countdown}
        </div>
        <div
          style={{
            fontSize: font.base,
            fontWeight: 700,
            color: riskColor,
            background: `${riskColor}15`,
            border: `1px solid ${riskColor}30`,
            borderRadius: radius.md,
            padding: "3px 10px",
          }}
        >
          {risk}
        </div>
      </div>

      {/* Entry cost */}
      {hasCost && (
        <div style={{ display: "flex", gap: sp.md, flexWrap: "wrap" }}>
          {(opportunity.cost.money ?? 0) > 0 && (
            <CostBadge label={`هزینه: ${formatMoney(opportunity.cost.money!)}`} color={colors.danger} />
          )}
          {(opportunity.cost.energy ?? 0) > 0 && (
            <CostBadge label={`⚡ ${toPersian(opportunity.cost.energy!)} انرژی`} color="#fb923c" />
          )}
          {(opportunity.cost.timeMinutes ?? 0) > 0 && (
            <CostBadge label={`⏱ ${toPersian(opportunity.cost.timeMinutes!)} دقیقه`} color={colors.textMuted} />
          )}
        </div>
      )}

      {/* Outcomes */}
      <div style={{ display: "flex", flexDirection: "column", gap: sp.md }}>
        <div style={{ fontSize: font.base, fontWeight: 700, color: colors.textSecondary }}>
          نتایج احتمالی:
        </div>
        {opportunity.outcomes.map((outcome, i) => (
          <div
            key={i}
            style={{
              padding: `${sp.md}px ${sp.lg}px`,
              borderRadius: radius.lg,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontSize: font.base, fontWeight: 700, color: "white" }}>
                {outcome.labelFa}
              </div>
              <div
                style={{
                  fontSize: font.sm,
                  fontWeight: 700,
                  color: colors.textMuted,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: radius.sm,
                  padding: "2px 8px",
                }}
              >
                {toPersian(Math.round(outcome.probability * 100))}٪
              </div>
            </div>
            <div style={{ display: "flex", gap: sp.md, flexWrap: "wrap" }}>
              {outcome.effects.money !== undefined && (
                <EffectChip
                  label={`${outcome.effects.money >= 0 ? "+" : ""}${formatMoney(outcome.effects.money)}`}
                  color={outcome.effects.money >= 0 ? colors.success : colors.danger}
                />
              )}
              {outcome.effects.xp !== undefined && (
                <EffectChip
                  label={`${outcome.effects.xp >= 0 ? "+" : ""}${toPersian(outcome.effects.xp)} XP`}
                  color={colors.info}
                />
              )}
              {outcome.effects.happiness !== undefined && (
                <EffectChip
                  label={`😊 ${outcome.effects.happiness >= 0 ? "+" : ""}${toPersian(outcome.effects.happiness)}`}
                  color="#f472b6"
                />
              )}
              {outcome.effects.stars !== undefined && (
                <EffectChip
                  label={`⭐ ${outcome.effects.stars >= 0 ? "+" : ""}${toPersian(outcome.effects.stars)}`}
                  color="#facc15"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: sp.md }}>
        <button
          onClick={onAccept}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: radius.lg,
            border: "1px solid rgba(34,197,94,0.4)",
            background: "linear-gradient(135deg, rgba(34,197,94,0.25), rgba(34,197,94,0.12))",
            color: colors.success,
            fontSize: font.lg,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          قبول کن ✓
        </button>
        <button
          onClick={onReject}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: radius.lg,
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            color: colors.textMuted,
            fontSize: font.lg,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          رد کن ✕
        </button>
      </div>
    </div>
  );
}

function CostBadge({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        fontSize: font.sm,
        fontWeight: 700,
        color,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        borderRadius: radius.md,
        padding: "3px 8px",
      }}
    >
      {label}
    </div>
  );
}

function EffectChip({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        fontSize: font.sm,
        fontWeight: 700,
        color,
        background: `${color}18`,
        borderRadius: radius.sm,
        padding: "2px 6px",
      }}
    >
      {label}
    </div>
  );
}
