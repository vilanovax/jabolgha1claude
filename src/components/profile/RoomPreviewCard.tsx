"use client";
import Link from "next/link";
import { useGameStore } from "@/stores/gameStore";
import { toPersian } from "@/data/mock";
import { colors, font, radius, sp } from "@/theme/tokens";

const ROOM_ITEMS = [
  { emoji: "🖥", label: "میز کار", href: "/jobs", glowColor: "rgba(212,168,67,0.35)" },
  { emoji: "📚", label: "کتابخانه", href: "/skills", glowColor: "rgba(59,130,246,0.35)" },
  { emoji: "🏋️", label: "باشگاه", href: "/", glowColor: "rgba(34,197,94,0.35)" },
  { emoji: "🛏", label: "تخت خواب", href: "/", glowColor: "rgba(139,92,246,0.35)" },
];

export default function RoomPreviewCard() {
  const player = useGameStore((s) => s.player);

  return (
    <div style={{
      padding: sp["2xl"],
      borderRadius: radius["3xl"],
      background: colors.cardBg,
      border: "1px solid rgba(255,255,255,0.07)",
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
          <span>🏠</span> اتاق من
        </div>
        <span style={{
          fontSize: font["2xs"],
          color: colors.textMuted,
          fontWeight: font.medium,
        }}>
          انرژی {toPersian(player.energy)}٪
        </span>
      </div>

      {/* 2×2 grid of room items */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginBottom: sp.xl,
      }}>
        {ROOM_ITEMS.map((item) => (
          <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
            <div style={{
              padding: "14px 10px",
              borderRadius: radius.xl,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}>
              <div style={{
                fontSize: 28,
                lineHeight: 1,
                filter: `drop-shadow(0 2px 8px ${item.glowColor})`,
              }}>
                {item.emoji}
              </div>
              <div style={{
                fontSize: font.xs,
                fontWeight: font.bold,
                color: "rgba(255,255,255,0.55)",
              }}>
                {item.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Upgrade button */}
      <Link href="/living" style={{ textDecoration: "none" }}>
        <div style={{
          padding: "10px 16px",
          borderRadius: radius.lg,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.4)",
          fontSize: font.xs,
          fontWeight: font.bold,
          textAlign: "center",
        }}>
          ارتقا اتاق →
        </div>
      </Link>
    </div>
  );
}
