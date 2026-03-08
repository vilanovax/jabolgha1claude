"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import { skills, COURSE_CATALOG, COURSE_FIELDS, toPersian, formatMoney } from "@/data/mock";
import type { CourseDefinition } from "@/data/mock";
import { useGameStore } from "@/stores/gameStore";

export default function SkillsPage() {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [enrollSheet, setEnrollSheet] = useState<CourseDefinition | null>(null);
  const [enrollSponsored, setEnrollSponsored] = useState(false);
  const [enrollResult, setEnrollResult] = useState<string | null>(null);

  const player = useGameStore((s) => s.player);
  const bank = useGameStore((s) => s.bank);
  const completedCourses = useGameStore((s) => s.completedCourses);
  const activeCourse = useGameStore((s) => s.activeCourse);
  const enrollCourse = useGameStore((s) => s.enrollCourse);
  const completeSession = useGameStore((s) => s.completeSession);
  const dropCourse = useGameStore((s) => s.dropCourse);

  const activeDef = activeCourse
    ? COURSE_CATALOG.find((c) => c.id === activeCourse.courseId)
    : null;

  const filteredCourses = activeField
    ? COURSE_CATALOG.filter((c) => c.field === activeField)
    : COURSE_CATALOG;

  const handleEnroll = () => {
    if (!enrollSheet) return;
    const result = enrollCourse(enrollSheet.id, enrollSponsored);
    if (result.success) {
      setEnrollSheet(null);
      setEnrollSponsored(false);
      setEnrollResult(null);
    } else {
      setEnrollResult(result.reason ?? "خطا");
    }
  };

  const handleSession = () => {
    const result = completeSession();
    if (!result.success) {
      setEnrollResult(result.reason ?? "خطا");
      setTimeout(() => setEnrollResult(null), 2000);
    }
  };

  return (
    <div className="game-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>
        {/* Sub-page header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 14,
              background: "linear-gradient(145deg, #0F2340, #1B3A5C)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 14px rgba(10,22,40,0.4)",
            }}>
              <ChevronRight size={18} color="rgba(255,255,255,0.8)" />
            </div>
          </Link>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 20 }}>📚</span> مهارت‌ها و دوره‌ها
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>یادگیری، ارتقاء و دوره‌های آموزشی</div>
          </div>
        </div>

        {/* ─── Active Course Panel ─── */}
        {activeCourse && activeDef && (
          <ActiveCoursePanel
            course={activeCourse}
            def={activeDef}
            playerEnergy={player.energy}
            onSession={handleSession}
            onDrop={() => {
              if (confirm("مطمئنی می‌خوای انصراف بدی؟ هزینه ثبت‌نام برنمی‌گرده!")) {
                dropCourse();
              }
            }}
            errorMessage={enrollResult}
          />
        )}

        {/* ─── Course Catalog ─── */}
        <div style={{
          borderRadius: 24, marginBottom: 14,
          background: "white",
          border: "1px solid rgba(0,0,0,0.04)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "14px 16px 10px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1e293b" }}>
              📖 کاتالوگ دوره‌ها
            </div>
            <span style={{
              fontSize: 9, fontWeight: 700, color: "#64748b",
              padding: "2px 8px", borderRadius: 8,
              background: "#f1f5f9",
            }}>
              {toPersian(completedCourses.length)}/{toPersian(COURSE_CATALOG.length)} گذرانده
            </span>
          </div>

          {/* Field filters */}
          <div style={{
            display: "flex", gap: 6, padding: "0 16px 12px",
            overflowX: "auto",
          }}>
            <FilterChip
              label="همه"
              emoji="📚"
              active={activeField === null}
              color="#6366f1"
              onClick={() => setActiveField(null)}
            />
            {COURSE_FIELDS.map((f) => (
              <FilterChip
                key={f.key}
                label={f.label}
                emoji={f.emoji}
                active={activeField === f.key}
                color={f.color}
                onClick={() => setActiveField(activeField === f.key ? null : f.key)}
              />
            ))}
          </div>

          {/* Course list */}
          <div style={{ padding: "0 12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredCourses.map((course) => {
              const isCompleted = completedCourses.includes(course.id);
              const isActive = activeCourse?.courseId === course.id;

              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  isCompleted={isCompleted}
                  isActive={isActive}
                  hasActiveCourse={!!activeCourse}
                  playerMoney={bank.checking}
                  onEnroll={() => {
                    setEnrollSheet(course);
                    setEnrollSponsored(false);
                    setEnrollResult(null);
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* ─── Skills sections ─── */}
        <SkillSection title="💻 مهارت‌های فنی" items={skills.hard} color="#3b82f6" />
        <SkillSection title="🤝 مهارت‌های نرم" items={skills.soft} color="#a855f7" />
      </div>

      {/* ─── Enroll Bottom Sheet ─── */}
      {enrollSheet && (
        <EnrollBottomSheet
          course={enrollSheet}
          sponsoredMode={enrollSponsored}
          onSponsoredToggle={setEnrollSponsored}
          playerMoney={bank.checking}
          onEnroll={handleEnroll}
          onClose={() => { setEnrollSheet(null); setEnrollResult(null); }}
          errorMessage={enrollResult}
        />
      )}

      <BottomNav />
    </div>
  );
}

// ─── Active Course Panel ─────────────────────

function ActiveCoursePanel({ course, def, playerEnergy, onSession, onDrop, errorMessage }: {
  course: { courseId: string; isSponsored: boolean; currentDay: number; sessionsCompletedToday: number };
  def: CourseDefinition;
  playerEnergy: number;
  onSession: () => void;
  onDrop: () => void;
  errorMessage: string | null;
}) {
  const sponsored = course.isSponsored ? def.sponsoredVariant : undefined;
  const totalProgress = Math.round(((course.currentDay - 1) / def.totalDays) * 100);
  const allSessionsDone = course.sessionsCompletedToday >= def.sessionsPerDay;
  const energyCost = sponsored ? sponsored.energyCostPerSession : def.energyCostPerSession;
  const canDoSession = !allSessionsDone && playerEnergy >= energyCost;

  return (
    <div style={{
      borderRadius: 24, padding: "18px 16px", marginBottom: 14,
      background: course.isSponsored
        ? "linear-gradient(145deg, #2a2010, #3d2f18 60%, #4a3820)"
        : "linear-gradient(145deg, #0F2340, #1B3A5C 60%, #263E66)",
      border: course.isSponsored
        ? "1px solid rgba(212,168,67,0.2)"
        : "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 8px 32px rgba(10,22,40,0.3)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
              📖 دوره فعلی
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 3 }}>
              {def.emoji} {sponsored ? sponsored.displayName : def.name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                روز {toPersian(course.currentDay)} از {toPersian(def.totalDays)}
              </span>
              {course.isSponsored && sponsored && (
                <span style={{
                  fontSize: 8, fontWeight: 800,
                  padding: "2px 6px", borderRadius: 6,
                  background: "linear-gradient(135deg, #D4A843, #F0C966)",
                  color: "white",
                }}>
                  ✦ {sponsored.brandName}
                </span>
              )}
            </div>
          </div>
          {/* Progress ring */}
          <div style={{ width: 52, height: 52, flexShrink: 0, position: "relative" }}>
            <svg width={52} height={52} style={{ transform: "rotate(-90deg)" }}>
              <circle cx="26" cy="26" r="22" fill="none"
                stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
              <circle cx="26" cy="26" r="22" fill="none"
                stroke={course.isSponsored ? "#D4A843" : "#60a5fa"} strokeWidth="3.5"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - totalProgress / 100)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: course.isSponsored ? "#F0C966" : "#93c5fd",
            }}>
              {toPersian(totalProgress)}٪
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 6,
            overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{
              width: `${totalProgress}%`, height: "100%", borderRadius: 99,
              background: course.isSponsored
                ? "linear-gradient(90deg, #D4A843, #F0C966)"
                : "linear-gradient(90deg, #3b82f6, #60a5fa)",
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        {/* Sessions */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
            session‌های امروز ({toPersian(course.sessionsCompletedToday)}/{toPersian(def.sessionsPerDay)})
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: def.sessionsPerDay }).map((_, i) => {
              const done = i < course.sessionsCompletedToday;
              const next = i === course.sessionsCompletedToday;
              return (
                <button key={i}
                  className={done ? "game-btn game-btn-done" : next ? "game-btn" : ""}
                  onClick={() => next && onSession()}
                  disabled={!next}
                  style={{
                    flex: 1, textAlign: "center", fontSize: 11, fontWeight: 700,
                    fontFamily: "inherit", cursor: next ? "pointer" : "default",
                    padding: "8px 0",
                    ...(!done && !next ? {
                      background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)",
                      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14,
                    } : {}),
                  }}
                >
                  {done ? "✓ تموم" : next ? `▶ -${toPersian(energyCost)}⚡` : "🔒 قفل"}
                </button>
              );
            })}
          </div>

          {/* Error message */}
          {errorMessage && (
            <div style={{
              marginTop: 8, padding: "6px 12px", borderRadius: 10,
              background: "rgba(239,68,68,0.15)", fontSize: 11, color: "#f87171",
              fontWeight: 700, textAlign: "center",
              border: "1px solid rgba(239,68,68,0.25)",
            }}>
              {errorMessage}
            </div>
          )}

          {allSessionsDone && (
            <div style={{
              marginTop: 8, padding: "8px 12px",
              background: "rgba(34,197,94,0.15)", borderRadius: 14,
              fontSize: 12, color: "#4ade80", fontWeight: 700, textAlign: "center",
              border: "1px solid rgba(34,197,94,0.25)",
            }}>
              🎉 امروز کامل! فردا ادامه بده
            </div>
          )}
        </div>

        {/* Drop button */}
        <button onClick={onDrop} style={{
          width: "100%", padding: "8px 0", borderRadius: 14,
          border: "1px solid rgba(239,68,68,0.15)",
          background: "rgba(239,68,68,0.06)",
          color: "#f87171",
          fontSize: 11, fontWeight: 700,
          fontFamily: "inherit", cursor: "pointer",
        }}>
          انصراف از دوره
        </button>
      </div>
    </div>
  );
}

// ─── Course Card ─────────────────────────────

function CourseCard({ course, isCompleted, isActive, hasActiveCourse, playerMoney, onEnroll }: {
  course: CourseDefinition;
  isCompleted: boolean;
  isActive: boolean;
  hasActiveCourse: boolean;
  playerMoney: number;
  onEnroll: () => void;
}) {
  const fieldInfo = COURSE_FIELDS.find((f) => f.key === course.field);
  const canAfford = playerMoney >= course.cost;

  return (
    <div style={{
      padding: "12px 14px", borderRadius: 18,
      background: isCompleted
        ? "rgba(34,197,94,0.04)"
        : isActive
          ? "rgba(59,130,246,0.04)"
          : "rgba(0,0,0,0.01)",
      border: isCompleted
        ? "1px solid rgba(34,197,94,0.15)"
        : isActive
          ? "1.5px solid rgba(59,130,246,0.2)"
          : "1px solid rgba(0,0,0,0.06)",
      opacity: isCompleted ? 0.7 : 1,
    }}>
      {/* Top row: name + field + sponsor dot */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 6,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>{course.emoji}</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                {course.name}
              </span>
              {course.sponsoredVariant && (
                <span style={{
                  fontSize: 7, fontWeight: 800,
                  padding: "1px 5px", borderRadius: 4,
                  background: "rgba(212,168,67,0.12)",
                  color: "#D4A843",
                  border: "1px solid rgba(212,168,67,0.2)",
                }}>
                  ✦
                </span>
              )}
            </div>
            <span style={{
              fontSize: 9, fontWeight: 600,
              color: fieldInfo?.color ?? "#64748b",
            }}>
              {fieldInfo?.emoji} {course.fieldLabel}
            </span>
          </div>
        </div>

        {/* Status */}
        {isCompleted ? (
          <span style={{
            fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 10,
            background: "rgba(34,197,94,0.1)", color: "#16a34a",
            border: "1px solid rgba(34,197,94,0.2)",
          }}>
            ✅ گذرانده
          </span>
        ) : isActive ? (
          <span style={{
            fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 10,
            background: "rgba(59,130,246,0.1)", color: "#3b82f6",
            border: "1px solid rgba(59,130,246,0.2)",
          }}>
            📖 در حال یادگیری
          </span>
        ) : null}
      </div>

      {/* Info chips */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
        <InfoChip text={`${toPersian(course.totalDays)} روز`} emoji="📅" />
        <InfoChip text={`${toPersian(course.sessionsPerDay)} session/روز`} emoji="📝" />
        <InfoChip text={`+${toPersian(course.xpReward)} XP`} emoji="✨" />
        <InfoChip text={formatMoney(course.cost)} emoji="💰" />
        <InfoChip text={`-${toPersian(course.energyCostPerSession)}⚡/session`} emoji="⚡" />
      </div>

      {/* Enroll button */}
      {!isCompleted && !isActive && (
        <button
          onClick={onEnroll}
          disabled={hasActiveCourse}
          style={{
            width: "100%", padding: "8px 0", borderRadius: 12,
            border: hasActiveCourse
              ? "1px solid rgba(0,0,0,0.06)"
              : canAfford
                ? `1px solid ${fieldInfo?.color ?? "#3b82f6"}40`
                : "1px solid rgba(239,68,68,0.15)",
            background: hasActiveCourse
              ? "rgba(0,0,0,0.02)"
              : canAfford
                ? `${fieldInfo?.color ?? "#3b82f6"}10`
                : "rgba(239,68,68,0.04)",
            color: hasActiveCourse
              ? "#94a3b8"
              : canAfford
                ? fieldInfo?.color ?? "#3b82f6"
                : "#f87171",
            fontSize: 11, fontWeight: 700,
            fontFamily: "inherit",
            cursor: hasActiveCourse ? "not-allowed" : "pointer",
          }}
        >
          {hasActiveCourse ? "اول دوره فعلی رو تموم کن" : canAfford ? "ثبت‌نام" : "موجودی کافی نیست"}
        </button>
      )}
    </div>
  );
}

// ─── Enroll Bottom Sheet ─────────────────────

function EnrollBottomSheet({ course, sponsoredMode, onSponsoredToggle, playerMoney, onEnroll, onClose, errorMessage }: {
  course: CourseDefinition;
  sponsoredMode: boolean;
  onSponsoredToggle: (v: boolean) => void;
  playerMoney: number;
  onEnroll: () => void;
  onClose: () => void;
  errorMessage: string | null;
}) {
  const sponsored = course.sponsoredVariant;
  const activeCost = sponsoredMode && sponsored ? sponsored.cost : course.cost;
  const activeXp = sponsoredMode && sponsored ? sponsored.xpReward : course.xpReward;
  const activeEnergy = sponsoredMode && sponsored ? sponsored.energyCostPerSession : course.energyCostPerSession;
  const activeSkill = sponsoredMode && sponsored ? sponsored.skillBoost : course.skillBoost;
  const canAfford = playerMoney >= activeCost;

  return (
    <div className="anim-backdrop-in" style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(8px)",
      zIndex: 200,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="anim-sheet-up" style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #0a0e27 100%)",
        borderRadius: "28px 28px 0 0",
        padding: "20px 16px 32px",
        border: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "none",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
      }}>
        {/* Drag handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: "rgba(255,255,255,0.15)",
          margin: "0 auto 16px",
        }} />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{course.emoji}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "white", marginBottom: 4 }}>
            {sponsoredMode && sponsored ? sponsored.displayName : course.name}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            {course.fieldLabel} · {toPersian(course.totalDays)} روز · {toPersian(course.sessionsPerDay)} session/روز
          </div>
        </div>

        {/* Sponsored toggle */}
        {sponsored && (
          <div style={{
            padding: 6, borderRadius: 14, marginBottom: 16,
            background: "rgba(255,255,255,0.03)",
            border: sponsoredMode ? "1px solid rgba(212,168,67,0.25)" : "1px solid rgba(255,255,255,0.06)",
            display: "flex", gap: 4,
          }}>
            <button onClick={() => onSponsoredToggle(false)} style={{
              flex: 1, padding: "8px 0", borderRadius: 10, border: "none",
              background: !sponsoredMode ? "rgba(255,255,255,0.08)" : "transparent",
              color: !sponsoredMode ? "white" : "rgba(255,255,255,0.4)",
              fontSize: 11, fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
            }}>
              عادی
            </button>
            <button onClick={() => onSponsoredToggle(true)} style={{
              flex: 1, padding: "8px 0", borderRadius: 10, border: "none",
              background: sponsoredMode ? "linear-gradient(135deg, #D4A843, #F0C966)" : "transparent",
              color: sponsoredMode ? "white" : "rgba(255,255,255,0.4)",
              fontSize: 11, fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
            }}>
              ✦ {sponsored.brandName}
            </button>
          </div>
        )}

        {/* Details */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          marginBottom: 16,
        }}>
          <DetailItem emoji="💰" label="هزینه" value={formatMoney(activeCost)}
            highlight={sponsoredMode} />
          <DetailItem emoji="✨" label="XP کل" value={`+${toPersian(activeXp)}`}
            highlight={sponsoredMode} />
          <DetailItem emoji="⚡" label="انرژی/session" value={`-${toPersian(activeEnergy)}`}
            highlight={sponsoredMode} />
          {activeSkill && (
            <DetailItem emoji="📈" label="تقویت مهارت"
              value={`+${toPersian(activeSkill.xpGain)} XP`}
              highlight={sponsoredMode} />
          )}
        </div>

        {/* Comparison for sponsored */}
        {sponsoredMode && sponsored && (
          <div style={{
            padding: "10px 14px", borderRadius: 14, marginBottom: 16,
            background: "rgba(212,168,67,0.06)",
            border: "1px solid rgba(212,168,67,0.15)",
            fontSize: 11, color: "#F0C966", fontWeight: 600, textAlign: "center",
          }}>
            ✦ نسخه اسپانسری: XP بیشتر، انرژی کمتر، تقویت مهارت قوی‌تر
          </div>
        )}

        {/* Error */}
        {errorMessage && (
          <div style={{
            padding: "8px 14px", borderRadius: 12, marginBottom: 12,
            background: "rgba(239,68,68,0.1)", color: "#f87171",
            fontSize: 11, fontWeight: 700, textAlign: "center",
            border: "1px solid rgba(239,68,68,0.2)",
          }}>
            {errorMessage}
          </div>
        )}

        {/* Enroll button */}
        <button onClick={onEnroll} style={{
          width: "100%", padding: "14px 0", borderRadius: 18,
          border: canAfford
            ? sponsoredMode
              ? "1.5px solid rgba(212,168,67,0.4)"
              : "1.5px solid rgba(59,130,246,0.3)"
            : "1.5px solid rgba(255,255,255,0.08)",
          background: canAfford
            ? sponsoredMode
              ? "linear-gradient(135deg, rgba(212,168,67,0.2), rgba(240,201,102,0.1))"
              : "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(96,165,250,0.1))"
            : "rgba(255,255,255,0.03)",
          color: canAfford ? "white" : "rgba(255,255,255,0.3)",
          fontSize: 14, fontWeight: 900, fontFamily: "inherit",
          cursor: canAfford ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          {canAfford
            ? `ثبت‌نام · ${formatMoney(activeCost)}`
            : "موجودی کافی نیست 😤"
          }
        </button>
      </div>
    </div>
  );
}

// ─── Helper Components ───────────────────────

function FilterChip({ label, emoji, active, color, onClick }: {
  label: string; emoji: string; active: boolean; color: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 12px", borderRadius: 12,
      background: active ? `${color}15` : "#f8fafc",
      color: active ? color : "#64748b",
      fontSize: 10, fontWeight: 700, fontFamily: "inherit",
      cursor: "pointer", whiteSpace: "nowrap",
      display: "flex", alignItems: "center", gap: 4,
      border: active ? `1px solid ${color}30` : "1px solid #e2e8f0",
    } as React.CSSProperties}>
      {emoji} {label}
    </button>
  );
}

function InfoChip({ text, emoji }: { text: string; emoji: string }) {
  return (
    <span style={{
      fontSize: 8, fontWeight: 700, color: "#64748b",
      padding: "2px 6px", borderRadius: 6,
      background: "#f1f5f9", border: "1px solid #e2e8f0",
      display: "inline-flex", alignItems: "center", gap: 2,
    }}>
      {emoji} {text}
    </span>
  );
}

function DetailItem({ emoji, label, value, highlight }: {
  emoji: string; label: string; value: string; highlight?: boolean;
}) {
  return (
    <div style={{
      padding: "10px 12px", borderRadius: 14,
      background: highlight ? "rgba(212,168,67,0.06)" : "rgba(255,255,255,0.04)",
      border: highlight ? "1px solid rgba(212,168,67,0.12)" : "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>
        {emoji} {label}
      </div>
      <div style={{
        fontSize: 13, fontWeight: 800,
        color: highlight ? "#F0C966" : "white",
      }}>
        {value}
      </div>
    </div>
  );
}

function SkillSection({ title, items, color }: {
  title: string;
  items: { name: string; emoji: string; level: number; xp: number; maxXp: number }[];
  color: string;
}) {
  return (
    <div style={{
      borderRadius: 24, marginBottom: 14,
      background: "white",
      border: "1px solid rgba(0,0,0,0.04)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "14px 16px 10px",
        fontSize: 14, fontWeight: 800, color: "#1e293b",
      }}>{title}</div>
      <div style={{ padding: "0 16px 14px" }}>
        {items.map((skill) => {
          const pct = Math.round((skill.xp / skill.maxXp) * 100);
          return (
            <div key={skill.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{skill.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{skill.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: 2,
                        background: i < skill.level ? color : "#e2e8f0",
                        boxShadow: i < skill.level ? `0 0 4px ${color}60` : "none",
                      }} />
                    ))}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: "2px 8px",
                    background: `${color}15`, color,
                    border: `1px solid ${color}30`,
                    borderRadius: 99,
                  }}>Lv.{toPersian(skill.level)}</span>
                </div>
              </div>
              <div style={{
                background: "#f1f5f9", borderRadius: 99,
                height: 6, overflow: "hidden",
              }}>
                <div style={{
                  width: `${pct}%`, height: "100%",
                  borderRadius: 99,
                  background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
