"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useMissionStore } from "@/game/missions/store";
import type { Mission } from "@/game/missions/types";
import { toPersian } from "@/data/mock";
import { colors, font, radius, sp } from "@/theme/tokens";

function getMissionProgress(mission: Mission): { current: number; total: number; pct: number } {
  const obj = mission.objectives[0];
  if (!obj) return { current: 0, total: 1, pct: 0 };

  const current = mission.progress["obj_0"] ?? 0;
  let total = 1;

  if ("count" in obj) total = obj.count;
  else if ("amount" in obj) total = obj.amount;
  else if ("days" in obj) total = obj.days;
  else if ("value" in obj) total = obj.value;

  const pct = Math.min(100, Math.round((current / total) * 100));
  return { current, total, pct };
}

export default function ActiveMissionCard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const getRecommended = useMissionStore((s) => s.getRecommendedMission);

  if (!mounted) return null;

  const mission = getRecommended();

  if (!mission) {
    return (
      <div style={{
        padding: sp["2xl"],
        borderRadius: radius["3xl"],
        background: colors.cardBg,
        border: "1px solid rgba(255,255,255,0.07)",
        marginBottom: 12,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>🎬</div>
        <div style={{ fontSize: font.sm, color: colors.textMuted }}>
          فعلاً ماموریتی نداری
        </div>
        <Link href="/missions" style={{ textDecoration: "none" }}>
          <div style={{
            marginTop: sp.xl,
            padding: "8px 20px",
            borderRadius: radius.pill,
            background: "rgba(250,204,21,0.1)",
            border: "1px solid rgba(250,204,21,0.2)",
            color: "#facc15",
            fontSize: font.xs,
            fontWeight: font.bold,
            display: "inline-block",
          }}>
            مشاهده ماموریت‌ها →
          </div>
        </Link>
      </div>
    );
  }

  const { pct } = getMissionProgress(mission);

  const categoryColor =
    mission.category === "story" ? "#a78bfa" :
    mission.category === "daily" ? "#facc15" :
    mission.category === "weekly" ? "#60a5fa" :
    mission.category === "event" ? "#f97316" :
    "#4ade80";

  const categoryLabel =
    mission.category === "story" ? "داستانی" :
    mission.category === "daily" ? "روزانه" :
    mission.category === "weekly" ? "هفتگی" :
    mission.category === "event" ? "رویداد" :
    mission.category === "rescue" ? "نجات" :
    "دستاورد";

  return (
    <div style={{
      padding: sp["2xl"],
      borderRadius: radius["3xl"],
      background: `linear-gradient(135deg, ${categoryColor}08, rgba(255,255,255,0.03))`,
      border: `1px solid ${categoryColor}22`,
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
          <span>🎬</span> ماموریت فعال
        </div>
        <span style={{
          fontSize: font["2xs"],
          fontWeight: font.bold,
          padding: "2px 8px",
          borderRadius: radius.pill,
          background: `${categoryColor}22`,
          color: categoryColor,
          border: `1px solid ${categoryColor}44`,
        }}>
          {categoryLabel}
        </span>
      </div>

      {/* Mission info */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: sp.xl,
        marginBottom: sp.xl,
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: radius.lg,
          background: `${categoryColor}18`,
          border: `1px solid ${categoryColor}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}>
          {mission.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: font.md,
            fontWeight: font.heavy,
            color: colors.textPrimary,
            marginBottom: 3,
          }}>
            {mission.titleFa}
          </div>
          {mission.subtitleFa && (
            <div style={{
              fontSize: font.xs,
              color: colors.textMuted,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}>
              {mission.subtitleFa}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: sp.xl }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: sp.sm,
        }}>
          <span style={{ fontSize: font["2xs"], color: colors.textMuted }}>پیشرفت</span>
          <span style={{
            fontSize: font["2xs"],
            fontWeight: font.heavy,
            color: categoryColor,
          }}>
            {toPersian(pct)}٪
          </span>
        </div>
        <div style={{
          height: 5,
          borderRadius: radius.pill,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: radius.pill,
            background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}aa)`,
            boxShadow: `0 0 8px ${categoryColor}60`,
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* CTA */}
      <Link href="/missions" style={{ textDecoration: "none" }}>
        <div style={{
          padding: "10px 16px",
          borderRadius: radius.lg,
          background: `${categoryColor}18`,
          border: `1px solid ${categoryColor}33`,
          color: categoryColor,
          fontSize: font.sm,
          fontWeight: font.bold,
          textAlign: "center",
        }}>
          ادامه بده →
        </div>
      </Link>
    </div>
  );
}
