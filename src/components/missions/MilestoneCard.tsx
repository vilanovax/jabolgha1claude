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

  return (
    <div style={{
      padding: "14px 16px",
      background: "rgba(255,255,255,0.03)",
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Title row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
          background: "rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>
          {milestone.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
            {milestone.title}
          </div>
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
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fb923c" }}>
            {toPersian(progressPct)}٪
          </span>
        </div>
        <div style={{
          height: 5, borderRadius: 3,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${progressPct}%`,
            height: "100%",
            borderRadius: 3,
            background: "linear-gradient(90deg, #f97316, #fb923c)",
            boxShadow: "0 0 6px rgba(249,115,22,0.3)",
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
