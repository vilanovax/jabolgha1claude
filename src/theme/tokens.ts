// ─── Design System Tokens ────────────────────────────
// Single source of truth for all visual constants.
// Use these in inline styles instead of magic values.

// ─── Colors ──────────────────────────────────────────

export const colors = {
  // Brand
  primary:      "#1B3A5C",
  primaryLight: "#2A5080",
  primaryDark:  "#0F2340",
  accent:       "#D4A843",
  accentLight:  "#F0C966",

  // Semantic
  success:  "#22c55e",
  successMuted: "#4ade80",
  warning:  "#f59e0b",
  warningMuted: "#fbbf24",
  danger:   "#ef4444",
  dangerMuted: "#f87171",
  info:     "#3b82f6",
  infoMuted: "#60a5fa",
  purple:   "#a78bfa",
  pink:     "#ec4899",

  // Scene (dark theme - home page)
  sceneBg: "#0a0e27",

  // Surface (dark glass cards)
  cardBg:     "rgba(255,255,255,0.04)",
  cardBgHover: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.06)",
  cardBorderActive: "rgba(255,255,255,0.12)",

  // Sponsored/branded
  sponsoredBg:     "linear-gradient(135deg, rgba(212,168,67,0.08), rgba(212,168,67,0.03))",
  sponsoredBorder: "rgba(212,168,67,0.15)",
  sponsoredBadgeBg: "linear-gradient(135deg, #D4A843, #F0C966)",

  // Text (on dark)
  textPrimary:   "white",
  textSecondary: "rgba(255,255,255,0.6)",
  textMuted:     "rgba(255,255,255,0.4)",
  textSubtle:    "rgba(255,255,255,0.25)",
  textDim:       "rgba(255,255,255,0.12)",

  // Overlays
  overlayDark: "rgba(0,0,0,0.85)",
  overlayLight: "rgba(255,255,255,0.06)",
} as const;

// ─── Spacing ─────────────────────────────────────────

export const sp = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 14,
  "2xl": 16,
  "3xl": 20,
  "4xl": 24,
  "5xl": 32,
  "6xl": 40,
} as const;

// ─── Radius ──────────────────────────────────────────

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  "2xl": 18,
  "3xl": 20,
  pill: 9999,
} as const;

// ─── Typography ──────────────────────────────────────

export const font = {
  // Size
  "2xs": 8,
  xs: 9,
  sm: 10,
  md: 11,
  base: 12,
  lg: 13,
  xl: 14,
  "2xl": 16,
  "3xl": 18,
  "4xl": 20,
  "5xl": 24,

  // Weight
  normal: 400 as const,
  medium: 600 as const,
  bold: 700 as const,
  heavy: 800 as const,
  black: 900 as const,
} as const;

// ─── Shadows ─────────────────────────────────────────

export const shadow = {
  sm: "0 1px 3px rgba(0,0,0,0.06)",
  md: "0 4px 14px rgba(0,0,0,0.15)",
  glow: (color: string, intensity = 0.35) =>
    `0 4px 14px rgba(${color},${intensity})`,
} as const;

// ─── Icon Sizes ──────────────────────────────────────

export const icon = {
  sm: 36,   // room objects, list items
  md: 46,   // item cards
  lg: 48,   // marketplace items
} as const;

// ─── Preset Styles ───────────────────────────────────
// Common style objects reusable across components.

import type { CSSProperties } from "react";

/** Glass card container */
export const cardStyle: CSSProperties = {
  padding: `${sp.xl}px`,
  borderRadius: radius["2xl"],
  background: colors.cardBg,
  border: `1px solid ${colors.cardBorder}`,
};

/** Sponsored card container */
export const sponsoredCardStyle: CSSProperties = {
  ...cardStyle,
  background: colors.sponsoredBg,
  border: `1px solid ${colors.sponsoredBorder}`,
};

/** Icon container (circle/rounded) */
export const iconBoxStyle = (size = icon.md): CSSProperties => ({
  width: size,
  height: size,
  borderRadius: radius.lg,
  flexShrink: 0,
  background: colors.cardBg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: Math.round(size * 0.52),
});

/** Sponsored badge "✦ Brand" */
export const sponsoredBadgeStyle: CSSProperties = {
  fontSize: font["2xs"],
  fontWeight: font.heavy,
  padding: "1px 6px",
  background: colors.sponsoredBadgeBg,
  color: "white",
  borderRadius: radius.pill,
};

/** Small stat chip (e.g. "⚡+20") */
export const statChipStyle = (color: string): CSSProperties => ({
  fontSize: font.xs,
  fontWeight: font.bold,
  padding: "2px 6px",
  borderRadius: radius.sm,
  background: `${color}18`,
  color,
});

/** Large stat chip for upgrade/tier cards */
export const tierChipStyle = (color: string): CSSProperties => ({
  fontSize: font.sm,
  fontWeight: font.bold,
  padding: "3px 8px",
  borderRadius: radius.sm,
  background: `${color}1F`,
  color,
});

/** Tab button base */
export const tabStyle = (active: boolean, activeColor: string): CSSProperties => ({
  flex: 1,
  padding: "9px 0",
  border: "none",
  cursor: "pointer",
  borderRadius: radius.lg - 1,
  fontSize: font.base,
  fontWeight: font.bold,
  fontFamily: "inherit",
  transition: "all .2s",
  background: active
    ? `linear-gradient(180deg, ${activeColor}, ${activeColor}dd)`
    : "transparent",
  color: active ? "white" : colors.textMuted,
  boxShadow: active ? `0 4px 14px ${activeColor}59` : "none",
});

/** Action button (buy, sell, eat, etc.) */
export const actionBtnStyle = (
  enabled: boolean,
  color: string,
): CSSProperties => ({
  padding: "8px 16px",
  borderRadius: radius.lg,
  border: `1px solid ${enabled ? `${color}4D` : colors.cardBorder}`,
  background: enabled
    ? `linear-gradient(135deg, ${color}33, ${color}1A)`
    : colors.cardBg,
  color: enabled ? color : colors.textSubtle,
  fontSize: font.md,
  fontWeight: font.heavy,
  cursor: enabled ? "pointer" : "default",
  fontFamily: "inherit",
  opacity: enabled ? 1 : 0.5,
});

/** Page content wrapper */
export const pageContentStyle: CSSProperties = {
  paddingTop: "calc(var(--header-h) + 8px)",
  paddingBottom: "calc(var(--nav-h) + 16px)",
  paddingLeft: sp.xl,
  paddingRight: sp.xl,
  position: "relative",
  zIndex: 2,
};

/** Page header with back button */
export const pageHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: sp.lg,
  marginBottom: sp.xl,
};

/** Back button circle */
export const backBtnStyle: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: radius.lg,
  background: `linear-gradient(145deg, ${colors.primaryDark}, ${colors.primary})`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 4px 14px rgba(10,22,40,0.4)",
};

/** Toast notification */
export const toastStyle: CSSProperties = {
  position: "fixed",
  bottom: 80,
  left: "50%",
  transform: "translateX(-50%)",
  padding: "10px 20px",
  borderRadius: radius.xl,
  background: colors.overlayDark,
  border: `1px solid rgba(255,255,255,0.1)`,
  color: "white",
  fontSize: font.base,
  fontWeight: font.bold,
  zIndex: 300,
  whiteSpace: "nowrap",
  backdropFilter: "blur(10px)",
};

/** Filter chip */
export const chipStyle = (active: boolean, color: string): CSSProperties => ({
  padding: "6px 12px",
  borderRadius: radius.md,
  whiteSpace: "nowrap",
  border: `1px solid ${active ? `${color}66` : colors.cardBorder}`,
  background: active ? `${color}26` : colors.cardBg,
  color: active ? color : colors.textMuted,
  fontSize: font.md,
  fontWeight: font.bold,
  cursor: "pointer",
  fontFamily: "inherit",
});

/** Empty state text */
export const emptyStateStyle: CSSProperties = {
  textAlign: "center",
  padding: "40px 0",
  color: colors.textSubtle,
  fontSize: font.lg,
  fontWeight: font.medium,
};

/** Section info banner */
export const bannerStyle = (color: string): CSSProperties => ({
  padding: `${sp.lg}px ${sp.xl}px`,
  borderRadius: radius.xl,
  background: `${color}0F`,
  border: `1px solid ${color}1A`,
});

/** Tab bar container */
export const tabBarStyle: CSSProperties = {
  display: "flex",
  padding: 3,
  marginBottom: sp.xl,
  background: colors.cardBg,
  borderRadius: radius.xl,
  border: `1px solid ${colors.cardBorder}`,
};
