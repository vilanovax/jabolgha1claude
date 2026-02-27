"use client";
import { getJobTypeColor, getDifficultyColor, getGrowthColor, formatMoney, toPersian } from "@/data/mock";
import type { JobListing } from "@/data/mock";

interface Props {
  job: JobListing;
  isApplied: boolean;
  onApply: (jobId: number) => void;
}

export default function JobCard({ job, isApplied, onApply }: Props) {
  const typeColor = getJobTypeColor(job.type);
  const diffColor = getDifficultyColor(job.difficulty);
  const growColor = getGrowthColor(job.growthPotential);
  const chanceBg = job.acceptanceChance >= 70
    ? "rgba(74,222,128,0.15)"
    : job.acceptanceChance >= 40
      ? "rgba(250,204,21,0.15)"
      : "rgba(239,68,68,0.15)";
  const chanceColor = job.acceptanceChance >= 70
    ? "#166534"
    : job.acceptanceChance >= 40
      ? "#854d0e"
      : "#991b1b";

  return (
    <div className={`activity-card ${isApplied ? "activity-card--done" : "activity-card--work"}`}>
      <div style={{ padding: "14px 16px 12px" }}>
        {/* Top row */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 8,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 5,
            }}>
              {job.title}
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px",
                background: typeColor.bg, color: typeColor.text,
                borderRadius: "var(--r-full)",
              }}>{job.type}</span>
              <span style={{ fontSize: 11, color: "#64748b" }}>{job.company}</span>
              {job.isRemote && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px",
                  background: "#dcfce7", color: "#166534",
                  borderRadius: "var(--r-full)",
                }}>🏠 دورکاری</span>
              )}
            </div>
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0 }}>
            {job.postedAgo === 0 ? "امروز" : `${toPersian(job.postedAgo)} روز پیش`}
          </div>
        </div>

        {/* Salary */}
        <div style={{
          fontSize: 15, fontWeight: 800, color: "#D4A843",
          marginBottom: 10,
          textShadow: "0 0 8px rgba(212,168,67,0.2)",
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
            fontSize: 10, fontWeight: 700, padding: "3px 8px",
            borderRadius: "var(--r-full)",
            background: chanceBg, color: chanceColor,
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
            📈 {job.growthPotential}
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
            <span key={req.skill} className="badge-cost" style={{
              background: "#f1f5f9", color: "#475569",
              borderColor: "#e2e8f0",
            }}>
              {req.skill} Lv.{toPersian(req.level)}+
            </span>
          ))}
        </div>

        {/* Action */}
        {job.suitable ? (
          <button
            onClick={() => !isApplied && onApply(job.id)}
            className={isApplied ? "game-btn game-btn-done" : "game-btn btn-bounce anim-submit-pulse"}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {isApplied ? "✓ درخواست ارسال شد" : "ارسال رزومه 📤"}
          </button>
        ) : (
          <div style={{
            padding: "10px 14px", borderRadius: 14,
            background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
            border: "1.5px solid #fed7aa",
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
    </div>
  );
}
