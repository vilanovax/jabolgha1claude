"use client";
import { cardStyle, colors, font, sp } from "@/theme/tokens";
import { toPersian } from "@/data/mock";

interface Stat {
  label: string;
  value: number;
  emoji: string;
  color: string;
  warnBelow?: number;   // show orange when value < this
}

interface StatBarProps {
  stats: Stat[];
}

export default function StatBar({ stats }: StatBarProps) {
  return (
    <div style={{ display: "flex", gap: sp.sm, marginBottom: sp.xl }}>
      {stats.map((s) => {
        const warn = s.warnBelow && s.value < s.warnBelow;
        return (
          <div key={s.label} style={{
            ...cardStyle,
            flex: 1,
            padding: `${sp.md}px ${sp.sm + 4}px`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: font.xl, marginBottom: 2 }}>{s.emoji}</div>
            <div style={{
              fontSize: font.base,
              fontWeight: font.heavy,
              color: warn ? colors.warning : s.color,
            }}>
              {toPersian(s.value)}٪
            </div>
            <div style={{
              fontSize: font["2xs"],
              fontWeight: font.medium,
              color: colors.textSubtle,
            }}>
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
