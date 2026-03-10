"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useMissionStore } from "@/game/missions/store";
import { badges, toPersian } from "@/data/mock";
import { colors, font, radius, sp } from "@/theme/tokens";

export default function AchievementsPreviewCard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const claimedAchievementIds = useMissionStore((s) => s.claimedAchievementIds);

  const earned = badges.filter((b) => b.earned);
  const total = badges.length;

  // combine static badges count with mission achievements
  const claimedCount = claimedAchievementIds.length;
  const earnedCount = Math.max(earned.length, claimedCount);
  const pct = Math.round((earnedCount / total) * 100);

  // Top 3 earned badges for preview
  const featured = earned.slice(0, 3);

  return (
    <div style={{
      padding: sp["2xl"],
      borderRadius: radius["3xl"],
      background: "linear-gradient(135deg, rgba(212,168,67,0.06), rgba(255,255,255,0.03))",
      border: "1px solid rgba(212,168,67,0.15)",
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
          <span>🏅</span> دستاوردها
        </div>
        <span style={{
          fontSize: font.xs,
          fontWeight: font.bold,
          padding: "3px 10px",
          borderRadius: radius.pill,
          background: "rgba(212,168,67,0.15)",
          color: "#F0C966",
          border: "1px solid rgba(212,168,67,0.25)",
        }}>
          {toPersian(earnedCount)} / {toPersian(total)}
        </span>
      </div>

      {/* Featured badges row */}
      {mounted && featured.length > 0 && (
        <div style={{
          display: "flex",
          gap: 8,
          marginBottom: sp.xl,
        }}>
          {featured.map((b) => (
            <div key={b.id} style={{
              flex: 1,
              textAlign: "center",
              padding: "12px 6px",
              borderRadius: radius.xl,
              background: "rgba(212,168,67,0.08)",
              border: "1px solid rgba(212,168,67,0.15)",
            }}>
              <div style={{
                fontSize: 28,
                lineHeight: 1,
                marginBottom: 4,
                filter: "drop-shadow(0 0 8px rgba(212,168,67,0.4))",
              }}>
                {b.emoji}
              </div>
              <div style={{
                fontSize: font["2xs"],
                fontWeight: font.bold,
                color: "#F0C966",
              }}>
                {b.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div style={{ marginBottom: sp.xl }}>
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
            background: "linear-gradient(90deg, #D4A843, #F0C966)",
            boxShadow: "0 0 8px rgba(212,168,67,0.4)",
            transition: "width 0.5s ease",
          }} />
        </div>
        <div style={{
          textAlign: "center",
          marginTop: sp.sm,
          fontSize: font["2xs"],
          color: colors.textMuted,
        }}>
          {toPersian(pct)}٪ تکمیل شده
        </div>
      </div>

      {/* View all button */}
      <Link href="/missions" style={{ textDecoration: "none" }}>
        <div style={{
          padding: "10px 16px",
          borderRadius: radius.lg,
          background: "rgba(212,168,67,0.1)",
          border: "1px solid rgba(212,168,67,0.2)",
          color: "#F0C966",
          fontSize: font.sm,
          fontWeight: font.bold,
          textAlign: "center",
        }}>
          مشاهده همه →
        </div>
      </Link>
    </div>
  );
}
