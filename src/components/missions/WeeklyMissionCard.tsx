"use client";
import { toPersian } from "@/data/mock";
import type { MissionStatus, MissionReward } from "@/data/mock";

interface WeeklyMission {
  id: string;
  title: string;
  emoji: string;
  progress: number;
  target: number;
  reward: MissionReward;
  status: MissionStatus;
}

export default function WeeklyMissionCard({ mission, onClaim }: {
  mission: WeeklyMission;
  onClaim?: (reward: MissionReward) => void;
}) {
  const progressPct = Math.min(100, Math.round((mission.progress / mission.target) * 100));
  const isClaimable = mission.status === "claimable";
  const isDone = mission.status === "done";

  // Step indicators
  const steps = Array.from({ length: mission.target }).map((_, i) => i < mission.progress);

  return (
    <div style={{
      padding: "14px 16px",
      background: isClaimable
        ? "rgba(96,165,250,0.04)"
        : "rgba(255,255,255,0.03)",
      borderRadius: 18,
      border: isClaimable
        ? "1.5px solid rgba(96,165,250,0.25)"
        : "1px solid rgba(255,255,255,0.06)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Title row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
      }}>
        <div className={isClaimable ? "anim-mission-glow" : "icon-idle-float"} style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: "rgba(96,165,250,0.08)",
          border: "1px solid rgba(96,165,250,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>
          {isDone ? "✅" : mission.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
            {mission.title}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Category label */}
          <span style={{
            fontSize: 8, fontWeight: 800,
            padding: "2px 6px", borderRadius: 6,
            background: "rgba(96,165,250,0.1)",
            color: "#60a5fa",
            border: "1px solid rgba(96,165,250,0.15)",
          }}>
            هفتگی
          </span>
          {isClaimable ? (
            <button
              className="btn-bounce anim-claim-pulse"
              onClick={() => onClaim?.(mission.reward)}
              style={{
                fontSize: 10, fontWeight: 700, color: "#facc15",
                padding: "4px 10px", borderRadius: 10,
                background: "linear-gradient(135deg, rgba(250,204,21,0.15), rgba(245,158,11,0.1))",
                border: "1px solid rgba(250,204,21,0.3)",
                fontFamily: "inherit", cursor: "pointer",
                boxShadow: "0 0 8px rgba(250,204,21,0.1)",
              }}
            >
              جایزه ⭐
            </button>
          ) : (
            <span style={{
              fontSize: 10, fontWeight: 700, color: "#60a5fa",
              background: "rgba(96,165,250,0.1)",
              border: "1px solid rgba(96,165,250,0.2)",
              borderRadius: 10, padding: "2px 8px",
            }}>
              {isDone ? "✓ تمام" : "در حال انجام"}
            </span>
          )}
        </div>
      </div>

      {/* Step indicators (circles) */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        marginBottom: 10, padding: "0 2px",
      }}>
        {steps.map((completed, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{
              width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
              background: completed
                ? "linear-gradient(135deg, #3b82f6, #60a5fa)"
                : "rgba(255,255,255,0.06)",
              border: completed
                ? "1px solid rgba(96,165,250,0.4)"
                : "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 7, fontWeight: 700,
              color: completed ? "#fff" : "rgba(255,255,255,0.2)",
              boxShadow: completed ? "0 0 4px rgba(96,165,250,0.3)" : "none",
            }}>
              {completed ? "✓" : toPersian(i + 1)}
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginRight: 1, marginLeft: 1,
                background: completed
                  ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                  : "rgba(255,255,255,0.05)",
                borderRadius: 1,
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Progress text */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 6,
      }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
          {toPersian(mission.progress)} از {toPersian(mission.target)}
        </span>
        <span style={{
          fontSize: 9, fontWeight: 800, color: "#000",
          background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
          borderRadius: 6, padding: "1px 6px",
        }}>
          {toPersian(progressPct)}٪
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 6, borderRadius: 4,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
        marginBottom: 10,
      }}>
        <div className="progress-bar-animated" style={{
          width: `${progressPct}%`,
          height: "100%",
          borderRadius: 4,
          background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
          boxShadow: "0 0 8px rgba(96,165,250,0.3)",
          transition: "width 0.6s ease",
        }} />
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
