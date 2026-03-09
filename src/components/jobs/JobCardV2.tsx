"use client";
import { useState } from "react";
import { formatMoney, toPersian, COURSE_CATALOG } from "@/data/mock";
import type { JobListing, SeniorityLevel } from "@/data/mock";

interface Props {
  job: JobListing;
  isApplied: boolean;
  onApply: (jobId: number, seniority: SeniorityLevel) => void;
  playerXp: number;
  completedCourses: string[];
  playerSkills: { name: string; level: number }[];
  cityHiringBoost?: number; // e.g. 0.1 = +10%
}

const SENIORITY_COLORS = {
  junior: { bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)",  text: "#4ade80"  },
  mid:    { bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)",  text: "#60a5fa"  },
  senior: { bg: "rgba(212,168,67,0.12)", border: "rgba(212,168,67,0.3)",   text: "#D4A843"  },
};

function calcMatchScore(
  level: SeniorityLevel,
  playerXp: number,
  completedCourses: string[],
  playerSkills: { name: string; level: number }[],
  cityHiringBoost = 0,
): number {
  // XP component (40%)
  const xpScore = level.minXp === 0 ? 40 : Math.min(1, playerXp / level.minXp) * 40;

  // Skills component (30%)
  const totalSkills = level.requirements.length;
  const metSkills = totalSkills === 0 ? 1 : level.requirements.filter((req) => {
    const ps = playerSkills.find((s) => s.name === req.skill);
    return ps && ps.level >= req.level;
  }).length / totalSkills;
  const skillScore = metSkills * 30;

  // Courses component (15%)
  const totalCourses = level.requiredCourses.length;
  const metCourses = totalCourses === 0 ? 1 : level.requiredCourses.filter((c) =>
    completedCourses.includes(c)
  ).length / totalCourses;
  const courseScore = metCourses * 15;

  // City demand bonus (15%)
  const cityScore = Math.min(15, 7.5 + cityHiringBoost * 50);

  return Math.round(Math.min(100, xpScore + skillScore + courseScore + cityScore));
}

function MatchRing({ score }: { score: number }) {
  const color = score >= 70 ? "#4ade80" : score >= 50 ? "#fbbf24" : "#f87171";
  const deg   = score * 3.6;
  return (
    <div style={{
      width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
      background: `conic-gradient(${color} ${deg}deg, rgba(255,255,255,0.07) 0deg)`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "#0f172a",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 10, fontWeight: 900, color, lineHeight: 1 }}>{toPersian(score)}</div>
        <div style={{ fontSize: 6, color: "rgba(255,255,255,0.35)", lineHeight: 1 }}>٪</div>
      </div>
    </div>
  );
}

export default function JobCardV2({
  job, isApplied, onApply, playerXp, completedCourses, playerSkills, cityHiringBoost = 0,
}: Props) {
  const [expanded, setExpanded]     = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const level  = job.seniorityLevels[selectedIdx];
  const sc     = SENIORITY_COLORS[level.key];
  const score  = calcMatchScore(level, playerXp, completedCourses, playerSkills, cityHiringBoost);

  const hasEnoughXp = playerXp >= level.minXp;
  const missingCourses = level.requiredCourses.filter((c) => !completedCourses.includes(c));
  const missingSkills  = level.requirements.filter((req) => {
    const ps = playerSkills.find((s) => s.name === req.skill);
    return !ps || ps.level < req.level;
  });
  const eligible = hasEnoughXp && missingCourses.length === 0 && missingSkills.length === 0;

  const typeColor = job.type === "استارتاپ" ? "#a78bfa" :
                    job.type === "دولتی"    ? "#60a5fa" : "#94a3b8";

  return (
    <div style={{
      marginBottom: 10,
      background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.8))",
      border: `1px solid ${isApplied ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 20,
      overflow: "hidden",
      transition: "border-color 0.2s ease",
    }}>
      {/* ── Collapsed header (always visible) ── */}
      <div
        style={{ padding: "14px 16px", cursor: "pointer", userSelect: "none" }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          {/* Match ring */}
          <MatchRing score={score} />

          {/* Title & meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "white" }}>
                {job.title}
              </span>
              {job.isHot && (
                <span style={{
                  fontSize: 8, fontWeight: 800, padding: "1px 6px", borderRadius: 8,
                  background: "rgba(251,146,60,0.15)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.2)",
                }}>
                  🔥 داغ
                </span>
              )}
              {job.isPremium && (
                <span style={{
                  fontSize: 8, fontWeight: 800, padding: "1px 6px", borderRadius: 8,
                  background: "rgba(212,168,67,0.12)", color: "#D4A843", border: "1px solid rgba(212,168,67,0.25)",
                }}>
                  ✦ ویژه
                </span>
              )}
              {isApplied && (
                <span style={{
                  fontSize: 8, fontWeight: 800, padding: "1px 6px", borderRadius: 8,
                  background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)",
                }}>
                  ✓ ارسال شد
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{job.company}</span>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 8,
                background: `${typeColor}15`, color: typeColor, border: `1px solid ${typeColor}25`,
              }}>
                {job.type}
              </span>
              {job.isRemote && (
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>🏠 دورکاری</span>
              )}
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
                {job.postedAgo === 0 ? "امروز" : `${toPersian(job.postedAgo)} روز پیش`}
              </span>
            </div>
          </div>

          {/* Salary + chevron */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#D4A843" }}>
              {formatMoney(level.salary)}
            </div>
            <div style={{
              fontSize: 13, color: "rgba(255,255,255,0.2)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s ease",
            }}>
              ▾
            </div>
          </div>
        </div>

        {/* Quick tags row */}
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
            background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
          }}>
            {level.label}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
            background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)",
          }}>
            ⚡ {toPersian(job.energyCost)} انرژی
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
            background: job.difficulty === "سخت" ? "rgba(248,113,113,0.1)" : job.difficulty === "آسان" ? "rgba(74,222,128,0.1)" : "rgba(251,191,36,0.1)",
            color: job.difficulty === "سخت" ? "#f87171" : job.difficulty === "آسان" ? "#4ade80" : "#fbbf24",
            border: "1px solid transparent",
          }}>
            {job.difficulty}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
            background: job.growthPotential === "بالا" ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)",
            color: job.growthPotential === "بالا" ? "#4ade80" : "rgba(255,255,255,0.35)",
            border: "1px solid transparent",
          }}>
            📈 {job.growthPotential}
          </span>
          {cityHiringBoost > 0.03 && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
              background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.15)",
            }}>
              🌆 شهر: +{Math.round(cityHiringBoost * 100)}٪
            </span>
          )}
        </div>
      </div>

      {/* ── Expanded details ── */}
      {expanded && (
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "14px 16px",
        }}>
          {/* Seniority selector */}
          <div style={{
            display: "flex", gap: 4, marginBottom: 14,
            background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 3,
          }}>
            {job.seniorityLevels.map((lv, i) => {
              const active = i === selectedIdx;
              const lvSc   = SENIORITY_COLORS[lv.key];
              const lvScore = calcMatchScore(lv, playerXp, completedCourses, playerSkills, cityHiringBoost);
              return (
                <button
                  key={lv.key}
                  onClick={(e) => { e.stopPropagation(); setSelectedIdx(i); }}
                  style={{
                    flex: 1, padding: "6px 4px", borderRadius: 10,
                    border: active ? `1.5px solid ${lvSc.border}` : "1.5px solid transparent",
                    background: active ? lvSc.bg : "transparent",
                    color: active ? lvSc.text : "rgba(255,255,255,0.35)",
                    fontSize: 10, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.2s ease",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  }}
                >
                  <span>{lv.label}</span>
                  <span style={{ fontSize: 8, opacity: 0.8 }}>{toPersian(lvScore)}٪</span>
                </button>
              );
            })}
          </div>

          {/* Salary & XP for selected level */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <div style={{
              flex: 1, padding: "10px 12px",
              background: "rgba(212,168,67,0.07)", border: "1px solid rgba(212,168,67,0.15)",
              borderRadius: 12,
            }}>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>💰 حقوق</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#D4A843" }}>
                {formatMoney(level.salary)}
              </div>
              {job.commission && (
                <div style={{ fontSize: 8, color: "#fb923c", marginTop: 2 }}>+ کمیسیون</div>
              )}
            </div>
            <div style={{
              flex: 1, padding: "10px 12px",
              background: hasEnoughXp ? "rgba(74,222,128,0.07)" : "rgba(248,113,113,0.07)",
              border: `1px solid ${hasEnoughXp ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)"}`,
              borderRadius: 12,
            }}>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>✨ حداقل XP</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: hasEnoughXp ? "#4ade80" : "#f87171" }}>
                {toPersian(level.minXp)}
              </div>
              {!hasEnoughXp && (
                <div style={{ fontSize: 8, color: "#f87171", marginTop: 2 }}>
                  شما: {toPersian(playerXp)}
                </div>
              )}
            </div>
          </div>

          {/* Skills checklist */}
          {level.requirements.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
                مهارت‌های مورد نیاز
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {level.requirements.map((req) => {
                  const met = playerSkills.some((s) => s.name === req.skill && s.level >= req.level);
                  return (
                    <span key={req.skill} style={{
                      fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                      background: met ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                      color: met ? "#4ade80" : "#f87171",
                      border: `1px solid ${met ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                    }}>
                      {met ? "✓" : "✗"} {req.skill} Lv.{toPersian(req.level)}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Courses checklist */}
          {level.requiredCourses.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
                دوره‌های مورد نیاز
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {level.requiredCourses.map((cId) => {
                  const course = COURSE_CATALOG.find((c) => c.id === cId);
                  const done   = completedCourses.includes(cId);
                  return (
                    <span key={cId} style={{
                      fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                      background: done ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                      color: done ? "#4ade80" : "#f87171",
                      border: `1px solid ${done ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                    }}>
                      {done ? "✓" : "✗"} {course?.emoji} {course?.name ?? cId}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Missing items hint */}
          {!eligible && (missingSkills.length > 0 || missingCourses.length > 0 || !hasEnoughXp) && (
            <div style={{
              marginBottom: 14, padding: "10px 12px",
              background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)",
              borderRadius: 12, fontSize: 10, color: "rgba(251,191,36,0.8)",
            }}>
              <span style={{ fontWeight: 700 }}>برای ارتقا نیاز داری:</span>
              {!hasEnoughXp && <div>• {toPersian(level.minXp - playerXp)} XP بیشتر</div>}
              {missingSkills.map((req) => (
                <div key={req.skill}>• مهارت {req.skill} تا سطح {toPersian(req.level)}</div>
              ))}
              {missingCourses.map((cId) => {
                const course = COURSE_CATALOG.find((c) => c.id === cId);
                return <div key={cId}>• دوره {course?.emoji} {course?.name ?? cId}</div>;
              })}
            </div>
          )}

          {/* Apply button */}
          {eligible ? (
            <button
              onClick={(e) => { e.stopPropagation(); if (!isApplied) onApply(job.id, level); }}
              disabled={isApplied}
              style={{
                width: "100%", padding: "12px 0", borderRadius: 14,
                cursor: isApplied ? "default" : "pointer",
                fontFamily: "inherit", fontSize: 13, fontWeight: 800,
                transition: "all 0.2s ease",
                ...(isApplied ? {
                  background: "rgba(74,222,128,0.1)",
                  color: "#4ade80",
                  border: "1px solid rgba(74,222,128,0.2)",
                } : {
                  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                  color: "white",
                  border: "none",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
                }),
              }}
            >
              {isApplied ? "✓ درخواست ارسال شد" : `📤 ارسال رزومه — ${level.label}`}
            </button>
          ) : (
            <button
              disabled
              style={{
                width: "100%", padding: "12px 0", borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.06)",
                fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                cursor: "not-allowed",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              🔒 پیش‌نیازها را تکمیل کنید
            </button>
          )}
        </div>
      )}
    </div>
  );
}
