"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import {
  pageContentStyle,
  pageHeaderStyle,
  backBtnStyle,
  colors,
  font,
} from "@/theme/tokens";

interface PageShellProps {
  title: string;
  titleEmoji: string;
  subtitle?: string;
  /** Extra element on the right side of header */
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

export default function PageShell({
  title,
  titleEmoji,
  subtitle,
  headerRight,
  children,
}: PageShellProps) {
  return (
    <div className="game-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={pageContentStyle}>
        {/* Header */}
        <div style={pageHeaderStyle}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={backBtnStyle}>
              <ChevronRight size={18} color="rgba(255,255,255,0.8)" />
            </div>
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: font["3xl"],
              fontWeight: font.heavy,
              color: colors.textPrimary,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <span style={{ fontSize: font["4xl"] }}>{titleEmoji}</span> {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: font.md, color: colors.textMuted }}>
                {subtitle}
              </div>
            )}
          </div>
          {headerRight}
        </div>

        {children}
      </div>

      <BottomNav />
    </div>
  );
}
