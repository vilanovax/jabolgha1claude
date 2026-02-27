"use client";
import Link from "next/link";

const DOCK_ITEMS = [
  { emoji: "🖥", label: "کامپیوتر", href: "/jobs" },
  { emoji: "📱", label: "موبایل", href: "/bank" },
  { emoji: "🛒", label: "فروشگاه", href: "/fridge" },
  { emoji: "💹", label: "سرمایه‌گذاری", href: "/bank" },
];

export default function QuickDock() {
  return (
    <div style={{
      borderRadius: 20,
      padding: "10px 8px",
      marginBottom: 10,
      display: "flex",
      justifyContent: "space-around",
      gap: 4,
    }}>
      {DOCK_ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          style={{
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "6px 8px",
            borderRadius: 14,
            transition: "background 0.15s ease",
            flex: 1,
          }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>
            {item.emoji}
          </div>
          <span style={{
            fontSize: 9, fontWeight: 600,
            color: "rgba(255,255,255,0.4)",
            whiteSpace: "nowrap",
          }}>
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
