"use client";
import { useState } from "react";
import { getDifficultyColor, getGrowthColor, formatMoney, toPersian, COURSE_CATALOG } from "@/data/mock";
import type { JobListing, SeniorityLevel } from "@/data/mock";

interface Props {
  job: JobListing;
  isApplied: boolean;
  onApply: (jobId: number, seniority: SeniorityLevel) => void;
  playerXp: number;
  completedCourses: string[];
  playerSkills: { name: string; level: number }[];
}

const SENIORITY_COLORS = {
  junior: { bg: "rgba(74,222,128,0.15)", color: "#166534", border: "rgba(74,222,128,0.3)" },
  mid: { bg: "rgba(96,165,250,0.15)", color: "#1e40af", border: "rgba(96,165,250,0.3)" },
  senior: { bg: "rgba(212,168,67,0.2)", color: "#78350f", border: "rgba(212,168,67,0.4)" },
};

export default function PremiumJobCard({ job, isApplied, onApply, playerXp, completedCourses, playerSkills }: Props) {
  const [selectedSeniority, setSelectedSeniority] = useState<number>(0);
  const level = job.seniorityLevels[selectedSeniority];
  const diffColor = getDifficultyColor(job.difficulty);
  const growColor = getGrowthColor(job.growthPotential);

  const hasEnoughXp = playerXp >= level.minXp;
  const missingCourses = level.requiredCourses.filter((c) => !completedCourses.includes(c));
  const missingSkills = level.requirements.filter((req) => {
    const ps = playerSkills.find((s) => s.name === req.skill);
    return !ps || ps.level < req.level;
  });
  const eligible = hasEnoughXp && missingCourses.length === 0 && missingSkills.length === 0;

  return (
    <div
      className={isApplied ? "" : "anim-premium-glow"}
      style={{
        borderRadius: 24, padding: "16px", marginBottom: 14,
        background: "linear-gradient(145deg, rgba(255,251,235,0.97), rgba(254,243,199,0.97) 50%, rgba(255,251,235,0.97))",
        border: isApplied ? "2px solid rgba(212,168,67,0.2)" : "2px solid rgba(212,168,67,0.4)",
        position: "relative", overflow: "hidden",
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
          <div style={{ fontSize: 15, fontWeight: 800, color: "#78350f", marginBottom: 5 }}>
            {job.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
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

      {/* Seniority tabs */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 10,
        background: "rgba(212,168,67,0.08)", borderRadius: 10, padding: 3,
      }}>
        {job.seniorityLevels.map((lv, i) => {
          const active = i === selectedSeniority;
          const lvColor = SENIORITY_COLORS[lv.key];
          return (
            <button
              key={lv.key}
              onClick={() => setSelectedSeniority(i)}
              style={{
                flex: 1, padding: "5px 0", borderRadius: 8,
                border: active ? `1.5px solid ${lvColor.border}` : "1.5px solid transparent",
                background: active ? lvColor.bg : "transparent",
                color: active ? lvColor.color : "#a8831f",
                fontSize: 11, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              {lv.label}
            </button>
          );
        })}
      </div>

      {/* Salary */}
      <div style={{
        fontSize: 17, fontWeight: 900, color: "#D4A843",
        marginBottom: 6,
        textShadow: "0 0 12px rgba(212,168,67,0.3)",
      }}>
        💰 {formatMoney(level.salary)}
        {job.commission && " + کمیسیون"}
      </div>

      {/* Min XP */}
      <div style={{
        fontSize: 10, fontWeight: 700, marginBottom: 10,
        color: hasEnoughXp ? "#16a34a" : "#dc2626",
      }}>
        ✨ حداقل XP: {toPersian(level.minXp)}
        {!hasEnoughXp && ` (شما: ${toPersian(playerXp)})`}
      </div>

      {/* Stats row */}
      <div style={{
        display: "flex", gap: 6, flexWrap: "wrap",
        marginBottom: 10, alignItems: "center",
      }}>
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
        <span style={{ fontSize: 10, fontWeight: 700, color: "#f97316" }}>
          ⚡ {toPersian(job.energyCost)}
        </span>
      </div>

      {/* Requirements */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        {level.requirements.map((req) => {
          const met = playerSkills.some((s) => s.name === req.skill && s.level >= req.level);
          return (
            <span key={req.skill} style={{
              fontSize: 10, fontWeight: 700, padding: "3px 10px",
              borderRadius: "var(--r-full)",
              background: met ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.1)",
              color: met ? "#166534" : "#991b1b",
              border: `1px solid ${met ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.2)"}`,
            }}>
              {met ? "✓" : "✗"} {req.skill} Lv.{toPersian(req.level)}+
            </span>
          );
        })}
      </div>

      {/* Required courses */}
      {level.requiredCourses.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {level.requiredCourses.map((cId) => {
            const course = COURSE_CATALOG.find((c) => c.id === cId);
            const done = completedCourses.includes(cId);
            return (
              <span key={cId} style={{
                fontSize: 10, fontWeight: 700, padding: "3px 10px",
                borderRadius: "var(--r-full)",
                background: done ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.1)",
                color: done ? "#166534" : "#991b1b",
                border: `1px solid ${done ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.2)"}`,
              }}>
                {done ? "✓" : "✗"} {course?.emoji} {course?.name ?? cId}
              </span>
            );
          })}
        </div>
      )}

      {/* Action */}
      {eligible ? (
        <button
          onClick={() => !isApplied && onApply(job.id, level)}
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
          {isApplied ? "✓ درخواست ارسال شد" : `⭐ ارسال رزومه (${level.label}) 📤`}
        </button>
      ) : (
        <div style={{
          padding: "10px 14px", borderRadius: 14,
          background: "rgba(212,168,67,0.08)",
          border: "1.5px solid rgba(212,168,67,0.2)",
          fontSize: 11, color: "#92400e",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          <span style={{ fontWeight: 700 }}>❌ پیش‌نیازها:</span>
          {!hasEnoughXp && <span>• XP کافی نیست ({toPersian(playerXp)}/{toPersian(level.minXp)})</span>}
          {missingSkills.map((req) => (
            <span key={req.skill}>• {req.skill} Lv.{toPersian(req.level)}</span>
          ))}
          {missingCourses.map((cId) => {
            const course = COURSE_CATALOG.find((c) => c.id === cId);
            return <span key={cId}>• {course?.emoji} {course?.name ?? cId}</span>;
          })}
        </div>
      )}
    </div>
  );
}
