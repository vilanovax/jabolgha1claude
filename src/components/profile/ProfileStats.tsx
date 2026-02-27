"use client";
import { player, bank, formatMoney, toPersian } from "@/data/mock";

const stats = [
  { icon: "💰", value: formatMoney(bank.checking + bank.savings), label: "دارایی", color: "#4ade80" },
  { icon: "⭐", value: toPersian(player.stars), label: "ستاره", color: "#facc15" },
  { icon: "✨", value: toPersian(player.xp), label: "تجربه", color: "#c084fc" },
];

export default function ProfileStats() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: 12,
      padding: "0 8px",
      marginBottom: 16,
    }}>
      {stats.map((s) => (
        <div key={s.label} style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "14px 8px 12px",
          borderRadius: 18,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>
            {s.icon}
          </div>
          <span style={{
            fontSize: 13, fontWeight: 800, color: s.color,
            fontVariantNumeric: "tabular-nums",
          }}>
            {s.value}
          </span>
          <span style={{
            fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.3)",
          }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
