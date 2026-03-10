"use client";
import { useState, useEffect } from "react";
import { useCareerStore } from "@/game/career/career-store";
import { getCareerRoadmapFa } from "@/game/career/career-ui-helpers";
import { toPersian } from "@/data/mock";
import { colors, font, radius, sp } from "@/theme/tokens";

// ─── Level badge colors ────────────────────────────────────────

const LEVEL_COLORS: Record<string, string> = {
  intern:    "#9ca3af",  // gray
  junior:    "#22c55e",  // green
  mid:       "#3b82f6",  // blue
  senior:    "#D4A843",  // gold
  lead:      "#f97316",  // orange
  manager:   "#a78bfa",  // purple
  executive: "#ef4444",  // red
};

const TRACK_EMOJI: Record<string, string> = {
  tech:       "💻",
  data:       "📊",
  design:     "🎨",
  education:  "📚",
  marketing:  "📣",
  finance:    "💰",
  operations: "⚙️",
  management: "🏢",
};

// ─── Sub-components ────────────────────────────────────────────

function ReputationBar({ value }: { value: number }) {
  const color =
    value > 60 ? colors.success :
    value > 30 ? colors.warning :
    colors.textMuted;

  return (
    <div>
      <div style={{
        fontSize: font.xs,
        color: colors.textSecondary,
        marginBottom: 4,
        fontWeight: font.medium,
      }}>
        شهرت حرفه‌ای
      </div>
      <div style={{
        height: 6,
        borderRadius: radius.pill,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${Math.min(value, 100)}%`,
          borderRadius: radius.pill,
          background: `linear-gradient(90deg, ${color}, ${color}bb)`,
          transition: "width 0.4s ease",
        }} />
      </div>
      <div style={{
        fontSize: font["2xs"],
        color,
        marginTop: 2,
        fontWeight: font.bold,
      }}>
        {toPersian(value)} / ۱۰۰
      </div>
    </div>
  );
}

function XPStat({ value }: { value: number }) {
  return (
    <div>
      <div style={{
        fontSize: font.xs,
        color: colors.textSecondary,
        marginBottom: 4,
        fontWeight: font.medium,
      }}>
        XP شغلی
      </div>
      <div style={{
        fontSize: font["2xl"],
        fontWeight: font.heavy,
        color: colors.accentLight,
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}>
        ✨ {toPersian(value)}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────

export default function CareerProfileSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const careerStore = useCareerStore();

  if (!mounted) return null;

  const summary = careerStore.getSummary();
  const primaryProgress = careerStore.getPrimaryProgress();

  // ── Empty state ──────────────────────────────────────────────
  if (!primaryProgress) {
    return (
      <div style={{
        padding: sp["2xl"],
        borderRadius: radius["3xl"],
        background: colors.cardBg,
        border: `1px solid rgba(255,255,255,0.08)`,
        marginBottom: 14,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>💼</div>
        <div style={{
          fontSize: font["2xl"],
          fontWeight: font.bold,
          color: colors.textSecondary,
          marginBottom: 6,
        }}>
          مسیر شغلی هنوز تعریف نشده
        </div>
        <div style={{
          fontSize: font.base,
          color: colors.textMuted,
        }}>
          با قبول یک شغل، مسیر شغلیت شروع می‌شه
        </div>
      </div>
    );
  }

  const {
    trackLabelFa,
    levelLabelFa,
    roleTitleFa,
    yearsOfExp,
    reputation,
    careerXp,
    readinessPercent,
    nextRoleTitleFa,
    isMaxLevel,
  } = summary;

  const { track, level } = primaryProgress;
  const levelColor = LEVEL_COLORS[level] ?? colors.textMuted;
  const trackEmoji = TRACK_EMOJI[track] ?? "💼";
  const roadmap = getCareerRoadmapFa(track, level);

  const readinessColor =
    readinessPercent >= 80 ? colors.success :
    readinessPercent >= 50 ? colors.warning :
    colors.textMuted;

  return (
    <div style={{
      padding: sp["2xl"],
      borderRadius: radius["3xl"],
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      marginBottom: 14,
    }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: sp["2xl"],
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: sp.md,
        }}>
          <span style={{ fontSize: 18 }}>{trackEmoji}</span>
          <span style={{
            fontSize: font["2xl"],
            fontWeight: font.heavy,
            color: colors.textPrimary,
          }}>
            مسیر شغلی
          </span>
        </div>

        {/* Level badge */}
        <div style={{
          fontSize: font.sm,
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

      {/* ── Current Role Box ─────────────────────────────────── */}
      <div style={{
        padding: sp.xl,
        borderRadius: radius.lg,
        background: `${levelColor}0D`,
        border: `1px solid ${levelColor}22`,
        marginBottom: sp.xl,
      }}>
        <div style={{
          fontSize: font["3xl"],
          fontWeight: font.heavy,
          color: colors.textPrimary,
          marginBottom: 4,
        }}>
          {roleTitleFa}
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: sp.lg,
        }}>
          <span style={{
            fontSize: font.base,
            color: colors.textSecondary,
          }}>
            {trackLabelFa}
          </span>
          <span style={{
            fontSize: font.xs,
            color: colors.textMuted,
          }}>
            · {yearsOfExp} تجربه
          </span>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: sp.xl,
        marginBottom: sp.xl,
      }}>
        <div style={{
          padding: sp.xl,
          borderRadius: radius.md,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <ReputationBar value={reputation} />
        </div>
        <div style={{
          padding: sp.xl,
          borderRadius: radius.md,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <XPStat value={careerXp} />
        </div>
      </div>

      {/* ── Promotion Readiness ──────────────────────────────── */}
      <div style={{
        padding: sp.xl,
        borderRadius: radius.lg,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        marginBottom: sp.xl,
      }}>
        {/* Label row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: sp.md,
        }}>
          <span style={{
            fontSize: font.base,
            fontWeight: font.bold,
            color: colors.textSecondary,
          }}>
            آمادگی ارتقا
          </span>
          <span style={{
            fontSize: font.base,
            fontWeight: font.heavy,
            color: readinessColor,
          }}>
            {toPersian(readinessPercent)}٪
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 8,
          borderRadius: radius.pill,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          marginBottom: sp.md,
        }}>
          <div style={{
            height: "100%",
            width: `${Math.min(readinessPercent, 100)}%`,
            borderRadius: radius.pill,
            background: `linear-gradient(90deg, ${readinessColor}, ${readinessColor}aa)`,
            transition: "width 0.5s ease",
          }} />
        </div>

        {/* Ready badge or next role */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {readinessPercent >= 100 ? (
            <span style={{
              fontSize: font.sm,
              fontWeight: font.heavy,
              padding: "3px 10px",
              borderRadius: radius.pill,
              background: "linear-gradient(135deg, #D4A843, #F0C966)",
              color: "white",
            }}>
              ⭐ آماده ارتقاست!
            </span>
          ) : (
            <span style={{
              fontSize: font.xs,
              color: colors.textMuted,
            }}>
              {isMaxLevel ? "بالاترین سطح" : `هنوز آماده ارتقا نیستی`}
            </span>
          )}

          {!isMaxLevel && nextRoleTitleFa && (
            <span style={{
              fontSize: font.xs,
              color: colors.textSecondary,
              fontWeight: font.medium,
            }}>
              مرحله بعد: {nextRoleTitleFa}
            </span>
          )}
        </div>
      </div>

      {/* ── Career Roadmap ───────────────────────────────────── */}
      <div>
        <div style={{
          fontSize: font.base,
          fontWeight: font.bold,
          color: colors.textSecondary,
          marginBottom: sp.lg,
        }}>
          مسیر پیشرفت
        </div>

        <div style={{
          display: "flex",
          gap: sp.md,
          overflowX: "auto",
          paddingBottom: sp.sm,
          // Hide scrollbar
          scrollbarWidth: "none",
        }}>
          {roadmap.map((item) => {
            const isCurrent = item.level === level;
            const isUnlocked = item.unlocked;
            const itemColor = LEVEL_COLORS[item.level] ?? colors.textMuted;

            return (
              <div key={item.level} style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                minWidth: 70,
              }}>
                {/* Star above current */}
                <div style={{
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {isCurrent && (
                    <span style={{ fontSize: 12 }}>⭐</span>
                  )}
                </div>

                {/* Level pill */}
                <div style={{
                  padding: "5px 10px",
                  borderRadius: radius.pill,
                  fontSize: font.xs,
                  fontWeight: font.bold,
                  textAlign: "center",
                  border: isCurrent
                    ? `1px solid ${itemColor}88`
                    : isUnlocked
                    ? `1px solid ${itemColor}44`
                    : "1px solid rgba(255,255,255,0.08)",
                  background: isCurrent
                    ? `linear-gradient(135deg, ${itemColor}44, ${itemColor}22)`
                    : isUnlocked
                    ? `${itemColor}18`
                    : "rgba(255,255,255,0.04)",
                  color: isCurrent
                    ? itemColor
                    : isUnlocked
                    ? `${itemColor}cc`
                    : colors.textSubtle,
                  boxShadow: isCurrent
                    ? `0 0 12px ${itemColor}33`
                    : "none",
                }}>
                  {/* Level label */}
                  <div style={{ marginBottom: 2 }}>
                    {{
                      intern:    "کارآموز",
                      junior:    "جونیور",
                      mid:       "میدل",
                      senior:    "سینیور",
                      lead:      "لید",
                      manager:   "مدیر",
                      executive: "اجرایی",
                    }[item.level] ?? item.level}
                  </div>
                </div>

                {/* Role title below pill */}
                <div style={{
                  fontSize: font["2xs"],
                  color: isUnlocked ? colors.textMuted : colors.textSubtle,
                  textAlign: "center",
                  maxWidth: 70,
                  lineHeight: 1.3,
                  wordBreak: "break-word",
                }}>
                  {item.titleFa}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
