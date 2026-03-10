"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCareerStore } from "@/game/career/career-store";
import { useIdentityStore } from "@/game/identity/identityStore";
import { colors, font, radius, sp } from "@/theme/tokens";

const LEVEL_COLORS: Record<string, string> = {
  intern:    "#9ca3af",
  junior:    "#22c55e",
  mid:       "#3b82f6",
  senior:    "#D4A843",
  lead:      "#f97316",
  manager:   "#a78bfa",
  executive: "#ef4444",
};

export default function PlayerFocusCard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const careerStore = useCareerStore();
  const lifePath = useIdentityStore((s) => s.lifePath);

  if (!mounted) return null;

  const primaryProgress = careerStore.getPrimaryProgress();

  if (!primaryProgress) {
    return (
      <div style={{
        padding: sp["2xl"],
        borderRadius: radius["3xl"],
        background: colors.cardBg,
        border: "1px solid rgba(255,255,255,0.07)",
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: font.base,
          fontWeight: font.bold,
          color: colors.textSecondary,
          marginBottom: sp.lg,
          display: "flex",
          alignItems: "center",
          gap: sp.md,
        }}>
          <span>🎯</span> تمرکز فعلی
        </div>
        <div style={{ textAlign: "center", padding: `${sp.xl}px 0` }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💼</div>
          <div style={{
            fontSize: font.sm,
            color: colors.textMuted,
            marginBottom: sp["2xl"],
            lineHeight: 1.5,
          }}>
            هنوز مسیر شغلی تعریف نشده
          </div>
          <Link href="/jobs" style={{ textDecoration: "none" }}>
            <div style={{
              padding: "10px 20px",
              borderRadius: radius.pill,
              background: "linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.1))",
              border: "1px solid rgba(212,168,67,0.35)",
              color: "#F0C966",
              fontSize: font.sm,
              fontWeight: font.bold,
              display: "inline-block",
            }}>
              برو بازار کار →
            </div>
          </Link>
        </div>
      </div>
    );
  }

  const summary = careerStore.getSummary();
  const { track, level } = primaryProgress;
  const levelColor = LEVEL_COLORS[level] ?? colors.textMuted;
  const {
    trackLabelFa,
    levelLabelFa,
    roleTitleFa,
    readinessPercent,
    nextRoleTitleFa,
    isMaxLevel,
  } = summary;

  const readinessColor =
    readinessPercent >= 80 ? colors.success :
    readinessPercent >= 50 ? colors.warning :
    colors.textMuted;

  return (
    <div style={{
      padding: sp["2xl"],
      borderRadius: radius["3xl"],
      background: `linear-gradient(135deg, ${levelColor}08, rgba(255,255,255,0.03))`,
      border: `1px solid ${levelColor}22`,
      marginBottom: 12,
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: sp.xl,
      }}>
        <div style={{
          fontSize: font.base,
          fontWeight: font.bold,
          color: colors.textSecondary,
          display: "flex",
          alignItems: "center",
          gap: sp.md,
        }}>
          <span>🎯</span> تمرکز فعلی
        </div>
        <div style={{
          fontSize: font.xs,
          fontWeight: font.bold,
          padding: "3px 10px",
          borderRadius: radius.pill,
          background: `${levelColor}22`,
          color: levelColor,
          border: `1px solid ${levelColor}44`,
        }}>
          {levelLabelFa}
        </div>
      </div>

      {/* Role */}
      <div style={{ marginBottom: sp.xl }}>
        <div style={{
          fontSize: font["3xl"],
          fontWeight: font.heavy,
          color: colors.textPrimary,
          marginBottom: 4,
        }}>
          {roleTitleFa}
        </div>
        <div style={{ fontSize: font.sm, color: colors.textMuted }}>
          {trackLabelFa}
        </div>
      </div>

      {/* Readiness bar */}
      <div style={{ marginBottom: sp.xl }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: sp.md,
        }}>
          <span style={{ fontSize: font.xs, color: colors.textMuted }}>آمادگی ارتقا</span>
          <span style={{ fontSize: font.xs, fontWeight: font.heavy, color: readinessColor }}>
            {readinessPercent}٪
          </span>
        </div>
        <div style={{
          height: 6,
          borderRadius: radius.pill,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${Math.min(readinessPercent, 100)}%`,
            borderRadius: radius.pill,
            background: `linear-gradient(90deg, ${readinessColor}, ${readinessColor}aa)`,
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>

      {/* CTA */}
      {readinessPercent >= 100 ? (
        <div style={{
          padding: "10px 16px",
          borderRadius: radius.lg,
          background: "linear-gradient(135deg, #D4A843, #F0C966)",
          color: "#000",
          fontSize: font.sm,
          fontWeight: font.heavy,
          textAlign: "center",
        }}>
          ⭐ آماده ارتقا هستی!
        </div>
      ) : (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontSize: font.xs, color: colors.textMuted }}>
            {isMaxLevel ? "بالاترین سطح" : `بعدی: ${nextRoleTitleFa ?? ""}`}
          </span>
          <Link href="/jobs" style={{ textDecoration: "none" }}>
            <span style={{
              fontSize: font.xs,
              fontWeight: font.bold,
              color: levelColor,
              padding: "4px 10px",
              borderRadius: radius.pill,
              background: `${levelColor}18`,
              border: `1px solid ${levelColor}33`,
            }}>
              بازار کار →
            </span>
          </Link>
        </div>
      )}

      {/* Life Path */}
      {lifePath.length > 0 && (
        <div style={{ marginTop: sp["2xl"] }}>
          <div style={{
            fontSize: font.xs,
            color: colors.textMuted,
            fontWeight: font.bold,
            marginBottom: sp.lg,
          }}>
            مسیر زندگی
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            overflowX: "auto",
            scrollbarWidth: "none",
            paddingBottom: 2,
          }}>
            {lifePath.map((step, i) => (
              <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  minWidth: 52,
                }}>
                  <div style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: step.reached
                      ? `linear-gradient(135deg, ${levelColor}44, ${levelColor}22)`
                      : "rgba(255,255,255,0.04)",
                    border: step.reached
                      ? `1.5px solid ${levelColor}66`
                      : "1.5px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    filter: step.reached ? "none" : "grayscale(1)",
                    opacity: step.reached ? 1 : 0.4,
                  }}>
                    {step.emoji}
                  </div>
                  <div style={{
                    fontSize: 8,
                    fontWeight: font.bold,
                    color: step.reached ? colors.textSecondary : colors.textSubtle,
                    textAlign: "center",
                    lineHeight: 1.3,
                    maxWidth: 52,
                  }}>
                    {step.nameFa}
                  </div>
                </div>
                {i < lifePath.length - 1 && (
                  <div style={{
                    width: 12,
                    height: 1.5,
                    background: lifePath[i + 1]?.reached
                      ? `${levelColor}66`
                      : "rgba(255,255,255,0.08)",
                    flexShrink: 0,
                    marginBottom: 14,
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
