"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { colors, font, sp, radius } from "@/theme/tokens";
import { useOpportunityStore } from "@/game/opportunities/store";
import { useGameStore } from "@/stores/gameStore";
import { getOpportunityCountdownTextFa } from "@/game/opportunities/helpers";

export default function HomeOpportunityWidget() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const getVisible = useOpportunityStore((s) => s.getVisible);
  const currentDay = useGameStore((s) => s.player.dayInGame);

  if (!mounted) return null;

  const visible = getVisible(currentDay);
  const first = visible[0];

  if (!first) return null;

  const countdown = getOpportunityCountdownTextFa(first, currentDay);

  return (
    <Link href="/opportunities" style={{ textDecoration: "none" }}>
      <div
        style={{
          padding: `${sp.lg}px ${sp.xl}px`,
          borderRadius: radius["2xl"],
          background:
            "linear-gradient(135deg, rgba(212,168,67,0.08), rgba(212,168,67,0.03))",
          border: "1px solid rgba(212,168,67,0.25)",
          boxShadow: "0 4px 16px rgba(212,168,67,0.08)",
          direction: "rtl",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: sp.md,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: font.sm,
              fontWeight: 700,
              color: colors.accent,
              marginBottom: 3,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>💡</span>
            <span>فرصت ویژه باز شده</span>
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
            {first.titleFa}
          </div>
          <div
            style={{
              fontSize: font.sm,
              fontWeight: 600,
              color: "#f59e0b",
              marginTop: 3,
            }}
          >
            ⏰ {countdown}
          </div>
        </div>

        <div
          style={{
            flexShrink: 0,
            fontSize: font.lg,
            fontWeight: 800,
            color: colors.accent,
            background: "rgba(212,168,67,0.12)",
            border: "1px solid rgba(212,168,67,0.2)",
            borderRadius: radius.lg,
            padding: "6px 12px",
            whiteSpace: "nowrap",
          }}
        >
          مشاهده →
        </div>
      </div>
    </Link>
  );
}
