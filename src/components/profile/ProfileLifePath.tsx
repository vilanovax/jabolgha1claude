"use client";
import { skills, job, bank, housing, toPersian } from "@/data/mock";

function calcTechFocus(): number {
  const maxLevel = Math.max(...skills.hard.map((s) => s.level));
  return Math.min(100, maxLevel * 10);
}

function calcRiskLevel(): { value: number; label: string } {
  if (job.type === "استارتاپ") return { value: 70, label: "بالا" };
  if (job.type === "دولتی") return { value: 20, label: "پایین" };
  return { value: 45, label: "متوسط" };
}

function calcStability(): number {
  const total = bank.savings + bank.checking;
  if (total === 0) return 0;
  const ratio = (bank.savings / total) * 100;
  const factor = housing.isOwned ? 1.2 : 0.8;
  return Math.min(100, Math.round(ratio * factor));
}

const paths = [
  {
    emoji: "💻",
    label: "تمرکز فنی",
    value: calcTechFocus(),
    color: "#3b82f6",
    suffix: "٪",
  },
  {
    emoji: "🎲",
    label: "ریسک‌پذیری",
    value: calcRiskLevel().value,
    color: "#f97316",
    suffix: "",
    displayLabel: calcRiskLevel().label,
  },
  {
    emoji: "🏦",
    label: "ثبات مالی",
    value: calcStability(),
    color: "#22c55e",
    suffix: "٪",
  },
];

export default function ProfileLifePath() {
  return (
    <div style={{ padding: "0 8px", marginBottom: 16 }}>
      {/* Section header */}
      <div style={{
        fontSize: 14, fontWeight: 800, color: "white",
        display: "flex", alignItems: "center", gap: 6,
        marginBottom: 10, padding: "0 4px",
      }}>
        <span style={{ fontSize: 16 }}>🧭</span>
        مسیر زندگی
      </div>

      <div style={{
        padding: "14px 16px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}>
        {paths.map((p) => (
          <div key={p.label}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 5,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <span style={{ fontSize: 13 }}>{p.emoji}</span>
                {p.label}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 800, color: p.color,
              }}>
                {p.displayLabel || `${toPersian(p.value)}${p.suffix}`}
              </span>
            </div>
            <div style={{
              height: 5, borderRadius: 3,
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}>
              <div style={{
                width: `${p.value}%`,
                height: "100%",
                borderRadius: 3,
                background: `linear-gradient(90deg, ${p.color}, ${p.color}cc)`,
                boxShadow: `0 0 6px ${p.color}40`,
                transition: "width 0.6s ease",
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
