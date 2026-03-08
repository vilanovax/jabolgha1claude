"use client";
import type { DailyCard } from "@/data/dailyCards";

interface Props {
  card: DailyCard;
  shielded: boolean;
  onDismiss: () => void;
}

const TYPE_STYLES = {
  positive: { bg: "linear-gradient(145deg, #ecfdf5, #d1fae5)", border: "#a7f3d0", glow: "rgba(34,197,94,0.15)", color: "#065f46" },
  negative: { bg: "linear-gradient(145deg, #fef2f2, #fee2e2)", border: "#fecaca", glow: "rgba(239,68,68,0.15)", color: "#991b1b" },
  neutral: { bg: "linear-gradient(145deg, #f0f9ff, #e0f2fe)", border: "#bae6fd", glow: "rgba(14,165,233,0.15)", color: "#0c4a6e" },
};

export default function DailyCardModal({ card, shielded, onDismiss }: Props) {
  const style = TYPE_STYLES[card.type];

  return (
    <div
      className="anim-backdrop-in"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="anim-summary-card"
        style={{
          width: "100%", maxWidth: 340, borderRadius: 28,
          background: style.bg,
          border: `2px solid ${style.border}`,
          boxShadow: `0 16px 48px ${style.glow}, 0 4px 16px rgba(0,0,0,0.1)`,
          padding: "32px 24px 24px",
          textAlign: "center",
        }}
      >
        {/* Card type label */}
        <div style={{
          fontSize: 10, fontWeight: 800, padding: "3px 12px",
          borderRadius: "var(--r-full)",
          background: card.type === "positive" ? "#dcfce7" : card.type === "negative" ? "#fef2f2" : "#e0f2fe",
          color: style.color,
          display: "inline-block", marginBottom: 16,
        }}>
          {card.type === "positive" ? "مثبت ✨" : card.type === "negative" ? "منفی ⚠️" : "خنثی 🔄"}
        </div>

        {/* Emoji */}
        <div className="anim-reward-pop" style={{
          fontSize: 64, marginBottom: 12,
          filter: `drop-shadow(0 4px 12px ${style.glow})`,
        }}>
          {card.emoji}
        </div>

        {/* Name */}
        <div style={{
          fontSize: 20, fontWeight: 900, color: style.color,
          marginBottom: 8,
        }}>
          {card.name}
        </div>

        {/* Description */}
        <div style={{
          fontSize: 13, color: style.color, opacity: 0.8,
          lineHeight: 1.7, marginBottom: 20,
        }}>
          {card.description}
        </div>

        {/* Effects */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 6,
          marginBottom: 20,
        }}>
          {card.effects.map((effect, i) => (
            <div key={i} style={{
              padding: "8px 14px", borderRadius: 12,
              background: "rgba(255,255,255,0.6)",
              fontSize: 13, fontWeight: 700,
              color: effect.value >= 0 ? "#166534" : "#991b1b",
            }}>
              {effect.label}
              {shielded && card.savingsShield && effect.target === "checking" && effect.value < 0 && (
                <span style={{ fontSize: 11, color: "#16a34a", marginRight: 6 }}>
                  {" "}(🛡️ ۷۰٪ کاهش!)
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Shield message */}
        {shielded && (
          <div style={{
            padding: "10px 14px", borderRadius: 14, marginBottom: 16,
            background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
            border: "1.5px solid #a7f3d0",
            fontSize: 12, fontWeight: 700, color: "#065f46",
          }}>
            🛡️ پس‌اندازت محافظت کرد! ضرر ۷۰٪ کاهش یافت
          </div>
        )}

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="game-btn btn-bounce"
          style={{
            width: "100%", justifyContent: "center",
            background: card.type === "positive"
              ? "linear-gradient(180deg, #22c55e, #16a34a)"
              : card.type === "negative"
                ? "linear-gradient(180deg, #ef4444, #dc2626)"
                : "linear-gradient(180deg, #3b82f6, #2563eb)",
            borderBottomColor: card.type === "positive" ? "#15803d" : card.type === "negative" ? "#b91c1c" : "#1d4ed8",
          }}
        >
          ادامه ←
        </button>
      </div>
    </div>
  );
}
