"use client";
import { toPersian } from "@/data/mock";

type TabKey = "suitable" | "hot" | "premium" | "all";

interface Props {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  counts: { suitable: number; hot: number; premium: number; all: number };
}

const tabs: { key: TabKey; emoji: string; label: string }[] = [
  { key: "suitable", emoji: "🎯", label: "مناسب" },
  { key: "hot", emoji: "🔥", label: "داغ" },
  { key: "premium", emoji: "⭐", label: "ویژه" },
  { key: "all", emoji: "📋", label: "همه" },
];

function getTabColors(key: TabKey): { bg: string; shadow: string } {
  switch (key) {
    case "suitable": return { bg: "linear-gradient(180deg, #22c55e, #16a34a)", shadow: "rgba(34,197,94,0.35)" };
    case "hot": return { bg: "linear-gradient(180deg, #f97316, #ea580c)", shadow: "rgba(249,115,22,0.35)" };
    case "premium": return { bg: "linear-gradient(180deg, #D4A843, #A8831F)", shadow: "rgba(212,168,67,0.35)" };
    case "all": return { bg: "linear-gradient(180deg, #3b82f6, #2563eb)", shadow: "rgba(59,130,246,0.35)" };
  }
}

export default function JobTabFilters({ activeTab, onTabChange, counts }: Props) {
  return (
    <div style={{
      display: "flex", padding: 4, marginBottom: 14,
      background: "linear-gradient(145deg, #0F2340, #1B3A5C)",
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 4px 16px rgba(10,22,40,0.3)",
    }}>
      {tabs.map((t) => {
        const isActive = activeTab === t.key;
        const colors = getTabColors(t.key);
        return (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={isActive ? "anim-tab-glow" : ""}
            style={{
              flex: 1, padding: "8px 0", border: "none", cursor: "pointer",
              borderRadius: 14, fontSize: 11, fontWeight: 700,
              fontFamily: "inherit", transition: "all .2s",
              background: isActive ? colors.bg : "transparent",
              color: isActive ? "white" : "rgba(255,255,255,0.4)",
              boxShadow: isActive ? `0 4px 14px ${colors.shadow}` : "none",
              textShadow: isActive ? "0 1px 2px rgba(0,0,0,0.15)" : "none",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
            }}
          >
            <span style={{ fontSize: 12 }}>{t.emoji}</span>
            <span>{t.label} ({toPersian(counts[t.key])})</span>
          </button>
        );
      })}
    </div>
  );
}
