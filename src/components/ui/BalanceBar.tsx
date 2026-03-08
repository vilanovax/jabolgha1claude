"use client";
import { cardStyle, colors, font, sp } from "@/theme/tokens";
import { formatMoney } from "@/data/mock";

interface BalanceBarProps {
  amount: number;
  label?: string;
}

export default function BalanceBar({ amount, label = "💰 موجودی" }: BalanceBarProps) {
  return (
    <div style={{
      ...cardStyle,
      padding: `${sp.md}px ${sp.xl}px`,
      marginBottom: sp.lg,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <span style={{ fontSize: font.md, fontWeight: font.medium, color: colors.textMuted }}>
        {label}
      </span>
      <span style={{ fontSize: font.lg, fontWeight: font.heavy, color: colors.successMuted }}>
        {formatMoney(amount)} تومن
      </span>
    </div>
  );
}
