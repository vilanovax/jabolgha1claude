"use client";
import { useState } from "react";
import { getJobTypeColor, getDifficultyColor, getGrowthColor, formatMoney, toPersian, COURSE_CATALOG } from "@/data/mock";
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
  junior: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
  mid: { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
  senior: { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
};

export default function JobCard({ job, isApplied, onApply, playerXp, completedCourses, playerSkills }: Props) {
  const [selectedSeniority, setSelectedSeniority] = useState<number>(0);
  const level = job.seniorityLevels[selectedSeniority];
  const sc = SENIORITY_COLORS[level.key];

  const typeColor = getJobTypeColor(job.type);
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
    <div className={`activity-card ${isApplied ? "activity-card--done" : "activity-card--work"}`}>
      <div style={{ padding: "14px 16px 12px" }}>
        {/* Top row */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 8,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 5 }}>
              {job.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
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

        {/* Seniority tabs */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 10,
          background: "#f1f5f9", borderRadius: 10, padding: 3,
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
                  color: active ? lvColor.color : "#94a3b8",
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
          fontSize: 15, fontWeight: 800, color: "#D4A843",
          marginBottom: 6,
          textShadow: "0 0 8px rgba(212,168,67,0.2)",
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
            📈 {job.growthPotential}
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
              <span key={req.skill} className="badge-cost" style={{
                background: met ? "#dcfce7" : "#fef2f2",
                color: met ? "#166534" : "#991b1b",
                borderColor: met ? "#bbf7d0" : "#fecaca",
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
                  fontSize: 10, fontWeight: 700, padding: "3px 8px",
                  borderRadius: "var(--r-full)",
                  background: done ? "#dcfce7" : "#fef2f2",
                  color: done ? "#166534" : "#991b1b",
                  border: `1px solid ${done ? "#bbf7d0" : "#fecaca"}`,
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
            className={isApplied ? "game-btn game-btn-done" : "game-btn btn-bounce anim-submit-pulse"}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {isApplied ? "✓ درخواست ارسال شد" : `ارسال رزومه (${level.label}) 📤`}
          </button>
        ) : (
          <div style={{
            padding: "10px 14px", borderRadius: 14,
            background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
            border: "1.5px solid #fed7aa",
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
    </div>
  );
}
