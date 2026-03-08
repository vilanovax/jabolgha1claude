"use client";
import { formatMoney, toPersian } from "@/data/mock";

interface Milestone {
  id: string;
  title: string;
  emoji: string;
  progress: number;
  target: number;
  unit: string;
  reward: { xp: number; stars: number; money: number };
  badge: string;
  badgeEmoji: string;
}

export default function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const progressPct = Math.min(100, Math.round((milestone.progress / milestone.target) * 100));
  const progressLabel = milestone.unit === "تومان"
    ? `${formatMoney(milestone.progress)} / ${formatMoney(milestone.target)}`
    : `${toPersian(milestone.progress)} / ${toPersian(milestone.target)} ${milestone.unit}`;

  const isClose = progressPct >= 75;

  return (
    <div style={{
      padding: "14px 16px",
      background: isClose
        ? "rgba(245,158,11,0.03)"
        : "rgba(255,255,255,0.03)",
      borderRadius: 18,
      border: isClose
        ? "1px solid rgba(245,158,11,0.12)"
        : "1px solid rgba(255,255,255,0.06)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Close to completion hint */}
      {isClose && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          fontSize: 7, fontWeight: 800,
          padding: "2px 8px",
          borderRadius: "0 0 8px 0",
          background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))",
          color: "#f59e0b",
        }}>
          نزدیکه! 🔥
        </div>
      )}

      {/* Title row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
      }}>
        <div className={isClose ? "icon-idle-float" : ""} style={{
          width: 40, height: 40, borderRadius: 14, flexShrink: 0,
          background: "rgba(245,158,11,0.06)",
          border: "1px solid rgba(245,158,11,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>
          {milestone.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
            {milestone.title}
          </div>
          {/* Category label */}
          <span style={{
            fontSize: 8, fontWeight: 800,
            padding: "1px 6px", borderRadius: 6,
            background: "rgba(245,158,11,0.1)",
            color: "#f59e0b",
            border: "1px solid rgba(245,158,11,0.15)",
          }}>
            دستاورد
          </span>
        </div>
        {/* Badge preview */}
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10, padding: "3px 8px",
        }}>
          <span style={{ fontSize: 12 }}>{milestone.badgeEmoji}</span>
          {milestone.badge}
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 10 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", marginBottom: 4,
        }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
            {progressLabel}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 800, color: "#000",
            background: isClose
              ? "linear-gradient(135deg, #f59e0b, #f97316)"
              : "linear-gradient(135deg, #fb923c, #f97316)",
            borderRadius: 6, padding: "1px 6px",
          }}>
            {toPersian(progressPct)}٪
          </span>
        </div>
        <div style={{
          height: 6, borderRadius: 4,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}>
          <div className={isClose ? "progress-bar-animated" : ""} style={{
            width: `${progressPct}%`,
            height: "100%",
            borderRadius: 4,
            background: isClose
              ? "linear-gradient(90deg, #f59e0b, #fb923c)"
              : "linear-gradient(90deg, #f97316, #fb923c)",
            boxShadow: isClose ? "0 0 8px rgba(249,115,22,0.4)" : "0 0 6px rgba(249,115,22,0.3)",
            transition: "width 0.6s ease",
          }} />
        </div>
      </div>

      {/* Reward chips */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {milestone.reward.xp > 0 && (
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 7px",
            borderRadius: 8, background: "rgba(168,85,247,0.1)",
            color: "#c084fc", border: "1px solid rgba(168,85,247,0.15)",
          }}>
            +{toPersian(milestone.reward.xp)} XP
          </span>
        )}
        {milestone.reward.stars > 0 && (
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 7px",
            borderRadius: 8, background: "rgba(250,204,21,0.1)",
            color: "#facc15", border: "1px solid rgba(250,204,21,0.15)",
          }}>
            +{toPersian(milestone.reward.stars)} ⭐
          </span>
        )}
        {milestone.reward.money > 0 && (
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 7px",
            borderRadius: 8, background: "rgba(74,222,128,0.1)",
            color: "#4ade80", border: "1px solid rgba(74,222,128,0.15)",
          }}>
            +{formatMoney(milestone.reward.money)}
          </span>
        )}
      </div>
    </div>
  );
}
