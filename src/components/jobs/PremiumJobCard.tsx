"use client";
import { getDifficultyColor, getGrowthColor, formatMoney, toPersian } from "@/data/mock";
import type { JobListing } from "@/data/mock";

interface Props {
  job: JobListing;
  isApplied: boolean;
  onApply: (jobId: number) => void;
}

export default function PremiumJobCard({ job, isApplied, onApply }: Props) {
  const diffColor = getDifficultyColor(job.difficulty);
  const growColor = getGrowthColor(job.growthPotential);
  const chanceBg = job.acceptanceChance >= 70
    ? "rgba(74,222,128,0.2)"
    : job.acceptanceChance >= 40
      ? "rgba(250,204,21,0.2)"
      : "rgba(239,68,68,0.2)";
  const chanceColor = job.acceptanceChance >= 70
    ? "#166534"
    : job.acceptanceChance >= 40
      ? "#854d0e"
      : "#991b1b";

  return (
    <div
      className={isApplied ? "" : "anim-premium-glow"}
      style={{
        borderRadius: 24,
        padding: "16px",
        marginBottom: 14,
        background: "linear-gradient(145deg, rgba(255,251,235,0.97), rgba(254,243,199,0.97) 50%, rgba(255,251,235,0.97))",
        border: isApplied
          ? "2px solid rgba(212,168,67,0.2)"
          : "2px solid rgba(212,168,67,0.4)",
        position: "relative",
        overflow: "hidden",
        opacity: isApplied ? 0.6 : 1,
      }}
    >
      {/* Premium badge */}
      <div style={{
        position: "absolute", top: 12, left: 12,
        background: "linear-gradient(135deg, #D4A843, #F0C966)",
        color: "white", fontSize: 9, fontWeight: 800,
        padding: "3px 10px", borderRadius: "var(--r-full)",
        boxShadow: "0 2px 8px rgba(212,168,67,0.3)",
      }}>
        ⭐ ویژه
      </div>

      {/* Top row */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 8, paddingTop: 4,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 15, fontWeight: 800, color: "#78350f", marginBottom: 5,
          }}>
            {job.title}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 8px",
              background: "rgba(212,168,67,0.15)", color: "#92400e",
              borderRadius: "var(--r-full)",
            }}>{job.type}</span>
            <span style={{ fontSize: 11, color: "#92400e" }}>{job.company}</span>
            {job.isRemote && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px",
                background: "rgba(74,222,128,0.15)", color: "#166534",
                borderRadius: "var(--r-full)",
              }}>🏠 دورکاری</span>
            )}
          </div>
        </div>
        <div style={{ fontSize: 10, color: "#a8831f", flexShrink: 0, marginTop: 2 }}>
          {job.postedAgo === 0 ? "امروز" : `${toPersian(job.postedAgo)} روز پیش`}
        </div>
      </div>

      {/* Salary */}
      <div style={{
        fontSize: 17, fontWeight: 900, color: "#D4A843",
        marginBottom: 10,
        textShadow: "0 0 12px rgba(212,168,67,0.3)",
      }}>
        💰 {formatMoney(job.salaryMin)}
        {job.salaryMax !== job.salaryMin && ` - ${formatMoney(job.salaryMax)}`}
        {job.commission && " + کمیسیون"}
      </div>

      {/* Stats row */}
      <div style={{
        display: "flex", gap: 6, flexWrap: "wrap",
        marginBottom: 10, alignItems: "center",
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "3px 10px",
          borderRadius: "var(--r-full)",
          background: chanceBg, color: chanceColor,
          border: `1px solid ${chanceColor}22`,
        }}>
          🎯 شانس: {toPersian(job.acceptanceChance)}٪
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "3px 8px",
          borderRadius: "var(--r-full)",
          background: diffColor.bg, color: diffColor.color,
        }}>
          {job.difficulty}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "3px 8px",
          borderRadius: "var(--r-full)",
          background: growColor.bg, color: growColor.color,
        }}>
          📈 رشد {job.growthPotential}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700, color: "#f97316",
        }}>
          ⚡ {toPersian(job.energyCost)}
        </span>
      </div>

      {/* Requirements */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {job.requirements.map((req) => (
          <span key={req.skill} style={{
            fontSize: 10, fontWeight: 700, padding: "3px 10px",
            borderRadius: "var(--r-full)",
            background: "rgba(212,168,67,0.1)",
            color: "#78350f",
            border: "1px solid rgba(212,168,67,0.2)",
          }}>
            {req.skill} Lv.{toPersian(req.level)}+
          </span>
        ))}
      </div>

      {/* Action */}
      {job.suitable ? (
        <button
          onClick={() => !isApplied && onApply(job.id)}
          className={isApplied ? "" : "btn-bounce"}
          style={{
            width: "100%", padding: "10px 0",
            borderRadius: 14, border: "none",
            background: isApplied
              ? "#e2e8f0"
              : "linear-gradient(180deg, #D4A843, #A8831F)",
            color: isApplied ? "#94a3b8" : "white",
            fontSize: 13, fontWeight: 800,
            fontFamily: "inherit", cursor: isApplied ? "default" : "pointer",
            boxShadow: isApplied ? "none" : "0 4px 14px rgba(212,168,67,0.35)",
            transition: "all 0.2s ease",
          }}
        >
          {isApplied ? "✓ درخواست ارسال شد" : "⭐ ارسال رزومه 📤"}
        </button>
      ) : (
        <div style={{
          padding: "10px 14px", borderRadius: 14,
          background: "rgba(212,168,67,0.08)",
          border: "1.5px solid rgba(212,168,67,0.2)",
          fontSize: 12, color: "#92400e",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>❌</span>
          <span>نیاز داری: <strong>{job.missing}</strong></span>
          <button style={{
            marginRight: "auto", background: "none", border: "none",
            fontSize: 12, color: "#1d4ed8", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", padding: 0,
          }}>یاد بگیر ←</button>
        </div>
      )}
    </div>
  );
}
