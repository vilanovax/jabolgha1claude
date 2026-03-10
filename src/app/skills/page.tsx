"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import { COURSE_CATALOG, COURSE_FIELDS, toPersian, formatMoney } from "@/data/mock";
import type { CourseDefinition } from "@/data/mock";
import { useGameStore } from "@/stores/gameStore";

type LibTab = "path" | "courses" | "skills";

// ─── Learning Path Data ────────────────────────────────────────────────────────
const LEARNING_PATHS = [
  {
    id: "dev", label: "مسیر توسعه‌دهنده", emoji: "💻", color: "#60a5fa",
    nodes: [
      { courseId: "python_basics",   jobUnlock: "Junior Developer", income: "۳M/شیفت" },
      { courseId: "react_advanced",  jobUnlock: "Mid Developer",    income: "۵M/شیفت" },
      { courseId: "data_science",    jobUnlock: "Senior Developer", income: "۸M/شیفت" },
    ],
  },
  {
    id: "marketing", label: "مسیر بازاریابی", emoji: "📣", color: "#f97316",
    nodes: [
      { courseId: "digital_marketing", jobUnlock: "کارشناس بازاریابی", income: "۲.۵M/شیفت" },
      { courseId: "seo_mastery",        jobUnlock: "مدیر بازاریابی",   income: "۴M/شیفت"   },
    ],
  },
  {
    id: "finance", label: "مسیر مالی", emoji: "📊", color: "#4ade80",
    nodes: [
      { courseId: "accounting_fundamentals", jobUnlock: "حسابدار",       income: "۲.۵M/شیفت" },
      { courseId: "financial_analysis",      jobUnlock: "تحلیلگر مالی",  income: "۵M/شیفت"   },
    ],
  },
  {
    id: "management", label: "مسیر مدیریت", emoji: "🎯", color: "#a78bfa",
    nodes: [
      { courseId: "leadership_101",      jobUnlock: "سرپرست تیم", income: "۵M/شیفت" },
      { courseId: "project_management",  jobUnlock: "مدیر پروژه", income: "۷M/شیفت" },
    ],
  },
];

// ─── Skill gameplay impact labels ─────────────────────────────────────────────
const SKILL_IMPACT: Record<string, { income?: string; unlock?: string[]; other?: string }> = {
  "برنامه‌نویسی": { income: "+۵٪ درآمد/سطح", unlock: ["Junior Developer", "Senior Developer"] },
  "بازاریابی":    { income: "+۳٪ درآمد/سطح", unlock: ["کارشناس بازاریابی", "مدیر بازاریابی"] },
  "حسابداری":     { income: "+۳٪ درآمد/سطح", unlock: ["حسابدار", "تحلیلگر مالی"] },
  "طراحی":        { income: "+۳٪ درآمد/سطح", unlock: ["طراح UI/UX"] },
  "مذاکره":       { other: "-۲٪ قیمت خرید/سطح" },
  "مدیریت زمان":  { other: "+۲٪ کارایی شیفت/سطح" },
  "ارتباطات":     { other: "+۵٪ احتمال قبولی مصاحبه/سطح" },
  "رهبری":        { income: "+۴٪ درآمد/سطح", unlock: ["سرپرست تیم", "مدیر پروژه"] },
};

// ─── Smart Suggestion ─────────────────────────────────────────────────────────
function computeSuggestion(
  activeCourse: { courseId: string; currentDay: number } | null,
  completedCourses: string[],
  checking: number,
): { title: string; body: string; courseId?: string; cta: string } | null {
  if (activeCourse) {
    const def = COURSE_CATALOG.find((c) => c.id === activeCourse.courseId);
    if (!def) return null;
    const path = LEARNING_PATHS.find((p) =>
      p.nodes.some((n) => n.courseId === activeCourse.courseId),
    );
    const node = path?.nodes.find((n) => n.courseId === activeCourse.courseId);
    const daysLeft = def.totalDays - activeCourse.currentDay + 1;
    return {
      title: `${toPersian(daysLeft)} روز تا اتمام ${def.name}`,
      body: node
        ? `شغل ${node.jobUnlock} باز می‌شه — درآمد ${node.income}`
        : `+${toPersian(def.xpReward)} XP پس از اتمام`,
      cta: "ادامه مطالعه",
    };
  }
  // No active course — find best next step
  for (const path of LEARNING_PATHS) {
    for (const node of path.nodes) {
      if (!completedCourses.includes(node.courseId)) {
        const course = COURSE_CATALOG.find((c) => c.id === node.courseId);
        if (!course) continue;
        const prereq = path.nodes.indexOf(node) > 0
          ? path.nodes[path.nodes.indexOf(node) - 1]
          : null;
        if (prereq && !completedCourses.includes(prereq.courseId)) continue;
        if (checking >= course.cost) {
          return {
            title: `ثبت‌نام در ${course.name}`,
            body: `پس از اتمام، شغل ${node.jobUnlock} باز می‌شه — ${node.income}`,
            courseId: course.id,
            cta: "ثبت‌نام",
          };
        }
      }
    }
  }
  return null;
}

// ─── Skill Radar ───────────────────────────────────────────────────────────────
const RADAR_AXES: { key: string; label: string; color: string; emoji: string }[] = [
  { key: "برنامه‌نویسی", label: "برنامه‌نویسی", color: "#60a5fa", emoji: "💻" },
  { key: "بازاریابی",    label: "بازاریابی",    color: "#f97316", emoji: "📣" },
  { key: "حسابداری",     label: "حسابداری",     color: "#4ade80", emoji: "📊" },
  { key: "طراحی",        label: "طراحی",        color: "#a78bfa", emoji: "🎨" },
  { key: "رهبری",        label: "رهبری",        color: "#fbbf24", emoji: "🎯" },
];
const RADAR_MAX = 10;
const RADAR_SIZE = 240;
const RADAR_CX = RADAR_SIZE / 2;
const RADAR_CY = RADAR_SIZE / 2;
const RADAR_R  = 90;

function radarPoint(axisIdx: number, value: number, total: number, r: number) {
  const angle = (Math.PI * 2 * axisIdx) / total - Math.PI / 2;
  return {
    x: RADAR_CX + r * Math.cos(angle),
    y: RADAR_CY + r * Math.sin(angle),
  };
}

function SkillRadar({
  skills,
  allSkills,
}: {
  skills: { name: string; level: number; emoji: string }[];
  allSkills: { name: string; level: number; emoji: string }[];
}) {
  const [animated, setAnimated] = useState(false);
  const [tooltip, setTooltip] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const n = RADAR_AXES.length;
  const levels = RADAR_AXES.map((ax) => {
    const found = allSkills.find((s) => s.name === ax.key);
    return found?.level ?? 0;
  });

  // Build filled polygon points
  const filledPoints = RADAR_AXES.map((_, i) => {
    const ratio = animated ? levels[i] / RADAR_MAX : 0;
    return radarPoint(i, ratio, n, RADAR_R * ratio);
  });
  const filledPath = filledPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

  // Grid circles
  const gridRatios = [0.25, 0.5, 0.75, 1];

  return (
    <div style={{
      borderRadius: 20, padding: "16px 12px 12px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      marginBottom: 16,
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 8, alignSelf: "flex-start" }}>
        🕸 نقشه مهارت
      </div>

      <div style={{ position: "relative" }}>
        <svg
          ref={ref}
          width={RADAR_SIZE}
          height={RADAR_SIZE}
          style={{ overflow: "visible", display: "block" }}
        >
          {/* Grid rings */}
          {gridRatios.map((ratio, ri) => {
            const pts = RADAR_AXES.map((_, i) => radarPoint(i, ratio, n, RADAR_R * ratio));
            const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
            return (
              <path key={ri} d={d}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            );
          })}

          {/* Axis lines */}
          {RADAR_AXES.map((_, i) => {
            const outer = radarPoint(i, 1, n, RADAR_R);
            return (
              <line key={i}
                x1={RADAR_CX} y1={RADAR_CY}
                x2={outer.x} y2={outer.y}
                stroke="rgba(255,255,255,0.07)" strokeWidth={1}
              />
            );
          })}

          {/* Filled polygon */}
          <path
            d={filledPath}
            fill="rgba(96,165,250,0.12)"
            stroke="rgba(96,165,250,0.5)"
            strokeWidth={1.5}
            strokeLinejoin="round"
            style={{ transition: "all 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}
          />

          {/* Axis nodes + colored dots */}
          {RADAR_AXES.map((ax, i) => {
            const ratio = animated ? levels[i] / RADAR_MAX : 0;
            const dotPt = radarPoint(i, ratio, n, RADAR_R * ratio);
            const labelPt = radarPoint(i, 1, n, RADAR_R + 22);
            const isActive = tooltip === i;

            return (
              <g key={i}>
                {/* Label */}
                <text
                  x={labelPt.x}
                  y={labelPt.y + 4}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill={ax.color}
                  style={{ userSelect: "none" }}
                >
                  {ax.emoji}
                </text>

                {/* Value dot */}
                <circle
                  cx={dotPt.x} cy={dotPt.y}
                  r={isActive ? 7 : 5}
                  fill={ax.color}
                  stroke={isActive ? "white" : "rgba(255,255,255,0.2)"}
                  strokeWidth={isActive ? 2 : 1}
                  style={{ cursor: "pointer", transition: "r 0.15s, stroke 0.15s" }}
                  onClick={() => setTooltip(tooltip === i ? null : i)}
                />
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip !== null && (() => {
          const ax = RADAR_AXES[tooltip];
          const sk = allSkills.find((s) => s.name === ax.key);
          const impact = SKILL_IMPACT[ax.key];
          const labelPt = radarPoint(tooltip, 1, n, RADAR_R + 22);
          const isLeft = labelPt.x < RADAR_CX - 10;
          return (
            <div style={{
              position: "absolute",
              top: Math.max(4, labelPt.y - 16),
              ...(isLeft ? { left: 0 } : { right: 0 }),
              minWidth: 120,
              background: "rgba(10,14,30,0.95)",
              border: `1px solid ${ax.color}44`,
              borderRadius: 12, padding: "8px 10px",
              zIndex: 20, pointerEvents: "none",
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: ax.color, marginBottom: 3 }}>
                {ax.emoji} {ax.label}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>
                سطح {toPersian(sk?.level ?? 0)} / {toPersian(RADAR_MAX)}
              </div>
              {impact?.income && (
                <div style={{ fontSize: 9, color: "#4ade80", fontWeight: 700 }}>{impact.income}</div>
              )}
              {impact?.unlock && (
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                  🔓 {impact.unlock.slice(0, 2).join(" · ")}
                </div>
              )}
              {impact?.other && (
                <div style={{ fontSize: 9, color: "#fbbf24", fontWeight: 600 }}>{impact.other}</div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Legend row */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
        {RADAR_AXES.map((ax, i) => (
          <button
            key={ax.key}
            onClick={() => setTooltip(tooltip === i ? null : i)}
            style={{
              border: "none", background: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit",
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: ax.color, display: "inline-block", flexShrink: 0,
            }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: tooltip === i ? ax.color : "rgba(255,255,255,0.4)" }}>
              {ax.label} {toPersian(levels[i])}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function SkillsPage() {
  const [tab, setTab]             = useState<LibTab>("path");
  const [activeField, setField]   = useState<string | null>(null);
  const [enrollSheet, setSheet]   = useState<CourseDefinition | null>(null);
  const [enrollSponsored, setSpon]= useState(false);
  const [sessionError, setSessErr]= useState<string | null>(null);
  const [enrollError, setEnrErr]  = useState<string | null>(null);

  const player          = useGameStore((s) => s.player);
  const checking        = useGameStore((s) => s.bank.checking);
  const completedCourses= useGameStore((s) => s.completedCourses);
  const activeCourse    = useGameStore((s) => s.activeCourse);
  const enrollCourse    = useGameStore((s) => s.enrollCourse);
  const completeSession = useGameStore((s) => s.completeSession);
  const dropCourse      = useGameStore((s) => s.dropCourse);
  const skills          = useGameStore((s) => s.skills);

  const activeDef = activeCourse
    ? COURSE_CATALOG.find((c) => c.id === activeCourse.courseId)
    : null;

  const suggestion = computeSuggestion(activeCourse, completedCourses, checking);

  const filteredCourses = activeField
    ? COURSE_CATALOG.filter((c) => c.field === activeField)
    : COURSE_CATALOG;

  function handleSession() {
    const r = completeSession();
    if (!r.success) {
      setSessErr(r.reason ?? "خطا");
      setTimeout(() => setSessErr(null), 2000);
    }
  }

  function handleEnroll() {
    if (!enrollSheet) return;
    const r = enrollCourse(enrollSheet.id, enrollSponsored);
    if (r.success) {
      setSheet(null); setSpon(false); setEnrErr(null);
    } else {
      setEnrErr(r.reason ?? "خطا");
    }
  }

  // Skills from game state (dynamic)
  const hardSkills = skills?.hard ?? [];
  const softSkills = skills?.soft ?? [];

  const TABS: { key: LibTab; label: string }[] = [
    { key: "path",    label: "🗺 مسیر" },
    { key: "courses", label: "📖 دوره‌ها" },
    { key: "skills",  label: "💡 مهارت‌ها" },
  ];

  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 14,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChevronRight size={18} color="rgba(255,255,255,0.8)" />
            </div>
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: "white", display: "flex", alignItems: "center", gap: 6 }}>
              <span>📚</span> کتابخانه
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>مرکز رشد و یادگیری</div>
          </div>
          {/* Balance pill */}
          <div style={{
            display: "flex", gap: 12, padding: "7px 12px", borderRadius: 14,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <MiniStat icon="💰" value={formatMoney(checking)} color="#4ade80" />
            <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
            <MiniStat icon="⚡" value={toPersian(player.energy)} color="#facc15" />
          </div>
        </div>

        {/* ── Study Streak pill (if active course) ── */}
        {activeCourse && activeDef && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 14px", borderRadius: 14, marginBottom: 10,
            background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.18)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>📚</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#a78bfa" }}>
                  Study Streak — روز {toPersian(activeCourse.currentDay)}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                  هر روز مطالعه کن، سریع‌تر پیشرفت کن
                </div>
              </div>
            </div>
            <div style={{
              fontSize: 10, fontWeight: 900, padding: "4px 10px", borderRadius: 10,
              background: "rgba(139,92,246,0.2)", color: "#c4b5fd",
              border: "1px solid rgba(139,92,246,0.3)",
            }}>
              +{toPersian(Math.min(activeCourse.currentDay * 2, 20))}٪ XP
            </div>
          </div>
        )}

        {/* ── Active Course Hero Card ── */}
        {activeCourse && activeDef && (
          <HeroCard
            course={activeCourse}
            def={activeDef}
            playerEnergy={player.energy}
            onSession={handleSession}
            onDrop={() => {
              if (confirm("انصراف از دوره؟ هزینه برنمی‌گرده!")) dropCourse();
            }}
            error={sessionError}
          />
        )}

        {/* ── Smart Suggestion ── */}
        {suggestion && (
          <div style={{
            padding: "12px 14px", borderRadius: 18, marginBottom: 14,
            background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.16)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#fbbf24", marginBottom: 2 }}>
                {suggestion.title}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                {suggestion.body}
              </div>
            </div>
            <button
              onClick={() => {
                if (suggestion.courseId) {
                  const c = COURSE_CATALOG.find((x) => x.id === suggestion.courseId);
                  if (c) { setSheet(c); setSpon(false); setEnrErr(null); }
                } else {
                  setTab("courses");
                }
              }}
              style={{
                flexShrink: 0, padding: "7px 12px", borderRadius: 10, border: "none",
                background: "rgba(250,204,21,0.2)", color: "#fbbf24",
                fontSize: 11, fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
              }}
            >
              {suggestion.cta} →
            </button>
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={{
          display: "flex", padding: 4, gap: 4, marginBottom: 14,
          background: "rgba(255,255,255,0.03)", borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: "9px 0", borderRadius: 13, border: "none",
              background: tab === t.key
                ? "linear-gradient(180deg, #22c55e, #16a34a)"
                : "transparent",
              color: tab === t.key ? "white" : "rgba(255,255,255,0.4)",
              fontSize: 12, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
              boxShadow: tab === t.key ? "0 4px 12px rgba(34,197,94,0.3)" : "none",
              transition: "all 0.18s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ══ TAB: Learning Path ══ */}
        {tab === "path" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {LEARNING_PATHS.map((path) => (
              <div key={path.id} style={{
                borderRadius: 20, overflow: "hidden",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              }}>
                {/* Path header */}
                <div style={{
                  padding: "12px 14px",
                  background: `linear-gradient(135deg, ${path.color}12, transparent)`,
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 18 }}>{path.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: path.color }}>{path.label}</span>
                  <span style={{
                    marginRight: "auto", fontSize: 9, fontWeight: 700, padding: "2px 7px",
                    borderRadius: 8, background: `${path.color}18`, color: path.color,
                    border: `1px solid ${path.color}25`,
                  }}>
                    {toPersian(path.nodes.filter((n) => completedCourses.includes(n.courseId)).length)}/
                    {toPersian(path.nodes.length)} تموم شده
                  </span>
                </div>

                {/* Nodes */}
                <div style={{ padding: "10px 14px 14px" }}>
                  {path.nodes.map((node, idx) => {
                    const done    = completedCourses.includes(node.courseId);
                    const isActive= activeCourse?.courseId === node.courseId;
                    const prevDone= idx === 0 || completedCourses.includes(path.nodes[idx - 1].courseId);
                    const locked  = !done && !isActive && !prevDone;
                    const def     = COURSE_CATALOG.find((c) => c.id === node.courseId);
                    return (
                      <div key={node.courseId}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "9px 10px", borderRadius: 14,
                          background: done
                            ? "rgba(74,222,128,0.06)"
                            : isActive
                              ? `${path.color}10`
                              : locked
                                ? "rgba(255,255,255,0.02)"
                                : "rgba(255,255,255,0.04)",
                          border: `1px solid ${done
                            ? "rgba(74,222,128,0.18)"
                            : isActive
                              ? `${path.color}30`
                              : "rgba(255,255,255,0.06)"}`,
                          opacity: locked ? 0.45 : 1,
                        }}>
                          {/* Status icon */}
                          <div style={{
                            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: done ? 16 : 18,
                            background: done
                              ? "rgba(74,222,128,0.15)"
                              : isActive ? `${path.color}20` : "rgba(255,255,255,0.05)",
                            border: `1px solid ${done
                              ? "rgba(74,222,128,0.25)"
                              : isActive ? `${path.color}35` : "rgba(255,255,255,0.08)"}`,
                          }}>
                            {done ? "✅" : isActive ? "📖" : locked ? "🔒" : (def?.emoji ?? "📘")}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 12, fontWeight: 800,
                              color: done ? "#4ade80" : isActive ? path.color : "rgba(255,255,255,0.8)",
                              marginBottom: 2,
                            }}>
                              {def?.name ?? node.courseId}
                            </div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                              {node.jobUnlock}
                            </div>
                          </div>

                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{
                              fontSize: 11, fontWeight: 800,
                              color: done ? "#4ade80" : isActive ? path.color : "rgba(255,255,255,0.5)",
                            }}>
                              {node.income}
                            </div>
                            {!done && !isActive && !locked && (
                              <button
                                onClick={() => {
                                  const c = COURSE_CATALOG.find((x) => x.id === node.courseId);
                                  if (c) { setSheet(c); setSpon(false); setEnrErr(null); }
                                }}
                                style={{
                                  marginTop: 3, padding: "3px 9px", borderRadius: 8, border: "none",
                                  background: `${path.color}25`, color: path.color,
                                  fontSize: 10, fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
                                }}
                              >
                                ثبت‌نام
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Connector line */}
                        {idx < path.nodes.length - 1 && (
                          <div style={{
                            width: 2, height: 10, borderRadius: 1, margin: "3px auto",
                            background: completedCourses.includes(node.courseId)
                              ? "rgba(74,222,128,0.3)"
                              : "rgba(255,255,255,0.08)",
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ TAB: Courses Grid ══ */}
        {tab === "courses" && (
          <>
            {/* Completion counter */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 10,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>
                {toPersian(completedCourses.length)}/{toPersian(COURSE_CATALOG.length)} دوره گذرانده
              </div>
              {/* Field filter chips */}
              <div style={{ display: "flex", gap: 5, overflowX: "auto" }}>
                <FieldChip label="همه" active={!activeField} color="#6366f1"
                  onClick={() => setField(null)} />
                {COURSE_FIELDS.map((f) => (
                  <FieldChip key={f.key} label={f.label} active={activeField === f.key}
                    color={f.color} onClick={() => setField(activeField === f.key ? null : f.key)} />
                ))}
              </div>
            </div>

            {/* 2-column grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {filteredCourses.map((course) => {
                const done     = completedCourses.includes(course.id);
                const isActive = activeCourse?.courseId === course.id;
                const field    = COURSE_FIELDS.find((f) => f.key === course.field);
                return (
                  <button
                    key={course.id}
                    onClick={() => { if (!done && !isActive) { setSheet(course); setSpon(false); setEnrErr(null); } }}
                    style={{
                      padding: "12px 10px", borderRadius: 18,
                      background: done
                        ? "rgba(74,222,128,0.05)"
                        : isActive
                          ? `${field?.color ?? "#60a5fa"}10`
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${done
                        ? "rgba(74,222,128,0.2)"
                        : isActive
                          ? `${field?.color ?? "#60a5fa"}30`
                          : "rgba(255,255,255,0.07)"}`,
                      cursor: done || isActive ? "default" : "pointer",
                      textAlign: "right", fontFamily: "inherit",
                      minHeight: 110,
                      display: "flex", flexDirection: "column", justifyContent: "space-between",
                      position: "relative",
                    }}
                  >
                    {/* Sponsored badge */}
                    {course.sponsoredVariant && (
                      <span style={{
                        position: "absolute", top: 7, left: 7,
                        fontSize: 8, fontWeight: 900, padding: "1px 5px", borderRadius: 6,
                        background: "linear-gradient(135deg, #D4A843, #F0C966)", color: "white",
                      }}>✦</span>
                    )}

                    <div>
                      <div style={{ fontSize: 26, marginBottom: 5 }}>{course.emoji}</div>
                      <div style={{
                        fontSize: 11, fontWeight: 800, lineHeight: 1.3, marginBottom: 3,
                        color: done ? "#4ade80" : isActive ? (field?.color ?? "white") : "rgba(255,255,255,0.88)",
                        overflow: "hidden", display: "-webkit-box",
                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      } as React.CSSProperties}>
                        {course.name}
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>
                        +{toPersian(course.xpReward)} XP · {toPersian(course.totalDays)} روز
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 7 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#fbbf24" }}>
                        {formatMoney(course.cost)}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 900, padding: "2px 8px", borderRadius: 8,
                        background: done
                          ? "rgba(74,222,128,0.14)"
                          : isActive
                            ? `${field?.color ?? "#60a5fa"}20`
                            : "rgba(34,197,94,0.12)",
                        color: done ? "#4ade80" : isActive ? (field?.color ?? "#60a5fa") : "#4ade80",
                        border: `1px solid ${done ? "rgba(74,222,128,0.2)" : isActive ? `${field?.color ?? "#60a5fa"}30` : "rgba(74,222,128,0.15)"}`,
                      }}>
                        {done ? "✓ تموم" : isActive ? "📖 فعال" : "ثبت‌نام"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ══ TAB: Skills ══ */}
        {tab === "skills" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Skill Radar */}
            <SkillRadar
              skills={hardSkills}
              allSkills={[...hardSkills, ...softSkills]}
            />

            {/* Hard skills */}
            <SectionLabel icon="💻" label="مهارت‌های فنی" />
            {hardSkills.map((sk) => <SkillRow key={sk.name} skill={sk} color="#3b82f6" />)}

            {/* Soft skills */}
            <div style={{ marginTop: 6 }} />
            <SectionLabel icon="🤝" label="مهارت‌های نرم" />
            {softSkills.map((sk) => <SkillRow key={sk.name} skill={sk} color="#a855f7" />)}
          </div>
        )}
      </div>

      {/* ══ Enroll Bottom Sheet ══ */}
      {enrollSheet && (
        <EnrollSheet
          course={enrollSheet}
          sponsored={enrollSponsored}
          onSponsoredToggle={setSpon}
          checking={checking}
          hasActiveCourse={!!activeCourse}
          onEnroll={handleEnroll}
          onClose={() => { setSheet(null); setEnrErr(null); }}
          error={enrollError}
        />
      )}

      <BottomNav />
    </div>
  );
}

// ─── Hero Card ─────────────────────────────────────────────────────────────────
function HeroCard({ course, def, playerEnergy, onSession, onDrop, error }: {
  course: { courseId: string; isSponsored: boolean; currentDay: number; sessionsCompletedToday: number };
  def: CourseDefinition;
  playerEnergy: number;
  onSession: () => void;
  onDrop: () => void;
  error: string | null;
}) {
  const sponsored  = course.isSponsored ? def.sponsoredVariant : undefined;
  const progress   = Math.round(((course.currentDay - 1) / def.totalDays) * 100);
  const energyCost = sponsored ? sponsored.energyCostPerSession : def.energyCostPerSession;
  const allDone    = course.sessionsCompletedToday >= def.sessionsPerDay;
  const canStudy   = !allDone && playerEnergy >= energyCost;
  const field      = COURSE_FIELDS.find((f) => f.key === def.field);
  const accent     = course.isSponsored ? "#D4A843" : (field?.color ?? "#60a5fa");

  return (
    <div style={{
      borderRadius: 24, padding: "18px 16px", marginBottom: 12,
      background: course.isSponsored
        ? "linear-gradient(145deg, #2a2010, #3d2f18 60%, #4a3820)"
        : "linear-gradient(145deg, #0F2340, #1B3A5C 60%, #263E66)",
      border: `1px solid ${accent}28`,
      boxShadow: "0 8px 32px rgba(10,22,40,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "relative" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>📖 دوره فعلی</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "white", marginBottom: 2 }}>
              {def.emoji} {sponsored ? sponsored.displayName : def.name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
                روز {toPersian(course.currentDay)} / {toPersian(def.totalDays)}
              </span>
              {course.isSponsored && sponsored && (
                <span style={{
                  fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 6,
                  background: "linear-gradient(135deg, #D4A843, #F0C966)", color: "white",
                }}>✦ {sponsored.brandName}</span>
              )}
            </div>
          </div>
          {/* Progress ring */}
          <div style={{ width: 52, height: 52, flexShrink: 0, position: "relative" }}>
            <svg width={52} height={52} style={{ transform: "rotate(-90deg)" }}>
              <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
              <circle cx="26" cy="26" r="22" fill="none" stroke={accent} strokeWidth="3.5"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - progress / 100)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: accent,
            }}>{toPersian(progress)}٪</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          background: "rgba(255,255,255,0.08)", borderRadius: 99,
          height: 6, overflow: "hidden", marginBottom: 12,
        }}>
          <div style={{
            width: `${progress}%`, height: "100%", borderRadius: 99,
            background: `linear-gradient(90deg, ${accent}, ${accent}cc)`,
            transition: "width 0.5s ease",
          }} />
        </div>

        {/* Session buttons */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
            سشن‌های امروز ({toPersian(course.sessionsCompletedToday)}/{toPersian(def.sessionsPerDay)})
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: def.sessionsPerDay }).map((_, i) => {
              const done = i < course.sessionsCompletedToday;
              const next = i === course.sessionsCompletedToday;
              return (
                <button key={i}
                  onClick={() => next && onSession()}
                  disabled={!next}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 14,
                    background: done
                      ? "rgba(74,222,128,0.15)"
                      : next && canStudy
                        ? `linear-gradient(135deg, ${accent}40, ${accent}20)`
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${done
                      ? "rgba(74,222,128,0.25)"
                      : next && canStudy
                        ? `${accent}40`
                        : "rgba(255,255,255,0.07)"}`,
                    color: done ? "#4ade80" : next && canStudy ? accent : "rgba(255,255,255,0.25)",
                    fontSize: 11, fontWeight: 800, fontFamily: "inherit",
                    cursor: next && canStudy ? "pointer" : "default",
                  }}
                >
                  {done ? "✓ تموم" : next ? `▶ -${toPersian(energyCost)}⚡` : "🔒 قفل"}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div style={{
            padding: "6px 12px", borderRadius: 10, marginBottom: 8,
            background: "rgba(239,68,68,0.12)", fontSize: 11, color: "#f87171",
            fontWeight: 700, textAlign: "center", border: "1px solid rgba(239,68,68,0.2)",
          }}>{error}</div>
        )}

        {allDone && (
          <div style={{
            padding: "8px 12px", borderRadius: 12, marginBottom: 10,
            background: "rgba(34,197,94,0.12)", fontSize: 11, color: "#4ade80",
            fontWeight: 700, textAlign: "center", border: "1px solid rgba(34,197,94,0.2)",
          }}>🎉 امروز کامل! فردا ادامه بده</div>
        )}

        {/* Drop */}
        <button onClick={onDrop} style={{
          width: "100%", padding: "7px 0", borderRadius: 12,
          border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.05)",
          color: "#f87171", fontSize: 10, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
        }}>انصراف از دوره</button>
      </div>
    </div>
  );
}

// ─── Skill Row ─────────────────────────────────────────────────────────────────
function SkillRow({ skill, color }: {
  skill: { name: string; emoji: string; level: number; xp: number; maxXp: number };
  color: string;
}) {
  const pct    = Math.min(100, Math.round((skill.xp / (skill.maxXp || 1)) * 100));
  const impact = SKILL_IMPACT[skill.name];
  return (
    <div style={{
      padding: "12px 14px", borderRadius: 18,
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>{skill.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.88)" }}>
              {skill.name}
            </span>
            <span style={{
              fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 8,
              background: `${color}18`, color, border: `1px solid ${color}28`,
            }}>Lv.{toPersian(skill.level)}</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
            {toPersian(skill.xp)} / {toPersian(skill.maxXp)} XP
          </div>
        </div>
        {/* Dot array */}
        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: 2,
              background: i < skill.level ? color : "rgba(255,255,255,0.08)",
              boxShadow: i < skill.level ? `0 0 4px ${color}50` : "none",
            }} />
          ))}
        </div>
      </div>

      {/* XP bar */}
      <div style={{
        background: "rgba(255,255,255,0.06)", borderRadius: 99,
        height: 5, overflow: "hidden", marginBottom: impact ? 8 : 0,
      }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 99,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          transition: "width 0.5s ease",
        }} />
      </div>

      {/* Impact badges */}
      {impact && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {impact.income && (
            <span style={{
              fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 7,
              background: "rgba(74,222,128,0.1)", color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.18)",
            }}>💰 {impact.income}</span>
          )}
          {impact.other && (
            <span style={{
              fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 7,
              background: "rgba(96,165,250,0.1)", color: "#60a5fa",
              border: "1px solid rgba(96,165,250,0.18)",
            }}>{impact.other}</span>
          )}
          {impact.unlock?.map((u) => (
            <span key={u} style={{
              fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 7,
              background: "rgba(250,204,21,0.08)", color: "#fbbf24",
              border: "1px solid rgba(250,204,21,0.15)",
            }}>🔓 {u}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Enroll Bottom Sheet ────────────────────────────────────────────────────────
function EnrollSheet({ course, sponsored, onSponsoredToggle, checking, hasActiveCourse, onEnroll, onClose, error }: {
  course: CourseDefinition;
  sponsored: boolean;
  onSponsoredToggle: (v: boolean) => void;
  checking: number;
  hasActiveCourse: boolean;
  onEnroll: () => void;
  onClose: () => void;
  error: string | null;
}) {
  const sv        = course.sponsoredVariant;
  const cost      = sponsored && sv ? sv.cost : course.cost;
  const xp        = sponsored && sv ? sv.xpReward : course.xpReward;
  const energy    = sponsored && sv ? sv.energyCostPerSession : course.energyCostPerSession;
  const skillBoost= sponsored && sv ? sv.skillBoost : course.skillBoost;
  const canAfford = checking >= cost;
  const field     = COURSE_FIELDS.find((f) => f.key === course.field);
  const pathNode  = LEARNING_PATHS
    .flatMap((p) => p.nodes.map((n) => ({ ...n, pathColor: p.color })))
    .find((n) => n.courseId === course.id);

  return (
    <div className="anim-backdrop-in" style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="anim-sheet-up" style={{
        background: "linear-gradient(180deg, #141428 0%, #0a0e20 100%)",
        borderRadius: "28px 28px 0 0", padding: "0 20px 36px",
        border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Course title */}
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>{course.emoji}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "white", marginBottom: 4 }}>
            {sponsored && sv ? sv.displayName : course.name}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            {course.fieldLabel} · {toPersian(course.totalDays)} روز · {toPersian(course.sessionsPerDay)} سشن/روز
          </div>
        </div>

        {/* What you unlock */}
        {pathNode && (
          <div style={{
            padding: "10px 14px", borderRadius: 14, marginBottom: 12,
            background: `${pathNode.pathColor}0D`, border: `1px solid ${pathNode.pathColor}22`,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>🔓</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: pathNode.pathColor }}>
                پس از اتمام — {pathNode.jobUnlock}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>درآمد: {pathNode.income}</div>
            </div>
          </div>
        )}

        {/* Sponsored toggle */}
        {sv && (
          <div style={{
            padding: 5, borderRadius: 14, marginBottom: 12,
            background: "rgba(255,255,255,0.03)",
            border: sponsored ? "1px solid rgba(212,168,67,0.25)" : "1px solid rgba(255,255,255,0.06)",
            display: "flex", gap: 4,
          }}>
            {[{ label: "عادی", active: !sponsored, gold: false }, { label: `✦ ${sv.brandName}`, active: sponsored, gold: true }].map((opt, i) => (
              <button key={i} onClick={() => onSponsoredToggle(opt.gold)} style={{
                flex: 1, padding: "8px 0", borderRadius: 10, border: "none",
                background: opt.active
                  ? opt.gold ? "linear-gradient(135deg, #D4A843, #F0C966)" : "rgba(255,255,255,0.09)"
                  : "transparent",
                color: opt.active ? "white" : "rgba(255,255,255,0.4)",
                fontSize: 11, fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
              }}>{opt.label}</button>
            ))}
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[
            { icon: "💰", label: "هزینه",         val: formatMoney(cost) },
            { icon: "✨", label: "XP کل",          val: `+${toPersian(xp)}` },
            { icon: "⚡", label: "انرژی/سشن",     val: `-${toPersian(energy)}` },
            { icon: "📈", label: "تقویت مهارت",   val: skillBoost ? `+${toPersian(skillBoost.xpGain)} XP` : "—" },
          ].map((s) => (
            <div key={s.label} style={{
              padding: "9px 12px", borderRadius: 14,
              background: sponsored ? "rgba(212,168,67,0.06)" : "rgba(255,255,255,0.04)",
              border: sponsored ? "1px solid rgba(212,168,67,0.12)" : "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>{s.icon} {s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: sponsored ? "#F0C966" : "white" }}>{s.val}</div>
            </div>
          ))}
        </div>

        {hasActiveCourse && (
          <div style={{
            padding: "8px 14px", borderRadius: 12, marginBottom: 10,
            background: "rgba(251,146,60,0.1)", color: "#fb923c",
            fontSize: 11, fontWeight: 700, textAlign: "center",
            border: "1px solid rgba(251,146,60,0.2)",
          }}>اول دوره فعلیت رو تموم کن 📖</div>
        )}

        {error && (
          <div style={{
            padding: "8px 14px", borderRadius: 12, marginBottom: 10,
            background: "rgba(239,68,68,0.1)", color: "#f87171",
            fontSize: 11, fontWeight: 700, textAlign: "center",
            border: "1px solid rgba(239,68,68,0.2)",
          }}>{error}</div>
        )}

        <button
          onClick={onEnroll}
          disabled={!canAfford || hasActiveCourse}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 20, border: "none",
            background: !canAfford || hasActiveCourse
              ? "rgba(255,255,255,0.05)"
              : sponsored
                ? "linear-gradient(135deg, #D4A843, #F0C966)"
                : `linear-gradient(135deg, ${field?.color ?? "#3b82f6"}, ${field?.color ?? "#3b82f6"}cc)`,
            color: !canAfford || hasActiveCourse ? "rgba(255,255,255,0.3)" : "white",
            fontSize: 14, fontWeight: 900, fontFamily: "inherit",
            cursor: canAfford && !hasActiveCourse ? "pointer" : "not-allowed",
            boxShadow: canAfford && !hasActiveCourse ? `0 4px 14px ${field?.color ?? "#3b82f6"}40` : "none",
          }}
        >
          {hasActiveCourse ? "دوره دیگه‌ای داری 📖" : !canAfford ? "موجودی کافی نیست 😤" : `ثبت‌نام · ${formatMoney(cost)}`}
        </button>
      </div>
    </div>
  );
}

// ─── Micro components ──────────────────────────────────────────────────────────
function MiniStat({ icon, value, color }: { icon: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 1 }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function SectionLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.4)",
      display: "flex", alignItems: "center", gap: 6, marginBottom: 2,
    }}><span>{icon}</span> {label}</div>
  );
}

function FieldChip({ label, active, color, onClick }: {
  label: string; active: boolean; color: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, padding: "5px 10px", borderRadius: 10,
      background: active ? `${color}20` : "rgba(255,255,255,0.04)",
      color: active ? color : "rgba(255,255,255,0.45)",
      fontSize: 10, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
      border: `1px solid ${active ? `${color}35` : "rgba(255,255,255,0.07)"}`,
    } as React.CSSProperties}>{label}</button>
  );
}
