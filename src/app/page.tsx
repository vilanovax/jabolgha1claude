"use client";
import { useState } from "react";
import Link from "next/link";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import { player, homeActivities, housing, formatMoney } from "@/data/mock";

type Activity = typeof homeActivities[0];

// Theme mapping for activity categories
const CARD_THEMES: Record<string, string> = {
  eat:      "survival",
  sleep:    "survival",
  exercise: "survival",
  rest:     "survival",
  study:    "development",
  work:     "work",
  invest:   "work",
};

function getCardTheme(id: string): string {
  return CARD_THEMES[id] ?? "default";
}

function getMascotFace(energy: number, hunger: number): { emoji: string; expression: string } {
  if (energy < 25 || hunger < 20) return { emoji: "😫", expression: "خسته‌ام..." };
  if (energy < 40 || hunger < 35) return { emoji: "😐", expression: "حالم خوب نیست" };
  if (energy > 75 && hunger > 60) return { emoji: "😄", expression: "عالیم! بزن بریم!" };
  return { emoji: "🙂", expression: "حالم خوبه" };
}

export default function RoomPage() {
  const [done, setDone] = useState<string[]>([]);
  const mascot = getMascotFace(player.energy, player.hunger);

  return (
    <div className="game-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      {/* Scrollable content */}
      <div style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14,
        paddingRight: 14,
        position: "relative",
        zIndex: 2,
      }}>

        {/* ── Mascot / Avatar Panel ──────────────── */}
        <div style={{
          borderRadius: 24,
          padding: "18px 16px",
          marginBottom: 14,
          background: "linear-gradient(145deg, #0F2340, #1B3A5C 60%, #263E66)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(10,22,40,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative blurred room bg */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent, transparent 20px,
              rgba(255,255,255,0.03) 20px,
              rgba(255,255,255,0.03) 40px
            )`,
            pointerEvents: "none",
          }} />
          {/* Ambient glow */}
          <div style={{
            position: "absolute", top: -20, right: -20,
            width: 100, height: 100, borderRadius: "50%",
            background: "rgba(212,168,67,0.08)", filter: "blur(30px)",
            pointerEvents: "none",
          }} />

          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            position: "relative",
          }}>
            {/* Avatar circle */}
            <div className="anim-breathe" style={{
              width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              border: "2px solid rgba(212,168,67,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 38,
              boxShadow: "0 0 20px rgba(212,168,67,0.15), inset 0 0 20px rgba(212,168,67,0.05)",
            }}>
              {mascot.emoji}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 3 }}>
                {player.name.split(" ")[0]}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>
                {mascot.expression}
              </div>

              {/* Mini stats */}
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px",
                  background: "rgba(212,168,67,0.2)", color: "#F0C966",
                  border: "1px solid rgba(212,168,67,0.3)", borderRadius: "var(--r-full)",
                }}>Lv.{player.level}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: "2px 8px",
                  background: "rgba(96,165,250,0.15)", color: "#93c5fd",
                  borderRadius: "var(--r-full)",
                }}>{player.scenario}</span>
              </div>
            </div>

            {/* XP ring */}
            <div style={{
              width: 48, height: 48, flexShrink: 0,
              position: "relative",
            }}>
              <svg width={48} height={48} style={{ transform: "rotate(-90deg)" }}>
                <circle cx="24" cy="24" r="20" fill="none"
                  stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
                <circle cx="24" cy="24" r="20" fill="none"
                  stroke="#D4A843" strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - player.xp / player.xpNext)}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke-dashoffset 1s ease",
                    filter: "drop-shadow(0 0 4px rgba(212,168,67,0.4))",
                  }}
                />
              </svg>
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800, color: "#F0C966",
              }}>
                {Math.round((player.xp / player.xpNext) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* ── Rent Warning ───────────────────────── */}
        {housing.nextRentDue <= 5 && (
          <div className="danger-pulse" style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 14px", marginBottom: 14,
            background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
            border: "1.5px solid #fed7aa",
            borderRadius: 20,
            boxShadow: "0 4px 16px rgba(249,115,22,0.15)",
          }}>
            <span style={{ fontSize: 22 }}>🏠</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e" }}>
                اجاره {housing.nextRentDue} روز دیگه!
              </div>
              <div style={{ fontSize: 11, color: "#b45309" }}>
                {formatMoney(housing.monthlyRent)} آماده کن
              </div>
            </div>
            <Link href="/bank" style={{ textDecoration: "none" }}>
              <button className="game-btn" style={{
                background: "linear-gradient(180deg, #f97316, #ea580c)",
                borderBottomColor: "#c2410c",
                boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
                fontSize: 11, padding: "6px 14px",
              }}>
                بانک
              </button>
            </Link>
          </div>
        )}

        {/* ── Section Title ──────────────────────── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 12, padding: "0 2px",
        }}>
          <div style={{
            fontSize: 15, fontWeight: 800, color: "#1e293b",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 18 }}>🎮</span>
            فعالیت‌ها
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700,
            padding: "4px 12px", borderRadius: "var(--r-full)",
            background: done.length === homeActivities.length
              ? "linear-gradient(135deg, #dcfce7, #f0fdf4)"
              : "white",
            color: done.length === homeActivities.length ? "#16a34a" : "#64748b",
            border: `1px solid ${done.length === homeActivities.length ? "#bbf7d0" : "#e2e8f0"}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            {done.length === homeActivities.length ? "✨ همه انجام شد!" : `${done.length}/${homeActivities.length}`}
          </div>
        </div>

        {/* ── Activity Cards ─────────────────────── */}
        {homeActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            theme={getCardTheme(activity.id)}
            isDone={done.includes(activity.id)}
            onDone={() => setDone((p) => [...p, activity.id])}
          />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

/* ─── Activity Card Component ──────────────────── */
function ActivityCard({
  activity, theme, isDone, onDone,
}: {
  activity: Activity;
  theme: string;
  isDone: boolean;
  onDone: () => void;
}) {
  const themeClass = isDone
    ? "activity-card--done"
    : `activity-card--${theme}`;

  return (
    <div className={`activity-card ${themeClass}`}>
      {/* Main row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 16px 12px",
      }}>
        {/* Icon box */}
        <div style={{
          width: 54,
          height: 54,
          borderRadius: 18,
          background: activity.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          flexShrink: 0,
          boxShadow: `0 6px 20px ${activity.iconGlow}`,
          border: "1px solid rgba(255,255,255,0.15)",
        }}>
          {activity.emoji}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 4,
          }}>
            {activity.label}
          </div>
          <div style={{ fontSize: 11, color: "#64748b" }}>
            {activity.sublabel}
          </div>
        </div>

        {/* Gaming button */}
        {isDone ? (
          <button className="game-btn game-btn-done" style={{ fontSize: 11, padding: "7px 14px" }}>
            ✓ شد
          </button>
        ) : (
          <Link href={activity.href} style={{ textDecoration: "none" }} onClick={onDone}>
            <button className="game-btn">
              انجام بده
            </button>
          </Link>
        )}
      </div>

      {/* Cost / Reward badges */}
      <div style={{
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        padding: "10px 16px 14px",
        borderTop: `1px solid ${isDone ? "#e2e8f0" : "rgba(0,0,0,0.04)"}`,
      }}>
        {activity.costs.map((c) => {
          const isTime = c.icon === "⏱️";
          return (
            <span
              key={c.label}
              className={isTime ? "badge-cost--time" : "badge-cost"}
              style={isTime ? {
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: 11, fontWeight: 700, padding: "4px 10px",
                borderRadius: "var(--r-full)",
                background: "#fefce8", color: "#a16207", border: "1px solid #fde68a",
              } : undefined}
            >
              {c.icon} {c.label}
            </span>
          );
        })}
        {activity.rewards.map((r) => {
          const isMoney = r.icon === "💰";
          return (
            <span
              key={r.label}
              className={isMoney ? "badge-reward--money" : "badge-reward"}
              style={isMoney ? {
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: 11, fontWeight: 700, padding: "4px 10px",
                borderRadius: "var(--r-full)",
                background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0",
              } : undefined}
            >
              {r.icon} {r.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
