"use client";
import { colors, font, sp, radius } from "@/theme/tokens";
import type { Opportunity } from "@/game/opportunities/types";
import {
  getOpportunityTypeEmojiAndLabel,
  getOpportunityCountdownTextFa,
  getOpportunityRiskLabelFa,
} from "@/game/opportunities/helpers";
import { formatMoney, toPersian } from "@/data/mock";

interface OpportunityDetailsSheetProps {
  opportunity: Opportunity | null;
  currentDay: number;
  onAccept: () => void;
  onClose: () => void;
}

function getRiskColor(risk: string): string {
  if (risk === "ریسک بالا") return colors.danger;
  if (risk === "ریسک متوسط") return colors.warning;
  return colors.success;
}

export default function OpportunityDetailsSheet({
  opportunity,
  currentDay,
  onAccept,
  onClose,
}: OpportunityDetailsSheetProps) {
  if (!opportunity) return null;

  const { emoji, labelFa } = getOpportunityTypeEmojiAndLabel(opportunity.type);
  const countdown = getOpportunityCountdownTextFa(opportunity, currentDay);
  const risk = getOpportunityRiskLabelFa(opportunity);
  const riskColor = getRiskColor(risk);

  const hasCost =
    (opportunity.cost.money ?? 0) > 0 ||
    (opportunity.cost.energy ?? 0) > 0 ||
    (opportunity.cost.timeMinutes ?? 0) > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          zIndex: 200,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 201,
          background: "linear-gradient(180deg, #12163a, #0a0e27)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderBottom: "none",
          borderRadius: `${radius["3xl"]}px ${radius["3xl"]}px 0 0`,
          padding: `${sp["3xl"]}px ${sp["2xl"]}px`,
          paddingBottom: `calc(${sp["5xl"]}px + env(safe-area-inset-bottom, 0px))`,
          maxHeight: "90dvh",
          overflowY: "auto",
          direction: "rtl",
          display: "flex",
          flexDirection: "column",
          gap: sp.xl,
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: radius.pill,
            background: "rgba(255,255,255,0.15)",
            margin: "0 auto",
            marginTop: -8,
            marginBottom: sp.md,
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: sp.md }}>
          <span style={{ fontSize: font["4xl"] }}>{emoji}</span>
          <div>
            <div style={{ fontSize: font.sm, fontWeight: 700, color: colors.textMuted }}>{labelFa}</div>
            <div style={{ fontSize: font["4xl"], fontWeight: 900, color: "white" }}>
              {opportunity.titleFa}
            </div>
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: font.lg,
            color: colors.textSecondary,
            lineHeight: 1.7,
            padding: `${sp.md}px ${sp.lg}px`,
            background: "rgba(255,255,255,0.03)",
            borderRadius: radius.lg,
            border: `1px solid ${colors.cardBorder}`,
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

        {/* Countdown + risk */}
        <div style={{ display: "flex", gap: sp.md }}>
          <InfoBadge label={`⏰ ${countdown}`} color="#f59e0b" />
          <InfoBadge label={risk} color={riskColor} />
        </div>

        {/* Cost breakdown */}
        {hasCost && (
          <div>
            <SectionLabel>هزینه ورود</SectionLabel>
            <div style={{ display: "flex", gap: sp.md, flexWrap: "wrap", marginTop: sp.md }}>
              {(opportunity.cost.money ?? 0) > 0 && (
                <InfoBadge label={`${formatMoney(opportunity.cost.money!)}`} color={colors.danger} prefix="💰" />
              )}
              {(opportunity.cost.energy ?? 0) > 0 && (
                <InfoBadge label={`${toPersian(opportunity.cost.energy!)} انرژی`} color="#fb923c" prefix="⚡" />
              )}
              {(opportunity.cost.timeMinutes ?? 0) > 0 && (
                <InfoBadge label={`${toPersian(opportunity.cost.timeMinutes!)} دقیقه`} color={colors.textMuted} prefix="⏱" />
              )}
            </div>
          </div>
        )}

        {/* Outcomes */}
        <div>
          <SectionLabel>نتایج احتمالی</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: sp.lg, marginTop: sp.md }}>
            {opportunity.outcomes.map((outcome, i) => (
              <div
                key={i}
                style={{
                  padding: `${sp.lg}px`,
                  borderRadius: radius.lg,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${colors.cardBorder}`,
                }}
              >
                {/* Label + percent */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: sp.md,
                  }}
                >
                  <div style={{ fontSize: font.lg, fontWeight: 700, color: "white" }}>
                    {outcome.labelFa}
                  </div>
                  <div
                    style={{
                      fontSize: font.base,
                      fontWeight: 700,
                      color: colors.textSecondary,
                    }}
                  >
                    {toPersian(Math.round(outcome.probability * 100))}٪
                  </div>
                </div>

                {/* Probability bar */}
                <div
                  style={{
                    height: 4,
                    borderRadius: radius.pill,
                    background: "rgba(255,255,255,0.08)",
                    marginBottom: sp.md,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${outcome.probability * 100}%`,
                      height: "100%",
                      borderRadius: radius.pill,
                      background:
                        outcome.probability >= 0.6
                          ? colors.success
                          : outcome.probability >= 0.3
                          ? "#f59e0b"
                          : colors.danger,
                    }}
                  />
                </div>

                {/* Effects */}
                <div style={{ display: "flex", gap: sp.sm, flexWrap: "wrap" }}>
                  {outcome.effects.money !== undefined && (
                    <EffectBadge
                      label={`${outcome.effects.money >= 0 ? "+" : ""}${formatMoney(outcome.effects.money)}`}
                      color={outcome.effects.money >= 0 ? colors.success : colors.danger}
                    />
                  )}
                  {outcome.effects.xp !== undefined && (
                    <EffectBadge
                      label={`${outcome.effects.xp >= 0 ? "+" : ""}${toPersian(outcome.effects.xp)} XP`}
                      color={colors.info}
                    />
                  )}
                  {outcome.effects.happiness !== undefined && (
                    <EffectBadge
                      label={`😊 ${outcome.effects.happiness >= 0 ? "+" : ""}${toPersian(outcome.effects.happiness)}`}
                      color="#f472b6"
                    />
                  )}
                  {outcome.effects.stars !== undefined && (
                    <EffectBadge
                      label={`⭐ ${outcome.effects.stars >= 0 ? "+" : ""}${toPersian(outcome.effects.stars)}`}
                      color="#facc15"
                    />
                  )}
                  {outcome.effects.reputation !== undefined && (
                    <EffectBadge
                      label={`🏅 ${outcome.effects.reputation >= 0 ? "+" : ""}${toPersian(outcome.effects.reputation)}`}
                      color="#a78bfa"
                    />
                  )}
                </div>

                {/* Narrative */}
                <div
                  style={{
                    marginTop: sp.md,
                    fontSize: font.base,
                    color: colors.textMuted,
                    fontStyle: "italic",
                  }}
                >
                  {outcome.narrativeTextFa}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: sp.md, paddingTop: sp.md }}>
          <button
            onClick={onAccept}
            style={{
              flex: 2,
              padding: "14px",
              borderRadius: radius.xl,
              border: "1px solid rgba(34,197,94,0.4)",
              background: "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.15))",
              color: colors.success,
              fontSize: font.xl,
              fontWeight: 900,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            قبول می‌کنم ✓
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: radius.xl,
              border: `1px solid ${colors.cardBorder}`,
              background: colors.cardBg,
              color: colors.textMuted,
              fontSize: font.xl,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            بی‌خیال
          </button>
        </div>
      </div>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: font.base, fontWeight: 700, color: colors.textSecondary }}>
      {children}
    </div>
  );
}

function InfoBadge({ label, color, prefix }: { label: string; color: string; prefix?: string }) {
  return (
    <div
      style={{
        fontSize: font.base,
        fontWeight: 700,
        color,
        background: `${color}12`,
        border: `1px solid ${color}25`,
        borderRadius: radius.md,
        padding: "3px 10px",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {prefix && <span>{prefix}</span>}
      {label}
    </div>
  );
}

function EffectBadge({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        fontSize: font.sm,
        fontWeight: 700,
        color,
        background: `${color}18`,
        borderRadius: radius.sm,
        padding: "2px 7px",
      }}
    >
      {label}
    </div>
  );
}
