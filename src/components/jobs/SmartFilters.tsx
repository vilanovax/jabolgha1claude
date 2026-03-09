"use client";

export type SmartFilterKey = "all" | "best" | "hot" | "premium";

interface Props {
  active: SmartFilterKey;
  onChange: (k: SmartFilterKey) => void;
  counts: Record<SmartFilterKey, number>;
}

const FILTERS: { key: SmartFilterKey; label: string; emoji: string }[] = [
  { key: "all",     label: "همه",        emoji: "🗂️" },
  { key: "best",    label: "مناسب من",   emoji: "🎯" },
  { key: "hot",     label: "داغ",        emoji: "🔥" },
  { key: "premium", label: "ویژه",       emoji: "✦" },
];

export default function SmartFilters({ active, onChange, counts }: Props) {
  return (
    <div style={{
      display: "flex", gap: 6, marginBottom: 14, overflowX: "auto",
      WebkitOverflowScrolling: "touch", scrollbarWidth: "none",
    }}>
      {FILTERS.map(({ key, label, emoji }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              flexShrink: 0,
              display: "flex", alignItems: "center", gap: 5,
              padding: "7px 14px", borderRadius: 100,
              fontSize: 11, fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 0.2s ease",
              ...(isActive ? {
                background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                border: "1.5px solid #60a5fa",
                color: "white",
                boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
              } : {
                background: "rgba(255,255,255,0.04)",
                border: "1.5px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)",
              }),
            }}
          >
            <span style={{ fontSize: key === "premium" ? 11 : 13 }}>{emoji}</span>
            {label}
            <span style={{
              fontSize: 9, fontWeight: 800, minWidth: 16, height: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 100, padding: "0 4px",
              background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)",
              color: isActive ? "white" : "rgba(255,255,255,0.4)",
            }}>
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
