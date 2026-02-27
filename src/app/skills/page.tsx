"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { skills, activeCourse } from "@/data/mock";

export default function SkillsPage() {
  const [sessionDone, setSessionDone] = useState(activeCourse.completedToday);

  const sessionPercent = Math.round((activeCourse.currentDay / activeCourse.totalDays) * 100);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{
        background: "var(--primary)", padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/" style={{ color: "white", fontSize: 22, textDecoration: "none", lineHeight: 1 }}>‹</Link>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "white" }}>📚 مهارت‌های من</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>یادگیری و ارتقاء</div>
        </div>
      </div>

      <div className="safe-bottom" style={{ padding: 16 }}>

        {/* Active Course */}
        <div className="card" style={{
          padding: "16px",
          marginBottom: 16,
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          border: "1px solid #bfdbfe",
        }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>📖 دوره فعلی</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--primary)", marginBottom: 2 }}>
                {activeCourse.emoji} {activeCourse.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                روز {activeCourse.currentDay} از {activeCourse.totalDays} · +{activeCourse.xpReward} XP پاداش
              </div>
            </div>
            <div style={{
              fontSize: 22, fontWeight: 800, color: "var(--primary)",
              background: "white", borderRadius: "var(--r-md)", padding: "4px 12px",
              border: "1px solid var(--border)",
            }}>
              {sessionPercent}٪
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ background: "rgba(27,58,92,.12)", borderRadius: "var(--r-full)", height: 8 }}>
              <div style={{
                width: `${sessionPercent}%`, height: "100%",
                borderRadius: "var(--r-full)", background: "var(--primary)", transition: "width .5s",
              }} />
            </div>
          </div>

          {/* Sessions */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
              session‌های امروز ({sessionDone}/{activeCourse.sessionsPerDay})
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {Array.from({ length: activeCourse.sessionsPerDay }).map((_, i) => {
                const done = i < sessionDone;
                const next = i === sessionDone;
                return (
                  <div key={i} style={{
                    flex: 1, padding: "8px 0", borderRadius: "var(--r-md)",
                    textAlign: "center", fontSize: 11, fontWeight: 600,
                    background: done ? "var(--primary)" : next ? "#dbeafe" : "var(--surface-2)",
                    color: done ? "white" : next ? "var(--primary)" : "var(--text-subtle)",
                    border: next ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                    cursor: next ? "pointer" : "default",
                    transition: "all .15s",
                  }}
                    onClick={() => next && setSessionDone((s) => s + 1)}
                  >
                    {done ? "✓ تموم" : next ? "▶ بعدی" : "🔒 قفل"}
                  </div>
                );
              })}
            </div>
            {sessionDone < activeCourse.sessionsPerDay && (
              <div style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 8, textAlign: "center" }}>
                ⏱ session بعدی: {activeCourse.nextSessionIn} دقیقه دیگه
              </div>
            )}
            {sessionDone === activeCourse.sessionsPerDay && (
              <div style={{
                marginTop: 8, padding: "8px 12px",
                background: "#f0fdf4", borderRadius: "var(--r-md)",
                fontSize: 12, color: "#166534", fontWeight: 600, textAlign: "center",
                border: "1px solid #bbf7d0",
              }}>
                🎉 امروز کامل! فردا ادامه بده
              </div>
            )}
          </div>

          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            + دوره جدید اضافه کن
          </button>
        </div>

        {/* Hard Skills */}
        <SkillSection title="💻 مهارت‌های فنی" items={skills.hard} />

        {/* Soft Skills */}
        <SkillSection title="🤝 مهارت‌های نرم" items={skills.soft} />

      </div>
      <BottomNav />
    </div>
  );
}

function SkillSection({ title, items }: {
  title: string;
  items: { name: string; emoji: string; level: number; xp: number; maxXp: number }[];
}) {
  return (
    <div className="card" style={{ padding: "14px 16px", marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((skill) => {
          const pct = Math.round((skill.xp / skill.maxXp) * 100);
          return (
            <div key={skill.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 16 }}>{skill.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{skill.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: 2,
                        background: i < skill.level ? "var(--primary)" : "var(--border)",
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", minWidth: 32 }}>
                    Lv.{skill.level}
                  </span>
                </div>
              </div>
              <div style={{ background: "var(--surface-2)", borderRadius: "var(--r-full)", height: 5, border: "1px solid var(--border)" }}>
                <div style={{
                  width: `${pct}%`, height: "100%", borderRadius: "var(--r-full)",
                  background: "var(--primary)", transition: "width .5s",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
