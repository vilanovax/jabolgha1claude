"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import { skills, activeCourse } from "@/data/mock";

export default function SkillsPage() {
  const [sessionDone, setSessionDone] = useState(activeCourse.completedToday);
  const sessionPercent = Math.round((activeCourse.currentDay / activeCourse.totalDays) * 100);

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
              <span style={{ fontSize: 20 }}>📚</span> مهارت‌ها
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>یادگیری و ارتقاء</div>
          </div>
        </div>

        {/* Active Course Panel */}
        <div style={{
          borderRadius: 24, padding: "18px 16px", marginBottom: 14,
          background: "linear-gradient(145deg, #0F2340, #1B3A5C 60%, #263E66)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(10,22,40,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)`,
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: -20, left: -20,
            width: 100, height: 100, borderRadius: "50%",
            background: "rgba(59,130,246,0.1)", filter: "blur(30px)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>📖 دوره فعلی</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 3 }}>
                  {activeCourse.emoji} {activeCourse.name}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                  روز {activeCourse.currentDay} از {activeCourse.totalDays} · +{activeCourse.xpReward} XP پاداش
                </div>
              </div>
              {/* XP Ring */}
              <div style={{ width: 52, height: 52, flexShrink: 0, position: "relative" }}>
                <svg width={52} height={52} style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="26" cy="26" r="22" fill="none"
                    stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
                  <circle cx="26" cy="26" r="22" fill="none"
                    stroke="#60a5fa" strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={2 * Math.PI * 22 * (1 - sessionPercent / 100)}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease", filter: "drop-shadow(0 0 4px rgba(96,165,250,0.5))" }}
                  />
                </svg>
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: "#93c5fd",
                }}>
                  {sessionPercent}٪
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 14 }}>
              <div style={{
                background: "rgba(255,255,255,0.1)", borderRadius: "var(--r-full)",
                height: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{
                  width: `${sessionPercent}%`, height: "100%",
                  borderRadius: "var(--r-full)",
                  background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                  boxShadow: "0 0 8px rgba(59,130,246,0.5)",
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>

            {/* Sessions */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                session‌های امروز ({sessionDone}/{activeCourse.sessionsPerDay})
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {Array.from({ length: activeCourse.sessionsPerDay }).map((_, i) => {
                  const done = i < sessionDone;
                  const next = i === sessionDone;
                  return (
                    <button key={i}
                      className={done ? "game-btn game-btn-done" : next ? "game-btn" : ""}
                      style={{
                        flex: 1, textAlign: "center", fontSize: 11, fontWeight: 700,
                        fontFamily: "inherit", cursor: next ? "pointer" : "default",
                        padding: "8px 0",
                        ...(done ? {} : {}),
                        ...(!done && !next ? {
                          background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)",
                          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14,
                        } : {}),
                      }}
                      onClick={() => next && setSessionDone((s) => s + 1)}
                      disabled={!next && !done}
                    >
                      {done ? "✓ تموم" : next ? "▶ بعدی" : "🔒 قفل"}
                    </button>
                  );
                })}
              </div>
              {sessionDone < activeCourse.sessionsPerDay && (
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 8, textAlign: "center" }}>
                  ⏱ session بعدی: {activeCourse.nextSessionIn} دقیقه دیگه
                </div>
              )}
              {sessionDone === activeCourse.sessionsPerDay && (
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

            <button className="game-btn" style={{
              width: "100%", justifyContent: "center",
              background: "linear-gradient(180deg, #3b82f6, #2563eb)",
              borderBottomColor: "#1d4ed8",
              boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
            }}>
              + دوره جدید اضافه کن
            </button>
          </div>
        </div>

        {/* Skills sections */}
        <SkillSection title="💻 مهارت‌های فنی" items={skills.hard} color="#3b82f6" />
        <SkillSection title="🤝 مهارت‌های نرم" items={skills.soft} color="#a855f7" />
      </div>

      <BottomNav />
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
                        transition: "all 0.3s ease",
                      }} />
                    ))}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: "2px 8px",
                    background: `${color}15`, color,
                    border: `1px solid ${color}30`,
                    borderRadius: "var(--r-full)",
                  }}>Lv.{skill.level}</span>
                </div>
              </div>
              <div style={{
                background: "#f1f5f9", borderRadius: "var(--r-full)",
                height: 6, overflow: "hidden",
              }}>
                <div style={{
                  width: `${pct}%`, height: "100%",
                  borderRadius: "var(--r-full)",
                  background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                  boxShadow: `0 0 6px ${color}40`,
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
