"use client";
import { toPersian } from "@/data/mock";
import type { MissionStatus } from "@/data/mock";

interface WeeklyMission {
  id: string;
  title: string;
  emoji: string;
  progress: number;
  target: number;
  reward: { xp: number; stars: number; money: number };
  status: MissionStatus;
}

export default function WeeklyMissionCard({ mission }: { mission: WeeklyMission }) {
  const progressPct = Math.min(100, Math.round((mission.progress / mission.target) * 100));

  return (
    <div style={{
      padding: "14px 16px",
      background: "rgba(255,255,255,0.03)",
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Title row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
          background: "rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>
          {mission.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
            {mission.title}
          </div>
        </div>
        <div style={{
          fontSize: 10, fontWeight: 700, color: "#60a5fa",
          background: "rgba(96,165,250,0.1)",
          border: "1px solid rgba(96,165,250,0.2)",
          borderRadius: 10, padding: "2px 8px",
        }}>
          در حال انجام
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", marginBottom: 4,
        }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
            پیشرفت
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#60a5fa" }}>
              {toPersian(mission.progress)} / {toPersian(mission.target)}
            </span>
            <span style={{
              fontSize: 9, fontWeight: 800, color: "#000",
              background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
              borderRadius: 6, padding: "1px 6px",
            }}>
              {toPersian(progressPct)}٪
            </span>
          </div>
        </div>
        <div style={{
          height: 6, borderRadius: 4,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}>
          <div className="progress-bar-animated" style={{
            width: `${progressPct}%`,
            height: "100%",
            borderRadius: 4,
            background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
            boxShadow: "0 0 8px rgba(96,165,250,0.3)",
            transition: "width 0.6s ease",
            position: "relative",
            overflow: "hidden",
          }} />
        </div>
      </div>

      {/* Reward chips */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {mission.reward.xp > 0 && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 8px",
            borderRadius: 10, background: "rgba(168,85,247,0.12)",
            color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)",
          }}>
            +{toPersian(mission.reward.xp)} XP
          </span>
        )}
        {mission.reward.stars > 0 && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 8px",
            borderRadius: 10, background: "rgba(250,204,21,0.12)",
            color: "#facc15", border: "1px solid rgba(250,204,21,0.2)",
          }}>
            +{toPersian(mission.reward.stars)} ⭐
          </span>
        )}
      </div>
    </div>
  );
}
