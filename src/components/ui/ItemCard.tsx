"use client";
import {
  cardStyle,
  sponsoredCardStyle,
  iconBoxStyle,
  sponsoredBadgeStyle,
  colors,
  font,
  sp,
} from "@/theme/tokens";

interface ItemCardProps {
  emoji: string;
  name: string;
  isSponsored?: boolean;
  brand?: string;
  /** Extra badges after the name (e.g. "داری ✓", "فعلی") */
  badges?: { label: string; color: string; bg: string }[];
  /** Description line under the name */
  description?: string;
  /** Bottom row: stat chips, price, etc. */
  details?: React.ReactNode;
  /** Action button on the right */
  action?: React.ReactNode;
  /** Custom icon background for sponsored items */
  sponsoredIconBg?: boolean;
  /** Icon size override */
  iconSize?: number;
}

export default function ItemCard({
  emoji,
  name,
  isSponsored,
  brand,
  badges,
  description,
  details,
  action,
  sponsoredIconBg,
  iconSize,
}: ItemCardProps) {
  const base = isSponsored ? sponsoredCardStyle : cardStyle;

  return (
    <div style={{ ...base, display: "flex", alignItems: "center", gap: sp.lg }}>
      {/* Icon */}
      <div style={{
        ...iconBoxStyle(iconSize),
        ...(sponsoredIconBg && isSponsored
          ? { background: "linear-gradient(135deg, rgba(212,168,67,0.12), rgba(212,168,67,0.04))" }
          : {}),
      }}>
        {emoji}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: sp.sm,
          marginBottom: 3,
        }}>
          <span style={{ fontSize: font.lg, fontWeight: font.bold, color: colors.textPrimary }}>
            {name}
          </span>
          {isSponsored && brand && (
            <span style={sponsoredBadgeStyle}>✦ {brand}</span>
          )}
          {badges?.map((b, i) => (
            <span key={i} style={{
              fontSize: font["2xs"],
              fontWeight: font.heavy,
              padding: "1px 6px",
              background: b.bg,
              color: b.color,
              borderRadius: 20,
            }}>
              {b.label}
            </span>
          ))}
        </div>

        {/* Description */}
        {description && (
          <div style={{
            fontSize: font.sm,
            color: colors.textMuted,
            marginBottom: 3,
          }}>
            {description}
          </div>
        )}

        {/* Details row */}
        {details && (
          <div style={{
            display: "flex",
            gap: sp.sm,
            flexWrap: "wrap",
            alignItems: "center",
          }}>
            {details}
          </div>
        )}
      </div>

      {/* Action */}
      {action}
    </div>
  );
}
